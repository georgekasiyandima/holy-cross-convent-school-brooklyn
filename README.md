# Holy Cross Convent School Brooklyn

A modern, full-stack web application for Holy Cross Convent School Brooklyn, featuring a beautiful React frontend with Material-UI v7 and a TypeScript Express backend.

## 🏫 About

Holy Cross Convent School Brooklyn is a private Catholic primary school committed to nurturing excellence, building character, and inspiring faith in students from Grade 0 through Grade 7. Located in Brooklyn, Cape Town, our school provides holistic Christian education that nurtures both the mind and the soul.

## 🚀 Features

### Frontend (React + Material-UI v7)
- **Modern UI Design**: Beautiful, responsive interface with school-themed colors (navy blue and gold)
- **Material-UI v7 Components**: Latest design system with consistent styling and improved performance
- **Comprehensive Pages**: Home, History, Events, Gallery, School Board, Info, Spiritual, and more
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Elements**: Lightbox gallery, event filtering, navigation drawer
- **Accessibility**: WCAG compliant with proper semantic markup

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
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Header.tsx   # Navigation header
│   │   │   └── Layout.tsx   # Page layout wrapper
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx     # Landing page
│   │   │   ├── Gallery.tsx  # Photo gallery
│   │   │   ├── History.tsx  # School history
│   │   │   ├── Events.tsx   # School events
│   │   │   ├── SchoolBoard.tsx # Board members
│   │   │   ├── Info.tsx     # General information
│   │   │   └── Spiritual.tsx # Spiritual life
│   │   ├── assets/          # Images and static files
│   │   ├── App.tsx          # Main application component
│   │   └── index.tsx        # Application entry point
│   ├── public/              # Public assets and images
│   ├── package.json
│   └── tsconfig.json
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
- Node.js (v16 or higher)
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
- **Address**: 162 Koeberg Road, Brooklyn, Cape Town, 7405 South Africa
- **Phone**: (021) 511 4337
- **Fax**: (021) 511 9690
- **Email**: info@holycrossbrooklyn.edu

### School Information
- **PBO Number**: 930011798
- **EMIS Number**: 0103000810
- **School Reg No.**: 13/3/1/51
- **Accreditation**: Umalusi Accredited
- **Grades**: Primary School (Grade 0 - Grade 7)

---

*Built with ❤️ for Holy Cross Convent School Brooklyn*

**Motto**: "Nurturing Excellence, Building Character, Inspiring Faith" 