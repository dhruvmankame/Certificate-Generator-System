import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  recipientName: string;
  email: string;
  courseOrEventName: string;
  issueDate: Date;
  certificateId: string; // Unique ID for verification link
  status: 'active' | 'revoked';
  generatedBy: string; // Admin or system who generated it
  verificationUrl: string;
}

const certificateSchema: Schema = new Schema(
  {
    recipientName: { type: String, required: true },
    email: { type: String, required: true },
    courseOrEventName: { type: String, required: true },
    issueDate: { type: Date, required: true, default: Date.now },
    certificateId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'revoked'], default: 'active' },
    generatedBy: { type: String, required: true, default: 'Admin' },
    verificationUrl: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

// Indexing for faster verification search
certificateSchema.index({ certificateId: 1 });

const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);

export default Certificate;