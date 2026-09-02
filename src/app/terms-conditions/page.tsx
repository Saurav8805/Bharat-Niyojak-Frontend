'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, AlertCircle, Scale, UserCheck } from 'lucide-react';

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-transparent relative">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl opacity-90">Please read these terms carefully before using our platform</p>
          <p className="text-sm opacity-75 mt-4">Last Updated: September 2, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to Bharat Niyojak. These Terms and Conditions ("Terms") govern your access to and 
              use of our civic issue reporting platform, including our website, mobile applications, and 
              related services (collectively, the "Platform"). By accessing or using the Platform, you 
              agree to be bound by these Terms.
            </p>
          </div>

          {/* Acceptance */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <UserCheck className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            
            <div className="space-y-4 pl-16 text-gray-700">
              <p>By creating an account or using our Platform, you confirm that:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>You are at least 18 years old or have parental/guardian consent</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You will comply with all applicable laws and regulations</li>
                <li>All information you provide is accurate and truthful</li>
              </ul>
            </div>
          </div>

          {/* User Account */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. User Account</h2>
            
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Registration</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>You must create an account to report civic issues</li>
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password confidential and secure</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Account Responsibility</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>You are responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>One account per person; no sharing accounts</li>
                  <li>We reserve the right to suspend or terminate accounts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Platform Use */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Acceptable Use</h2>
            
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">You May:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Report legitimate civic issues within your community</li>
                  <li>Upload photos/videos of infrastructure problems</li>
                  <li>Track the status of your submitted reports</li>
                  <li>Engage with community features responsibly</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">You May NOT:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Submit false, fraudulent, or misleading reports</li>
                  <li>Upload inappropriate, offensive, or harmful content</li>
                  <li>Harass, abuse, or threaten other users or authorities</li>
                  <li>Violate any laws or regulations</li>
                  <li>Attempt to hack, disrupt, or damage the Platform</li>
                  <li>Use automated tools (bots) without authorization</li>
                  <li>Impersonate others or misrepresent your identity</li>
                  <li>Collect user data without consent</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. User Content</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>When you submit content (reports, photos, comments):</p>
              <ul className="list-disc list-inside space-y-2">
                <li>You retain ownership of your content</li>
                <li>You grant us a license to use, display, and share your content with relevant authorities</li>
                <li>You represent that you have the right to submit the content</li>
                <li>You acknowledge that reports may be made public for transparency</li>
                <li>We reserve the right to remove inappropriate content</li>
              </ul>
            </div>
          </div>

          {/* AI Disclaimer */}
          <div className="mb-12">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">5. AI Technology Disclaimer</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Our AI-powered issue detection and routing:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Is provided on an "as-is" basis for assistance purposes</li>
                    <li>May not be 100% accurate in all cases</li>
                    <li>Should not be solely relied upon for critical decisions</li>
                    <li>Continuously improves through machine learning</li>
                    <li>Users can manually correct AI classifications</li>
                  </ul>
                  <p className="font-semibold mt-4">
                    We are not liable for errors or delays resulting from AI misclassification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Liability */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <Scale className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">6. Limitation of Liability</h2>
            </div>
            
            <div className="space-y-4 pl-16 text-gray-700">
              <p>To the maximum extent permitted by law:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>We provide the Platform "as-is" without warranties</li>
                <li>We are not responsible for government response times or actions</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to the amount you paid us (if any)</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
              </ul>
            </div>
          </div>

          {/* Government Relationship */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Government Relationship</h2>
            <div className="space-y-4 text-gray-700">
              <p className="font-semibold">Important Notice:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Bharat Niyojak is an independent platform facilitating civic reporting</li>
                <li>We are NOT a government entity or official government service</li>
                <li>We forward reports to appropriate authorities but do not control their actions</li>
                <li>Response times and resolution depend on government departments</li>
                <li>For emergencies, contact official emergency services (100, 101, 102, 108)</li>
              </ul>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Intellectual Property</h2>
            <div className="text-gray-700 space-y-3">
              <p>All Platform content, features, and functionality are owned by Bharat Niyojak:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Logos, trademarks, and brand elements</li>
                <li>Software, algorithms, and AI models</li>
                <li>Design, layout, and user interface</li>
                <li>Documentation and support materials</li>
              </ul>
              <p className="mt-4">Unauthorized use, reproduction, or distribution is prohibited.</p>
            </div>
          </div>

          {/* Termination */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Termination</h2>
            <div className="text-gray-700 space-y-3">
              <p>We may suspend or terminate your account if you:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Violate these Terms or applicable laws</li>
                <li>Submit fraudulent or abusive reports</li>
                <li>Engage in harmful or disruptive behavior</li>
                <li>Fail to respond to verification requests</li>
              </ul>
              <p className="mt-4">You may delete your account at any time from your profile settings.</p>
            </div>
          </div>

          {/* Changes */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. Material changes will be notified 
              via email or platform notification. Your continued use after changes constitutes acceptance 
              of the updated Terms.
            </p>
          </div>

          {/* Governing Law */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Governing Law</h2>
            <p className="text-gray-700">
              These Terms are governed by the laws of India. Any disputes shall be subject to the 
              exclusive jurisdiction of courts in New Delhi, India.
            </p>
          </div>

          {/* Contact */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">
                For questions about these Terms, contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:legal@bharatniyojak.in" className="text-primary-600 hover:underline">legal@bharatniyojak.in</a></p>
                <p><strong>Phone:</strong> +91 123 456 7890</p>
                <p><strong>Address:</strong> Bharat Niyojak Office, New Delhi, India</p>
              </div>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-r-lg mb-12">
            <p className="text-gray-800 font-semibold">
              By using Bharat Niyojak, you acknowledge that you have read, understood, and agree to be 
              bound by these Terms and Conditions.
            </p>
          </div>

          {/* India Flag */}
          <div className="h-1 w-full flex rounded-full overflow-hidden">
            <div className="flex-1 bg-india-saffron"></div>
            <div className="flex-1 bg-india-white"></div>
            <div className="flex-1 bg-india-green"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
