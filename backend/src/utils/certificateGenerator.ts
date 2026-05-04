import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

interface CertificateData {
  teacherName:       string;
  teacherId:         string;
  trainingName:      string;
  program:           string;
  module:            string;
  unit:              string | null;
  venue:             string | null;
  startDate:         Date;
  duration:          string;
  description:       string | null;
  mentorName:        string | null;
  certificateNumber: string;
  issuedAt:          Date;
  skills:            Array<{ name: string; module: string; unit: string | null }>;
}

// Signature URLs hardcoded per person
const SIGNATURES: Record<string, string> = {
  "Abyekta Khanal": "https://your-cdn.com/signatures/abyekta-khanal.png",   // replace with real URL
  "Nikita Bhattarai": "https://your-cdn.com/signatures/nikita-bhattarai.png",
  "Sita Thing":      "https://your-cdn.com/signatures/sita-thing.png",
  "Hari Acharya":    "https://your-cdn.com/signatures/hari-acharya.png",
};

const getCoordinator = (program: string): { name: string; title: string } => {
  switch (program) {
    case "Activity-based Mathematics":
      return { name: "Nikita Bhattarai", title: "ABM Co-ordinator"  };
    case "Reading & Language":
      return { name: "Sita Thing",       title: "R&L Co-ordinator"  };
    case "Pre-School Transformation":
      return { name: "Hari Acharya",     title: "PST Co-ordinator"  };
    default:
      return { name: "Co-ordinator",     title: "Program Co-ordinator" };
  }
};

const getProgramDescription = (
  program: string,
  skills:  Array<{ name: string; module: string; unit: string | null }>
): { title: string; bullets: string[] } => {
  const bullets = skills.map(s => s.unit ? `${s.module} - ${s.unit}: ${s.name}` : `${s.module}: ${s.name}`);
  return {
    title: `${program} Program`,
    bullets,
  };
};

const generateHTML = async (data: CertificateData): Promise<string> => {
  const coordinator = getCoordinator(data.program);
  const { title, bullets } = getProgramDescription(data.program, data.skills);

  const issuedDate = new Date(data.issuedAt).toLocaleDateString("en-US", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  });

  const profileUrl  = `${process.env.FRONTEND_URL}/teachers/${data.teacherId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
    width:  100,
    margin: 1,
    color: { dark: "#1a1a4e", light: "#ffffff" },
  });

  const ceoName         = "Abyekta Khanal";
  const ceoSignatureUrl = SIGNATURES[ceoName]         ?? "";
  const cooSignatureUrl = SIGNATURES[coordinator.name] ?? "";

  // Build topic grid: max 12 items (4 rows × 3 cols), flow column-first
  const topicItems = bullets
    .slice(0, 12)
    .map((b) => `<li class="topic-item"><span class="bullet">•</span>${b}</li>`)
    .join("");

  // Convert local assets to base64 data URLs for Puppeteer
  const logoPath = path.join(__dirname, "../assets/logo.svg");
  const medalPath = path.join(__dirname, "../assets/certificateMedalPlaceholder.png");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  let medalBase64: string;
  try {
    medalBase64 = fs.readFileSync(medalPath).toString("base64");
  } catch {
    // Use a minimal 1x1 transparent PNG if medal image is missing
    medalBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
  }
  const logoDataUrl = `data:image/svg+xml;base64,${logoBase64}`;
  const medalDataUrl = `data:image/png;base64,${medalBase64}`;

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
          width:    991px;
          height:   700px;
          display:  flex;
          overflow: hidden;
          background: #ffffff;
          border-top: 20px solid #2D84C4;
        }

        /* ── Sidebar ── */
        aside {
          position:   relative;
          width:      200px;
          flex-shrink: 0;
          background: #ffffff;
        }

        .sidebar-inner {
          height:        100%;
          border-right:  1px solid #eee;
          position:      relative;
          overflow:      hidden;
        }

        /* Vertical blue stripe */
        .sidebar-stripe {
          position:   absolute;
          top:        0;
          left:       25%;
          width:      50%;
          height:     100%;
          background: #2D84C4;
          z-index:    0;
        }

        /* Logo sits on top of stripe */
        .sidebar-logo {
          position:    absolute;
          top:         0;
          left:        0;
          z-index:     10;
          width:       99%;
          background:  #ffffff;
          object-fit:  contain;
        }

        /* Medal circle at bottom */
        .sidebar-medal-wrapper {
          position:         absolute;
          bottom:           3.5%;
          left:             50%;
          transform:        translateX(-50%);
          z-index:          10;
          width:            115px;
          height:           115px;
          border-radius:    50%;
          background:       #ffffff;
          display:          flex;
          align-items:      center;
          justify-content:  center;
          overflow:         hidden;
        }

        .sidebar-medal-wrapper img {
          width:  100%;
          height: 100%;
          object-fit: cover;
        }

        /* Blue bottom bar (overlaps inner) */
        .sidebar-bottom-bar {
          position:   absolute;
          bottom:     0;
          left:       0;
          width:      100%;
          height:     60px;
          background: #2D84C4;
          z-index:    5;
        }

        /* ── Main ── */
        main {
          flex:         1;
          display:      flex;
          flex-direction: column;
          gap:          0;
        }

        /* Top header */
        .header {
          display:       flex;
          align-items:   flex-start;
          gap:           20px;
          padding:       32px 40px 20px;
          border-bottom: 1px solid #eee;
        }

        .org-presents {
          font-size:     13px;
          color:         #555;
          margin-bottom: 6px;
        }

        .org-presents span {
          font-weight: 500;
        }

        .cert-title {
          font-family:    'Playfair Display', serif;
          font-size:      28px;
          font-weight:    700;
          color:          #1a6eb5;
          letter-spacing: 1px;
        }

        /* Body */
        .body {
          flex:       1;
          padding:    20px 40px 0;
          max-height: 360px;
          overflow:   hidden;
        }

        .to-text {
          font-size:     13px;
          color:         #555;
          margin-bottom: 8px;
        }

        .teacher-name {
          font-family:   'Playfair Display', serif;
          font-size:     42px;
          font-weight:   700;
          color:         #2c2c2c;
          margin-bottom: 12px;
        }

        .program-title {
          font-size:     14px;
          font-style:    italic;
          color:         #555;
          margin-bottom: 16px;
        }

        /* Topic grid: 4 rows, 3 cols, column-first flow */
        .topics {
          display:               grid;
          grid-template-rows:    repeat(4, 1fr);
          grid-template-columns: repeat(3, 1fr);
          grid-auto-flow:        column;
          height:                120px;
          max-height:            120px;
          overflow:              hidden;
          list-style:            none;
          gap:                   6px 0;
          margin-bottom:         20px;
        }

        .topic-item {
          display:     flex;
          align-items: center;
          gap:         8px;
          font-size:   13px;
          color:       #444;
        }

        .bullet {
          font-size:   16px;
          font-weight: bold;
          color:       #1a6eb5;
        }

        /* Footer */
        .footer {
          display:         flex;
          align-items:     flex-end;
          justify-content: space-between;
          padding:         0 40px 32px;
        }

        .signer {
          min-width:  140px;
          text-align: center;
        }

        .signature-box {
          width:         160px;
          height:        50px;
          border-bottom: 1.5px solid #1a6eb5;
          margin-bottom: 6px;
          display:       flex;
          align-items:   center;
          justify-content: center;
          overflow:      hidden;
        }

        .signature-box img {
          max-width:  100%;
          max-height: 100%;
          object-fit: contain;
        }

        .signer-name {
          font-size:   13px;
          font-weight: 600;
          color:       #2c2c2c;
        }

        .signer-title {
          font-size: 11px;
          color:     #777;
        }

        /* QR section */
        .qr-section {
          text-align: center;
        }

        .qr-id {
          font-size:     10px;
          color:         #777;
          margin-bottom: 4px;
        }

        .qr-image {
          width:  100px;
          height: 100px;
        }

        .cert-issued {
          font-size:   11px;
          color:       #797979;
          font-weight: 600;
          margin-top:  6px;
        }

        .cert-issued strong {
          font-weight: 700;
          color:       #535353;
        }

        /* Blue bottom bar */
        .main-bottom-bar {
          height:     60px;
          flex-shrink: 0;
          background: #2D84C4;
        }
      </style>
    </head>
    <body>

      <!-- Sidebar -->
      <aside>
        <div class="sidebar-inner">
          <div class="sidebar-stripe"></div>
          <img
            class="sidebar-logo"
            src="${logoDataUrl}"
            alt="Logo"
          />
          <div class="sidebar-medal-wrapper">
            <img
              src="${medalDataUrl}"
              alt="Medal"
            />
          </div>
        </div>
        <div class="sidebar-bottom-bar"></div>
      </aside>

      <!-- Main -->
      <main>

        <!-- Header -->
        <div class="header">
          <div>
            <p class="org-presents">
              <span>Navodaya Education Innovation Center</span> presents this
            </p>
            <h1 class="cert-title">CERTIFICATE OF COMPLETION</h1>
          </div>
        </div>

        <!-- Body -->
        <div class="body">
          <p class="to-text">to</p>
          <h2 class="teacher-name">${data.teacherName}</h2>
          <p class="program-title">for completing ${title}</p>
          <ul class="topics">
            ${topicItems}
          </ul>
        </div>

        <!-- Footer -->
        <div class="footer">

          <div class="signer">
            <div class="signature-box">
              ${ceoSignatureUrl ? `<img src="${ceoSignatureUrl}" alt="Signature"/>` : ""}
            </div>
            <p class="signer-name">${ceoName}</p>
            <p class="signer-title">Chief Executive Officer</p>
          </div>

          <div class="signer">
            <div class="signature-box">
              ${cooSignatureUrl ? `<img src="${cooSignatureUrl}" alt="Signature"/>` : ""}
            </div>
            <p class="signer-name">${coordinator.name}</p>
            <p class="signer-title">${coordinator.title}</p>
          </div>

          <div class="qr-section">
            <p class="qr-id">ID: ${data.certificateNumber}</p>
            <img class="qr-image" src="${qrCodeDataUrl}" alt="QR Code"/>
            <p class="cert-issued">
              Certificate Issued<br/>
              <strong>${issuedDate}</strong>
            </p>
          </div>

        </div>

        <!-- Bottom bar -->
        <div class="main-bottom-bar"></div>

      </main>
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
    width:           "991px",
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