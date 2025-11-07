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
import ReturnToHome from '../components/ReturnToHome';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { StaffAvatar } from '../components/OptimizedImage';
import { API_BASE_URL_WITH_PREFIX } from '../services/apiConfig';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  category: 'LEADERSHIP' | 'TEACHING' | 'SUPPORT' | 'ADMIN';
  imageUrl?: string;
}

const AdminStaffUpload: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load staff members on component mount
  React.useEffect(() => {
    if (isAuthenticated) {
      loadStaff();
    }
  }, [isAuthenticated]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL_WITH_PREFIX}/staff`);
      if (response.data.success) {
        setStaff(response.data.data.staff);
      }
    } catch (error) {
      console.error('Error loading staff:', error);
      setMessage({ type: 'error', text: 'Failed to load staff members. Please check if the backend server is running.' });
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

      // Create FormData for the upload
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', staffMember.name);
      formData.append('role', staffMember.role || '');
      formData.append('category', staffMember.category);

      // Get auth token from localStorage
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      console.log('🔍 Upload - Token:', token ? 'Present' : 'Missing');
      console.log('🔍 Upload - Staff Member:', staffMember);
      
      // Upload to staff endpoint
      // NOTE: Don't set Content-Type manually - let axios/browser set it with boundary
      const response = await axios.put(`${API_BASE_URL_WITH_PREFIX}/staff/${staffMember.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Let browser set Content-Type with boundary automatically
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: `Image uploaded successfully for ${staffMember.name}` });
        // Update the staff member with new image URL
        const updatedStaff = response.data.data?.data || response.data.data;
        const newImageUrl = updatedStaff?.imageUrl || updatedStaff?.staff?.imageUrl;
        if (newImageUrl) {
          setStaff(prev => prev.map(s => 
            s.id === staffMember.id 
              ? { ...s, imageUrl: newImageUrl }
              : s
          ));
          setSelectedStaff(prev => prev ? { ...prev, imageUrl: newImageUrl } : null);
        }
        // Reload staff list to get updated data
        await loadStaff();
      } else {
        throw new Error(response.data.error || response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      console.error('Upload error response:', error.response?.data);
      const errorData = error.response?.data;
      console.error('Full error data:', JSON.stringify(errorData, null, 2));
      
      let errorMessage = 'Upload failed. Please check your connection and try again.';
      
      if (errorData) {
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = `Validation failed: ${errorData.errors.join(', ')}`;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      setMessage({ 
        type: 'error', 
        text: errorMessage
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

  // Check authentication
  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          You must be logged in to access this page.
        </Alert>
        <ReturnToHome />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Return to Home */}
      <ReturnToHome />
      
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
                      size={100}
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
