# Holy Cross Convent School Brooklyn

A modern web application for Holy Cross Convent School Brooklyn, featuring a beautiful React frontend with Material-UI and a TypeScript Express backend.

## 🏫 About

Holy Cross Convent School Brooklyn is a private Catholic school committed to nurturing excellence, building character, and inspiring faith in students from Kindergarten through 12th grade.

## 🚀 Features

### Frontend (React + Material-UI)
- **Modern UI Design**: Beautiful, responsive interface with school-themed colors (navy blue and gold)
- **Material-UI Components**: Professional design system with consistent styling
- **School Information**: Comprehensive display of school programs, events, and contact information
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Backend (Express + TypeScript)
- **RESTful API**: Clean, well-structured endpoints for school data
- **TypeScript**: Type-safe development with better code quality
- **CORS Enabled**: Cross-origin resource sharing for frontend integration
- **Error Handling**: Comprehensive error handling and logging

## 📁 Project Structure

```
Holy Cross Convent School Brooklyn/
├── frontend/                 # React application
│   ├── src/
│   │   ├── App.tsx          # Main application component
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/                  # Express server
│   ├── src/
│   │   └── server.ts        # Main server file
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The React app will run on `http://localhost:3000`

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

The Express server will run on `http://localhost:5000`

## 🔌 API Endpoints

### Base URL: `http://localhost:5000`

- `GET /` - Welcome message and API status
- `GET /api/school` - School information
- `GET /api/programs` - Academic programs
- `GET /api/events` - Upcoming events
- `GET /api/health` - Health check endpoint

## 🎨 Design System

### Colors
- **Primary**: Navy Blue (`#1a237e`) - Represents trust, stability, and tradition
- **Secondary**: Gold (`#ffd700`) - Represents excellence, achievement, and prestige
- **Background**: Light Gray (`#f5f5f5`) - Clean, professional appearance

### Typography
- **Font Family**: Roboto (Material-UI default)
- **Headings**: Bold weights with primary color
- **Body Text**: Regular weight with secondary text color

## 🚀 Development

### Available Scripts

#### Frontend
```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Build for production
```

#### Backend
```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm start          # Start production server
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Contact

**Holy Cross Convent School Brooklyn**
- Address: 123 School Street, Brooklyn, NY 11201
- Phone: (555) 123-4567
- Email: info@holycrossbrooklyn.edu

---

*Built with ❤️ for Holy Cross Convent School Brooklyn* 