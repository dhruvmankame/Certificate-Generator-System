import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import Certificate from '../models/Certificate';
import { generatePdfBuffer } from '../utils/pdfGenerator';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Helper to generate verification URL
const getVerificationUrl = (id: string) => `${FRONTEND_URL}/verify/${id}`;

export const generateCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipientName, email, courseOrEventName, generatedBy } = req.body;

    if (!recipientName || !email || !courseOrEventName) {
      res.status(400).json({ error: 'Please provide recipientName, email, and courseOrEventName' });
      return;
    }

    const certificateId = nanoid(10).toUpperCase();
    const verificationUrl = getVerificationUrl(certificateId);

    const certificate = new Certificate({
      recipientName,
      email,
      courseOrEventName,
      certificateId,
      verificationUrl,
      generatedBy: generatedBy || 'Admin'
    });

    await certificate.save();

    res.status(201).json({
      message: 'Certificate generated successfully',
      certificate
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

export const generateBulkCertificates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { certificates, courseOrEventName, generatedBy } = req.body;
    
    if (!certificates || !Array.isArray(certificates) || certificates.length === 0) {
      res.status(400).json({ error: 'Please provide an array of certificates' });
      return;
    }

    if (!courseOrEventName) {
      res.status(400).json({ error: 'Please provide courseOrEventName for the bulk batch' });
      return;
    }

    const certificatesToInsert = certificates.map((cert: any) => {
      const certificateId = nanoid(10).toUpperCase();
      return {
        recipientName: cert.recipientName,
        email: cert.email,
        courseOrEventName,
        certificateId,
        verificationUrl: getVerificationUrl(certificateId),
        generatedBy: generatedBy || 'Admin'
      };
    });

    const inserted = await Certificate.insertMany(certificatesToInsert);

    res.status(201).json({
      message: `${inserted.length} certificates generated successfully`,
      count: inserted.length,
      certificates: inserted
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

export const verifyCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId });

    if (!certificate) {
      res.status(404).json({ valid: false, error: 'Certificate not found' });
      return;
    }

    if (certificate.status === 'revoked') {
      res.status(200).json({ valid: false, error: 'Certificate has been revoked', certificate });
      return;
    }

    res.status(200).json({ valid: true, certificate });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

export const getAllCertificates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const query: any = {};
    if (search) {
      query.$or = [
        { recipientName: { $regex: search, $options: 'i' } },
        { certificateId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const certificates = await Certificate.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Certificate.countDocuments(query);

    res.status(200).json({
      certificates,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

export const revokeCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findByIdAndUpdate(
      id,
      { status: 'revoked' },
      { new: true }
    );

    if (!certificate) {
      res.status(404).json({ error: 'Certificate not found' });
      return;
    }

    res.status(200).json({ message: 'Certificate revoked successfully', certificate });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

export const downloadCertificatePdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId });

    if (!certificate) {
      res.status(404).json({ error: 'Certificate not found' });
      return;
    }

    const pdfBuffer = await generatePdfBuffer(
      certificate.recipientName,
      certificate.courseOrEventName,
      certificate.issueDate,
      certificate.certificateId,
      certificate.verificationUrl
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${certificateId}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server Error generating PDF' });
  }
};