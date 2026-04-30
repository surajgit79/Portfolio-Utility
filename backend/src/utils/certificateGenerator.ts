import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";

interface Signatories {
  leftName:         string;
  leftDesignation:  string;
  leftSignature:    string;
  rightName:        string;
  rightDesignation: string;
  rightSignature:   string;
}

interface CertificateData {
  teacherName:       string;
  teacherId:         string;
  programTitle:      string;
  topics:            string[];
  certificateNumber: string;
  issuedAt:          Date;
  signatories:       Signatories;
}

const generateHTML = async (data: CertificateData): Promise<string> => {
  const issuedDate = new Date(data.issuedAt).toLocaleDateString("en-US", {
    year:   "numeric",
    month:  "long",
    day:    "numeric",
  });

  const profileUrl = `${process.env.FRONTEND_URL}/teachers/${data.teacherId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
    width:  100,
    margin: 1,
    color: {
      dark:  "#1a1a4e",
      light: "#ffffff",
    },
  });

  const topicsHtml = data.topics
    .map((topic) => `<li><span class="bullet">•</span>${topic}</li>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', sans-serif;
          width:  991px;
          height: 700px;
          display: flex;
          overflow: hidden;
          background: #ffffff;
        }

        /* Left sidebar */
        .sidebar {
          width: 200px;
          background: white;
          flex-shrink: 0;
          position: relative;
          border-right: 1px solid #eee;
        }

        .sidebar-stripe {
          position: absolute;
          top: 0;
          left: 25%;
          width: 50%;
          height: 100%;
          background: #2D84C4;
          z-index: 0;
        }

        .sidebar-logo {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          width: 99%;
          background: white;
          object-fit: contain;
        }

        .sidebar-circle {
          position: absolute;
          bottom: 3.5%;
          left: 50%;
          transform: translateX(-50%);
          width: 115px;
          height: 115px;
          border-radius: 50%;
          background: white;
          z-index: 10;
          overflow: hidden;
        }

        .sidebar-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sidebar-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60px;
          background: #2D84C4;
        }

        /* Main content */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* Top section */
        .top {
          display: flex;
          padding: 30px 40px 20px;
          align-items: flex-start;
          gap: 20px;
          border-bottom: 1px solid #eee;
        }

        .org-info {
          flex: 1;
        }

        .org-presents {
          font-size: 13px;
          color: #555;
          margin-bottom: 6px;
        }

        .org-presents span {
          font-weight: 500;
        }

        .cert-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a6eb5;
          letter-spacing: 1px;
          font-family: 'Playfair Display', serif;
        }

        /* Body section */
        .body {
          padding: 20px 40px;
          flex: 1;
        }

        .to-text {
          font-size: 13px;
          color: #555;
          margin-bottom: 8px;
        }

        .teacher-name {
          font-size: 42px;
          font-weight: 700;
          color: #2c2c2c;
          font-family: 'Playfair Display', serif;
          margin-bottom: 12px;
        }

        .program-title {
          font-size: 14px;
          color: #555;
          font-style: italic;
          margin-bottom: 16px;
        }

        .topics-list {
          list-style: none;
          display: grid;
          grid-template-rows: repeat(4, 1fr);
          grid-template-columns: repeat(3, 1fr);
          grid-auto-flow: column;
          gap: 6px 12px;
          max-height: 120px;
          overflow: hidden;
        }

        .topics-list li {
          font-size: 13px;
          color: #444;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bullet {
          font-size: 16px;
          font-weight: bold;
          color: #1a6eb5;
        }

        /* Footer section */
        .footer {
          padding: 20px 40px 30px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .signer {
          text-align: center;
          min-width: 140px;
        }

        .signature-line {
          width: 160px;
          height: 50px;
          border-bottom: 1.5px solid #1a6eb5;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signature-line img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .signer-name {
          font-size: 13px;
          font-weight: 600;
          color: #2c2c2c;
        }

        .signer-title {
          font-size: 11px;
          color: #777;
        }

        .qr-section {
          text-align: center;
        }

        .qr-id {
          font-size: 10px;
          color: #777;
          margin-bottom: 4px;
        }

        .qr-image {
          width: 100px;
          height: 100px;
        }

        .cert-issued {
          font-size: 11px;
          color: #797979;
          font-weight: 600;
          margin-top: 6px;
        }

        .cert-issued strong {
          color: #535353;
          font-weight: 700;
        }

        /* Bottom bar */
        .bottom-bar {
          height: 60px;
          background: #2D84C4;
          flex-shrink: 0;
        }
      </style>
    </head>
    <body>
      <!-- Left sidebar -->
      <div class="sidebar">
        <div class="sidebar-stripe"></div>
        <img class="sidebar-logo" src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logoTransparantBG.svg" alt="Logo"/>
        <div class="sidebar-circle">
          <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/certificateMedalPlaceholder.png" alt="Medal"/>
        </div>
        <div class="sidebar-bottom"></div>
      </div>

      <!-- Main content -->
      <div class="main">
        <!-- Top -->
        <div class="top">
          <div class="org-info">
            <div class="org-presents"><span>Navodaya Education Innovation Center</span> presents this</div>
            <div class="cert-title">CERTIFICATE OF COMPLETION</div>
          </div>
        </div>

        <!-- Body -->
        <div class="body">
          <div class="to-text">to</div>
          <div class="teacher-name">${data.teacherName}</div>
          <div class="program-title">for completing ${data.programTitle}</div>

          <ul class="topics-list">
            ${topicsHtml}
          </ul>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="signer">
            <div class="signature-line">
              <img src="${data.signatories.leftSignature}" alt="Left Signature"/>
            </div>
            <div class="signer-name">${data.signatories.leftName}</div>
            <div class="signer-title">${data.signatories.leftDesignation}</div>
          </div>

          <div class="signer">
            <div class="signature-line">
              <img src="${data.signatories.rightSignature}" alt="Right Signature"/>
            </div>
            <div class="signer-name">${data.signatories.rightName}</div>
            <div class="signer-title">${data.signatories.rightDesignation}</div>
          </div>

          <div class="qr-section">
            <div class="qr-id">ID: ${data.certificateNumber}</div>
            <img class="qr-image" src="${qrCodeDataUrl}" alt="QR Code"/>
            <div class="cert-issued">
              Certificate Issued<br/>
              <strong>${issuedDate}</strong>
            </div>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="bottom-bar"></div>
      </div>
    </body>
    </html>
  `;
};

export const generateCertificatePDF = async (
  data: CertificateData
): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args:     ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(await generateHTML(data), { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    width:           "1000px",
    height:          "700px",
    printBackground: true,
  });

  await browser.close();
  return Buffer.from(pdf);
};

export const mergePDFs = async (pdfs: Buffer[]): Promise<Buffer> => {
  const mergedPdf = await PDFDocument.create();

  for (const pdfBuffer of pdfs) {
    const pdf   = await PDFDocument.load(pdfBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();
  return Buffer.from(mergedBytes);
};