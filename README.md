# 🚂 Neural Track - AI-Powered Railway Monitoring System

An intelligent railway track defect detection and monitoring system using computer vision, AI analysis, and real-time alerting.

## 🎯 Overview

Neural Track is a comprehensive railway safety system that combines:
- **AI-powered defect detection** using EfficientNet-B0 model
- **Intelligent analysis** via Groq AI (Llama 3.3)
- **Real-time monitoring dashboard** with interactive maps
- **Automated alerting** for critical defects
- **Role-based access control** for admins and station masters
- **Drone inspection** capability via web interface

## 🏗️ System Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   ML Model API  │◄─────│  Backend (API)   │◄─────│  Frontend (UI)  │
│  (Hugging Face) │      │    FastAPI       │      │   React + Vite  │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                 │
                         ┌───────┴────────┐
                         │                │
                    ┌────▼────┐     ┌────▼─────┐
                    │ SQLite  │     │  Groq AI │
                    │   DB    │     │ Analysis │
                    └─────────┘     └──────────┘
```

### Components

1. **Frontend (React + Vite)**
   - Dashboard with real-time defect visualization
   - Interactive Leaflet maps
   - Reports with Excel export
   - Station management (admin)
   - Drone control interface (admin)
   - Dark/Light theme support

2. **Backend (FastAPI)**
   - RESTful API for defect management
   - JWT-based authentication
   - Role-based authorization (Admin/StationMaster)
   - Image upload and analysis
   - Automated email alerts
   - Database management

3. **AI Pipeline**
   - **ML Model**: EfficientNet-B0 for defect detection (hosted on Hugging Face)
   - **AI Analysis**: Groq API (Llama 3.3) for defect reasoning and resolution protocols
   - **Confidence Threshold**: 70% for defect classification

### 🚀 Features

### Core Features
- ✅ Real-time defect detection and monitoring
- ✅ AI-powered defect analysis and resolution recommendations
- ✅ Interactive dashboard with map visualization
- ✅ Automated email alerts for critical defects
- ✅ Role-based access control
- ✅ Station-based defect assignment
- ✅ Resolution tracking with timestamps
- ✅ Excel report export

### Admin Features
- ✅ Station management (CRUD operations)
- ✅ Drone inspection control via web UI
- ✅ Defect deletion (single and bulk)
- ✅ Reopen resolved defects
- ✅ View all defects across all stations

### Station Master Features
- ✅ View assigned station defects
- ✅ Mark defects as resolved
- ✅ Track resolution history
- ✅ Generate reports

## 📋 Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **Groq API Key** ([Get it here](https://console.groq.com))
- **Gmail App Password** (for email alerts)

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Railway-Moniter
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOL
GROQ_API_KEY=your_groq_api_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EOL

# Run backend
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Default Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### Station Master Account
- **Username**: `sm_delhi`
- **Password**: `delhi123`

> ⚠️ **Important**: Change these credentials in production!

## 📁 Project Structure

```
Railway-Moniter/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main API application
│   ├── auth.py             # Authentication logic
│   ├── database.py         # Database models
│   ├── groq_service.py     # Groq AI integration
│   ├── email_service.py    # Email alert service
│   ├── location_utils.py   # Location utilities
│   ├── requirements.txt    # Python dependencies
│   ├── railway.db          # SQLite database
│   └── uploads/            # Uploaded images
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth, Theme)
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main app component
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Vite configuration
│
├── vision/                 # Vision agent (optional)
│   ├── vision_agent.py     # Standalone detection script
│   └── requirements.txt    # Python dependencies
│
├── drone_shot.mp4          # Sample drone footage
└── README.md               # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Defects
- `GET /defects` - List all defects
- `POST /upload-analyze` - Upload and analyze image
- `PATCH /defects/{id}/resolve` - Mark as resolved
- `PATCH /defects/{id}/reopen` - Reopen defect (admin)
- `DELETE /defects/{id}` - Delete defect (admin)
- `POST /defects/bulk-delete` - Bulk delete (admin)
- `GET /defects/export/excel` - Export to Excel

### Stations
- `GET /stations` - List all stations
- `POST /stations` - Create station (admin)
- `PUT /stations/{id}` - Update station (admin)
- `DELETE /stations/{id}` - Delete station (admin)

### Drone Control
- `POST /drone/start` - Start drone inspection (admin)
- `POST /drone/stop` - Stop drone inspection (admin)
- `GET /drone/status` - Get drone status

## 🎨 UI Features

### Dashboard
- Real-time defect statistics
- Interactive map with defect markers
- Defect list with filtering
- Detailed defect view with AI analysis
- Resolution tracking

### Reports
- Searchable and filterable defect table
- Detailed defect modal
- Excel export functionality
- Bulk selection and deletion (admin)

### Drone Control (Admin)
- Web-based drone inspection
- Live video feed
- Manual image upload
- Real-time analysis results

### Stations (Admin)
- Station CRUD operations
- Station master assignment
- Location management

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway)
```bash
# Use Render.com or Railway.app
# Set environment variables in platform dashboard
```

### Database
- **Development**: SQLite (included)
- **Production**: PostgreSQL (recommended)

## 🔧 Environment Variables

### Backend (.env)
```env
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
MODEL_API_URL=https://vishalbhagat01-railway.hf.space/predict
DATABASE_URL=sqlite:///./railway.db
```

### Frontend
Update `API_URL` in source files if deploying to production.

## 📊 Database Schema

### Users
- id, username, password_hash, role, station_id

### Stations
- id, name, code, latitude, longitude, station_master_email

### Defects
- id, defect_type, confidence, severity, latitude, longitude
- root_cause, action_required, resolution_steps
- image_url, status, assigned_station_id
- timestamp, resolved_at, resolved_by

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with Argon2
- Role-based access control
- Session-based storage (auto-logout on browser close)
- Admin-only sensitive operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **ML Model**: EfficientNet-B0 hosted on Hugging Face
- **AI Analysis**: Groq API (Llama 3.3)
- **Maps**: Leaflet.js
- **UI Framework**: React + Vite

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for Railway Safety**
