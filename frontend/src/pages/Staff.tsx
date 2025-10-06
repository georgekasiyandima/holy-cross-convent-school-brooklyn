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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReturnToHome from "../components/ReturnToHome";
import {
  Person,
  Email,
  Phone,
} from "@mui/icons-material";
import axios from "axios";
import { getStaffImageUrl, preloadStaffImages } from "../utils/imageUtils";
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
    background: "linear-gradient(90deg, #1a237e 0%, #ffd700 100%)",
    transform: "scaleX(0)",
    transition: "transform 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-12px) scale(1.02)",
    boxShadow: "0 24px 48px rgba(26, 35, 126, 0.2)",
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
    background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
    transform: "scaleX(1)",
    transition: "transform 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-12px) scale(1.02)",
    boxShadow: "0 28px 56px rgba(26, 35, 126, 0.25)",
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

        {/* Favorite Quote */}
        {member.favoriteQuote && (
          <Box
            sx={{
              p: 2,
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
                fontStyle: "italic",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                textAlign: "center"
              }}
            >
              "{member.favoriteQuote}"
            </Typography>
          </Box>
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
    admin: [],
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

        const response = await axios.get<StaffApiResponse>("https://holy-cross-convent-school-brooklyn.onrender.com/api/staff");

        if (response.data.success) {
          const staffData = response.data.data.groupedStaff ?? {
            leadership: [],
            teaching: [],
            admin: [],
            support: [],
          };
          
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Modern Header Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
        color: 'white',
        py: 8,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
          `,
          zIndex: 0
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Return to Home */}
          <ReturnToHome />
          
          {/* Modern Header Content */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 800,
                mb: 3,
                background: 'linear-gradient(45deg, #ffffff 30%, #ffd700 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              Our Staff
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                maxWidth: '600px',
                mx: 'auto',
                opacity: 0.9,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                lineHeight: 1.6
              }}
            >
              Meet the dedicated educators and support staff who are committed to nurturing 
              excellence, building character, and inspiring faith in our students.
            </Typography>
            
            {/* Decorative Elements */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              mt: 4,
              gap: 2
            }}>
              <Box sx={{ 
                width: 60, 
                height: 4, 
                background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)',
                borderRadius: 2
              }} />
              <Box sx={{ 
                width: 8, 
                height: 8, 
                background: '#ffd700',
                borderRadius: '50%'
              }} />
              <Box sx={{ 
                width: 60, 
                height: 4, 
                background: 'linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)',
                borderRadius: 2
              }} />
            </Box>
          </Box>
        </Container>
      </Box>

    <Container maxWidth="xl" sx={{ py: 6 }}>

      {/* Principal Section - Horizontal Banner Style */}
      {groupedStaff.leadership.length > 0 && (
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" sx={{ color: "#1a237e", fontWeight: 700, mb: 3, textAlign: "center" }}>
            Our Principal
          </Typography>
          <Divider sx={{ bgcolor: "#ffd700", height: 4, width: 100, mx: "auto", mb: 4 }} />
          
          {/* Principal Banner Card - Horizontal Layout */}
          {groupedStaff.leadership.filter(member => member.role.toLowerCase().includes('principal')).map((member) => (
            <Card
              key={member.id}
              sx={{
                background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
                color: "white",
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(26, 35, 126, 0.3)",
                mb: 4,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "200px",
                  height: "200px",
                  background: "radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)",
                  borderRadius: "50%",
                  transform: "translate(50%, -50%)",
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", minHeight: 200 }}>
                  {/* Principal Image */}
                  <Box sx={{ flex: "0 0 200px", p: 3, display: "flex", justifyContent: "center" }}>
                    <StaffAvatar
                      src={getStaffImageUrl(member.imageUrl)}
                      name={member.name}
                      size={160}
                      category={member.category}
                      sx={{
                        border: "4px solid #ffd700",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      }}
                    />
                  </Box>

                  {/* Principal Info */}
                  <Box sx={{ flex: 1, p: 3, pr: 4 }}>
                    <Typography variant="h4" sx={{ color: "#ffd700", fontWeight: 700, mb: 1 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.9)", mb: 1, fontWeight: 500 }}>
                      Principal
                    </Typography>
                    {member.grade && (
                      <Typography variant="body1" sx={{ color: "#ffd700", mb: 2, fontWeight: 600, fontSize: "1.1rem" }}>
                        {member.grade}
                      </Typography>
                    )}
                    
                    {/* Bio */}
                    {member.bio && (
                      <Typography
                        variant="body1"
                        sx={{
                          color: "rgba(255,255,255,0.9)",
                          mb: 3,
                          lineHeight: 1.6,
                          fontSize: "1.1rem",
                        }}
                      >
                        {member.bio}
                      </Typography>
                    )}

                    {/* Favorite Quote */}
                    {member.favoriteQuote && (
          <Box
            sx={{
                          p: 2,
                          bgcolor: "rgba(255, 215, 0, 0.1)",
                          borderRadius: 2,
                          border: "1px solid rgba(255, 215, 0, 0.3)",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#ffd700",
                            fontStyle: "italic",
                            fontSize: "1rem",
                            lineHeight: 1.6,
                            textAlign: "left",
                            fontWeight: 500,
                          }}
                        >
                          "{member.favoriteQuote}"
                        </Typography>
                      </Box>
                    )}

                    {/* Contact Info */}
                    <Box sx={{ mt: 3, display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {member.email && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Email sx={{ color: "#ffd700", fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                            {member.email}
                          </Typography>
                        </Box>
                      )}
                      {member.phone && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Phone sx={{ color: "#ffd700", fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                            {member.phone}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Teaching, Admin & Support Tabs */}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="staff tabs"
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
                height: 3,
              },
            }}
          >
            <Tab label="Teaching Staff" id="staff-tab-0" aria-controls="staff-tabpanel-0" />
            <Tab label="Administrative Staff" id="staff-tab-1" aria-controls="staff-tabpanel-1" />
            <Tab label="Support Staff" id="staff-tab-2" aria-controls="staff-tabpanel-2" />
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
          {groupedStaff.admin.length > 0 ? (
            renderStaffGrid(groupedStaff.admin)
          ) : (
            <EmptyState category="administrative" />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {groupedStaff.support.length > 0 ? (
            renderStaffGrid(groupedStaff.support)
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