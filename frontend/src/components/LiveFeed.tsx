import React, { useState, useEffect, memo, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Fade,
  useTheme,
  useMediaQuery,
  LinearProgress
} from '@mui/material';
import {
  Event as EventIcon,
  TrendingUp,
  Notifications,
  School,
  Celebration,
  SportsSoccer,
  MusicNote,
  Science,
  AccessTime,
  LocationOn,
  ArrowForward,
  Timer
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

//---------------------------------------------------------
// TYPES & INTERFACES
//---------------------------------------------------------
interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  icon: React.ReactNode;
  color: string;
}

interface News {
  id: number;
  title: string;
  summary: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

//---------------------------------------------------------
// TASK SCHEDULER TYPES
//---------------------------------------------------------
type Job = {
  id: string;        // unique identifier for the job
  interval: number;  // how often to run (in seconds)
  task: () => void;  // the function to run
};

//---------------------------------------------------------
// TASK SCHEDULER HOOK
//---------------------------------------------------------
/**
 * Custom hook that provides a centralized task scheduler
 * This pattern helps manage multiple intervals efficiently and prevents
 * memory leaks by using a single master interval instead of multiple setInterval calls
 */
export const useTaskScheduler = () => {
  const tickRef = useRef(0);      // keeps track of elapsed seconds
  const jobsRef = useRef<Job[]>([]); // active jobs list

  // Register a new job to be executed at specified intervals
  const addJob = useCallback((job: Job) => {
    jobsRef.current.push(job);
  }, []);

  // Remove a job by ID to stop its execution
  const removeJob = useCallback((jobId: string) => {
    jobsRef.current = jobsRef.current.filter((job) => job.id !== jobId);
  }, []);

  // Central interval (runs every second) - this is the "master clock"
  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;

      // Check each job to see if it should run at this tick
      jobsRef.current.forEach(({ interval, task }) => {
        if (tickRef.current % interval === 0) {
          task();
        }
      });
    }, 1000);

    return () => clearInterval(interval); // cleanup master clock
  }, []);

  return { addJob, removeJob };
};

//---------------------------------------------------------
// STYLED COMPONENTS
//---------------------------------------------------------
const LiveFeedContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fff3e0 0%, #e0f7fa 100%)', // School-friendly gradient
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  maxWidth: '1200px',
  margin: '0 auto', // Center the container
}));

const FeedCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));


const CountdownCardStyled = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ff7043 0%, #f50057 100%)', // Vibrant red-orange
  color: 'white',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const TickerContainer = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  background: 'rgba(255, 193, 7, 0.1)', // Yellowish tint
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  border: '1px solid rgba(255, 193, 7, 0.2)',
  '&:hover': {
    '& .ticker': {
      animationPlayState: 'paused', // Pause on hover
    },
  },
}));

const TickerText = styled(Typography)(({ theme }) => ({
  display: 'inline-block',
  animation: 'ticker 30s linear infinite',
  '@keyframes ticker': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(-100%)' },
  },
}));

//---------------------------------------------------------
// SAMPLE DATA
//---------------------------------------------------------
const upcomingEvents: Event[] = [
  {
    id: 1,
    title: 'Robotics Program Launch',
    date: '2025-02-15', // Updated to near future for testing
    time: '10:00 AM',
    location: 'New Computer Lab',
    category: 'Technology',
    icon: <Science />,
    color: '#9c27b0',
  },
  {
    id: 2,
    title: 'Computer Lab Unveiling',
    date: '2025-02-20',
    time: '02:00 PM',
    location: 'Main Building',
    category: 'Infrastructure',
    icon: <School />,
    color: '#2196f3',
  },
  {
    id: 3,
    title: 'Annual Sports Day',
    date: '2025-08-20',
    time: '09:00 AM',
    location: 'School Grounds',
    category: 'Sports',
    icon: <SportsSoccer />,
    color: '#4caf50',
  },
  {
    id: 4,
    title: 'Music Concert',
    date: '2025-08-25',
    time: '06:00 PM',
    location: 'School Auditorium',
    category: 'Music',
    icon: <MusicNote />,
    color: '#ff9800',
  },
];

const latestNews: News[] = [
  {
    id: 1,
    title: 'Robotics Program Launch',
    summary: 'Exciting new robotics program launching with cutting-edge technology and hands-on learning opportunities.',
    category: 'Technology',
    priority: 'high',
    date: '2025-02-10',
  },
  {
    id: 2,
    title: 'Computer Lab Unveiling',
    summary: 'State-of-the-art computer laboratory officially opens with modern equipment and advanced learning resources.',
    category: 'Infrastructure',
    priority: 'high',
    date: '2025-02-08',
  },
  {
    id: 3,
    title: 'Academic Excellence Awards',
    summary: 'Congratulations to our top-performing students for their outstanding achievements.',
    category: 'Academic',
    priority: 'medium',
    date: '2025-01-15',
  },
  {
    id: 4,
    title: 'Community Outreach Program',
    summary: 'Students participate in local community service initiatives.',
    category: 'Community',
    priority: 'low',
    date: '2025-01-10',
  },
];

const announcements = [
  '🚀 Robotics Program Launch - February 15th at 10:00 AM in the New Computer Lab',
  '💻 Computer Lab Unveiling - February 20th at 2:00 PM in the Main Building',
  '📚 Parent-teacher meetings scheduled for next week',
  '🏫 School library extended hours during exam period',
  '⚽ Sports equipment donation drive is now live',
  '💝 Donation drive for school projects is now live. Visit our donate page to contribute.',
  '🎯 New after-school programs starting this month',
  '🤖 Robotics workshops available for all grade levels',
];


//---------------------------------------------------------
// UTILITY FUNCTIONS
//---------------------------------------------------------
/**
 * Helper to parse a date + time string into a timestamp.
 * Assumes "YYYY-MM-DD" and "HH:mm AM/PM" formats.
 * This function converts the date and time strings to a JavaScript timestamp
 * that can be used for countdown calculations.
 */
function parseEventDateTime(dateStr: string, timeStr: string): number {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  // Convert 12-hour format to 24-hour format
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const isoDate = `${dateStr}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  return new Date(isoDate).getTime();
}

//---------------------------------------------------------
// SUBCOMPONENTS
//---------------------------------------------------------
const EventCard = memo(({ event, index, total }: { event: Event; index: number; total: number }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
          <FeedCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EventIcon sx={{ color: '#1a237e', mr: 1 }} aria-hidden="true" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                  Upcoming Events
                </Typography>
              </Box>
        <Fade in key={index} timeout={500}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: event.color, width: 32, height: 32, mr: 1 }}>
                {event.icon}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {event.title}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} aria-hidden="true" />
                    <Typography variant="body2" color="text.secondary">
                {formatDate(event.date)} at {event.time}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} aria-hidden="true" />
                    <Typography variant="body2" color="text.secondary">
                {event.location}
                    </Typography>
                  </Box>
                  <Chip 
              label={event.category}
                    size="small" 
              sx={{ backgroundColor: event.color, color: 'white', fontWeight: 500 }}
                  />
                </Box>
              </Fade>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
            {index + 1} of {total}
                </Typography>
          <IconButton size="small" sx={{ color: '#1a237e' }} aria-label="Next event">
                  <ArrowForward />
                </IconButton>
              </Box>
            </CardContent>
          </FeedCard>
  );
});

const NewsCard = memo(({ news, index, total }: { news: News; index: number; total: number }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#2196f3';
    }
  };

  return (
          <FeedCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Notifications sx={{ color: '#1a237e', mr: 1 }} aria-hidden="true" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                  Latest News
                </Typography>
              </Box>
        <Fade in key={index} timeout={500}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {news.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {news.summary}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                label={news.category}
                      size="small" 
                      sx={{ 
                  backgroundColor: getPriorityColor(news.priority),
                        color: 'white',
                  fontWeight: 500,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                {formatDate(news.date)}
                    </Typography>
                  </Box>
                </Box>
              </Fade>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
            {index + 1} of {total}
                </Typography>
          <IconButton size="small" sx={{ color: '#1a237e' }} aria-label="Next news">
                  <ArrowForward />
                </IconButton>
              </Box>
            </CardContent>
          </FeedCard>
  );
});


const CountdownCardComponent = memo(({ event, countdown }: { event: Event; countdown: Countdown }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate progress (assuming 30 days max for simplicity)
  const maxSeconds = 30 * 24 * 60 * 60;
  const currentSeconds =
    countdown.days * 24 * 60 * 60 +
    countdown.hours * 60 * 60 +
    countdown.minutes * 60 +
    countdown.seconds;
  const progress = (currentSeconds / maxSeconds) * 100;

  return (
    <CountdownCardStyled>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Timer sx={{ fontSize: 32, mr: 1 }} aria-hidden="true" />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Next Event
        </Typography>
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        {event.title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
        {formatDate(event.date)} at {event.time}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {countdown.days}
          </Typography>
          <Typography variant="caption">Days</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {countdown.hours}
          </Typography>
          <Typography variant="caption">Hours</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {countdown.minutes}
          </Typography>
          <Typography variant="caption">Mins</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {countdown.seconds}
          </Typography>
          <Typography variant="caption">Secs</Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 2, px: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' }}
          aria-label="Countdown progress"
        />
      </Box>
      <Chip
        label={event.category}
        size="small"
        sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500, mt: 2 }}
      />
    </CountdownCardStyled>
  );
});

//---------------------------------------------------------
// MAIN LIVE FEED COMPONENT
//---------------------------------------------------------
const LiveFeed: React.FC = () => {
  const theme = useTheme();
  
  //-----------------------------------------------------
  // STATE MANAGEMENT
  //-----------------------------------------------------
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [countdown, setCountdown] = useState<Countdown>({ 
    days: 0, 
    hours: 0, 
    minutes: 0, 
    seconds: 0 
  });

  //-----------------------------------------------------
  // TASK SCHEDULER HOOK
  //-----------------------------------------------------
  const { addJob, removeJob } = useTaskScheduler();

  //-----------------------------------------------------
  // COUNTDOWN UPDATER FUNCTION
  //-----------------------------------------------------
  /**
   * Updates the countdown timer for the next upcoming event
   * This function calculates the time remaining until the next event
   * and updates the countdown state accordingly
   */
  const updateCountdown = useCallback(() => {
    const now = new Date().getTime();
    const nextEventTime = parseEventDateTime(
      upcomingEvents[0].date,
      upcomingEvents[0].time
    );
    const distance = nextEventTime - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    } else {
      // if event is past due → reset
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  }, []);

  //-----------------------------------------------------
  // REGISTER JOBS WHEN COMPONENT MOUNTS
  //-----------------------------------------------------
  /**
   * This useEffect registers all the scheduled tasks with the task scheduler
   * Each job has a unique ID, interval (in seconds), and task function
   * The cleanup function removes all jobs when the component unmounts
   */
  useEffect(() => {
    // Job 1: Update countdown every second
    addJob({ 
      id: "countdown", 
      interval: 1, 
      task: updateCountdown 
    });
    
    // Job 2: Rotate news items every 4 seconds
    addJob({
      id: "news",
      interval: 4,
      task: () =>
        setCurrentNewsIndex((prev) => (prev + 1) % latestNews.length),
    });
    
    // Job 3: Rotate event items every 5 seconds
    addJob({
      id: "events",
      interval: 5,
      task: () =>
        setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length),
    });

    // Cleanup jobs when component unmounts
    return () => {
      removeJob("countdown");
      removeJob("news");
      removeJob("events");
    };
  }, [addJob, removeJob, updateCountdown]);

  //-----------------------------------------------------
  // RENDER
  //-----------------------------------------------------
  return (
    <LiveFeedContainer role="region" aria-label="School Live Feed">
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: '#1a237e',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TrendingUp sx={{ color: '#ffca28' }} aria-hidden="true" />
        Live School Feed
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive grid
          },
          gap: 3,
          mb: 4,
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        <CountdownCardComponent event={upcomingEvents[0]} countdown={countdown} />
        <EventCard event={upcomingEvents[currentEventIndex]} index={currentEventIndex} total={upcomingEvents.length} />
        <NewsCard news={latestNews[currentNewsIndex]} index={currentNewsIndex} total={latestNews.length} />
            </Box>

              <FeedCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <School sx={{ color: '#1a237e', mr: 1 }} aria-hidden="true" />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                      School Announcements
                    </Typography>
                  </Box>
                  <TickerContainer>
            <TickerText variant="body2" className="ticker">
                      {announcements.join(' • ')}
                    </TickerText>
                  </TickerContainer>
                  <List dense sx={{ mt: 2 }}>
                    {announcements.slice(0, 3).map((announcement, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                  <Celebration sx={{ fontSize: 16, color: '#ffca28' }} aria-hidden="true" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={announcement}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </FeedCard>
    </LiveFeedContainer>
  );
};

export default memo(LiveFeed);
