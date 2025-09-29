import React, { useEffect, useState } from "react";
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
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReturnToHome from "../components/ReturnToHome";
import {
  School,
  Person,
  Support,
  AdminPanelSettings,
  Grade,
  MusicNote,
  Computer,
  LibraryBooks,
  ChildCare,
  Business,
  Email,
  Phone,
} from "@mui/icons-material";
import axios from "axios";
import { getStaffImageUrl, getStaffInitials, preloadStaffImages } from "../utils/imageUtils";
import { StaffAvatar } from "../components/OptimizedImage";

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
  category: "LEADERSHIP" | "TEACHING" | "SUPPORT";
  subjects?: string; // JSON string of array
  qualifications?: string;
  experience?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GroupedStaff {
  leadership: StaffMember[];
  teaching: StaffMember[];
  support: StaffMember[];
}

interface StaffApiResponse {
  success: boolean;
  data: {
    staff: StaffMember[];
    groupedStaff: GroupedStaff;
  };
}

/**
 * ========================================
 * STYLED COMPONENTS
 * ========================================
 */

const StaffCard = styled(Card)(({ theme }) => ({
  height: "100%",
  background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
  border: "1px solid #e0e0e0",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const LeadershipCard = styled(Card)(({ theme }) => ({
  height: "100%",
  background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
  borderLeft: `6px solid #ffd700`,
  boxShadow: theme.shadows[3],
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[10],
    borderLeftColor: "#1a237e",
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  textTransform: "uppercase",
  fontSize: "0.75rem",
}));

const LoadingSkeleton = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
}));

/**
 * ========================================
 * UTILITY FUNCTIONS
 * ========================================
 */

const parseSubjects = (subjects?: string | null): string[] | null => {
  if (!subjects) return null;
  try {
    const parsed = JSON.parse(subjects);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (error) {
    console.warn("Invalid subjects format:", subjects, error);
  }
  return null;
};

const getStaffIcon = (role: string, category: string) => {
  const roleLower = role.toLowerCase();

  if (category === "LEADERSHIP") return <School sx={{ color: "#1a237e" }} />;
  if (roleLower.includes("computer") || roleLower.includes("technology"))
    return <Computer sx={{ color: "#ffd700" }} />;
  if (roleLower.includes("music")) return <MusicNote sx={{ color: "#ffd700" }} />;
  if (roleLower.includes("library") || roleLower.includes("librarian"))
    return <LibraryBooks sx={{ color: "#1a237e" }} />;
  if (roleLower.includes("grade") || roleLower.includes("teacher"))
    return <Grade sx={{ color: "#1a237e" }} />;
  if (roleLower.includes("support") || roleLower.includes("coordinator"))
    return <Support sx={{ color: "#1a237e" }} />;
  if (roleLower.includes("secretary") || roleLower.includes("admin"))
    return <AdminPanelSettings sx={{ color: "#1a237e" }} />;
  if (roleLower.includes("bursar") || roleLower.includes("finance"))
    return <Business sx={{ color: "#1a237e" }} />;
  if (roleLower.includes("aftercare") || roleLower.includes("care"))
    return <ChildCare sx={{ color: "#1a237e" }} />;

  return <Person sx={{ color: "#ffd700" }} />;
};

interface CategoryColors {
  color: "primary" | "secondary" | "default";
  bgcolor: string;
}

const getCategoryColors = (category: string): CategoryColors => {
  switch (category) {
    case "LEADERSHIP":
      return { color: "primary", bgcolor: "#e3f2fd" };
    case "TEACHING":
      return { color: "secondary", bgcolor: "#f3e5f5" };
    case "SUPPORT":
      return { color: "default", bgcolor: "#f5f5f5" };
    default:
      return { color: "default", bgcolor: "#f5f5f5" };
  }
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

const StaffCardComponent: React.FC<StaffCardProps> = ({ member, isLeadership = false }) => {
  const subjects = parseSubjects(member.subjects);
  const categoryColors = getCategoryColors(member.category);
  const CardComponent = isLeadership ? LeadershipCard : StaffCard;

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
        <Typography
          variant={isLeadership ? "h6" : "body2"}
          sx={{
            color: isLeadership ? "#ffd700" : "#666",
            fontWeight: isLeadership ? 600 : 500,
            mb: 2,
          }}
        >
          {member.role}
        </Typography>

        {/* Category */}
        <CategoryChip
          label={member.category}
          color={categoryColors.color}
          size="small"
          sx={{ mb: 2, bgcolor: categoryColors.bgcolor, color: "#1a237e" }}
        />

        {/* Grade */}
        {member.grade && (
          <Chip
            label={member.grade}
            color="secondary"
            variant="outlined"
            size="small"
            sx={{ mb: 2, borderColor: "#1a237e" }}
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

        {/* Subjects */}
        {subjects && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
              mb: 2,
            }}
          >
            {subjects.map((subject) => (
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

        {/* Contact Info */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
          {member.email && (
            <Chip
              component="a"
              href={`mailto:${member.email}`}
              icon={<Email sx={{ fontSize: 16 }} />}
              label={member.email}
              size="small"
              variant="outlined"
              sx={{ borderColor: "#ffd700", color: "#1a237e" }}
            />
          )}
          {member.phone && (
            <Chip
              component="a"
              href={`tel:${member.phone}`}
              icon={<Phone sx={{ fontSize: 16 }} />}
              label={member.phone}
              size="small"
              variant="outlined"
              sx={{ borderColor: "#ffd700", color: "#1a237e" }}
            />
          )}
        </Box>
      </CardContent>
    </CardComponent>
  );
};

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

const EmptyState: React.FC<{ category: string }> = ({ category }) => {
  const getEmptyMessage = (category: string) => {
    switch (category) {
      case "leadership":
        return "No leadership staff available";
      case "teaching":
        return "No teaching staff available";
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
    support: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<StaffApiResponse>("http://localhost:5000/api/staff");

        if (response.data.success) {
          const staffData = response.data.data.groupedStaff ?? {
            leadership: [],
            teaching: [],
            support: [],
          };
          
          setGroupedStaff(staffData);
          
          // Preload staff images for better performance
          const allStaff = [
            ...staffData.leadership,
            ...staffData.teaching,
            ...staffData.support
          ];
          
          const imageUrls = allStaff
            .map(member => getStaffImageUrl(member.imageUrl))
            .filter((url): url is string => !!url);
          
          if (imageUrls.length > 0) {
            preloadStaffImages(imageUrls).catch(console.warn);
          }
        } else {
          throw new Error("Failed to fetch staff data");
        }
      } catch (err) {
        const message = axios.isAxiosError(err) ? err.message : "Unknown error";
        console.error("Failed to fetch staff:", err);
        setError(`Failed to load staff information: ${message}. Please check if the backend is running.`);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderStaffGrid = (staffList: StaffMember[], isLeadership = false) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        gap: 3,
      }}
    >
      {staffList.map((member) => (
        <StaffCardComponent key={member.id} member={member} isLeadership={isLeadership} />
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
          <CircularProgress size={60} sx={{ color: "#1a237e" }} />
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
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Return to Home */}
      <ReturnToHome />
      
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          sx={{ color: "#1a237e", fontWeight: 700, mb: 2, fontSize: { xs: "2rem", md: "2.5rem" } }}
        >
          Our Staff
        </Typography>
        <Divider sx={{ bgcolor: "#ffd700", height: 4, width: 80, mx: "auto", mb: 3 }} />
        <Typography variant="h6" sx={{ color: "#555", maxWidth: 800, mx: "auto", mb: 4 }}>
          Meet our dedicated team of educators and support staff who are committed to nurturing
          excellence, building character, and inspiring faith in our students.
        </Typography>
        <Chip
          label="2025 Academic Year"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600, borderColor: "#ffd700" }}
        />
      </Box>

      {/* Leadership */}
      {groupedStaff.leadership.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{ color: "#1a237e", fontWeight: 700, mb: 3, textAlign: "center" }}
          >
            School Leadership
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(auto-fit, minmax(300px, 1fr))" },
              gap: 3,
              maxWidth: 800,
              mx: "auto",
            }}
          >
            {groupedStaff.leadership.map((member) => (
              <StaffCardComponent key={member.id} member={member} isLeadership />
            ))}
          </Box>
        </Box>
      )}

      {/* Teaching & Support Tabs */}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="staff tabs"
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
                height: 3,
              },
            }}
          >
            <Tab label="Teaching Staff" id="staff-tab-0" aria-controls="staff-tabpanel-0" />
            <Tab label="Support Staff" id="staff-tab-1" aria-controls="staff-tabpanel-1" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {groupedStaff.teaching.length > 0 ? (
            renderStaffGrid(groupedStaff.teaching)
          ) : (
            <EmptyState category="teaching" />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {groupedStaff.support.length > 0 ? (
            renderStaffGrid(groupedStaff.support)
          ) : (
            <EmptyState category="support" />
          )}
        </TabPanel>
      </Box>
    </Container>
  );
};

export default Staff;