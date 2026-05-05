import { Router } from 'express';
import {
  generateCertificate,
  generateBulkCertificates,
  verifyCertificate,
  getAllCertificates,
  revokeCertificate,
  downloadCertificatePdf
} from '../controllers/certificateController';

const router = Router();

// @route   POST /api/certificates/generate
// @desc    Generate a single certificate
router.post('/generate', generateCertificate);

// @route   POST /api/certificates/bulk-generate
// @desc    Generate certificates in bulk (JSON array)
router.post('/bulk-generate', generateBulkCertificates);

// @route   GET /api/certificates/verify/:certificateId
// @desc    Verify a certificate by ID
router.get('/verify/:certificateId', verifyCertificate);

// @route   GET /api/certificates
// @desc    Get all certificates (with optional pagination/search)
router.get('/', getAllCertificates);

// @route   PATCH /api/certificates/:id/revoke
// @desc    Revoke a certificate
router.patch('/:id/revoke', revokeCertificate);

// @route   GET /api/certificates/download/:certificateId
// @desc    Download the certificate PDF
router.get('/download/:certificateId', downloadCertificatePdf);

export default router;