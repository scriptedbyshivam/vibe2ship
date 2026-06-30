<div align="center">
  
# 🏛️ CivicMind
### AI-Powered Smart Civic Issue Reporting & Resolution Platform

![Vibe2Ship Hackathon 2026](https://img.shields.io/badge/Vibe2Ship_Hackathon-2026-4285F4?style=for-the-badge&logo=google&logoColor=white)
![License MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-0081CB?style=for-the-badge&logo=mui&logoColor=white)

Built for the Vibe2Ship Hackathon 2026 under the theme **AI for Smart Cities**, majorly utilizing Google AI Studio.

[Live Demo](https://civicmind-understanding-agent-229084139257.asia-southeast1.run.app) • [Documentation](https://docs.google.com/document/d/1ngnR-ALoRkE8lDMmZpl-nvosxxZiaHVWd97iNzGl6xY/edit?usp=sharing)

</div>

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Google AI Studio Integration](#-google-ai-studio-integration)
- [Hackathon Requirements (Judges' Guide)](#-hackathon-requirements-judges-guide)
- [Key Features](#-key-features)
- [Google Technologies Utilized](#-google-technologies-utilized)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Application Flow](#-application-flow)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Future Improvements](#-future-improvements)
- [Deployment](#-deployment)
- [Made By](#-made-by)
- [License](#-license)
- [Contact](#-contact)

---

## 🌍 Project Overview

### The Problem
Traditional civic reporting systems are fundamentally broken. They are plagued by manual routing, subjective prioritization, endless bureaucratic bottlenecks, and "black-hole" feedback loops where citizens never hear back about their reports. This leads to frustrated citizens, inefficient resource allocation, and deteriorating city infrastructure.

### The CivicMind Solution
CivicMind is a hyperlocal problem solver that transforms how communities report, process, and resolve infrastructure issues. By leveraging state-of-the-art Artificial Intelligence (Google Gemini), CivicMind automatically analyzes submitted reports (text, voice, or image), categorizes them, assigns a severity score, and routes them to the correct municipal department—all in real-time.

We bring transparency, speed, and intelligence to smart city management.

### 🛠️ Google AI Studio Integration
This project was prototyped, built, and optimized primarily using Google AI Studio. System instructions, multimodal image analysis logic, and structured JSON output schemas for the Gemini API were thoroughly developed and tested within Google AI Studio. This enabled rapid iteration and validation of model prompts before integrating them into the backend server.

---

## 🏆 Hackathon Requirements (Judges' Guide)
<details open>
<summary><b>Click to expand Hackathon Details</b></summary>

| Criteria | Implementation in CivicMind |
| :--- | :--- |
| **Problem Statement** | Statement 2 – Community Hero: Hyperlocal Problem Solver. We empower citizens to instantly report and track local issues while equipping city officials with an AI-triaged dashboard. |
| **Theme Alignment** | AI for Smart Cities. Integrates AI directly into the municipal lifecycle to create autonomous, self-organizing urban maintenance workflows. |
| **Solution Overview** | An end-to-end platform bridging the gap between citizens and city officials via AI-automated triaging, mapping, and priority detection. |
| **Impact & Community Benefits** | Reduces issue triage time from days to seconds. Promotes civic engagement through transparent timelines and community verification. Saves municipal resources. |
| **Innovation & AI Capabilities** | Replaces human dispatchers with multimodal AI. Features AI Confidence Scoring, automatic severity detection, and smart deduplication of nearby issues. |

</details>

---

## ✨ Key Features
CivicMind is packed with intelligent features designed for both citizens and city officials:

### 🤖 AI & Automation
- **AI-Powered Issue Detection:** Analyzes uploaded images to identify potholes, broken lights, leaks, etc.
- **Smart Categorization & Priority:** Automatically determines issue severity (Low, Medium, Critical).
- **AI Confidence Score:** Displays the AI's certainty percentage for data transparency.
- **Voice & Text Reporting:** NLP-driven processing of natural language complaints.
- **Nearby Issue Deduplication:** AI detects and merges duplicate reports in the same geofence.
- **AI Insights:** Provides city officials with predictive maintenance recommendations.

### 🏙️ Civic & Officer Tools
- **Interactive Google Maps:** Visual spatial plotting of all active and resolved issues.
- **Officer Dashboard:** A high-performance, Kanban-style triage center for municipal workers.
- **Citizen Dashboard:** A personalized hub to track the live status and timeline of submitted issues.
- **Community Verification:** Citizens can "upvote" or verify existing issues to boost priority.
- **Smart Notifications:** Real-time alerts when issue statuses change.

### 🎨 UI / UX
- **Responsive Design:** Flawless experience across mobile, tablet, and desktop.
- **Dark & Light Theme:** Accessible, premium visual aesthetics.
- **Role-Based Authentication:** Secure, separate experiences for Citizens and Officers.

---

## ⚡ Google Technologies Utilized
CivicMind is proudly built on the Google ecosystem to ensure scale, speed, and intelligence.

| Technology | Purpose in CivicMind |
| :--- | :--- |
| **Gemini API** | The core brain. Used for multimodal image analysis, NLP text parsing, sentiment analysis, and priority scoring. |
| **Google Maps API** | Provides interactive, hyperlocal mapping, geocoding, and spatial data visualization for issue tracking. |
| **Google Cloud Run** | Serverless deployment of our backend container, ensuring scale-to-zero capabilities and high availability. |
| **Vertex AI** | (If applicable) Advanced model tuning and predictive analytics for city infrastructure degradation. |
| **Material Design 3** | UI principles utilized to ensure accessible, intuitive, and modern user interfaces. |

---

## 🛠️ Tech Stack

### Frontend
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB) **React.js** - UI Library
- ![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS** - Utility-first styling
- ![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=flat&logo=mui&logoColor=white) **Material UI** - Component library
- ![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat&logo=framer&logoColor=blue) **Framer Motion & GSAP** - Fluid animations
- ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white) **React Router** - Navigation
- ![Axios](https://img.shields.io/badge/axios-671ddf?style=flat&logo=axios&logoColor=white) **Axios** - HTTP client

### Backend & Database
- ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) **Node.js & Express.js** - Server environment & framework
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white) **MongoDB** - NoSQL Database
- ![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens) **JWT & bcrypt** - Secure Authentication

### Infrastructure
- ![Google Cloud Platform](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=flat&logo=google-cloud&logoColor=white) **Google Cloud Platform**
- ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=flat&logo=github&logoColor=white) **GitHub** - Version Control & Actions

---

## 🏗️ System Architecture

```mermaid
graph TD
    %% Entities
    User((🧑‍🤝‍🧑 Citizen))
    Officer((👮 Officer))
    
    %% Frontend
    subgraph Frontend [Client - React.js]
        WebUI[Web App UI]
        Maps[Google Maps Component]
    end
    
    %% Backend
    subgraph Backend [Server - Node.js/Express]
        Auth[Auth Service JWT]
        Core[Issue Management API]
        AI_Controller[AI Orchestrator]
    end
    
    %% Google Services
    subgraph Google_Cloud [Google Ecosystem]
        Gemini[🤖 Gemini API / Vertex AI]
        GMapsAPI[🗺️ Google Maps API]
    end
    
    %% Database
    subgraph Database [Storage]
        Mongo[(MongoDB)]
    end

    %% Flow
    User -->|Submits Image/Text/Voice| WebUI
    WebUI -->|REST API| Core
    Core -->|Payload| AI_Controller
    AI_Controller <-->|Prompt & Image| Gemini
    AI_Controller -->|Structured Data| Core
    Core <--> Mongo
    Core <--> Auth
    Maps <-->|Geocoding| GMapsAPI
    WebUI <--> Maps
    
    Mongo -->|Real-time Fetch| Officer
    Officer -->|Update Status| Core
```

---

## 🔄 Application Flow

```mermaid
flowchart LR
    A([📱 Citizen Reports Issue]) --> B{📸 Uploads Media & Location}
    B --> C[🧠 Gemini AI Analysis]
    C -->|Categorizes & Prioritizes| D[(MongoDB Record Created)]
    D --> E[🚨 Officer Receives Alert]
    E --> F{🛠️ Officer Reviews}
    F -->|Dispatches Team| G[⏳ Status: In Progress]
    G -->|Job Finished| H[✅ Status: Resolved]
    H --> I([🔔 Citizen Receives Notification])
    
    style A fill:#4285F4,stroke:#fff,stroke-width:2px,color:#fff
    style C fill:#8E75B2,stroke:#fff,stroke-width:2px,color:#fff
    style H fill:#34A853,stroke:#fff,stroke-width:2px,color:#fff
```

---

## 📂 Project Structure

```text
CivicMind/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, icons, global styles
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React Context (Auth, Theme)
│   │   ├── hooks/              # Custom React Hooks
│   │   ├── pages/              # Route pages (Dashboard, Login, etc.)
│   │   ├── services/           # API integration logic
│   │   └── utils/              # Helper functions
│   └── package.json
│
├── server/                     # Node.js Backend
│   ├── controllers/            # Business logic (Issue, Auth, AI)
│   ├── middleware/             # JWT Verification, Error handling
│   ├── models/                 # Mongoose Schemas
│   ├── routes/                 # Express API Routes
│   ├── utils/                  # Gemini Prompt Configs, helpers
│   ├── .env.example            # Environment config template
│   └── server.js               # Entry point
│
└── README.md                   # Project documentation
```

---

## 📸 Screenshots

| Landing Page | Authentication |
| :---: | :---: |
| <img src="assets/image/screenshot_1.png" width="100%"> | <img src="assets/image/screenshot_2.png" width="100%"> |
| **Citizen Dashboard** | **Report Issue Form** |
| <img src="assets/image/screenshot_3.png" width="100%"> | <img src="assets/image/screenshot_4.png" width="100%"> |
| **Interactive Map View** | **Issue Details (AI Analysis)** |
| <img src="assets/image/screenshot_5.png" width="100%"> | <img src="assets/image/screenshot_6.png" width="100%"> |
| **Officer Dashboard** | **Notifications Hub** |
| <img src="assets/image/screenshot_7.png" width="100%"> | <img src="assets/image/screenshot_8.png" width="100%"> |
| **AI Triaging Details** | **Platform Settings & Theme** |
| <img src="assets/image/screenshot_9.png" width="100%"> | <img src="assets/image/screenshot_10.png" width="100%"> |

---

## 🚀 Installation & Setup
Follow these instructions to run CivicMind locally.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas)
- Google Cloud Console Account (For Maps & Gemini API Keys)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/CivicMind.git
cd CivicMind
```

### 2. Install Dependencies
Install the required Node.js packages in the project root:
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory by copying `.env.example` and filling in your credentials.

> [!IMPORTANT]
> You must add your own `GEMINI_API_KEY` in the `.env` file to use the AI capabilities of this project.

### 4. Run the Application
Start the development server (runs both backend API and frontend Vite middleware on port 3000):
```bash
npm run dev
```
The application will be running at `http://localhost:3000`.

---

## 🔐 Environment Variables
Create a `.env` file in the project root directory with the following structure:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/civicmind?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Google APIs
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

---

## 🔮 Future Improvements
We have a massive vision for CivicMind. Post-hackathon, we plan to implement:
- **Drone Inspection Integration:** Autonomous drones investigating critical AI-flagged zones.
- **IoT Sensor Sync:** Connecting smart city sensors (water pressure, traffic) to automatically open tickets.
- **Satellite Monitoring:** Using Google Earth Engine to detect macro infrastructure shifts.
- **Blockchain Verification:** Immutable ledgers for municipal budgets and repair completion verification.
- **Emergency Alert Broadcasts:** Push notifications to citizens based on hyperlocal critical hazards.

---

## 🌐 Deployment
- **Live Demo (Google Cloud Run):** [https://civicmind-understanding-agent-229084139257.asia-southeast1.run.app](https://civicmind-understanding-agent-229084139257.asia-southeast1.run.app)

---

## 🧑‍💻 Made By
Built with ❤️ by **Shivam Maurya** ([@scriptedbyshivam](https://github.com/scriptedbyshivam)).

---

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for the full license text.

---

## 📫 Contact
For any inquiries, feedback, or collaboration opportunities:
- **Email:** shivam2024maurya@gmail.com
- **Website:** [https://civicmind-understanding-agent-229084139257.asia-southeast1.run.app](https://civicmind-understanding-agent-229084139257.asia-southeast1.run.app)

<div align="center">
<br>
<i>Crafted with ❤️ for the Vibe2Ship Hackathon 2026</i>
</div>
