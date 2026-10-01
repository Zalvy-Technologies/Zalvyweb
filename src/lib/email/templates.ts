export interface EmailTemplateData {
  recipientName?: string;
  companyName?: string;
  internshipTitle?: string;
  startDate?: string;
  endDate?: string;
  stipend?: string;
  certificateNumber?: string;
  verificationHash?: string;
  verificationUrl?: string;
  projectTitle?: string;
  projectDescription?: string;
  mentorName?: string;
  dashboardUrl?: string;
  supportEmail?: string;
  companyUrl?: string;
  year?: number;
}

const BASE_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f8f7f4; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .card { background: #ffffff; border-radius: 16px; border: 1px solid #e8e4dd; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06); }
  .header { background: linear-gradient(135deg, #07090d 0%, #1a1f2e 100%); padding: 32px; text-align: center; }
  .logo { color: #7ce2f0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; }
  .tagline { color: #96a5b8; font-size: 14px; margin-top: 8px; }
  .content { padding: 32px; }
  .title { font-size: 24px; font-weight: 600; color: #07090d; margin-bottom: 16px; letter-spacing: -0.02em; }
  .body { color: #4a5568; font-size: 15px; line-height: 1.7; }
  .body p { margin-bottom: 16px; }
  .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0efe9; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #718096; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
  .detail-value { color: #1a1a2e; font-size: 14px; font-weight: 500; text-align: right; }
  .btn { display: inline-block; background: linear-gradient(135deg, #7ce2f0 0%, #60a5fa 100%); color: #07090d; font-weight: 600; font-size: 14px; padding: 14px 28px; border-radius: 10px; text-decoration: none; text-align: center; box-shadow: 0 4px 16px rgba(124, 226, 240, 0.3); }
  .btn:hover { opacity: 0.95; }
  .footer { padding: 24px 32px; background: #faf9f6; border-top: 1px solid #e8e4dd; text-align: center; }
  .footer-text { color: #96a5b8; font-size: 12px; line-height: 1.6; }
  .footer-links { margin-top: 12px; }
  .footer-links a { color: #60a5fa; text-decoration: none; margin: 0 8px; font-size: 12px; }
  .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .badge-success { background: #dcfce7; color: #166534; }
  .badge-warning { background: #fef3c7; color: #92400e; }
  .badge-info { background: #dbeafe; color: #1e40af; }
  .code-block { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #334155; word-break: break-all; margin: 16px 0; }
  .divider { height: 1px; background: linear-gradient(90deg, transparent, #e8e4dd, transparent); margin: 24px 0; }
`;

function wrapTemplate(content: string, preheader = ""): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <title>${preheader}</title>
      <style>${BASE_STYLES}</style>
    </head>
    <body>
      <div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="logo">ZALVY</div>
            <div class="tagline">Building Intelligent Systems. Empowering Future Talent.</div>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p class="footer-text">
              This email was sent to you by ZALVY Technologies.<br>
              © ${new Date().getFullYear()} ZALVY Technologies. All rights reserved.
            </p>
            <div class="footer-links">
              <a href="https://zalvy.com">Website</a>
              <a href="https://zalvy.com/legal/privacy">Privacy</a>
              <a href="https://zalvy.com/legal/terms">Terms</a>
              <a href="mailto:hello@zalvy.com">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function offerLetterTemplate(data: EmailTemplateData): string {
  const content = `
    <h1 class="title">Welcome to ZALVY, ${data.recipientName || "Intern"} 🎉</h1>
    <p class="body">We're thrilled to extend an offer for you to join the <strong>${data.internshipTitle || "ZALVY Internship Program"}</strong>. Your background and potential stood out, and we're excited about what you'll build with us.</p>
    
    <div class="divider"></div>
    
    <div class="detail-row">
      <span class="detail-label">Position</span>
      <span class="detail-value">${data.internshipTitle || "AI Engineering Intern"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Duration</span>
      <span class="detail-value">${data.startDate} – ${data.endDate}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Stipend</span>
      <span class="detail-value">${data.stipend || "$9,800/month"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Location</span>
      <span class="detail-value">INDIA (relocation support provided)</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Mentor</span>
      <span class="detail-value">${data.mentorName || "Senior Staff Engineer (assigned on Day 1)"}</span>
    </div>
    
    <div class="divider"></div>
    
    <p class="body"><strong>What happens next:</strong></p>
    <ol class="body" style="padding-left: 20px; margin-bottom: 24px;">
      <li style="margin-bottom: 8px;">Click the button below to accept this offer</li>
      <li style="margin-bottom: 8px;">You'll receive onboarding docs and equipment shipping details</li>
      <li style="margin-bottom: 8px;">Your project will be scoped with your mentor before Day 1</li>
    </ol>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.dashboardUrl || "https://app.zalvy.com/onboarding"}" class="btn">Accept Offer & Begin Onboarding</a>
    </div>
    
    <p class="body" style="font-size: 13px; color: #718096;">This offer expires in 7 days. Questions? Reply to this email — a real engineer will respond.</p>
  `;

  return wrapTemplate(content, `ZALVY Offer Letter: ${data.internshipTitle || "Internship Position"}`);
}

export function projectAssignmentTemplate(data: EmailTemplateData): string {
  const content = `
    <h1 class="title">Your Project Assignment: ${data.projectTitle || "New Project"}</h1>
    <p class="body">Welcome to your project, ${data.recipientName || "Intern"}! Your mentor <strong>${data.mentorName || "your assigned mentor"}</strong> has scoped a production-ready project for you.</p>
    
    <div class="divider"></div>
    
    <div class="detail-row">
      <span class="detail-label">Project</span>
      <span class="detail-value">${data.projectTitle}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Description</span>
      <span class="detail-value" style="text-align: left;">${data.projectDescription || "Production feature scoped for 4–12 week delivery"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Mentor</span>
      <span class="detail-value">${data.mentorName}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Repository</span>
      <span class="detail-value">GitHub: zalvy/${data.projectTitle?.toLowerCase().replace(/\s+/g, "-") || "intern-project"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Timeline</span>
      <span class="detail-value">${data.startDate} – ${data.endDate}</span>
    </div>
    
    <div class="divider"></div>
    
    <p class="body"><strong>Your first steps:</strong></p>
    <ol class="body" style="padding-left: 20px; margin-bottom: 24px;">
      <li style="margin-bottom: 8px;">Clone the repo and complete the setup guide in <code>SETUP.md</code></li>
      <li style="margin-bottom: 8px;">Schedule your kickoff sync with ${data.mentorName} (Calendly link in onboarding portal)</li>
      <li style="margin-bottom: 8px;">Review the architecture doc and success metrics in <code>ARCHITECTURE.md</code></li>
    </ol>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.dashboardUrl || "https://github.com/zalvy"}" class="btn">Open Project Repository</a>
    </div>
  `;

  return wrapTemplate(content, `Project Assignment: ${data.projectTitle || "New Project"}`);
}

export function completionEmailTemplate(data: EmailTemplateData): string {
  const content = `
    <h1 class="title">Congratulations, ${data.recipientName || "Graduate"}! 🎓</h1>
    <p class="body">You've successfully completed the ZALVY Internship Program. You shipped production code, contributed to our platform, and grew as an engineer. We're proud of what you've accomplished.</p>
    
    <div class="divider"></div>
    
    <div style="text-align: center; margin: 24px 0;">
      <span class="badge badge-success">PROGRAM COMPLETED</span>
    </div>
    
    <div class="detail-row">
      <span class="detail-label">Certificate</span>
      <span class="detail-value">${data.certificateNumber || "ZLV-2026-XXXX"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Verification Hash</span>
      <span class="detail-value" style="font-family: monospace; font-size: 12px;">${data.verificationHash || "0x..."}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Verification URL</span>
      <span class="detail-value"><a href="${data.verificationUrl || "https://zalvy.com/verify"}" style="color: #60a5fa;">zalvy.com/verify</a></span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Project Completed</span>
      <span class="detail-value">${data.projectTitle || "Production Feature"}</span>
    </div>
    
    <div class="divider"></div>
    
    <p class="body">Your digital certificate is cryptographically signed and verifiable by any employer. Share the verification link above on LinkedIn, your resume, or with recruiters.</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.verificationUrl || "https://zalvy.com/verify"}" class="btn">View & Share Your Certificate</a>
    </div>
    
    <p class="body">Over 80% of ZALVY interns receive full-time offers. If you're interested in continuing with us, reply to this email and we'll connect you with the hiring team.</p>
  `;

  return wrapTemplate(content, `ZALVY Internship Completed: ${data.certificateNumber || "Certificate"}`);
}

export function paymentReminderTemplate(data: EmailTemplateData): string {
  const content = `
    <h1 class="title">Payment Reminder: Stipend Processing</h1>
    <p class="body">Hi ${data.recipientName || "Intern"}, this is a friendly reminder that your monthly stipend of <strong>${data.stipend || "$9,800"}</strong> is scheduled for processing.</p>
    
    <div class="divider"></div>
    
    <div class="detail-row">
      <span class="detail-label">Amount</span>
      <span class="detail-value">${data.stipend || "$9,800"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Period</span>
      <span class="detail-value">${data.startDate} – ${data.endDate}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Status</span>
      <span class="detail-value"><span class="badge badge-warning">Awaiting Payment Proof</span></span>
    </div>
    
    <div class="divider"></div>
    
    <p class="body">Please upload your payment proof (bank screenshot, transaction ID) to the dashboard within 48 hours to avoid delays.</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.dashboardUrl || "https://app.zalvy.com/payments"}" class="btn">Upload Payment Proof</a>
    </div>
  `;

  return wrapTemplate(content, `Payment Reminder: ${data.stipend || "Stipend"}`);
}

export function paymentVerifiedTemplate(data: EmailTemplateData): string {
  const content = `
    <h1 class="title">Payment Verified ✅</h1>
    <p class="body">Hi ${data.recipientName || "Intern"}, your payment proof has been verified and your stipend of <strong>${data.stipend || "$9,800"}</strong> has been processed successfully.</p>
    
    <div class="divider"></div>
    
    <div style="text-align: center; margin: 24px 0;">
      <span class="badge badge-success">PAYMENT CONFIRMED</span>
    </div>
    
    <div class="detail-row">
      <span class="detail-label">Amount</span>
      <span class="detail-value">${data.stipend || "$9,800"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Transaction ID</span>
      <span class="detail-value" style="font-family: monospace; font-size: 12px;">${data.verificationHash || "TXN-XXXXXX"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Date</span>
      <span class="detail-value">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
    </div>
    
    <div class="divider"></div>
    
    <p class="body">Funds will appear in your account within 1-2 business days. Thank you for your continued contributions to ZALVY!</p>
  `;

  return wrapTemplate(content, `Payment Confirmed: ${data.stipend || "Stipend"}`);
}

export function enterpriseLeadNotificationTemplate(data: EmailTemplateData): string {
  const content = `
    <h1 class="title">New Enterprise Inquiry 📥</h1>
    <p class="body">A new enterprise lead has been submitted via the ZALVY contact form.</p>
    
    <div class="divider"></div>
    
    <div class="detail-row">
      <span class="detail-label">Name</span>
      <span class="detail-value">${data.recipientName || "—"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Email</span>
      <span class="detail-value"><a href="mailto:${data.companyName || "—"}" style="color: #60a5fa;">${data.companyName || "—"}</a></span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Company</span>
      <span class="detail-value">${data.companyName || "—"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Intent</span>
      <span class="detail-value"><span class="badge badge-info">Enterprise Partnership</span></span>
    </div>
    
    <div class="divider"></div>
    
    <p class="body"><strong>Message:</strong></p>
    <div class="code-block">${data.projectDescription || "No message provided"}</div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.dashboardUrl || "https://app.zalvy.com/admin/leads"}" class="btn">View in Dashboard</a>
    </div>
  `;

  return wrapTemplate(content, `New Enterprise Lead: ${data.companyName || "Unknown Company"}`);
}

export function internshipApplicationNotificationTemplate(data: EmailTemplateData): string {
  const content = `
    <h1 class="title">New Internship Application 📝</h1>
    <p class="body">A new application has been submitted for the ZALVY Internship Program.</p>
    
    <div class="divider"></div>
    
    <div class="detail-row">
      <span class="detail-label">Applicant</span>
      <span class="detail-value">${data.recipientName || "—"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Email</span>
      <span class="detail-value"><a href="mailto:${data.companyName || "—"}" style="color: #60a5fa;">${data.companyName || "—"}</a></span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Program</span>
      <span class="detail-value">${data.internshipTitle || "ZALVY Internship"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Cohort</span>
      <span class="detail-value">${data.startDate} – ${data.endDate}</span>
    </div>
    
    <div class="divider"></div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.dashboardUrl || "https://app.zalvy.com/admin/applications"}" class="btn">Review Application</a>
    </div>
  `;

  return wrapTemplate(content, `New Internship Application: ${data.recipientName || "Applicant"}`);
}