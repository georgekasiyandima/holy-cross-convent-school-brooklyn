import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
  Grid
} from '@mui/material';
import { Edit, Delete, CloudDownload } from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';
import DocumentService, { Document } from '../services/documentService';

const documentService = DocumentService.getInstance();

const DEFAULT_CATEGORIES = ['policy', 'form', 'admissions', 'fees', 'resources', 'report', 'newsletter'];

const AdminDocumentManagement: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDocument, setEditDocument] = useState<Document | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  });

  const stats = useMemo(() => {
    const total = documents.length;
    const published = documents.filter((doc) => doc.isPublished).length;
    const drafts = total - published;
    return {
      total,
      published,
      drafts,
    };
  }, [documents]);

  const tableColumns = useMemo(
    () => [
      { key: 'title', label: 'Title', align: 'left' as const },
      { key: 'category', label: 'Category', align: 'left' as const },
      { key: 'type', label: 'Type', align: 'left' as const },
      { key: 'status', label: 'Status', align: 'left' as const },
      { key: 'tags', label: 'Tags', align: 'left' as const },
      { key: 'uploaded', label: 'Uploaded', align: 'left' as const },
      { key: 'actions', label: 'Actions', align: 'center' as const },
    ],
    []
  );

  const refreshCategories = useCallback(async () => {
    try {
      const fetched = await documentService.getCategories();
      const merged = new Set<string>([...DEFAULT_CATEGORIES, ...fetched]);
      merged.delete('all');
      setCategories(Array.from(merged));
    } catch (err) {
      console.error('Failed to load document categories', err);
    }
  }, []);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const categoryList = selectedCategory === 'all' ? categories : [selectedCategory];
      const uniqueCategories = Array.from(new Set(categoryList.filter(Boolean)));

      const results = await Promise.all(
        uniqueCategories.map(async (category) => {
          const [publishedDocs, draftDocs] = await Promise.all([
            documentService.getDocumentsByCategory(category, true).catch(() => []),
            documentService.getDocumentsByCategory(category, false).catch(() => []),
          ]);
          return [...publishedDocs, ...draftDocs];
        })
      );

      const combined = results.flat();
      const docMap = new Map<string, Document>();
      combined.forEach((doc) => {
        docMap.set(doc.id, doc);
      });

      let finalDocs = Array.from(docMap.values());
      if (statusFilter === 'published') {
        finalDocs = finalDocs.filter((doc) => doc.isPublished);
      } else if (statusFilter === 'draft') {
        finalDocs = finalDocs.filter((doc) => !doc.isPublished);
      }

      finalDocs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setDocuments(finalDocs);
    } catch (err) {
      console.error('Failed to load documents', err);
      setError('Failed to load documents. Please try again.');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [categories, selectedCategory, statusFilter]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
  };

  const handleStatusFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    value: 'all' | 'published' | 'draft' | null
  ) => {
    if (value !== null) {
      setStatusFilter(value);
    }
  };

  const handleTogglePublished = async (document: Document) => {
    setActionId(document.id);
    try {
      await documentService.updateDocument(document.category, document.id, {
        isPublished: !document.isPublished,
      });
      await fetchDocuments();
      await refreshCategories();
    } catch (err) {
      console.error('Failed to update publish status', err);
      setError('Unable to update publish status. Please try again.');
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteDocument = async (document: Document) => {
    const confirmed = window.confirm(`Delete "${document.title}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setActionId(document.id);
    try {
      await documentService.deleteDocument(document.category, document.id);
      await fetchDocuments();
      await refreshCategories();
    } catch (err) {
      console.error('Failed to delete document', err);
      setError('Unable to delete document. Please try again.');
    } finally {
      setActionId(null);
    }
  };

  const handleOpenEdit = (document: Document) => {
    setEditDocument(document);
    setEditForm({
      title: document.title,
      description: document.description,
      category: document.category,
      tags: document.tags.join(', '),
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditDocument(null);
  };

  const handleEditFormChange = (field: 'title' | 'description' | 'category' | 'tags') => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value as string;
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!editDocument) {
      return;
    }

    setActionId(editDocument.id);
    try {
      const tags = editForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await documentService.updateDocument(editDocument.category, editDocument.id, {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        tags,
      });

      setEditDialogOpen(false);
      setEditDocument(null);
      await refreshCategories();
      await fetchDocuments();
    } catch (err) {
      console.error('Failed to update document', err);
      setError('Unable to update document. Please try again.');
    } finally {
      setActionId(null);
    }
  };

  const downloadUrl = useCallback((document: Document) => {
    return documentService.getDocumentDownloadUrl(document.fileUrl);
  }, []);

  return (
    <AdminLayout>
      <Box
        sx={{
          background: 'linear-gradient(135deg,#1a237e 0%,#3949ab 60%,#5c6bc0 100%)',
          color: '#fff',
          py: { xs: 6, md: 8 },
          borderBottomLeftRadius: { xs: 0, md: 32 },
          borderBottomRightRadius: { xs: 0, md: 32 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Document Management
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 620 }}>
            Review, publish, and organise admissions assets, policies, and resources in one place.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, mt: { md: -6 } }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
              }}
            >
              <Typography variant="overline" sx={{ color: '#64748b' }}>
                Published
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
                {stats.published}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                Live on the public site
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
              }}
            >
              <Typography variant="overline" sx={{ color: '#64748b' }}>
                Drafts
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef6c00' }}>
                {stats.drafts}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                Awaiting review or publish
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
              }}
            >
              <Typography variant="overline" sx={{ color: '#64748b' }}>
                Total Library
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                Across all categories
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e2e8f0',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 16px 32px rgba(15,23,42,0.08)',
            backgroundColor: '#fff',
          }}
        >
          <Toolbar
            sx={{
              bgcolor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2,
              p: { xs: 2, md: 3 },
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <ToggleButtonGroup
                value={statusFilter}
                exclusive
                onChange={handleStatusFilterChange}
                size="small"
                color="primary"
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="published">Published</ToggleButton>
                <ToggleButton value="draft">Drafts</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            <Button
              variant="contained"
              color="primary"
              sx={{ ml: { md: 'auto' }, mt: { xs: 1, md: 0 } }}
              onClick={() => {
                setSelectedCategory('all');
                setStatusFilter('all');
                fetchDocuments();
              }}
            >
              Refresh
            </Button>
          </Toolbar>

          <Box sx={{ minHeight: 320, position: 'relative', p: { xs: 2, md: 0 } }}>
            {loading ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress sx={{ color: '#1a237e' }} />
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Loading documents...
                </Typography>
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>
            ) : documents.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  No documents found for the selected filters.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ px: { xs: 0, md: 3 }, pb: 3 }}>
                <Table size="medium">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a237e' }}>
                      {tableColumns.map((column) => (
                        <TableCell
                          key={column.key}
                          align={column.align}
                          sx={{ color: '#ffffff', fontWeight: 600 }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documents.map((document) => (
                      <TableRow key={document.id} hover>
                        <TableCell sx={{ maxWidth: 260 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            {document.title}
                          </Typography>
                          {document.description && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {document.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={document.category.replace(/_/g, ' ').toUpperCase()}
                            size="small"
                            sx={{ bgcolor: '#e3f2fd', color: '#1a237e', fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>{document.type ? document.type.toUpperCase() : '—'}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Switch
                              checked={document.isPublished}
                              onChange={() => handleTogglePublished(document)}
                              color="primary"
                              disabled={actionId === document.id}
                              inputProps={{ 'aria-label': 'Toggle publish status' }}
                            />
                            <Chip
                              label={document.isPublished ? 'Published' : 'Draft'}
                              size="small"
                              sx={{
                                bgcolor: document.isPublished ? '#e8f5e9' : '#fff3e0',
                                color: document.isPublished ? '#2e7d32' : '#ef6c00',
                                fontWeight: 600,
                              }}
                            />
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                            {document.tags.length ? (
                              document.tags.map((tag, index) => (
                                <Chip key={index} label={tag} size="small" variant="outlined" />
                              ))
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                —
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(document.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Download">
                              <IconButton
                                component="a"
                                href={downloadUrl(document)}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="small"
                              >
                                <CloudDownload fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEdit(document)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteDocument(document)}
                                disabled={actionId === document.id}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Document</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Title"
              value={editForm.title}
              onChange={handleEditFormChange('title')}
              fullWidth
            />
            <TextField
              label="Description"
              value={editForm.description}
              onChange={handleEditFormChange('description')}
              fullWidth
              multiline
              minRows={3}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={editForm.category}
                onChange={handleEditFormChange('category')}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Tags"
              helperText="Separate tags with commas"
              value={editForm.tags}
              onChange={handleEditFormChange('tags')}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={actionId === editDocument?.id}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDocumentManagement;
