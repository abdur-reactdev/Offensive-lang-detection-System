# RAG Query System

A simple, modern query interface for a Retrieval-Augmented Generation (RAG) system built with React and Ant Design.

## Features

- **Clean, Modern UI**: Beautiful interface with gradient backgrounds and glassmorphism effects
- **Simple Query Interface**: Just an input field and button for easy interaction
- **Real-time Processing**: Shows loading states and processing feedback
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Mock API Integration**: Includes a mock backend for testing

## Tech Stack

- **Frontend**: React 18 with Ant Design 5
- **Backend**: FastAPI (mock implementation)
- **Styling**: Modern CSS with animations and responsive design
- **HTTP Client**: Axios for API communication

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Mock API

```bash
# Install Python dependencies
pip install -r mock_requirements.txt

# Start the API server
python mock_api.py
```

The API will be available at `http://localhost:8000`

### 3. Start the React App

```bash
npm start
```

The app will be available at `http://localhost:3000`

## Usage

1. Open the app in your browser
2. Type your query in the input field
3. Click "Send Query" or press Enter
4. View the response from the RAG system

## API Endpoints

- `GET /health` - Health check
- `POST /query` - Process a query

### Query Request Format

```json
{
  "text": "Your query here"
}
```

### Query Response Format

```json
{
  "response": "Generated response from RAG system",
  "query": "Original query",
  "timestamp": "2024-01-01 12:00:00",
  "processing_time": 1.23
}
```

## Project Structure

```
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js          # Main React component
│   ├── App.css         # Modern styling
│   └── index.js        # React entry point
├── mock_api.py         # FastAPI mock backend
├── mock_requirements.txt # Python dependencies
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## Customization

### Styling

The app uses modern CSS with:
- Gradient backgrounds
- Glassmorphism effects
- Smooth animations
- Responsive design

You can customize the appearance by modifying `src/App.css`.

### API Integration

To connect to a real RAG backend:
1. Update the API endpoints in `src/App.js`
2. Modify the request/response handling
3. Replace the mock API with your actual implementation

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Adding Features

The simple structure makes it easy to add:
- Query history
- Multiple query types
- Advanced filtering
- Export functionality
- User authentication

## License

MIT License - feel free to use this project for your own RAG implementations!
