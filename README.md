
HydroRisk
AI-Powered Urban Flood Risk & Citizen Reporting for Hyderabad.

HydroRisk turns live rainfall and terrain data into a street-level flood risk score for every hotspot in Hyderabad — and gives citizens a one-tap way to report flooding as it happens.

🌐 Live Platform
Live Application: hydrorisk-frontend.vercel.app Repository: github.com/farheen2101/hydrorisk-frontend

✦ Why HydroRisk?
Every monsoon, the same low-lying Hyderabad neighbourhoods flood — Balkampet, Malakpet, Nampally, and others — but residents get no advance, street-level warning. City-wide alerts don't tell you whether your road is at risk right now, and there's no easy way to tell your neighbours or the authorities that a spot has flooded.

HydroRisk closes that gap:

Turn live rainfall data into a warning citizens can actually use — and turn citizen reports into ground truth the model can learn from.

🔄 The Idea
      RAINFALL DATA                TERRAIN / SLOPE DATA
             │                              │
             └──────────────┐  ┌────────────┘
                            ▼  ▼
                        ML Model (XGBoost)
                            │
                            ▼
                     Live Risk Score (0–100)
                            │
                            ▼
                  Citizen Map + Risk Search
                            │
                            ▼
                    Report Flooding / Potholes
                            │
                            ▼
                     Faster, Local Response
✨ Core Features
🗺️ Live Hotspot Map Colour-coded flood-risk markers across Hyderabad — Critical, Major, Moderate and Low — plotted on a stylised city map.

🔍 Searchable Risk Updates Search any hotspot by name and instantly see its live risk score, rainfall reading and soil-saturation percentage.

🤖 ML-Powered Risk Scoring An XGBoost model, trained on rainfall and slope/terrain features, scores every hotspot from 0–100 and assigns a severity level.

📣 One-Tap Flood Reporting Citizens report flooding or potholes straight from the risk panel, with an optional photo attached.

👤 Authentication Sign in / sign up to access the citizen dashboard.

📚 Resources Safety information and community resources for residents.

📱 Responsive Interface Designed to work consistently across desktop and mobile.

🚀 How It Works
01 — Sense Live rainfall, cumulative 5-day rainfall, and terrain/slope features feed the model.

02 — Score The XGBoost model rates every hotspot's flood risk from 0–100.

03 — Show The citizen dashboard displays a live map and a searchable list, colour-coded by severity.

04 — Report Residents flag flooding or blocked roads directly from the app.

05 — Respond Neighbours and authorities see the real-time picture and can act faster.

Sense → Score → Show → Report → Respond
🧩 The Concept
                 LIVE RAINFALL
                      │
                      ▼
               ┌─────────────┐
               │  HydroRisk  │
               └─────────────┘
                      ▲
                      │
                 TERRAIN DATA
Flood risk isn't just about how much it's raining — it's about where that water has nowhere to go. HydroRisk combines both signals into one score.

🛠️ Technology Stack
Layer	Technologies
Frontend	React, Vite, JavaScript (JSX), CSS
Backend	Python, FastAPI
Database	SQLite
ORM	SQLAlchemy
Machine Learning	XGBoost, pandas, joblib
Application Server	Uvicorn
Deployment	Vercel (frontend), Render (backend)
Version Control	Git, GitHub
🏗️ Architecture
                          HydroRisk
                              │
                 ┌────────────┴────────────┐
                 │                         │
             Frontend                   Backend
          React + Vite                  FastAPI
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                         SQLAlchemy               XGBoost Model
                              │                         │
                              ▼                         ▼
                           SQLite               Risk Score (0–100)
📁 Project Structure
hydrorisk-frontend/
│
├── src/
│   ├── components/     Sidebar, TopBar, MapPanel, RiskDetailsPanel, StatsBar, PhotoUpload...
│   ├── pages/           MapView, RiskUpdates, ReportIssue, Resources, SettingsPage, SignIn, SignUp
│   ├── context/         AuthContext (client-side session)
│   ├── lib/
│   │   └── api.js        fetch wrapper for /hotspots, /risk-scores, /reports
│   ├── data/             Hyderabad bounding box + severity colours for marker placement
│   └── styles.css
│
├── backend/
│   ├── main.py           FastAPI app entrypoint
│   ├── models.py         SQLAlchemy models
│   ├── schemas.py        Pydantic request/response schemas
│   ├── database.py       SQLite + SQLAlchemy session setup
│   ├── data_loader.py    Loads the Hyderabad hotspot dataset
│   ├── risk_model.py     Risk-scoring logic
│   ├── predict_risk.py   Model inference
│   ├── auth_utils.py     Password hashing & tokens
│   ├── hotspots_MASTER_COMBINED.csv
│   ├── hydrorisk_model_slope.pkl
│   ├── requirements.txt
│   ├── Procfile
│   └── .python-version
│
├── .env.example
├── vercel.json
├── package.json
└── vite.config.js
⚙️ Getting Started
Prerequisites
Make sure the following are installed:

Node.js 18+
Python 3.11+
Git
1. Clone the Repository
bash
git clone https://github.com/farheen2101/hydrorisk-frontend.git
cd hydrorisk-frontend/frontend
2. Set Up the Backend
bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
Runs at http://127.0.0.1:8000 — interactive API docs at /docs.

3. Set Up the Frontend
Open a second terminal:

bash
cd frontend
npm install
cp .env.example .env   # point at your backend if it's not on localhost:8000
npm run dev
4. Open in Your Browser
http://localhost:5173
☁️ Deployment
HydroRisk is deployed as two separate services:

GitHub
   │
   ├──▶ Vercel  ──▶  React + Vite frontend (static build)
   │
   └──▶ Render  ──▶  Uvicorn ──▶ FastAPI backend
                                     │
                                     ├── SQLite
                                     └── XGBoost model
🔐 Security
HydroRisk follows standard web application practices, including:

Password hashing for authentication
CORS configured on the backend
Environment-based configuration (.env, not committed to the repo)
Sensitive configuration values are kept out of version control
🌍 Use Cases
Residents Check flood risk near home before stepping out during monsoon.

Commuters Avoid routes through flooded or high-risk areas.

Local Authorities See a live, street-level risk picture instead of city-wide guesses.

Emergency Responders Prioritise the most critical hotspots first.

📈 Future Roadmap
 SMS / push alerts for Critical-risk areas
 Live IMD rainfall feed integration
 Photo verification for citizen reports
 Expand hotspot coverage beyond Hyderabad
 Real map tiles (Leaflet / Mapbox) instead of the stylised panel
🤝 Team
Name	Role
Farheen Begum	Team Lead & Frontend Developer
Zeba Nazneen	Backend & ML Engineer
Umaima	Data & Research
Sania	Documentation & QA
🤝 Contributing
bash
git checkout -b feature/your-feature
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
Then open a Pull Request.

📜 License
This project was built as a student/hackathon project and is provided for educational purposes.

HydroRisk Turning rainfall into warning, and warning into action.
