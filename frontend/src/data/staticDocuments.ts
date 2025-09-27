//---------------------------------------------------------
// STATIC DOCUMENTS CONFIGURATION
// Following best practices for document management
//---------------------------------------------------------

export interface StaticDocument {
  id: string;
  title: string;
  description: string;
  type: 'logo' | 'mission' | 'vision' | 'policy' | 'form' | 'attendance' | 'language' | 'other';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  mimeType: string;
  priority?: number; // For ordering documents
}

//---------------------------------------------------------
// STATIC DOCUMENTS DATA
//---------------------------------------------------------
export const staticDocuments: StaticDocument[] = [
  // Language Policy Document
  {
    id: 'language-policy-2024',
    title: 'Language Policy',
    description: 'Holy Cross Convent School Language Policy outlining our approach to multilingual education and language development strategies.',
    type: 'language',
    fileUrl: '/Language Policy.pdf',
    fileName: 'Language Policy.pdf',
    fileSize: 2968000, // ~2.97MB based on file analysis
    uploadedAt: '2024-01-15',
    category: 'Policies',
    tags: ['language', 'policy', 'education', 'multilingual', 'curriculum'],
    isPublished: true,
    authorId: 'admin',
    authorName: 'School Administration',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    mimeType: 'application/pdf',
    priority: 1
  },
  
  // Learner Attendance Policy Document
  {
    id: 'learner-attendance-2024',
    title: 'Learner Attendance Policy',
    description: 'Comprehensive policy document covering attendance requirements, procedures, and guidelines for learners at Holy Cross Convent School.',
    type: 'attendance',
    fileUrl: '/LEARNER ATTENDANCE.pdf',
    fileName: 'LEARNER ATTENDANCE.pdf',
    fileSize: 3092000, // ~3.09MB based on file analysis
    uploadedAt: '2024-01-15',
    category: 'Policies',
    tags: ['attendance', 'policy', 'procedures', 'guidelines', 'learner'],
    isPublished: true,
    authorId: 'admin',
    authorName: 'School Administration',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    mimeType: 'application/pdf',
    priority: 2
  },

  // Existing sample documents (for reference)
  {
    id: 'school-logo-explanation',
    title: 'Holy Cross Convent School Logo',
    description: 'Official school logo with detailed explanation of its symbolic meaning and design elements.',
    type: 'logo',
    fileUrl: '/documents/logo-explanation.pdf',
    fileName: 'logo-explanation.pdf',
    fileSize: 2048576, // 2MB
    uploadedAt: '2025-01-15',
    category: 'Branding',
    tags: ['logo', 'branding', 'symbolism'],
    isPublished: true,
    authorId: 'admin',
    authorName: 'School Administration',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
    mimeType: 'application/pdf',
    priority: 3
  },
  
  {
    id: 'mission-statement-doc',
    title: 'Mission Statement',
    description: 'Our school\'s mission statement outlining our commitment to academic excellence and character development.',
    type: 'mission',
    fileUrl: '/documents/mission-statement.pdf',
    fileName: 'mission-statement.pdf',
    fileSize: 1536000, // 1.5MB
    uploadedAt: '2025-01-10',
    category: 'Governance',
    tags: ['mission', 'values', 'goals'],
    isPublished: true,
    authorId: 'admin',
    authorName: 'School Administration',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
    mimeType: 'application/pdf',
    priority: 4
  },
  
  {
    id: 'vision-statement-doc',
    title: 'Vision Statement',
    description: 'Our vision for the future of education and the development of our students.',
    type: 'vision',
    fileUrl: '/documents/vision-statement.pdf',
    fileName: 'vision-statement.pdf',
    fileSize: 1024000, // 1MB
    uploadedAt: '2025-01-08',
    category: 'Governance',
    tags: ['vision', 'future', 'aspirations'],
    isPublished: true,
    authorId: 'admin',
    authorName: 'School Administration',
    createdAt: '2025-01-08T08:00:00Z',
    updatedAt: '2025-01-08T08:00:00Z',
    mimeType: 'application/pdf',
    priority: 5
  }
];

//---------------------------------------------------------
// UTILITY FUNCTIONS
//---------------------------------------------------------

/**
 * Get documents by type
 */
export const getDocumentsByType = (type: string): StaticDocument[] => {
  return staticDocuments
    .filter(doc => doc.type === type && doc.isPublished)
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));
};

/**
 * Get documents by category
 */
export const getDocumentsByCategory = (category: string): StaticDocument[] => {
  return staticDocuments
    .filter(doc => doc.category.toLowerCase() === category.toLowerCase() && doc.isPublished)
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));
};

/**
 * Get all published documents
 */
export const getAllPublishedDocuments = (): StaticDocument[] => {
  return staticDocuments
    .filter(doc => doc.isPublished)
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));
};

/**
 * Search documents by title, description, or tags
 */
export const searchDocuments = (query: string): StaticDocument[] => {
  const lowercaseQuery = query.toLowerCase();
  return staticDocuments
    .filter(doc => 
      doc.isPublished && (
        doc.title.toLowerCase().includes(lowercaseQuery) ||
        doc.description.toLowerCase().includes(lowercaseQuery) ||
        doc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    )
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));
};

/**
 * Get document by ID
 */
export const getDocumentById = (id: string): StaticDocument | undefined => {
  return staticDocuments.find(doc => doc.id === id && doc.isPublished);
};

/**
 * Get document statistics
 */
export const getDocumentStats = () => {
  const published = staticDocuments.filter(doc => doc.isPublished);
  
  const byType = published.reduce((acc, doc) => {
    acc[doc.type] = (acc[doc.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byCategory = published.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total: published.length,
    byType,
    byCategory,
    published: published.length,
    unpublished: staticDocuments.length - published.length
  };
};

