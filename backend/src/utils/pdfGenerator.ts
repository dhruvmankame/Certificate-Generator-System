import PDFDocument from 'pdfkit';

export const generatePdfBuffer = async (
  recipientName: string,
  courseOrEventName: string,
  issueDate: Date,
  certificateId: string,
  verificationUrl: string
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 0 // Set margin to 0 to easily use absolute coordinates
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const width = doc.page.width;
      const height = doc.page.height;

      // Draw background/border
      doc.rect(20, 20, width - 40, height - 40).stroke('#047857');
      doc.rect(25, 25, width - 50, height - 50).stroke('#065f46');

      // Title
      doc.font('Helvetica-Bold').fontSize(40).fillColor('#047857')
         .text('Certificate of Completion', 0, 140, { align: 'center', width });
      
      // Subtitle
      doc.font('Helvetica').fontSize(20).fillColor('#333333')
         .text('This is to certify that', 0, 210, { align: 'center', width });

      // Name
      doc.font('Helvetica-Bold').fontSize(35).fillColor('#111827')
         .text(recipientName, 0, 260, { align: 'center', width });

      // Description
      doc.font('Helvetica').fontSize(18).fillColor('#4b5563')
         .text(`has successfully completed the ${courseOrEventName}`, 0, 330, { align: 'center', width });
         
      doc.text('organized by Amaanitvam Foundation.', 0, 360, { align: 'center', width });

      // Details at bottom
      const yPos = height - 150;
      
      doc.fontSize(14).fillColor('#000000');
      doc.text(`Date: ${issueDate.toLocaleDateString()}`, 100, yPos);
      doc.text('Authorized Signature', width - 250, yPos);
      
      // Draw signature line
      doc.moveTo(width - 250, yPos - 5)
         .lineTo(width - 100, yPos - 5)
         .stroke('#000000');

      // Footer - Verification info
      doc.fontSize(10).fillColor('#6b7280');
      doc.text(`Certificate ID: ${certificateId}`, 100, height - 70);
      doc.text(`Verify at: ${verificationUrl}`, 100, height - 55);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};