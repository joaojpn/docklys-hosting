import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

type Props = {
  onBack: () => void
}

export function TermsOfService({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.button onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-8"
          whileHover={{ x: -2 }}>
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </motion.button>

        <div className="mb-10">
          <h1 className="text-[28px] font-bold tracking-tight mb-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            Terms of Service
          </h1>
          <p className="text-[13px] text-muted-foreground">Last updated: April 15, 2026 · Effective: April 15, 2026</p>
        </div>

        <div className="space-y-8 text-[14px] leading-relaxed text-foreground/80">

          <section className="p-4 rounded-xl bg-muted/20 border border-border/40">
            <p className="text-[13px]">
              Please read these Terms of Service carefully before using Nuvee. By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, you must not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">1. The Parties</h2>
            <p>These Terms constitute a legally binding agreement between you ("User") and <strong>Nuvee</strong>, a company incorporated in the State of Delaware, United States of America ("Company", "we", "us", or "our"). Our services are available globally, including to users in Brazil, subject to applicable local laws.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p className="mb-2">Nuvee ("the Platform") is a self-hosted infrastructure platform for deploying and managing bots for Discord, Telegram, WhatsApp, and other messaging services. The Platform provides:</p>
            <ul className="space-y-1 list-disc list-inside text-foreground/70">
              <li>Containerized application deployment via Docker</li>
              <li>Real-time log monitoring and file management</li>
              <li>Environment variable and secret management</li>
              <li>Application lifecycle management (start, stop, restart)</li>
            </ul>
            <p className="mt-3">The Platform is currently provided <strong>free of charge</strong> during its Early Access period. We reserve the right to introduce paid plans in the future with reasonable notice.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">3. Eligibility</h2>
            <p>You must be at least 18 years old to use the Platform. By creating an account, you represent that you are of legal age and have the authority to enter into these Terms. If you are using the Platform on behalf of an organization, you represent that you have authority to bind that organization.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">4. Prohibited Uses</h2>
            <p className="mb-3">You agree not to use the Platform to deploy, host, execute, or facilitate any application or activity that:</p>
            <ul className="space-y-2 list-none">
              {[
                'Contains or distributes malware, viruses, trojans, ransomware, spyware, or any malicious code',
                'Performs or facilitates Distributed Denial of Service (DDoS) or other cyberattacks',
                'Sends unsolicited bulk communications (spam) via any channel',
                'Mines cryptocurrency without explicit authorization from all affected parties',
                'Stores, distributes, or processes child sexual abuse material (CSAM) or any illegal content',
                'Violates the intellectual property rights of any third party',
                'Circumvents, disables, or interferes with security features of any system',
                'Engages in phishing, identity theft, or fraud',
                'Violates any applicable local, national, or international law or regulation',
                'Interferes with or disrupts the integrity or performance of the Platform',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5 shrink-0 font-bold">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">Violation of this section may result in immediate account termination and may be reported to relevant law enforcement authorities.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">5. Account Security and Responsibilities</h2>
            <p className="mb-2">You are solely responsible for:</p>
            <ul className="space-y-1 list-disc list-inside text-foreground/70">
              <li>Maintaining the confidentiality of your login credentials and two-factor authentication codes</li>
              <li>All activities that occur under your account, whether authorized or not</li>
              <li>Ensuring your deployed applications comply with all applicable laws and third-party terms of service</li>
              <li>Promptly notifying us of any unauthorized access to your account</li>
            </ul>
            <p className="mt-3">We strongly recommend enabling Two-Factor Authentication (2FA) to protect your account.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">6. Service Availability and SLA</h2>
            <p className="mb-2">The Platform is provided on an "as available" basis. During the Early Access period:</p>
            <ul className="space-y-1 list-disc list-inside text-foreground/70">
              <li>We do not guarantee any specific level of uptime or availability</li>
              <li>Scheduled and unscheduled maintenance may cause temporary service interruptions</li>
              <li>We are not liable for any losses resulting from service unavailability</li>
            </ul>
            <p className="mt-3">We will make reasonable efforts to notify users of planned maintenance in advance via Discord or email.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">7. Billing and Refunds</h2>
            <p className="mb-2">The Platform is currently <strong>free of charge</strong>. In the event that paid plans are introduced:</p>
            <ul className="space-y-2 list-disc list-inside text-foreground/70">
              <li>All fees will be displayed clearly before purchase</li>
              <li><strong>Refunds:</strong> Requests made within 7 days of the initial purchase may be eligible for a full refund, provided that no more than 10% of the plan resources have been consumed</li>
              <li><strong>No refunds</strong> will be issued for accounts terminated due to violations of these Terms</li>
              <li><strong>Chargebacks:</strong> Filing a chargeback without first contacting us constitutes a breach of these Terms and may result in permanent account suspension</li>
              <li>We reserve the right to modify pricing with at least 30 days prior notice to existing subscribers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">8. Data, Logs and Retention</h2>
            <p className="mb-2">You acknowledge and agree that:</p>
            <ul className="space-y-1 list-disc list-inside text-foreground/70">
              <li>Application logs are retained for up to 90 days after bot deletion</li>
              <li>Security and audit logs are retained indefinitely for legal compliance</li>
              <li>Uploaded ZIP files are retained in secure quarantine storage for 90 days before permanent deletion</li>
              <li>SHA-256 hashes of uploaded files are stored permanently for audit purposes</li>
              <li>IP addresses are logged for security events and retained for 90 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">9. Intellectual Property</h2>
            <p className="mb-2">You retain all intellectual property rights to the code and content you deploy on the Platform. By using the Platform, you grant us a limited license to host and operate your applications solely for the purpose of providing the service. The Platform itself, including its source code (open-sourced under the MIT License), branding, and documentation, remains the property of Nuvee.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">10. DMCA and Copyright</h2>
            <p>We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). If you believe content hosted on the Platform infringes your copyright, please contact us through our Discord with the following information: identification of the copyrighted work, identification of the infringing material, your contact information, and a statement of good faith belief that the use is unauthorized.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">11. Law Enforcement and Legal Requests</h2>
            <p>We cooperate with law enforcement authorities when required by a valid court order, subpoena, or other legal process issued by competent authorities in the United States, Brazil, or other applicable jurisdictions. We will endeavor to notify affected users of such requests unless prohibited by law or court order.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">12. Export Controls</h2>
            <p>The Platform may be subject to U.S. export control laws and regulations. You represent that you are not located in, or a national or resident of, any country subject to U.S. government embargo, and that you are not on any U.S. government list of prohibited or restricted parties.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">13. Disclaimer of Warranties</h2>
            <p>THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE FROM HARMFUL COMPONENTS.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">14. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NUVEE AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING FROM YOUR USE OF OR INABILITY TO USE THE PLATFORM, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">15. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless Nuvee and its affiliates, officers, directors, and employees from and against any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Platform, your violation of these Terms, or your violation of any third-party rights.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">16. Termination</h2>
            <p>We reserve the right to suspend or terminate your account immediately and without prior notice if you violate these Terms. Upon termination, all running containers will be stopped, and your data will be scheduled for deletion in accordance with our retention policy. You may also delete your account at any time from the Profile settings.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">17. Governing Law and Dispute Resolution</h2>
            <p className="mb-2">These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles. For users in Brazil, mandatory consumer protection provisions under Brazilian law (including the LGPD and the Consumer Defense Code) shall apply to the extent required by law.</p>
            <p>Any disputes arising from these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration in accordance with the rules of the American Arbitration Association, conducted in Delaware, USA.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">18. Changes to These Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Material changes will be communicated with at least 30 days notice via email or a prominent notice on the Platform. Continued use of the Platform after the effective date constitutes acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground mb-3">19. Contact Information</h2>
            <p>For questions about these Terms, please contact us through our <a href="https://discord.gg/ke5V4NeQ49" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Discord community</a> or via GitHub Issues at <a href="https://github.com/joaojpn/docklys-hosting" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">github.com/joaojpn/docklys-hosting</a>.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
