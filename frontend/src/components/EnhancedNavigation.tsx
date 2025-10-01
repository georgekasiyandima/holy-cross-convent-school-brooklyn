import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  Collapse,
  Chip,
  Stack,
} from '@mui/material';
import {
  ExpandMore,
  School,
  SportsSoccer,
  MusicNote,
  Palette,
  Science,
  Groups,
  Description,
  CalendarMonth,
  History,
  AttachMoney,
  Person,
  AdminPanelSettings,
  Menu as MenuIcon,
  Close,
  ArrowForward,
  Star,
  TrendingUp,
  EmojiPeople,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components for enhanced navigation
const NavigationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

const PillarButton = styled(Button)(({ theme }) => ({
  color: '#1a237e',
  backgroundColor: 'rgba(26, 35, 126, 0.1)',
  borderRadius: '25px',
  padding: '8px 20px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  border: '2px solid transparent',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: 'rgba(26, 35, 126, 0.2)',
    borderColor: 'rgba(26, 35, 126, 0.3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
}));

const DropdownMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '16px',
    marginTop: theme.spacing(1),
    minWidth: '280px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    border: '1px solid rgba(26, 35, 126, 0.1)',
  },
}));

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: '8px',
  margin: theme.spacing(0.5, 1),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(26, 35, 126, 0.08)',
    transform: 'translateX(4px)',
  },
  '& .MuiListItemIcon-root': {
    color: '#1a237e',
    minWidth: '40px',
  },
  '& .MuiListItemText-primary': {
    fontWeight: 500,
    color: '#1a237e',
  },
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 193, 7, 0.1)',
  color: '#1a237e',
  border: '1px solid rgba(255, 193, 7, 0.3)',
  fontSize: '0.75rem',
  height: '24px',
  '& .MuiChip-icon': {
    fontSize: '16px',
  },
}));

// Navigation data structure
const navigationData = {
  pillars: [
    {
      name: 'Academics',
      icon: <School />,
      color: '#1a237e',
      items: [
        { name: 'Robotics & Computer Room', path: '/robotics', icon: <Science />, featured: true },
        { name: 'Core Subjects', path: '/academics', icon: <School /> },
        { name: 'Learning Support', path: '/learning-support', icon: <EmojiPeople /> },
      ],
    },
    {
      name: 'Cultural',
      icon: <Palette />,
      color: '#ff6b35',
      items: [
        { name: 'Art & Creativity', path: '/art', icon: <Palette /> },
        { name: 'Music Department', path: '/music', icon: <MusicNote /> },
        { name: 'Liturgical Dance', path: '/liturgical-dance', icon: <EmojiPeople /> },
        { name: 'Gardening Club', path: '/gardening', icon: <Science /> },
      ],
    },
    {
      name: 'Service & Ethos',
      icon: <Groups />,
      color: '#2e7d32',
      items: [
        { name: 'Religious Education', path: '/religious-education', icon: <Groups /> },
        { name: 'Community Outreach', path: '/community-outreach', icon: <EmojiPeople /> },
        { name: 'Spiritual Activities', path: '/spiritual', icon: <Groups /> },
      ],
    },
    {
      name: 'Sports',
      icon: <SportsSoccer />,
      color: '#d32f2f',
      items: [
        { name: 'Soccer', path: '/soccer', icon: <SportsSoccer /> },
        { name: 'Netball', path: '/netball', icon: <SportsSoccer /> },
        { name: 'Tennis', path: '/tennis', icon: <SportsSoccer /> },
        { name: 'Mini Tennis', path: '/mini-tennis', icon: <SportsSoccer /> },
        { name: 'Karate', path: '/karate', icon: <SportsSoccer /> },
      ],
    },
  ],
  mainPages: [
    { name: 'Admissions', path: '/admissions', icon: <Person /> },
    { name: 'Fee Structure', path: '/fees', icon: <AttachMoney /> },
    { name: 'Afterschool Programme', path: '/afterschool', icon: <TrendingUp /> },
    { name: 'Gallery', path: '/gallery', icon: <Palette /> },
    { name: 'Staff', path: '/staff', icon: <Person /> },
    { name: 'School Board', path: '/school-board', icon: <AdminPanelSettings /> },
    { name: 'Policies', path: '/policies', icon: <Description /> },
    { name: 'Calendar', path: '/events', icon: <CalendarMonth /> },
    { name: 'History & Mission', path: '/history', icon: <History /> },
  ],
};

interface EnhancedNavigationProps {
  onNavigate: (path: string) => void;
  currentPage?: string;
}

const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({ onNavigate, currentPage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>, pillarName: string) => {
    setAnchorEls(prev => ({
      ...prev,
      [pillarName]: event.currentTarget,
    }));
  };

  const handleClose = (pillarName: string) => {
    setAnchorEls(prev => ({
      ...prev,
      [pillarName]: null,
    }));
  };

  const handleNavigation = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
    // Close all dropdowns
    setAnchorEls({});
  };

  // Mobile drawer content
  const MobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: '400px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700 }}>
            Navigation
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Typography variant="h6" sx={{ color: '#1a237e', mb: 2, fontWeight: 600 }}>
          School Pillars
        </Typography>
        
        {navigationData.pillars.map((pillar) => (
          <Box key={pillar.name} sx={{ mb: 2 }}>
            <Button
              fullWidth
              startIcon={pillar.icon}
              onClick={() => handleNavigation(pillar.items[0].path)}
              sx={{
                justifyContent: 'flex-start',
                color: pillar.color,
                fontWeight: 600,
                mb: 1,
              }}
            >
              {pillar.name}
            </Button>
            <List sx={{ pl: 2 }}>
              {pillar.items.map((item) => (
                <ListItem key={item.name} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: '32px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    onClick={() => handleNavigation(item.path)}
                    sx={{ cursor: 'pointer' }}
                  />
                  {item.featured && (
                    <FeatureChip label="New" size="small" icon={<Star />} />
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ color: '#1a237e', mb: 2, fontWeight: 600 }}>
          Quick Links
        </Typography>
        
        <List>
          {navigationData.mainPages.map((page) => (
            <ListItem key={page.name} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: '32px' }}>
                {page.icon}
              </ListItemIcon>
              <ListItemText
                primary={page.name}
                onClick={() => handleNavigation(page.path)}
                sx={{ cursor: 'pointer' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            color: '#1a237e',
            backgroundColor: 'rgba(26, 35, 126, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(26, 35, 126, 0.2)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        <MobileDrawer />
      </>
    );
  }

  return (
    <NavigationContainer>
      {/* School Pillars */}
      {navigationData.pillars.map((pillar) => (
        <React.Fragment key={pillar.name}>
          <PillarButton
            onClick={(e) => handleClick(e, pillar.name)}
            endIcon={<ExpandMore />}
            sx={{
              '&:hover': {
                backgroundColor: `${pillar.color}15`,
                borderColor: `${pillar.color}30`,
              },
            }}
          >
            {pillar.icon}
            <Typography sx={{ ml: 1 }}>{pillar.name}</Typography>
          </PillarButton>

          <DropdownMenu
            anchorEl={anchorEls[pillar.name]}
            open={Boolean(anchorEls[pillar.name])}
            onClose={() => handleClose(pillar.name)}
            TransitionComponent={Grow}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          >
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle1" sx={{ color: pillar.color, fontWeight: 600, px: 2, py: 1 }}>
                {pillar.name} Programs
              </Typography>
              {pillar.items.map((item) => (
                <MenuItemStyled
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                  {item.featured && (
                    <FeatureChip label="New" size="small" icon={<Star />} />
                  )}
                </MenuItemStyled>
              ))}
            </Box>
          </DropdownMenu>
        </React.Fragment>
      ))}

      {/* Quick Links */}
      <Box sx={{ display: 'flex', gap: 1, ml: 2, flexWrap: 'wrap' }}>
        {navigationData.mainPages.slice(0, 4).map((page) => (
          <Button
            key={page.name}
            onClick={() => handleNavigation(page.path)}
            sx={{
              color: '#1a237e',
              backgroundColor: 'rgba(255, 193, 7, 0.1)',
              borderRadius: '20px',
              padding: '6px 16px',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.85rem',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 193, 7, 0.2)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {page.icon}
            <Typography sx={{ ml: 0.5, fontSize: '0.8rem' }}>
              {page.name}
            </Typography>
          </Button>
        ))}
      </Box>
    </NavigationContainer>
  );
};

export default EnhancedNavigation;




