import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
  Divider,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReturnToHome from "../components/ReturnToHome";
import {
  Person,
} from "@mui/icons-material";
import axios from "axios";
import { API_BASE_URL_WITH_PREFIX } from "../services/apiConfig";
import { getStaffImageUrl, preloadStaffImages } from "../utils/imageUtils";
import { StaffAvatar } from "../components/OptimizedImage";
import { getBackgroundImageUrl } from "../utils/staticFiles";
import SEO from "../components/SEO";
import { Helmet } from "react-helmet-async";

/**
 * ========================================
 * TYPE DEFINITIONS
 * ========================================
 */

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  bio?: string;
  imageUrl?: string;
  grade?: string;
  category: "LEADERSHIP" | "TEACHING" | "ADMIN" | "SUPPORT";
  subjects?: string; // JSON string of array
  qualifications?: string;
  experience?: string;
  favoriteQuote?: string; // Favorite quote or verse
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GroupedStaff {
  leadership: StaffMember[];
  teaching: StaffMember[];
  admin: StaffMember[];
  support: StaffMember[];
}

type StaffCategory = 'leadership' | 'teaching' | 'administrative' | 'support';

/**
 * ========================================
 * STYLED COMPONENTS
 * ========================================
 */

const StaffCard = styled(Card)(({ theme }) => ({
  height: "100%",
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  border: "none",
  borderRadius: theme.spacing(3),
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)",
    transform: "scaleX(0)",
    transition: "transform 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 24px 48px rgba(211, 47, 47, 0.2)",
    "&::before": {
      transform: "scaleX(1)",
    },
  },
}));

const LeadershipCard = styled(Card)(({ theme }) => ({
  height: "100%",
  background: "linear-gradient(145deg, #e3f2fd 0%, #ffffff 100%)",
  border: "none",
  borderRadius: theme.spacing(3),
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 12px 40px rgba(26, 35, 126, 0.15)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "6px",
    background: "linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)",
    transform: "scaleX(1)",
    transition: "transform 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 28px 56px rgba(211, 47, 47, 0.25)",
    "&::before": {
      transform: "scaleX(1.1)",
    },
  },
}));


const LoadingSkeleton = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
}));

/**
 * ========================================
 * UTILITY FUNCTIONS
 * ========================================
 */

/**
 * Parse subjects JSON string with type guard
 * @param subjects - JSON string of array or null/undefined
 * @returns Parsed string array or null if invalid/empty
 */
const parseSubjects = (subjects?: string | null): string[] | null => {
  if (!subjects) return null;
  try {
    const parsed = JSON.parse(subjects);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(item => typeof item === 'string')) {
      return parsed;
    }
  } catch (error) {
    console.warn("Invalid subjects format:", subjects, error);
  }
  return null;
};



const getAvatarStyles = (isLeadership: boolean) => ({
  width: isLeadership ? 140 : 120,
  height: isLeadership ? 140 : 120,
  mx: "auto",
  mb: 2,
  bgcolor: "#1a237e",
  fontSize: isLeadership ? "3rem" : "2.5rem",
});

/**
 * ========================================
 * COMPONENT INTERFACES
 * ========================================
 */

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface StaffCardProps {
  member: StaffMember;
  isLeadership?: boolean;
}

/**
 * ========================================
 * COMPONENT IMPLEMENTATIONS
 * ========================================
 */

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`staff-tabpanel-${index}`}
      aria-labelledby={`staff-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const StaffCardComponent: React.FC<StaffCardProps> = React.memo(({ member, isLeadership = false }) => {
  const subjects = parseSubjects(member.subjects);
  const CardComponent = isLeadership ? LeadershipCard : StaffCard;

  /**
   * Filter subjects based on staff member name
   * TODO: Move this logic to backend - add excludeSubjects field to StaffMember model
   * This hard-coded approach is brittle and not scalable
   */
  const getFilteredSubjects = (): string[] | null => {
    if (!subjects) return null;
    
    const name = member.name.toLowerCase();
    let filteredSubjects = [...subjects];

    // Ms. Gleeson - Remove "Grade R" and "Early Childhood Development" after quote section
    if (name.includes('gleeson')) {
      filteredSubjects = filteredSubjects.filter(subj => 
        !subj.toLowerCase().includes('grade r') && 
        !subj.toLowerCase().includes('early childhood development')
      );
    }

    // Mrs De Sousa - Remove "Computer Studies" and "ICT"
    if (name.includes('de sousa') || name.includes('desousa')) {
      filteredSubjects = filteredSubjects.filter(subj => 
        !subj.toLowerCase().includes('computer studies') && 
        !subj.toLowerCase().includes('ict')
      );
    }

    // Mr Thelen - Remove all subjects (keep only grade and quote)
    if (name.includes('thelen')) {
      filteredSubjects = [];
    }

    // Mrs Wilson - Remove "Physical Education" and "Sports"
    if (name.includes('wilson')) {
      filteredSubjects = filteredSubjects.filter(subj => 
        !subj.toLowerCase().includes('physical education') && 
        !subj.toLowerCase().includes('sports')
      );
    }

    // Mrs McLeod - Remove "Religious Education" and "Remedial Work"
    if (name.includes('mcleod') || name.includes('mcleod')) {
      filteredSubjects = filteredSubjects.filter(subj => 
        !subj.toLowerCase().includes('religious education') && 
        !subj.toLowerCase().includes('remedial work')
      );
    }

    // Ms Du Preez - Remove all subjects (keep only grade and quote)
    if (name.includes('du preez') || name.includes('dupreez')) {
      filteredSubjects = [];
    }

    // Mrs Lottering - Remove all subjects (keep only grade and quote)
    if (name.includes('lottering')) {
      filteredSubjects = [];
    }

    // Ms Daniels - Remove all subjects (keep only grade and quote)
    if (name.includes('daniels')) {
      filteredSubjects = [];
    }

    // Mrs Malander - Remove all subjects (keep only grade and quote)
    if (name.includes('malander')) {
      filteredSubjects = [];
    }

    return filteredSubjects.length > 0 ? filteredSubjects : null;
  };

  const filteredSubjects = getFilteredSubjects();

  return (
    <CardComponent>
      <CardContent sx={{ textAlign: "center", p: 3 }}>
        {/* Optimized Avatar */}
        <StaffAvatar
          src={getStaffImageUrl(member.imageUrl)}
          name={member.name}
          size={isLeadership ? 140 : 120}
          category={member.category}
          sx={getAvatarStyles(isLeadership)}
        />

        {/* Name */}
        <Typography
          variant={isLeadership ? "h5" : "h6"}
          sx={{ color: "#1a237e", fontWeight: 700, mb: 1 }}
        >
          {member.name}
        </Typography>

        {/* Role */}
        {member.role && (
          <Typography
            variant="body2"
            sx={{ color: "#666", mb: 1.5, fontWeight: 500 }}
          >
            {member.role}
          </Typography>
        )}

        {/* Grade - Only show for teaching staff, improved contrast */}
        {member.grade && member.grade !== 'All' && member.grade !== 'All Grades' && (
          <Chip
            label={member.grade}
            variant="outlined"
            size="small"
            sx={{ 
              mb: 2, 
              borderColor: "#d32f2f", 
              color: "#b71c1c", 
              fontWeight: 600,
              backgroundColor: "rgba(211, 47, 47, 0.05)"
            }}
          />
        )}

        {/* Bio */}
        {member.bio && (
          <Typography
            variant="body2"
            sx={{ color: "#666", mb: 2, fontSize: "0.875rem", lineHeight: 1.6 }}
          >
            {member.bio}
          </Typography>
        )}

        {/* Favorite Quote */}
        {member.favoriteQuote && (
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              mb: 2,
              bgcolor: "#f8f9fa",
              borderRadius: 2,
              border: "1px solid #e3f2fd",
              borderLeft: "4px solid #1a237e"
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#1a237e",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                textAlign: "center",
                wordBreak: "break-word"
              }}
            >
              "{member.favoriteQuote}"
            </Typography>
          </Box>
        )}

        {/* Subjects - Only show filtered subjects */}
        {filteredSubjects && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
              mb: 2,
            }}
          >
            {filteredSubjects.map((subject) => (
              <Chip
                key={subject}
                label={subject}
                size="small"
                variant="outlined"
                sx={{ borderColor: "#ddd" }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </CardComponent>
  );
});

const StaffLoadingSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        gap: 3,
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <StaffCard key={index}>
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <LoadingSkeleton variant="circular" width={80} height={80} sx={{ mx: "auto", mb: 2 }} />
            <LoadingSkeleton variant="text" width="80%" height={24} sx={{ mx: "auto", mb: 1 }} />
            <LoadingSkeleton variant="text" width="60%" height={20} sx={{ mx: "auto", mb: 2 }} />
            <LoadingSkeleton variant="rectangular" width="40%" height={24} sx={{ mx: "auto", mb: 2 }} />
            <LoadingSkeleton variant="text" width="90%" height={16} sx={{ mx: "auto" }} />
          </CardContent>
        </StaffCard>
      ))}
    </Box>
  );
};

const EmptyState: React.FC<{ category: StaffCategory }> = ({ category }) => {
  const getEmptyMessage = (category: StaffCategory) => {
    switch (category) {
      case "leadership":
        return "No leadership staff available";
      case "teaching":
        return "No teaching staff available";
      case "administrative":
        return "No administrative staff available";
      case "support":
        return "No support staff available";
      default:
        return "No staff members available";
    }
  };

  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Person sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
      <Typography variant="h6" sx={{ color: "#666", mb: 2 }}>
        {getEmptyMessage(category)}
      </Typography>
      <Typography variant="body2" sx={{ color: "#888" }}>
        Staff information will be added as it becomes available.
      </Typography>
    </Box>
  );
};

/**
 * ========================================
 * MAIN STAFF COMPONENT
 * ========================================
 */

const Staff: React.FC = () => {
  const [groupedStaff, setGroupedStaff] = useState<GroupedStaff>({
    leadership: [],
    teaching: [],
    admin: [],
    support: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Combined useMemo for all filtering logic - more efficient than multiple memos
  const {
    allStaffMembers,
    leadershipHighlights,
    principalMember,
    filteredTeachingStaff,
    filteredAdminStaff,
    filteredSupportStaff,
  } = useMemo(() => {
    const allStaff = [
      ...groupedStaff.leadership,
      ...groupedStaff.teaching,
      ...groupedStaff.admin,
      ...groupedStaff.support,
    ];

    const selectPreferredMember = (candidates: StaffMember[]) => {
      if (candidates.length === 0) return undefined;

      const scoreMember = (member: StaffMember) => {
        let score = 0;
        if (member.imageUrl) score += 2;
        if (member.favoriteQuote && member.favoriteQuote.trim().length > 0) score += 2;
        if (member.grade && member.grade.trim().length > 0) score += 1;
        if (member.bio && member.bio.trim().length > 0) score += 1;
        return score;
      };

      return [...candidates].sort((a, b) => scoreMember(b) - scoreMember(a))[0];
    };

    const principalMember = (() => {
      const principalCandidates = allStaff.filter((member) => {
        const role = member.role?.toLowerCase() ?? "";
        return role.includes("principal") && !role.includes("deputy");
      });
      return selectPreferredMember(principalCandidates);
    })();

    const duPlessisMember = (() => {
      const duPlessisCandidates = allStaff.filter((member) => {
        const name = member.name?.toLowerCase() ?? "";
        const role = member.role?.toLowerCase() ?? "";

        const matchesName =
          name.includes("du plessis") ||
          name.includes("duplessis") ||
          name.includes("du-plessis");

        const matchesRole = role.includes("principal") || role.includes("leadership");

        return matchesName || matchesRole;
      });
      return selectPreferredMember(duPlessisCandidates);
    })();

    // Prevent duplicate leadership highlights
    const highlights: StaffMember[] = [];
    if (principalMember) {
      highlights.push(principalMember);
    }
    if (
      duPlessisMember &&
      (!principalMember || duPlessisMember.id !== principalMember.id)
    ) {
      highlights.push(duPlessisMember);
    }

    const highlightIds = new Set(highlights.map((member) => member.id));
    const highlightNameKeys = new Set(
      highlights
        .map((member) => member.name?.trim().toLowerCase())
        .filter((name): name is string => !!name)
    );

    const filterStaff = (staffList: StaffMember[]) =>
      staffList.filter(
        (member) =>
          !highlightIds.has(member.id) &&
          (() => {
            const nameKey = member.name?.trim().toLowerCase();
            return nameKey ? !highlightNameKeys.has(nameKey) : true;
          })()
      );

    return {
      allStaffMembers: allStaff,
      leadershipHighlights: highlights,
      principalMember: principalMember || undefined,
      filteredTeachingStaff: filterStaff(groupedStaff.teaching),
      filteredAdminStaff: filterStaff(groupedStaff.admin),
      filteredSupportStaff: filterStaff(groupedStaff.support),
    };
  }, [groupedStaff]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_BASE_URL_WITH_PREFIX}/staff`, {
          signal: controller.signal,
        });

        // Support both shapes:
        // 1) { success: true, data: { groupedStaff } }
        // 2) [array of StaffMember]
        let staffData: GroupedStaff = {
          leadership: [],
          teaching: [],
          admin: [],
          support: [],
        };

        const body = response.data as any;
        if (Array.isArray(body)) {
          // shape 2: array of staff -> group by category
          const allStaff = body as StaffMember[];
          staffData = {
            leadership: allStaff.filter(m => m.category === 'LEADERSHIP'),
            teaching: allStaff.filter(m => m.category === 'TEACHING'),
            admin: allStaff.filter(m => m.category === 'ADMIN'),
            support: allStaff.filter(m => m.category === 'SUPPORT'),
          };
        } else if (body && typeof body === 'object') {
          const maybeSuccess = (body as any).success;
          if (maybeSuccess && (body as any).data?.groupedStaff) {
            staffData = (body as any).data.groupedStaff as GroupedStaff;
          } else if ((body as any).groupedStaff) {
            staffData = (body as any).groupedStaff as GroupedStaff;
          } else if ((body as any).data && Array.isArray((body as any).data)) {
            const allStaff = (body as any).data as StaffMember[];
            staffData = {
              leadership: allStaff.filter(m => m.category === 'LEADERSHIP'),
              teaching: allStaff.filter(m => m.category === 'TEACHING'),
              admin: allStaff.filter(m => m.category === 'ADMIN'),
              support: allStaff.filter(m => m.category === 'SUPPORT'),
            };
          }
        }
          
          setGroupedStaff(staffData);
          
          // Preload staff images for better performance
          const allStaff = [
            ...staffData.leadership,
            ...staffData.teaching,
            ...staffData.admin,
            ...staffData.support
          ];
          
          const imageUrls = allStaff
            .map(member => getStaffImageUrl(member.imageUrl))
            .filter((url): url is string => !!url);
          
          if (imageUrls.length > 0) {
            preloadStaffImages(imageUrls).catch((err) => {
              console.error('Failed to preload staff images:', err);
            });
          }
      } catch (err) {
        // Don't set error if request was aborted
        if (axios.isCancel(err) || (err instanceof Error && err.name === 'AbortError')) {
          return;
        }
        const message = axios.isAxiosError(err) ? err.message : "Unknown error";
        console.error("Failed to fetch staff:", err);
        setError(`Failed to load staff information: ${message}. Please check if the backend is running.`);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();

    return () => {
      controller.abort();
    };
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Generate JSON-LD structured data for staff members
  const staffStructuredData = useMemo(() => {
    const staffPersons = allStaffMembers.map((member) => ({
      '@type': 'Person',
      name: member.name,
      jobTitle: member.role,
      ...(member.email && { email: member.email }),
      ...(member.phone && { telephone: member.phone }),
      ...(member.imageUrl && { image: getStaffImageUrl(member.imageUrl) }),
      ...(member.bio && { description: member.bio }),
      worksFor: {
        '@type': 'EducationalOrganization',
        name: 'Holy Cross Convent School Brooklyn',
      },
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Staff Directory - Holy Cross Convent School Brooklyn',
      description: 'Meet the dedicated educators and support staff committed to nurturing excellence.',
      itemListElement: staffPersons.map((person, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: person,
      })),
    };
  }, [allStaffMembers]);

  const renderStaffGrid = (staffList: StaffMember[], isLeadership = false) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        gap: 3,
      }}
      data-testid={isLeadership ? "leadership-grid" : "staff-grid"}
    >
      {staffList.map((member) => (
        <StaffCardComponent 
          key={member.id || `staff-${member.name}-${member.role}`} 
          member={member} 
          isLeadership={isLeadership} 
        />
      ))}
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h2" sx={{ color: "#1a237e", fontWeight: 700, mb: 2 }}>
            Our Staff
          </Typography>
          <Divider sx={{ bgcolor: "#ffd700", height: 4, width: 80, mx: "auto", mb: 3 }} />
          <CircularProgress 
            size={60} 
            sx={{ color: "#1a237e" }} 
            aria-label="Loading staff data"
          />
          <Typography variant="h6" sx={{ color: "#666", mt: 2 }}>
            Loading staff information...
          </Typography>
        </Box>
        <StaffLoadingSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h2" sx={{ color: "#1a237e", fontWeight: 700, mb: 2 }}>
            Our Staff
          </Typography>
          <Divider sx={{ bgcolor: "#ffd700", height: 4, width: 80, mx: "auto", mb: 3 }} />
        </Box>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ bgcolor: "#1a237e", "&:hover": { bgcolor: "#0d1421" } }}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <SEO
        title="Our Staff - Holy Cross Convent School Brooklyn"
        description="Meet the dedicated educators and support staff who are committed to nurturing excellence, building character, and inspiring faith in our students."
        url="https://holycrossbrooklyn.edu.za/staff"
      />
      
      {/* JSON-LD Structured Data for Staff */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(staffStructuredData)}
        </script>
      </Helmet>

      {/* Modern Header Section with Background Image */}
      <Box sx={{ 
        backgroundImage: getBackgroundImageUrl('HCCS25.jpeg'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center'
      }}
      role="img"
      aria-label="Holy Cross Convent School Brooklyn - Our Staff"
      >
        {/* Dark Overlay for Text Readability */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.85) 0%, rgba(57, 73, 171, 0.75) 50%, rgba(211, 47, 47, 0.7) 100%)',
          zIndex: 0
        }} />
        
        {/* Additional Pattern Overlay */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.15) 0%, transparent 50%)
          `,
          zIndex: 1
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Return to Home */}
          <Box sx={{ 
            position: 'absolute',
            top: 16,
            left: 16,
            '& .MuiTypography-root': {
              color: 'white !important',
              textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
              display: 'inline-block',
              '&:hover': {
                transform: 'translateX(-2px)',
              }
            }
          }}>
            <ReturnToHome />
          </Box>
          
          {/* Modern Header Content */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 800,
                mb: 3,
                color: 'white',
                textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
              }}
            >
              Our Staff
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 400,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                lineHeight: 1.6,
                color: 'white',
                textShadow: '1px 1px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)'
              }}
            >
              Meet the dedicated educators and support staff who are committed to nurturing 
              excellence, building character, and inspiring faith in our students.
            </Typography>
          </Box>
        </Container>
      </Box>

    <Container maxWidth="xl" sx={{ py: 6 }}>

      {/* Leadership Highlights */}
      {leadershipHighlights.length > 0 && (
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" sx={{ color: "#1a237e", fontWeight: 700, mb: 3, textAlign: "center" }}>
            Our Leadership Team
          </Typography>
          <Divider sx={{ bgcolor: "#ffd700", height: 4, width: 100, mx: "auto", mb: 4 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: `repeat(${Math.min(leadershipHighlights.length, 2)}, minmax(280px, 1fr))`,
              },
              gap: 3,
            }}
            data-testid="leadership-highlights"
          >
            {leadershipHighlights.map((member) => {
              const isPrincipal =
                principalMember && member.id === principalMember.id;
              const accentColor = "#ffd700";
              const gradientBackground = isPrincipal
                ? "linear-gradient(135deg, #1a237e 0%, #283593 100%)"
                : "linear-gradient(135deg, #283593 0%, #3949ab 70%, #5c6bc0 100%)";

              return (
                <Card
                  key={member.id}
                  sx={{
                    background: gradientBackground,
                    color: "white",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(26, 35, 126, 0.3)",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "200px",
                      height: "200px",
                      background:
                        "radial-gradient(circle, rgba(255, 215, 0, 0.12) 0%, transparent 70%)",
                      borderRadius: "50%",
                      transform: "translate(40%, -40%)",
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: { xs: "center", md: "flex-start" },
                        gap: { xs: 3, md: 4 },
                      }}
                    >
                      <Box sx={{ flexShrink: 0, textAlign: "center" }}>
                        <StaffAvatar
                          src={getStaffImageUrl(member.imageUrl)}
                          name={member.name}
                          size={180}
                          category={member.category}
                          sx={{
                            border: `4px solid ${accentColor}`,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                          }}
                        />
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h4"
                          sx={{
                            color: accentColor,
                            fontWeight: 700,
                            mb: 1,
                            textAlign: { xs: "center", md: "left" },
                          }}
                        >
                          {member.name}
                        </Typography>

                        {member.role && (
                          <Typography
                            variant="h6"
                            sx={{
                              color: "rgba(255,255,255,0.95)",
                              fontWeight: 500,
                              mb: 1,
                              textAlign: { xs: "center", md: "left" },
                            }}
                          >
                            {member.role}
                          </Typography>
                        )}

                        {member.grade &&
                          member.grade !== "All" &&
                          member.grade !== "All Grades" && (
                            <Typography
                              variant="body1"
                              sx={{
                                color: accentColor,
                                fontWeight: 600,
                                mb: 2,
                                textAlign: { xs: "center", md: "left" },
                              }}
                            >
                              {member.grade}
                            </Typography>
                          )}

                        {member.bio && (
                          <Typography
                            variant="body1"
                            sx={{
                              color: "rgba(255,255,255,0.95)",
                              lineHeight: 1.7,
                              fontSize: "1.05rem",
                              mb: member.favoriteQuote ? 3 : 0,
                              textAlign: { xs: "center", md: "left" },
                              wordBreak: "break-word",
                              overflowWrap: "break-word"
                            }}
                          >
                            {member.bio}
                          </Typography>
                        )}

                        {member.favoriteQuote && (
                          <Box
                            sx={{
                              p: 3,
                              bgcolor: "rgba(255, 215, 0, 0.12)",
                              borderRadius: 3,
                              border: "1px solid rgba(255, 215, 0, 0.35)",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                color: accentColor,
                                fontSize: "1rem",
                                lineHeight: 1.7,
                                fontWeight: 500,
                                textAlign: "center",
                                fontStyle: "italic",
                              }}
                            >
                              “{member.favoriteQuote}”
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Teaching, Admin & Support Tabs */}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="staff category tabs"
            role="tablist"
            centered
            sx={{
              "& .MuiTab-root": {
                color: "#666",
                fontWeight: 600,
                fontSize: "1.1rem",
                "&.Mui-selected": {
                  color: "#1a237e",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#ffd700",
                height: 4,
              },
            }}
          >
            <Tab 
              label="Teaching Staff" 
              id="staff-tab-0" 
              aria-controls="staff-tabpanel-0"
              data-testid="tab-teaching"
            />
            <Tab 
              label="Administrative Staff" 
              id="staff-tab-1" 
              aria-controls="staff-tabpanel-1"
              data-testid="tab-admin"
            />
            <Tab 
              label="Support Staff" 
              id="staff-tab-2" 
              aria-controls="staff-tabpanel-2"
              data-testid="tab-support"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {filteredTeachingStaff.length > 0 ? (
            renderStaffGrid(filteredTeachingStaff)
          ) : (
            <EmptyState category="teaching" />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {filteredAdminStaff.length > 0 ? (
            renderStaffGrid(filteredAdminStaff)
          ) : (
            <EmptyState category="administrative" />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {filteredSupportStaff.length > 0 ? (
            renderStaffGrid(
              // Sort support staff to put Mrs Benita Faulman first
              [...filteredSupportStaff].sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                const faulmanInA = aName.includes('faulman') || aName.includes('benita');
                const faulmanInB = bName.includes('faulman') || bName.includes('benita');
                
                if (faulmanInA && !faulmanInB) return -1;
                if (!faulmanInA && faulmanInB) return 1;
                return 0;
              })
            )
          ) : (
            <EmptyState category="support" />
          )}
        </TabPanel>
      </Box>
    </Container>
    </Box>
  );
};

export default Staff;