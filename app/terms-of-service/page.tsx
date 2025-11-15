import Link from "next/link";
import { ArrowLeft, FileText, Scale, AlertTriangle, BookOpen, Shield, Ban } from "lucide-react";

export const metadata = {
  title: "Terms of Service - Yemesahft Alem",
  description: "Terms of Service for Yemesahft Alem Book Store",
};

export default function TermsOfService() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-3 rounded-full">
            <Scale className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-gray-600 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using Yemesahft Alem ("the Website" or "our service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of our website, including any content, functionality, and services offered on or through the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              2. Use of Service
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2.1 Eligibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  You must be at least 13 years old to use our service. By using the Website, you represent and warrant that you meet this age requirement.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2.2 Permitted Use</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  You may use our service for lawful purposes only. You agree to use the Website in accordance with all applicable laws and regulations.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You are granted a limited, non-exclusive, non-transferable license to access and use the Website for personal, non-commercial purposes.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Ban className="w-6 h-6 text-blue-600" />
              3. Prohibited Activities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Violating any applicable local, state, national, or international law or regulation</li>
              <li>Transmitting any malicious code, viruses, or harmful data</li>
              <li>Attempting to gain unauthorized access to any portion of the Website</li>
              <li>Interfering with or disrupting the Website or servers connected to the Website</li>
              <li>Reproducing, duplicating, copying, or reselling any portion of the Website without permission</li>
              <li>Using automated systems (bots, scrapers) to access the Website without authorization</li>
              <li>Impersonating any person or entity or misrepresenting your affiliation with any person or entity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              4. Intellectual Property Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Website and its original content, features, and functionality are owned by Yemesahft Alem and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              All book content, including but not limited to text, images, and downloadable files, are the property of their respective copyright holders. We respect intellectual property rights and expect our users to do the same.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Book Downloads and Content</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">5.1 Download Rights</h3>
                <p className="text-gray-700 leading-relaxed">
                  Books available for download are provided for personal, non-commercial use only. You may not redistribute, sell, or commercially exploit any downloaded content.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">5.2 Copyright Compliance</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for ensuring that your use of downloaded content complies with applicable copyright laws. We are not responsible for any copyright infringement resulting from your use of downloaded materials.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
              6. Disclaimers and Limitations of Liability
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">6.1 Service Availability</h3>
                <p className="text-gray-700 leading-relaxed">
                  We strive to provide continuous access to our service, but we do not guarantee that the Website will be available at all times. The Website may be unavailable due to maintenance, updates, or circumstances beyond our control.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">6.2 Content Accuracy</h3>
                <p className="text-gray-700 leading-relaxed">
                  While we make every effort to ensure the accuracy of information on our Website, we do not warrant that all content is complete, accurate, or up-to-date. We reserve the right to make changes to content at any time without notice.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">6.3 Limitation of Liability</h3>
                <p className="text-gray-700 leading-relaxed">
                  To the fullest extent permitted by law, Yemesahft Alem shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Website.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you create an account on our Website, you are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Ensuring that all information provided is accurate and current</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Links and Services</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Website may contain links to third-party websites or services that are not owned or controlled by Yemesahft Alem. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused by your use of any third-party content, goods, or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to terminate or suspend your access to the Website immediately, without prior notice or liability, for any reason, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Breach of these Terms of Service</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Request by law enforcement or other government agencies</li>
              <li>Extended periods of inactivity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. Your continued use of the Website after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Ethiopia, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Website shall be subject to the exclusive jurisdiction of the courts of Ethiopia.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                <strong>Email:</strong> support@yemesahftalem.com
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Telegram:</strong> <a href="https://t.me/Yemesahft_Alem" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">@Yemesahft_Alem</a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Acknowledgment</h2>
            <p className="text-gray-700 leading-relaxed">
              By using Yemesahft Alem, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these Terms, you must not use our service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

