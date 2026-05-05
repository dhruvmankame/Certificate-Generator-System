# Amaanitvam Foundation - Certificate Generator System

## 1. Selected Task + Reason
**Selected Task:** Certificate Generator System

**Reason for Selection:** 
NGOs often struggle with administrative overhead when issuing certificates manually for hundreds of volunteers, interns, or event participants. A system that automates PDF generation, tracks validity, and provides a unique verification link adds immense, immediate professional value. This project stands out by incorporating PDF processing, bulk data handling, and public verification—all of which demonstrate strong full-stack architectural skills and solve a very real bottleneck.

---

## 2. Project Overview
**Problem Statement:** The Amaanitvam Foundation manually creates and distributes certificates for interns and volunteers, which is time-consuming and prone to forgery.

**Vision:** A modern, web-based portal to generate beautiful PDF certificates dynamically, either individually or in bulk via JSON. Every certificate is cryptographically assigned a unique ID that can be instantly verified on a public web page, enhancing the credibility of the foundation.

**Target Users:** 
- **NGO Admins:** To issue and revoke certificates.
- **Volunteers/Interns:** To receive and download their certificates.
- **3rd Party Evaluators (Employers/Colleges):** To verify the authenticity of a certificate.

---

## 3. Features
**Core Features:**
- **Dynamic PDF Generation:** High-quality, landscape A4 certificates generated on the fly.
- **Single & Bulk Generation:** Admins can issue a single certificate or paste a JSON array to generate hundreds instantly.
- **Public Verification Portal:** Anyone can enter a `Certificate ID` or scan a URL to verify authenticity.
- **Revocation System:** Admins can revoke certificates if issued by mistake, preventing false verification.

**Advanced / Unique Features:**
- **Real-time Search & Filtering:** Instantly filter issued certificates by name, email, or ID on the dashboard.
- **Direct Download & Export:** Instantly download the generated PDF directly from the dashboard without leaving the browser.
- **Unique Cryptographic IDs:** Uses `nanoid` to ensure collision-free, professional-looking IDs (e.g., `A1B2C3D4E5`).

---

## 4. Tech Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React (Icons), Vite
- **Backend:** Node.js, Express, TypeScript, PDFKit (for PDF generation), Mongoose
- **Database:** MongoDB (Atlas/Local)
- **Deployment Ready:** Vercel (Frontend), Render/Railway (Backend), MongoDB Atlas (Database)

---

## 5. Folder Structure
```text
amaanitvam-assignment/
├── backend/
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── config/
│       │   └── db.ts
│       ├── controllers/
│       │   └── certificateController.ts
│       ├── models/
│       │   └── Certificate.ts
│       ├── routes/
│       │   └── certificateRoutes.ts
│       ├── utils/
│       │   └── pdfGenerator.ts
│       └── index.ts
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.ts
    └── src/
        ├── api/
        │   └── axios.ts
        ├── components/
        │   ├── CertificateList.tsx
        │   ├── GenerateSingleForm.tsx
        │   └── Navbar.tsx
        ├── pages/
        │   ├── Dashboard.tsx
        │   └── VerifyCertificate.tsx
        ├── App.tsx
        ├── main.tsx
        └── index.css
```

---

## 6. Backend Code
*(The backend code has been successfully implemented in the `backend/src` directory. Key highlights include the `Certificate` Mongoose model, the `pdfGenerator` utility using `pdfkit`, and the Express REST APIs for CRUD operations and bulk generation.)*

---

## 7. Frontend Code
*(The frontend code has been built using React + TailwindCSS in the `frontend/src` directory. It includes a polished, responsive NGO-themed UI with separate modules for generating certificates, viewing lists, and a dedicated public verification page.)*

---

## 8. Database Models
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  recipientName: string;
  email: string;
  courseOrEventName: string;
  issueDate: Date;
  certificateId: string;
  status: 'active' | 'revoked';
  generatedBy: string;
  verificationUrl: string;
}

const certificateSchema: Schema = new Schema({
  recipientName: { type: String, required: true },
  email: { type: String, required: true },
  courseOrEventName: { type: String, required: true },
  issueDate: { type: Date, required: true, default: Date.now },
  certificateId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'revoked'], default: 'active' },
  generatedBy: { type: String, required: true, default: 'Admin' },
  verificationUrl: { type: String, required: true }
}, { timestamps: true });

certificateSchema.index({ certificateId: 1 });
export default mongoose.model<ICertificate>('Certificate', certificateSchema);
```

---

## 9. Deployment Guide

### Local Setup
1. Ensure MongoDB is running locally or provide an Atlas URI.
2. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Production Deployment
**Database (MongoDB Atlas):**
1. Create a free cluster on MongoDB Atlas.
2. Whitelist `0.0.0.0/0` in Network Access.
3. Get the connection string and set it as `MONGO_URI` in the backend environment.

**Backend (Render / Railway):**
1. Push the code to a GitHub repository.
2. Create a new Web Service on Render/Railway pointing to the `backend` folder.
3. Set the build command to `npm install && npm run build` and the start command to `npm start`.
4. Add Environment Variables: `MONGO_URI` and `FRONTEND_URL`.

**Frontend (Vercel):**
1. Import the GitHub repository into Vercel.
2. Select the `frontend` directory as the root.
3. Vercel will automatically detect Vite. 
4. Update `axios.ts` to point to your new deployed Backend URL.
5. Deploy.

---

*This project is completely built and ready to demonstrate in the local environment.*