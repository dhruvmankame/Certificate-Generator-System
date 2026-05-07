# Amaanitvam Foundation - Certificate Generator System

## 1. Selected Task + Reason
**Selected Task:** Certificate Generator System

**Reason for Selection:** 
NGOs often struggle with administrative overhead when issuing certificates manually for hundreds of volunteers, interns, or event participants. A system that automates PDF generation, tracks validity, and provides a unique verification link adds immense, immediate professional value. This project stands out by incorporating PDF processing, bulk data handling, and public verification—all of which demonstrate strong full-stack architectural skills and solve a very real administrative bottleneck.

---

## 2. Project Overview
**Problem Statement:** The Amaanitvam Foundation manually creates and distributes certificates for interns and volunteers, which is time-consuming and prone to forgery.

**Vision:** A modern, web-based portal to generate beautiful PDF certificates dynamically, either individually or in bulk via JSON. Every certificate is cryptographically assigned a unique ID that can be instantly verified on a public web page, enhancing the credibility of the foundation.

**Target Users:** 
- **NGO Admins:** To issue, manage, and revoke certificates via a secured dashboard.
- **Volunteers/Interns:** To receive and download their certificates.
- **3rd Party Evaluators (Employers/Colleges):** To verify the authenticity of a certificate.

---

## 3. Features
**Core Features:**
- **Dynamic PDF Generation:** High-quality, landscape A4 certificates generated on the fly. Optimized for single-page downloading.
- **Single & Bulk Generation:** Admins can issue a single certificate or paste a JSON array to generate hundreds instantly.
- **Admin Authentication:** A secured login screen to protect the management dashboard.
- **Public Verification Portal:** Anyone can enter a `Certificate ID` or use a direct link to verify authenticity.
- **Revocation System:** Admins can revoke certificates instantly if issued by mistake.

**Advanced / Unique Features:**
- **Real-time Search & Filtering:** Instantly filter issued certificates by name, email, or ID.
- **Buffer-Based PDF Streaming:** No files are stored on the server; PDFs are streamed as buffers to ensure privacy and server efficiency.
- **Case-Insensitive Verification:** Public verification handles varied user input gracefully.
- **Unique Cryptographic IDs:** Uses `nanoid` for collision-free, professional IDs (e.g., `A1B2C3D4E5`).

---

## 4. Tech Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React (Icons), Vite, React Router 7
- **Backend:** Node.js, Express, TypeScript, PDFKit, Mongoose
- **Database:** MongoDB (Atlas for production)
- **Deployment:** Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)

---

## 5. Deployment Guide & Credentials

### Admin Credentials (for Dashboard Access)
- **Password:** `amaanitvam2026`

### Local Setup
1. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Production Deployment
**Backend (Render):**
- Set `MONGO_URI` and `FRONTEND_URL` in environment variables.
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

**Frontend (Vercel):**
- Set `VITE_API_URL` to your backend URL (ending in `/api`).
- Set `VITE_ADMIN_PASSWORD` to `amaanitvam2026`.
- Important: The project includes a `vercel.json` to handle SPA routing and prevent 404 errors on refresh.

---

## 6. Folder Structure
```text
amaanitvam-assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/ (Logic for generation & verification)
│   │   ├── models/ (Certificate Schema)
│   │   ├── utils/ (PDF Generation logic)
│   │   └── index.ts (Server entry)
└── frontend/
    ├── vercel.json (Routing config)
    └── src/
        ├── api/ (Axios config)
        ├── components/ (UI Elements)
        ├── pages/ (Dashboard, Login, Verification)
        └── App.tsx (Routing logic)
```

---

*This project is built to production standards, solving real-world NGO challenges with automated, verifiable documentation.*