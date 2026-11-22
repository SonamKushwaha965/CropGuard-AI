# CropGuard AI 🌿🔍

**CropGuard AI** is an intelligent, real-time agricultural diagnostics platform designed to assist farmers, agronomists, and researchers in detecting crop diseases early, understanding symptoms, and applying effective organic and chemical remedies.

---

## 🚀 Key Features

- 📸 **AI-Powered Disease Detection**: Upload or capture crop leaf photos to get instant, accurate disease diagnosis powered by Google's Gemini models.
- 🔬 **Offline Edge Diagnostics**: Client-side image analysis and heuristic matching for low-connectivity rural field scenarios.
- 🌐 **Multilingual Support**: Accessible in multiple languages (English, Hindi, Punjabi, Tamil, Telugu, Marathi, etc.) for localized farmer accessibility.
- 💊 **Treatment Recommendations**: Actionable organic remedies, chemical treatments, and preventive farming practices.
- 📊 **Agricultural Surveillance & Admin Dashboard**: Track disease outbreak patterns, regional trends, farmer feedback, and manage agricultural datasets.
- 📱 **Progressive Web App (PWA)**: Installable directly onto mobile devices and smartphones for field use.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend / API**: Express, Node.js / tsx, Google GenAI SDK (`@google/genai`)
- **AI Models**: Google Gemini 2.5 Flash / Flash Lite

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SonamKushwaha965/CropGuard-AI.git
   cd CropGuard-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` or `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   PORT=3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

---

## 📁 Project Structure

```
cropguard-ai/
├── data/                  # Seed dataset & mock records
├── public/                # Static assets, PWA icons, manifest
├── src/
│   ├── components/        # UI components, modals, dashboards
│   ├── data/              # Disease database & translations
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Leaf analyzer & PWA helpers
│   ├── App.tsx            # Main application
│   └── main.tsx           # React entry point
├── server.ts              # Express API & Gemini integration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies and scripts
```

---

## 📄 License

This project is licensed under the MIT License.
