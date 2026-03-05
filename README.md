# BioSignal Intelligence Scanner

This repository contains a full-stack web application for White Glove Wellness® that analyzes a user's photo and voice recording, cross-references the signals, and generates a personalized non-diagnostic wellness report using the Claude API.

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Python + FastAPI
- **AI Report**: Anthropic Claude API (claude-sonnet-4-6)
- **Analysis**: DeepFace, OpenCV, librosa

## Requirements

- Python 3.9+
- Node 18+
- 2GB free disk space (for TensorFlow and model downloads)
- Internet connection for initial model downloads

## Quick Start

### Option 1: Using Startup Scripts (Recommended)

#### Terminal 1 - Start Backend:
```bash
chmod +x start-backend.sh
./start-backend.sh
```

#### Terminal 2 - Start Frontend:
```bash
chmod +x start-frontend.sh
./start-frontend.sh
```

### Option 2: Manual Setup

#### Backend Setup

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # on macOS/Linux
   # on Windows: .venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   # Edit .env file and add your Anthropic API key
   ANTHROPIC_API_KEY=your_key_here
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will be available at `http://localhost:8000`.

#### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will open in your browser (typically at `http://localhost:5173`).

## Important Notes

### First Run Performance
- **TensorFlow Initialization**: The first time you run the backend, TensorFlow (used by DeepFace) will initialize, which can take 1-2 minutes. This is normal and only happens once. Subsequent requests will be much faster.
- **Model Downloads**: DeepFace will automatically download pre-trained models (~200MB) on first use. Ensure you have an internet connection and sufficient disk space.

### API Endpoints

#### POST /analyze
Accepts multipart form data:
- `photo` (file): JPG/PNG image file
- `audio` (file): WAV audio file
- `symptoms` (string, optional): User-reported symptoms
- `sleep_hours` (float, optional): Hours of sleep (default: 7)
- `stress_level` (int, optional): Stress level 1-10 (default: 5)
- `primary_goal` (string, optional): Wellness goal

Response:
```json
{
  "emergency": false,
  "report": "Generated wellness report text",
  "scores": {
    "stress_load": 0.450,
    "nervous_system_balance": 0.620,
    ...
  },
  "flags": {
    "possible_sleep_debt_pattern": false,
    "possible_high_sympathetic_tone": false,
    ...
  },
  "session_id": "uuid-here"
}
```

## Project Structure

```
biosignal-scanner/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── WelcomeScreen.jsx
│   │   │   ├── UploadScreen.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   └── ReportScreen.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── index.html
├── backend/
│   ├── main.py
│   ├── analysis/
│   │   ├── __init__.py
│   │   ├── facial.py
│   │   ├── audio.py
│   │   └── fusion.py
│   ├── report/
│   │   ├── __init__.py
│   │   └── generator.py
│   └── requirements.txt
├── .env
├── .gitignore
├── start-backend.sh
├── start-frontend.sh
└── README.md
```

## Troubleshooting

### Backend won't start
- **Issue**: "ModuleNotFoundError" - Make sure you've activated the virtual environment and installed requirements
- **Issue**: TensorFlow taking too long - This is normal on first run. Give it 2-3 minutes to initialize

### Frontend won't connect to backend
- **Issue**: CORS errors - Backend CORS is configured for all origins. Check that backend is running on port 8000
- **Issue**: Network error - Verify both services are running: Backend http://localhost:8000, Frontend http://localhost:5173

### File upload fails
- **Issue**: No file selected - Ensure both photo and audio files are selected before clicking "Analyze My BioSignals"
- **Issue**: Wrong file type - Photo must be JPG/PNG, audio must be WAV

## License

This project is proprietary and owned by White Glove Wellness®.
