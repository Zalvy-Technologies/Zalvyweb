import { PDFDocument, rgb, StandardFonts, type PDFFont } from "pdf-lib";
import QRCode from "qrcode";

export interface CertificateData {
  certificateNumber: string;
  recipientName: string;
  recipientEmail: string;
  title: string;
  issueDate: string;
  verificationHash: string;
  projectTitle?: string;
  mentorName?: string;
  duration?: string;
}

const ZALVY_DARK = rgb(0.027, 0.035, 0.051);      // #07090d
const ZALVY_ACCENT = rgb(0.486, 0.886, 0.941);    // #7ce2f0
const ZALVY_IRIS = rgb(0.376, 0.647, 0.98);       // #60a5fa
const ZALVY_WHITE = rgb(1, 1, 1);
const ZALVY_LIGHT_GRAY = rgb(0.9, 0.9, 0.92);
const ZALVY_MEDIUM_GRAY = rgb(0.65, 0.7, 0.75);

const PAGE_WIDTH = 841.89;  // A4 landscape
const PAGE_HEIGHT = 595.28;

function drawBackground(page: any, accentFont: PDFFont) {
  // Dark background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: ZALVY_DARK,
  });

  // Top accent bar
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 8,
    width: PAGE_WIDTH,
    height: 8,
    color: ZALVY_ACCENT,
  });

  // Bottom accent bar
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: 8,
    color: ZALVY_IRIS,
  });

  // Subtle geometric pattern - circles
  for (let i = 0; i < 15; i++) {
    const x = (i % 5) * 160 + 40;
    const y = Math.floor(i / 5) * 180 + 60;
    page.drawCircle({
      x,
      y,
      size: 2,
      color: ZALVY_ACCENT,
      opacity: 0.05,
    });
  }

  // ZALVY watermark (large, subtle)
  page.drawText("ZALVY", {
    x: PAGE_WIDTH / 2 - 180,
    y: PAGE_HEIGHT / 2 - 20,
    size: 120,
    font: accentFont,
    color: ZALVY_ACCENT,
    opacity: 0.02,
    rotate: Math.PI / -12,
  });
}

function drawBorder(page: any) {
  // Outer border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: PAGE_WIDTH - 40,
    height: PAGE_HEIGHT - 40,
    borderWidth: 2,
    borderColor: ZALVY_ACCENT,
    color: undefined,
  });

  // Inner border
  page.drawRectangle({
    x: 35,
    y: 35,
    width: PAGE_WIDTH - 70,
    height: PAGE_HEIGHT - 70,
    borderWidth: 1,
    borderColor: ZALVY_IRIS,
    color: undefined,
    opacity: 0.5,
  });
}

function drawCornerAccents(page: any) {
  const size = 30;
  const offset = 25;
  const thickness = 3;

  // Top-left
  page.drawLine({ start: { x: offset, y: PAGE_HEIGHT - offset }, end: { x: offset + size, y: PAGE_HEIGHT - offset }, thickness, color: ZALVY_ACCENT });
  page.drawLine({ start: { x: offset, y: PAGE_HEIGHT - offset }, end: { x: offset, y: PAGE_HEIGHT - offset - size }, thickness, color: ZALVY_ACCENT });

  // Top-right
  page.drawLine({ start: { x: PAGE_WIDTH - offset, y: PAGE_HEIGHT - offset }, end: { x: PAGE_WIDTH - offset - size, y: PAGE_HEIGHT - offset }, thickness, color: ZALVY_IRIS });
  page.drawLine({ start: { x: PAGE_WIDTH - offset, y: PAGE_HEIGHT - offset }, end: { x: PAGE_WIDTH - offset, y: PAGE_HEIGHT - offset - size }, thickness, color: ZALVY_IRIS });

  // Bottom-left
  page.drawLine({ start: { x: offset, y: offset }, end: { x: offset + size, y: offset }, thickness, color: ZALVY_IRIS });
  page.drawLine({ start: { x: offset, y: offset }, end: { x: offset, y: offset + size }, thickness, color: ZALVY_IRIS });

  // Bottom-right
  page.drawLine({ start: { x: PAGE_WIDTH - offset, y: offset }, end: { x: PAGE_WIDTH - offset - size, y: offset }, thickness, color: ZALVY_ACCENT });
  page.drawLine({ start: { x: PAGE_WIDTH - offset, y: offset }, end: { x: PAGE_WIDTH - offset, y: offset + size }, thickness, color: ZALVY_ACCENT });
}

async function drawQRCode(page: any, data: string, x: number, y: number, size: number) {
  await QRCode.toDataURL(data, {
    width: size,
    margin: 1,
    color: {
      dark: "#7ce2f0",
      light: "#07090d00",
    },
  });

  // pdf-lib doesn't support data URLs directly, so we embed as PNG
  // For now, draw a placeholder - in production you'd convert data URL to PNG bytes
  page.drawRectangle({
    x,
    y,
    width: size,
    height: size,
    color: ZALVY_DARK,
    borderWidth: 1,
    borderColor: ZALVY_ACCENT,
  });

  page.drawText("QR CODE", {
    x: x + size / 2 - 25,
    y: y + size / 2 - 5,
    size: 10,
    font: await page.getFont(),
    color: ZALVY_ACCENT,
  });
}

export async function generateCertificatePDF(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const accentFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

  // Draw background and decorative elements
  drawBackground(page, accentFont);
  drawBorder(page);
  drawCornerAccents(page);

  // Header section
  let y = PAGE_HEIGHT - 100;

  // ZALVY Logo/Wordmark
  page.drawText("ZALVY", {
    x: 60,
    y,
    size: 36,
    font: accentFont,
    color: ZALVY_ACCENT,
  });

  page.drawText("Building Intelligent Systems. Empowering Future Talent.", {
    x: 60,
    y: y - 30,
    size: 12,
    font: regularFont,
    color: ZALVY_MEDIUM_GRAY,
  });

  // Certificate type badge
  const badgeText = "CERTIFICATE OF COMPLETION";
  const badgeWidth = boldFont.widthOfTextAtSize(badgeText, 14) + 40;
  page.drawRectangle({
    x: PAGE_WIDTH - 60 - badgeWidth,
    y: y - 10,
    width: badgeWidth,
    height: 36,
    color: ZALVY_ACCENT,
  });
  page.drawText(badgeText, {
    x: PAGE_WIDTH - 60 - badgeWidth / 2 - boldFont.widthOfTextAtSize(badgeText, 14) / 2,
    y: y + 2,
    size: 14,
    font: boldFont,
    color: ZALVY_DARK,
  });

  y -= 100;

  // Main certificate title
  page.drawText("This certifies that", {
    x: PAGE_WIDTH / 2 - regularFont.widthOfTextAtSize("This certifies that", 20) / 2,
    y,
    size: 20,
    font: regularFont,
    color: ZALVY_LIGHT_GRAY,
  });

  y -= 50;

  // Recipient name
  page.drawText(data.recipientName, {
    x: PAGE_WIDTH / 2 - boldFont.widthOfTextAtSize(data.recipientName, 36) / 2,
    y,
    size: 36,
    font: boldFont,
    color: ZALVY_WHITE,
  });

  y -= 50;

  // Completion statement
  page.drawText("has successfully completed the", {
    x: PAGE_WIDTH / 2 - regularFont.widthOfTextAtSize("has successfully completed the", 20) / 2,
    y,
    size: 20,
    font: regularFont,
    color: ZALVY_LIGHT_GRAY,
  });

  y -= 40;

  // Program title
  const titleLines = wrapText(data.title, boldFont, 28, PAGE_WIDTH - 120);
  for (const line of titleLines) {
    page.drawText(line, {
      x: PAGE_WIDTH / 2 - boldFont.widthOfTextAtSize(line, 28) / 2,
      y,
      size: 28,
      font: boldFont,
      color: ZALVY_ACCENT,
    });
    y -= 36;
  }

  y -= 30;

  // Project title if provided
  if (data.projectTitle) {
    page.drawText("Project: " + data.projectTitle, {
      x: PAGE_WIDTH / 2 - regularFont.widthOfTextAtSize("Project: " + data.projectTitle, 16) / 2,
      y,
      size: 16,
      font: regularFont,
      color: ZALVY_MEDIUM_GRAY,
    });
    y -= 30;
  }

  // Mentor if provided
  if (data.mentorName) {
    page.drawText("Mentored by: " + data.mentorName, {
      x: PAGE_WIDTH / 2 - regularFont.widthOfTextAtSize("Mentored by: " + data.mentorName, 14) / 2,
      y,
      size: 14,
      font: regularFont,
      color: ZALVY_MEDIUM_GRAY,
    });
    y -= 25;
  }

  // Duration if provided
  if (data.duration) {
    page.drawText("Duration: " + data.duration, {
      x: PAGE_WIDTH / 2 - regularFont.widthOfTextAtSize("Duration: " + data.duration, 14) / 2,
      y,
      size: 14,
      font: regularFont,
      color: ZALVY_MEDIUM_GRAY,
    });
    y -= 25;
  }

  y -= 40;

  // Details grid
  const detailX = 100;
  const detailWidth = (PAGE_WIDTH - 200) / 3;

  const details = [
    { label: "Certificate No.", value: data.certificateNumber },
    { label: "Issue Date", value: formatDate(data.issueDate) },
    { label: "Verification Hash", value: data.verificationHash.slice(0, 20) + "..." },
  ];

  for (const detail of details) {
    const i = details.indexOf(detail);
    const x = detailX + i * detailWidth;
    
    // Detail box
    page.drawRectangle({
      x: x - 10,
      y: y - 10,
      width: detailWidth - 10,
      height: 80,
      color: ZALVY_DARK,
      borderWidth: 1,
      borderColor: ZALVY_ACCENT,
      opacity: 0.8,
    });

    page.drawText(detail.label, {
      x: x + 5,
      y: y + 45,
      size: 11,
      font: regularFont,
      color: ZALVY_MEDIUM_GRAY,
    });

    page.drawText(detail.value, {
      x: x + 5,
      y: y + 15,
      size: 13,
      font: boldFont,
      color: ZALVY_WHITE,
    });
  }

  y -= 120;

  // QR Code section
  const verificationUrl = `https://zalvy.com/verify?id=${data.certificateNumber}`;
  const qrSize = 100;
  const qrX = PAGE_WIDTH / 2 - qrSize / 2;
  
  await drawQRCode(page, verificationUrl, qrX, y, qrSize);

  y -= qrSize + 20;

  page.drawText("Scan to verify authenticity", {
    x: PAGE_WIDTH / 2 - regularFont.widthOfTextAtSize("Scan to verify authenticity", 12) / 2,
    y,
    size: 12,
    font: regularFont,
    color: ZALVY_MEDIUM_GRAY,
  });

  page.drawText(verificationUrl, {
    x: PAGE_WIDTH / 2 - regularFont.widthOfTextAtSize(verificationUrl, 10) / 2,
    y: y - 20,
    size: 10,
    font: regularFont,
    color: ZALVY_IRIS,
  });

  // Footer signatures area
  y = 100;
  
  // Signature lines
  const sigY = y;
  const sigWidth = 200;
  const sigSpacing = 60;
  const startX = PAGE_WIDTH / 2 - (sigWidth * 2 + sigSpacing) / 2;

  // Left signature
  page.drawLine({
    start: { x: startX, y: sigY },
    end: { x: startX + sigWidth, y: sigY },
    thickness: 1,
    color: ZALVY_MEDIUM_GRAY,
  });
  page.drawText("Program Director", {
    x: startX + sigWidth / 2 - regularFont.widthOfTextAtSize("Program Director", 10) / 2,
    y: sigY - 20,
    size: 10,
    font: regularFont,
    color: ZALVY_MEDIUM_GRAY,
  });

  // Right signature
  const rightX = startX + sigWidth + sigSpacing;
  page.drawLine({
    start: { x: rightX, y: sigY },
    end: { x: rightX + sigWidth, y: sigY },
    thickness: 1,
    color: ZALVY_MEDIUM_GRAY,
  });
  page.drawText("Technical Lead", {
    x: rightX + sigWidth / 2 - regularFont.widthOfTextAtSize("Technical Lead", 10) / 2,
    y: sigY - 20,
    size: 10,
    font: regularFont,
    color: ZALVY_MEDIUM_GRAY,
  });

  // Final verification note at bottom
  page.drawText(`Verification: zalvy.com/verify?id=${data.certificateNumber}  |  Hash: ${data.verificationHash}`, {
    x: 60,
    y: 35,
    size: 8,
    font: regularFont,
    color: ZALVY_MEDIUM_GRAY,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? currentLine + " " + word : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}