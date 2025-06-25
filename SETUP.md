# RAG Offensive Language Detection - Frontend Setup

This is a React frontend application for the RAG (Retrieval-Augmented Generation) Offensive Language Detection system, built with Ant Design.

## Features

- 🎨 Modern UI with Ant Design components
- 🔍 Real-time text analysis
- 📊 Confidence scoring and visualization
- 🏥 System health monitoring
- 📱 Responsive design for mobile and desktop
- ⚡ Fast and intuitive user experience

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Backend API running on `http://localhost:8000`

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── App.js          # Main application component
├── App.css         # Application styles
├── index.js        # Application entry point
└── index.css       # Global styles

public/
├── index.html      # Main HTML file
└── manifest.json   # Web app manifest
```

## API Integration

The frontend is configured to communicate with a FastAPI backend running on `http://localhost:8000`. The proxy is configured in `package.json`.

### API Endpoints Used

- `POST /predict` - Analyze single text
- `GET /health` - Check system health

## Customization

### Styling
- Modify `src/App.css` for custom styles
- Ant Design theme can be customized in the component props

### Components
- Main analysis interface: `src/App.js`
- Add new components in the `src/` directory

## Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your web server

## Troubleshooting

- **Port conflicts:** If port 3000 is in use, React will automatically suggest an alternative port
- **API connection:** Ensure your backend is running on `http://localhost:8000`
- **CORS issues:** The backend should have CORS configured to allow requests from `http://localhost:3000`

## Technologies Used

- **React 18** - Frontend framework
- **Ant Design 5** - UI component library
- **Axios** - HTTP client for API calls
- **Create React App** - Build tool and development environment 