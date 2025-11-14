import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import governingBodyService, { GoverningBodyMember } from '../services/governingBodyService';
import AdminLayout from '../components/AdminLayout';

interface FormState {
  id?: string;
  name: string;
  designation: string;
  sector: string;
  address: string;
  phone: string;
  email: string;
  order: number;
  isActive: boolean;
}

const emptyFormState: FormState = {
  name: '',
  designation: '',
  sector: '',
  address: '',
  phone: '',
  email: '',
  order: 0,
  isActive: true,
};

const AdminGoverningBody: React.FC = () => {
  const [members, setMembers] = useState<GoverningBodyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyFormState);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const sortedMembers = useMemo(
    () =>
      [...members].sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return a.name.localeCompare(b.name);
      }),
    [members]
  );

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await governingBodyService.getMembers(true);
      setMembers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load governing body members', err);
      setError('Unable to load governing body members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleInputChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'isActive' ? (event.target as HTMLInputElement).checked : event.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: field === 'order' ? Number(value) : value,
      }));
    };

  const handleAdd = () => {
    setForm(emptyFormState);
    setDialogOpen(true);
  };

  const handleEdit = (member: GoverningBodyMember) => {
    setForm({
      id: member.id,
      name: member.name,
      designation: member.designation || '',
      sector: member.sector || '',
      address: member.address || '',
      phone: member.phone || '',
      email: member.email || '',
      order: member.order,
      isActive: member.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (member: GoverningBodyMember) => {
    const confirmed = window.confirm(`Remove ${member.name} from the governing body?`);
    if (!confirmed) return;
    try {
      await governingBodyService.deleteMember(member.id);
      setToast({ open: true, message: 'Member removed', severity: 'success' });
      await loadMembers();
    } catch (err) {
      console.error('Failed to delete member', err);
      setToast({ open: true, message: 'Failed to delete member', severity: 'error' });
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setToast({ open: true, message: 'Name is required', severity: 'error' });
      return;
    }

    try {
      setSaving(true);
      if (form.id) {
        await governingBodyService.updateMember(form.id, {
          name: form.name.trim(),
          designation: form.designation.trim() || null,
          sector: form.sector.trim() || null,
          address: form.address.trim() || null,
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          order: form.order,
          isActive: form.isActive,
        });
        setToast({ open: true, message: 'Member updated successfully', severity: 'success' });
      } else {
        await governingBodyService.createMember({
          name: form.name.trim(),
          designation: form.designation.trim() || null,
          sector: form.sector.trim() || null,
          address: form.address.trim() || null,
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          order: form.order,
          isActive: form.isActive,
        });
        setToast({ open: true, message: 'Member added successfully', severity: 'success' });
      }
      setDialogOpen(false);
      await loadMembers();
    } catch (err) {
      console.error('Failed to save member', err);
      setToast({ open: true, message: 'Failed to save member', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
            Governing Body Members
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage the governing body directory so parents and stakeholders always have the latest contact details.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            Add Member
          </Button>
        </Box>

        <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1a237e' }}>
                {['Name', 'Designation', 'Sector', 'Contact', 'Order', 'Active', 'Actions'].map((col) => (
                  <TableCell key={col} sx={{ color: '#fff', fontWeight: 600 }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                    Loading members...
                  </TableCell>
                </TableRow>
              ) : sortedMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                    No governing body members found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedMembers.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>
                      <Stack>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {member.name}
                        </Typography>
                        {member.address && (
                          <Typography variant="caption" color="text.secondary">
                            {member.address}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{member.designation || '—'}</TableCell>
                    <TableCell>{member.sector || '—'}</TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {member.phone && (
                          <Typography variant="body2" color="text.secondary">
                            {member.phone}
                          </Typography>
                        )}
                        {member.email && (
                          <Typography variant="body2" color="text.secondary">
                            {member.email}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{member.order}</TableCell>
                    <TableCell>{member.isActive ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(member)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(member)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{form.id ? 'Edit Member' : 'Add Member'}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                label="Name"
                required
                fullWidth
                value={form.name}
                onChange={handleInputChange('name')}
              />
              <TextField
                label="Designation"
                fullWidth
                value={form.designation}
                onChange={handleInputChange('designation')}
              />
              <TextField label="Sector" fullWidth value={form.sector} onChange={handleInputChange('sector')} />
              <TextField
                label="Address"
                fullWidth
                value={form.address}
                onChange={handleInputChange('address')}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Phone" fullWidth value={form.phone} onChange={handleInputChange('phone')} />
                <TextField
                  label="Email"
                  fullWidth
                  type="email"
                  value={form.email}
                  onChange={handleInputChange('email')}
                />
              </Stack>
              <TextField
                label="Display Order"
                type="number"
                fullWidth
                value={form.order}
                onChange={handleInputChange('order')}
              />
              <FormControlLabel
                control={<Switch checked={form.isActive} onChange={handleInputChange('isActive')} />}
                label="Active"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setToast((prev) => ({ ...prev, open: false }))}
            severity={toast.severity}
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    </AdminLayout>
  );
};

export default AdminGoverningBody;




