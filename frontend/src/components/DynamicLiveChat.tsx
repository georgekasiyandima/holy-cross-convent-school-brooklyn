import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Paper,
  Fade,
  Slide,
  Alert,
  CircularProgress,
  Tooltip,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Send,
  Chat,
  Close,
  Refresh,
  Person,
  School,
  AdminPanelSettings,
  Settings,
  ThumbUp,
  Reply
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

//---------------------------------------------------------
// TYPES & INTERFACES
//---------------------------------------------------------
interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  senderType: 'student' | 'parent' | 'teacher' | 'admin';
  timestamp: Date;
  isRead: boolean;
  likes: number;
  replies?: ChatMessage[];
  isHighlighted?: boolean;
  category?: string;
}

interface ChatUser {
  id: string;
  name: string;
  type: 'student' | 'parent' | 'teacher' | 'admin';
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface ChatSettings {
  autoRefresh: boolean;
  soundEnabled: boolean;
  notifications: boolean;
  highlightKeywords: string[];
  maxMessages: number;
  refreshInterval: number;
}

//---------------------------------------------------------
// STYLED COMPONENTS
//---------------------------------------------------------
const ChatContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  width: 350,
  height: 500,
  zIndex: 1000,
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '100vh',
    bottom: 0,
    right: 0,
  },
}));

const ChatHeader = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
  color: 'white',
  padding: theme.spacing(1.5),
  borderRadius: '12px 12px 0 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  height: 300,
  overflowY: 'auto',
  padding: theme.spacing(1),
  backgroundColor: '#f8f9fa',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c1c1c1',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#a8a8a8',
  },
}));

const MessageBubble = styled(Paper)<{ 
  isOwn: boolean; 
  senderType: string;
  isHighlighted?: boolean;
}>(({ theme, isOwn, senderType, isHighlighted }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(0.5, 0),
  maxWidth: '80%',
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  backgroundColor: isOwn ? '#e3f2fd' : '#ffffff',
  border: isHighlighted ? '2px solid #ffca28' : '1px solid #e0e0e0',
  borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  position: 'relative',
  '&::before': isHighlighted ? {
    content: '"⭐"',
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: '16px',
  } : {},
  ...(senderType === 'admin' && {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
  }),
  ...(senderType === 'teacher' && {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
  }),
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: 'white',
  borderTop: '1px solid #e0e0e0',
  borderRadius: '0 0 12px 12px',
}));

//---------------------------------------------------------
// UTILITY FUNCTIONS
//---------------------------------------------------------
const getSenderIcon = (senderType: string) => {
  switch (senderType) {
    case 'admin':
      return <AdminPanelSettings sx={{ fontSize: 16 }} />;
    case 'teacher':
      return <School sx={{ fontSize: 16 }} />;
    case 'parent':
      return <Person sx={{ fontSize: 16 }} />;
    default:
      return <Person sx={{ fontSize: 16 }} />;
  }
};

const getSenderColor = (senderType: string) => {
  switch (senderType) {
    case 'admin':
      return '#ff9800';
    case 'teacher':
      return '#4caf50';
    case 'parent':
      return '#2196f3';
    default:
      return '#9e9e9e';
  }
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

//---------------------------------------------------------
// MESSAGE COMPONENT
//---------------------------------------------------------
const MessageComponent: React.FC<{
  message: ChatMessage;
  currentUser: ChatUser;
  onLike: (messageId: string) => void;
  onReply: (messageId: string, sender: string) => void;
}> = ({ message, currentUser, onLike, onReply }) => {
  const isOwn = message.sender === currentUser.name;
  const theme = useTheme();

  return (
    <Fade in timeout={300}>
      <Box sx={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', mb: 1 }}>
        <MessageBubble 
          isOwn={isOwn}
          senderType={message.senderType}
          isHighlighted={message.isHighlighted}
          elevation={2}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Avatar sx={{ 
              width: 24, 
              height: 24, 
              mr: 1,
              bgcolor: getSenderColor(message.senderType)
            }}>
              {getSenderIcon(message.senderType)}
            </Avatar>
            <Typography variant="caption" sx={{ fontWeight: 600, color: getSenderColor(message.senderType) }}>
              {message.sender}
            </Typography>
            <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
              {formatTime(message.timestamp)}
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ mb: 1 }}>
            {message.content}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton 
                size="small" 
                onClick={() => onLike(message.id)}
                sx={{ color: message.likes > 0 ? '#f44336' : 'text.secondary' }}
              >
                <ThumbUp sx={{ fontSize: 14 }} />
              </IconButton>
              {message.likes > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {message.likes}
                </Typography>
              )}
              
              <IconButton 
                size="small" 
                onClick={() => onReply(message.id, message.sender)}
                sx={{ color: 'text.secondary' }}
              >
                <Reply sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
            
            {message.category && (
              <Chip 
                label={message.category} 
                size="small" 
                sx={{ 
                  height: 20, 
                  fontSize: '0.7rem',
                  backgroundColor: '#e3f2fd',
                  color: '#1a237e'
                }} 
              />
            )}
          </Box>
        </MessageBubble>
      </Box>
    </Fade>
  );
};

//---------------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------------
const DynamicLiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser] = useState<ChatUser>({
    id: '1',
    name: 'Guest User',
    type: 'parent',
    isOnline: true
  });
  const [settings] = useState<ChatSettings>({
    autoRefresh: true,
    soundEnabled: true,
    notifications: true,
    highlightKeywords: ['robotics', 'computer lab', 'launch', 'unveiling'],
    maxMessages: 50,
    refreshInterval: 5000
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  // Sample data for demonstration
  const sampleMessages: ChatMessage[] = [
    {
      id: '1',
      content: 'Excited about the robotics program launch! 🤖',
      sender: 'Sarah Johnson',
      senderType: 'parent',
      timestamp: new Date(Date.now() - 300000),
      isRead: true,
      likes: 3,
      category: 'Robotics'
    },
    {
      id: '2',
      content: 'The new computer lab looks amazing! Can\'t wait for the unveiling.',
      sender: 'Mr. Smith',
      senderType: 'teacher',
      timestamp: new Date(Date.now() - 240000),
      isRead: true,
      likes: 5,
      category: 'Infrastructure'
    },
    {
      id: '3',
      content: 'What time is the robotics program starting?',
      sender: 'Mike Wilson',
      senderType: 'parent',
      timestamp: new Date(Date.now() - 180000),
      isRead: true,
      likes: 1,
      category: 'Robotics'
    },
    {
      id: '4',
      content: 'The robotics program starts at 10:00 AM on February 15th in the new computer lab.',
      sender: 'Admin',
      senderType: 'admin',
      timestamp: new Date(Date.now() - 120000),
      isRead: true,
      likes: 8,
      isHighlighted: true,
      category: 'Announcement'
    }
  ];

  const loadMessages = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(sampleMessages);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Load messages
  useEffect(() => {
    loadMessages();
  }, []);

  // Auto-refresh messages
  useEffect(() => {
    if (!settings.autoRefresh) return;

    const interval = setInterval(() => {
      loadMessages();
    }, settings.refreshInterval);

    return () => clearInterval(interval);
  }, [settings.autoRefresh, settings.refreshInterval, loadMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: currentUser.name,
      senderType: currentUser.type,
      timestamp: new Date(),
      isRead: false,
      likes: 0,
      category: determineCategory(newMessage)
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate API call
    try {
      // await axios.post('/api/chat/messages', message);
      console.log('Message sent:', message);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const determineCategory = (content: string): string => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('robotics')) return 'Robotics';
    if (lowerContent.includes('computer lab')) return 'Infrastructure';
    if (lowerContent.includes('launch') || lowerContent.includes('unveiling')) return 'Events';
    return 'General';
  };

  const handleLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, likes: msg.likes + 1 }
        : msg
    ));
  };

  const handleReply = (messageId: string, sender: string) => {
    setNewMessage(`@${sender} `);
  };

  const handleRefresh = () => {
    loadMessages();
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const unreadCount = messages.filter(msg => !msg.isRead && msg.sender !== currentUser.name).length;

  if (!isOpen) {
    return (
      <Tooltip title="Open Live Chat">
        <IconButton
          onClick={toggleChat}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: '#1a237e',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': {
              backgroundColor: '#0d1421',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <Chat />
          </Badge>
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Slide direction="up" in={isOpen} timeout={300}>
      <ChatContainer>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <ChatHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chat />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Live Chat
              </Typography>
              <Chip 
                label="Live" 
                size="small" 
                sx={{ 
                  backgroundColor: '#4caf50', 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Refresh">
                <IconButton 
                  size="small" 
                  onClick={handleRefresh}
                  sx={{ color: 'white' }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Settings">
                <IconButton 
                  size="small" 
                  sx={{ color: 'white' }}
                >
                  <Settings />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Close">
                <IconButton 
                  size="small" 
                  onClick={toggleChat}
                  sx={{ color: 'white' }}
                >
                  <Close />
                </IconButton>
              </Tooltip>
            </Box>
          </ChatHeader>

          {error && (
            <Alert severity="error" sx={{ m: 1 }}>
              {error}
            </Alert>
          )}

          <MessageContainer>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            
            {messages.map((message) => (
              <MessageComponent
                key={message.id}
                message={message}
                currentUser={currentUser}
                onLike={handleLike}
                onReply={handleReply}
              />
            ))}
            <div ref={messagesEndRef} />
          </MessageContainer>

          <InputContainer>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  }
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  backgroundColor: '#1a237e',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#0d1421',
                  },
                  '&:disabled': {
                    backgroundColor: '#e0e0e0',
                    color: '#9e9e9e',
                  }
                }}
              >
                <Send />
              </IconButton>
            </Box>
          </InputContainer>
        </Card>
      </ChatContainer>
    </Slide>
  );
};

export default DynamicLiveChat;
