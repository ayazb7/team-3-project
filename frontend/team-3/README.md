# SkyWise Frontend

React webapp for an AI-powered learning platform built for people wanting to learn digital skills from the beginning.

**Project Group:** Flow State (Team 3)

### Prerequisites

Before running the application, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Backend server** running on `http://localhost:5000`

### Installation

1. **Navigate to the frontend directory**

   ```bash
   cd frontend/team-3
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Start the development server**

   ```bash
   npm run dev
   ```
4. **Open your browser**

   - Navigate to `http://localhost:5173` (or the URL shown in terminal)

## Available Scripts

| Command                    | Description                              |
| -------------------------- | ---------------------------------------- |
| `npm run dev`            | Start development server with hot reload |
| `npm run build`          | Build production-ready application       |
| `npm run preview`        | Preview production build locally         |
| `npm test`               | Run test suite with Vitest               |
| `npm test -- --coverage` | Run tests with coverage report           |
| `npm run lint`           | Check code for linting issues            |

## Project Structure

```
frontend/team-3/
├── src/
│   ├── pages/              # Page components (routing)
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Quiz.jsx
│   │   ├── Learning.jsx
│   │   ├── Courses.jsx
│   │   ├── CourseView.jsx
│   │   ├── LandingPage.jsx
│   │   └── __tests__/      # Page tests
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── AskAno.jsx      # AI chatbot
│   │   ├── CourseCard.jsx
│   │   ├── StatCard.jsx
│   │   ├── FormField.jsx
│   │   └── __tests__/      # Component tests
│   ├── context/           # React context providers
│   │   └── AuthContext.jsx # Authentication state
│   ├── hooks/             # Custom React hooks
│   │   └── useFormValidation.js
│   ├── utils/             # Helper functions
│   │   └── validation.js
│   ├── assets/            # Static assets
│   ├── App.jsx            # Root component with routing
│   └── main.jsx           # Application entry point
├── public/                # Public assets
├── setupTests.js          # Test configuration
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## Key Features

### Authentication

- User registration with real-time validation
- Secure login with JWT tokens
- Automatic token refresh
- Cookie-based session management

### Course Management

- Browse public and personalized courses
- Track progress across multiple courses
- View course details, prerequisites, and learning objectives
- Difficulty levels: Beginner, Intermediate, Advanced

### Interactive Learning

- Video tutorials with captions
- **AI Emotion Detection** using TensorFlow.js
- Real-time feedback system (thumbs up/down)
- Progress tracking per tutorial

### Quiz System

- Multiple-choice questions with instant feedback
- Question navigation (forward/backward)
- Text-to-speech for accessibility
- Score calculation and results display
- Quiz completion tracking

### AI Assistant (Ask Ano)

- Real-time chat using Socket.io
- Streaming responses with markdown support
- Context-aware help and guidance
- Floating button interface

### Dashboard

- User statistics (courses completed, tutorials watched, time spent)
- Weekly activity chart
- Course progress with carousel
- Nearby events display
- Continue learning from where you left off

## Technology Stack

### Core Technologies

- **React 19.1.1** - UI framework
- **React Router DOM 7.9.4** - Client-side routing
- **Vite 7.1.7** - Build tool and dev server
- **Tailwind CSS 4.1.13** - Utility-first CSS framework

### State & Data

- **React Context API** - Global state management
- **Axios 1.12.2** - HTTP client with interceptors
- **Socket.io-client** - Real-time communication

### AI & 3D Features

- **@tensorflow/tfjs** - Emotion detection
- **@react-three/fiber** - 3D rendering
- **@react-three/drei** - 3D helpers

### UI Components

- **lucide-react** - Modern icons
- **react-icons** - Additional icon library
- **react-markdown** - Markdown rendering
- **remark-gfm** - GitHub Flavored Markdown

### Testing

- **Vitest 3.2.4** - Test runner
- **@testing-library/react 16.3.0** - Component testing
- **@testing-library/user-event 14.6.1** - User interaction simulation
- **@vitest/coverage-v8** - Code coverage

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Specific Test File

```bash
npm test -- src/pages/__tests__/Login.test.jsx
```

## Configuration

### Environment Variables

Create a `.env` file in the root if you need custom configuration:

```env
VITE_API_URL=http://localhost:5000
```

### Backend Connection

The frontend expects the backend server to be running at `http://localhost:5000`. Update API endpoints in:

- `src/context/AuthContext.jsx` - Authentication endpoints
- Individual page components - Feature-specific endpoints

## Troubleshooting

### Port Already in Use

```bash
# If port 5173 is occupied, Vite will use the next available port
# Check terminal output for the actual URL
```

### Backend Connection Issues

```bash
# Ensure backend is running on http://localhost:5000
# Check CORS configuration on backend
# Verify API endpoints are accessible
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Additional Resources

### Documentation

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Vitest](https://vitest.dev/)

### Project Links

- **Backend Repository**: `../backend`
- **API Documentation**: Ask team lead for Postman collection
- **Design System**: Check `/assets` for brand assets

## Getting Help

If you encounter issues:

1. **Check this README** - Common solutions above
2. **Check existing tests** - Examples in `__tests__` folders
3. **Ask the team** - Contact team members on Teams
4. **Review git history** - `git log` for recent changes
5. **Check console logs** - Browser DevTools and terminal output

**Built by FlowState (Team 3)** | Last Updated: October 2025
