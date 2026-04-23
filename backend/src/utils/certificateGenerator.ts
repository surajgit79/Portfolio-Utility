import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";

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
}

const getCoordinator = (program: string): { name: string; title: string } => {
  switch (program) {
    case "Activity-based Mathematics":
      return { name: "Nikita Bhattarai",    title: "ABM Co-ordinator"  };
    case "Reading & Language":
      return { name: "Sita Thing", title: "R&L Co-ordinator"  };
    case "Pre-School Transformation":
      return { name: "Hari Acharya", title: "PST Co-ordinator"  };
    default:
      return { name: "Co-ordinator",  title: "Program Co-ordinator" };
  }
};

const getProgramDescription = (
  program: string,
  module:  string,
  unit:    string | null
): { title: string; bullets: string[] } => {
  const bullets = unit
    ? [`${module} - ${unit}`]
    : [module];

  return {
    title:   `for completing ${program} Program`,
    bullets,
  };
};

const generateHTML = async (data: CertificateData): Promise<string> => {
  const coordinator = getCoordinator(data.program);
  const { title, bullets } = getProgramDescription(
    data.program,
    data.module,
    data.unit
  );

  const issuedDate = new Date(data.issuedAt).toLocaleDateString("en-US", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  });

  const profileUrl = `${process.env.FRONTEND_URL}/teachers/${data.teacherId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
    width:  120,
    margin: 1,
    color: {
      dark:  "#1a1a4e",
      light: "#ffffff",
    },
  });

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
          width:  1000px;
          height: 700px;
          display: flex;
          overflow: hidden;
          background: #ffffff;
        }

        /* Left gray sidebar */
        .sidebar {
          width: 80px;
          background: #e8e8e8;
          flex-shrink: 0;
          position: relative;
        }

        .sidebar-circle {
          width:  60px;
          height: 60px;
          background: #d0d0d0;
          border-radius: 50%;
          position: absolute;
          bottom: 80px;
          left: 10px;
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

        .logo {
          width:  80px;
          height: 80px;
          object-fit: contain;
        }

        .org-info {
          flex: 1;
        }

        .org-presents {
          font-size:   13px;
          color:       #555;
          margin-bottom: 6px;
        }

        .cert-title {
          font-size:      28px;
          font-weight:    700;
          color:          #1a6eb5;
          letter-spacing: 1px;
          font-family:    'Playfair Display', serif;
        }

        /* Body section */
        .body {
          padding:    30px 40px;
          flex:       1;
        }

        .to-text {
          font-size:     13px;
          color:         #555;
          margin-bottom: 8px;
        }

        .teacher-name {
          font-size:      42px;
          font-weight:    700;
          color:          #2c2c2c;
          font-family:    'Playfair Display', serif;
          margin-bottom:  12px;
        }

        .program-title {
          font-size:      14px;
          color:          #555;
          font-style:     italic;
          margin-bottom:  16px;
        }

        .bullets {
          list-style: none;
          margin-bottom: 20px;
        }

        .bullets li {
          font-size:     13px;
          color:         #444;
          margin-bottom: 6px;
          display:       flex;
          align-items:   center;
          gap:           8px;
        }

        .bullets li::before {
          content:          "•";
          color:            #1a6eb5;
          font-size:        16px;
          font-weight:      bold;
        }

        /* Footer section */
        .footer {
          padding:        20px 40px;
          display:        flex;
          align-items:    flex-end;
          justify-content: space-between;
        }

        .signer {
          text-align: center;
          min-width:  140px;
        }

        .signature-line {
          width:         120px;
          height:        50px;
          border-bottom: 1.5px solid #1a6eb5;
          margin-bottom: 6px;
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
          font-size:  11px;
          color:      #555;
          margin-top: 6px;
        }

        .cert-issued strong {
          color:       #1a6eb5;
          font-weight: 600;
        }

        /* Bottom teal bar */
        .bottom-bar {
          height:     18px;
          background: #1a9b8a;
          flex-shrink: 0;
        }
      </style>
    </head>
    <body>

      <!-- Left sidebar -->
      <div class="sidebar">
        <div class="sidebar-circle"></div>
      </div>

      <!-- Main content -->
      <div class="main">

        <!-- Top -->
        <div class="top">
          <img
            class="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Navodaya_Vidyalaya_Samiti_logo.png/120px-Navodaya_Vidyalaya_Samiti_logo.png"
            alt="Logo"
          />
          <div class="org-info">
            <div class="org-presents">Navodaya Innovation Center presents this</div>
            <div class="cert-title">CERTIFICATE OF COMPLETION</div>
          </div>
        </div>

        <!-- Body -->
        <div class="body">
          <div class="to-text">to</div>
          <div class="teacher-name">${data.teacherName}</div>
          <div class="program-title">${title}</div>
          <ul class="bullets">
            ${bullets.map((b) => `<li>${b}</li>`).join("")}
          </ul>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="signer">
            <div class="signature-line"></div>
            <div class="signer-name">Abyekta Khanal</div>
            <div class="signer-title">Chief Executive Officer</div>
          </div>

          <div class="signer">
            <div class="signature-line"></div>
            <div class="signer-name">${coordinator.name}</div>
            <div class="signer-title">${coordinator.title}</div>
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