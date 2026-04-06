import puppeteer from "puppeteer";

interface CertificateData {
  teacherName:       string;
  trainingName:      string;
  category:          string;
  sector:            string;
  phase:             string | null;
  venue:             string | null;
  startDate:         Date;
  duration:          string;
  description:       string | null;
  mentorName:        string | null;
  certificateNumber: string;
}

const generateHTML = (data: CertificateData): string => {
  const formattedDate = new Date(data.startDate).toLocaleDateString("en-US", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  });

  const sectorPhase = data.phase
    ? `${data.sector} - ${data.phase}`
    : data.sector;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #ffffff;
          width: 1000px;
          min-height: 1414px;
          position: relative;
          overflow: hidden;
        }

        /* Background geometric shapes */
        .bg-top-right {
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: #1a1a4e;
          clip-path: polygon(100% 0, 100% 100%, 0 0);
          z-index: 0;
        }

        .bg-top-right-gold {
          position: absolute;
          top: 0;
          right: 0;
          width: 160px;
          height: 120px;
          background: #c9a84c;
          clip-path: polygon(100% 0, 100% 100%, 40% 0);
          z-index: 0;
        }

        .bg-bottom-left {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200px;
          height: 200px;
          background: #1a1a4e;
          clip-path: polygon(0 0, 0 100%, 100% 100%);
          z-index: 0;
        }

        .bg-bottom-left-gold {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 120px;
          height: 160px;
          background: #c9a84c;
          clip-path: polygon(0 0, 0 100%, 100% 100%);
          z-index: 0;
        }

        .content {
          position: relative;
          z-index: 1;
          padding: 50px 80px;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }

        .date {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a4e;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo {
          height: 60px;
          width: auto;
        }

        /* Title */
        .title-section {
          text-align: center;
          margin-bottom: 30px;
        }

        .certificate-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          color: #1a1a4e;
          letter-spacing: 2px;
          margin-bottom: 20px;
        }

        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .divider-line {
          width: 120px;
          height: 1px;
          background: #1a1a4e;
        }

        .certify-text {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }

        /* Teacher name */
        .teacher-name {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: #1a1a4e;
          text-align: center;
          margin-bottom: 30px;
        }

        /* Body */
        .body-text {
          font-size: 15px;
          line-height: 1.8;
          color: #333;
          text-align: justify;
          margin-bottom: 30px;
        }

        .body-text em {
          font-style: italic;
          font-weight: 600;
        }

        /* Description */
        .description {
          font-size: 14px;
          line-height: 1.8;
          color: #444;
          margin-bottom: 30px;
          text-align: justify;
        }

        /* Divider */
        .section-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 30px 0;
        }

        .section-divider-line {
          flex: 1;
          height: 1px;
          background: #1a1a4e;
        }

        .section-divider-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a4e;
          letter-spacing: 1px;
        }

        /* Mentor section */
        .mentor-section {
          margin-bottom: 40px;
        }

        .mentor-name {
          font-size: 15px;
          color: #333;
          font-weight: 500;
        }

        /* Certificate number */
        .certificate-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
        }

        .cert-number {
          font-size: 13px;
          color: #666;
        }

        .cert-number span {
          font-weight: 600;
          color: #1a1a4e;
        }

        .footer-links {
          font-size: 13px;
          color: #666;
          text-align: right;
        }

        .footer-links a {
          color: #1a1a4e;
          text-decoration: none;
          font-weight: 500;
        }

        /* Watermark */
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 120px;
          font-weight: 900;
          color: rgba(26, 26, 78, 0.04);
          white-space: nowrap;
          z-index: 0;
          pointer-events: none;
          font-family: 'Playfair Display', serif;
        }
      </style>
    </head>
    <body>

      <!-- Background shapes -->
      <div class="bg-top-right"></div>
      <div class="bg-top-right-gold"></div>
      <div class="bg-bottom-left"></div>
      <div class="bg-bottom-left-gold"></div>

      <!-- Watermark -->
      <div class="watermark">PORTFOLIO</div>

      <div class="content">

        <!-- Header -->
        <div class="header">
          <div class="date"><strong>Date:</strong> ${formattedDate}</div>
          <div class="logo-section">
            <img
              class="logo"
              src="https://your-logo-url.com/logo.png"
              alt="Logo"
            />
          </div>
        </div>

        <!-- Title -->
        <div class="title-section">
          <h1 class="certificate-title">CERTIFICATE OF PARTICIPATION</h1>
          <div class="divider">
            <div class="divider-line"></div>
            <span class="certify-text">This is to certify that</span>
            <div class="divider-line"></div>
          </div>
        </div>

        <!-- Teacher name -->
        <div class="teacher-name">${data.teacherName}</div>

        <!-- Body -->
        <p class="body-text">
          attended the <strong>${data.duration}</strong>
          <em>${data.trainingName}</em> (${data.category} — ${sectorPhase}),
          ${data.venue ? `held at <strong>${data.venue}</strong>,` : ""}
          commencing <strong>${formattedDate}</strong>.
        </p>

        ${data.description ? `
        <p class="description">${data.description}</p>
        ` : ""}

        <!-- Mentor section -->
        ${data.mentorName ? `
        <div class="section-divider">
          <div class="section-divider-line"></div>
          <span class="section-divider-title">MENTOR / TRAINER</span>
          <div class="section-divider-line"></div>
        </div>
        <div class="mentor-section">
          <p class="mentor-name">${data.mentorName}</p>
        </div>
        ` : ""}

        <!-- Certificate footer -->
        <div class="certificate-footer">
          <div class="cert-number">
            Certificate No: <span>${data.certificateNumber}</span>
          </div>
          <div class="footer-links">
            <div>Web: <a href="https://your-website.com">your-website.com</a></div>
            <div>Email: <a href="mailto:info@your-org.com">info@your-org.com</a></div>
          </div>
        </div>

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
  await page.setContent(generateHTML(data), { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    width:            "1000px",
    height:           "1414px",
    printBackground:  true,
  });

  await browser.close();

  return Buffer.from(pdf);
};