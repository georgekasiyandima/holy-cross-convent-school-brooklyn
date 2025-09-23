import React, { useState, useRef } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Save,
  Person,
  School,
  Support,
} from '@mui/icons-material';
import axios from 'axios';
import { uploadStaffImage } from '../utils/imageUtils';
import { StaffAvatar } from '../components/OptimizedImage';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  category: 'LEADERSHIP' | 'TEACHING' | 'SUPPORT';
  imageUrl?: string;
}

const AdminStaffUpload: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load staff members on component mount
  React.useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/staff');
      if (response.data.success) {
        setStaff(response.data.data.staff);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load staff members' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedStaff) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, or WebP)' });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    await uploadImage(file, selectedStaff);
  };

  const uploadImage = async (file: File, staffMember: StaffMember) => {
    try {
      setUploading(true);
      setMessage(null);

      const result = await uploadStaffImage(file, staffMember.id, (progress) => {
        console.log(`Upload progress: ${progress.percentage}%`);
      });

      if (result.success && result.data) {
        setMessage({ type: 'success', text: `Image uploaded successfully for ${staffMember.name}` });
        // Update the staff member with new image URL
        const newImageUrl = result.data.data?.staff?.imageUrl || result.data.imageUrl;
        setStaff(prev => prev.map(s => 
          s.id === staffMember.id 
            ? { ...s, imageUrl: newImageUrl }
            : s
        ));
        setSelectedStaff(prev => prev ? { ...prev, imageUrl: newImageUrl } : null);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Upload failed'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'LEADERSHIP': return <School sx={{ color: '#1a237e' }} />;
      case 'TEACHING': return <Person sx={{ color: '#ffd700' }} />;
      case 'SUPPORT': return <Support sx={{ color: '#1a237e' }} />;
      default: return <Person />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'LEADERSHIP': return '#e3f2fd';
      case 'TEACHING': return '#f3e5f5';
      case 'SUPPORT': return '#f5f5f5';
      default: return '#f5f5f5';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4 }}>
        Staff Image Upload
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      {/* Staff Selection */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select Staff Member
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                gap: 2,
              }}
            >
              {staff.map((member) => (
                <Card
                  key={member.id}
                  sx={{
                    cursor: 'pointer',
                    border: selectedStaff?.id === member.id ? '2px solid #1a237e' : '1px solid #e0e0e0',
                    bgcolor: getCategoryColor(member.category),
                  }}
                  onClick={() => setSelectedStaff(member)}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <StaffAvatar
                      src={member.imageUrl}
                      name={member.name}
                      size={80}
                      category={member.category}
                      sx={{ mx: 'auto', mb: 2 }}
                    />
                    
                    <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 1 }}>
                      {member.name}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      {member.role}
                    </Typography>
                    
                    <Chip
                      icon={getCategoryIcon(member.category)}
                      label={member.category}
                      size="small"
                      sx={{ bgcolor: '#fff', color: '#1a237e' }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Upload Section */}
      {selectedStaff && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Upload Image for {selectedStaff.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <StaffAvatar
                src={selectedStaff.imageUrl}
                name={selectedStaff.name}
                size={100}
                category={selectedStaff.category}
              />

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ color: '#1a237e', mb: 1 }}>
                  {selectedStaff.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  {selectedStaff.role}
                </Typography>
                
                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1421' } }}
                >
                  {uploading ? 'Uploading...' : 'Choose Image'}
                </Button>
              </Box>
            </Box>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
            />

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Image Requirements:</strong>
                <br />• Format: JPEG, PNG, or WebP
                <br />• Size: Maximum 5MB
                <br />• Recommended: Square aspect ratio (1:1)
                <br />• Images will be automatically optimized and resized
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AdminStaffUpload;
