'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, UserCheck, Bell, Database } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-transparent relative">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90">Your privacy and data security are our top priorities</p>
          <p className="text-sm opacity-75 mt-4">Last Updated: September 2, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to Bharat Niyojak ("we," "our," or "us"). We are committed to protecting your 
              personal information and your right to privacy. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our civic issue reporting platform.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <Database className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">1. Information We Collect</h2>
            </div>
            
            <div className="space-y-6 pl-16">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Name, email address, and phone number</li>
                  <li>Profile picture (optional)</li>
                  <li>Government-issued ID for verification (optional)</li>
                  <li>Address and location information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Issue Report Data</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Photos and videos of civic issues</li>
                  <li>GPS coordinates and location data</li>
                  <li>Issue descriptions and categories</li>
                  <li>Timestamps of reports</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Technical Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Device information (type, OS, browser)</li>
                  <li>IP address and usage data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">2. How We Use Your Information</h2>
            </div>
            
            <ul className="list-disc list-inside space-y-3 text-gray-700 pl-16">
              <li>To process and route your civic issue reports to appropriate authorities</li>
              <li>To send you notifications about report status updates</li>
              <li>To improve our AI algorithms and service quality</li>
              <li>To authenticate your identity and prevent fraud</li>
              <li>To provide customer support and respond to inquiries</li>
              <li>To comply with legal obligations and government requests</li>
              <li>To analyze platform usage and generate anonymized statistics</li>
            </ul>
          </div>

          {/* Information Sharing */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">3. Information Sharing</h2>
            </div>
            
            <div className="space-y-4 pl-16 text-gray-700">
              <p className="font-semibold">We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Government Authorities:</strong> Issue reports are shared with relevant municipal departments</li>
                <li><strong>Service Providers:</strong> Third-party vendors who assist in platform operations</li>
                <li><strong>Legal Compliance:</strong> When required by law or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
              </ul>
              <p className="font-semibold mt-6">We do NOT:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Sell your personal information to third parties</li>
                <li>Share your data for marketing purposes without consent</li>
                <li>Disclose sensitive information publicly</li>
              </ul>
            </div>
          </div>

          {/* Data Security */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">4. Data Security</h2>
            </div>
            
            <div className="space-y-4 pl-16 text-gray-700">
              <p>We implement industry-standard security measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>End-to-end encryption for data transmission</li>
                <li>Secure server infrastructure with regular security audits</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular backups and disaster recovery protocols</li>
                <li>Employee training on data protection practices</li>
              </ul>
              <p className="mt-4 italic">
                While we strive to protect your data, no method of transmission over the internet 
                is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </div>

          {/* Your Rights */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">5. Your Privacy Rights</h2>
            </div>
            
            <ul className="list-disc list-inside space-y-3 text-gray-700 pl-16">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Data Portability:</strong> Export your data in a structured format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Withdraw Consent:</strong> Revoke permissions for data processing</li>
            </ul>
            <p className="text-gray-700 pl-16 mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@bharatniyojak.in" className="text-primary-600 hover:underline">privacy@bharatniyojak.in</a>
            </p>
          </div>

          {/* Cookies */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <div className="text-gray-700 space-y-3">
              <p>We use cookies and similar technologies to enhance your experience:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p>You can control cookies through your browser settings.</p>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700">
              Our platform is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children. If you believe we have collected information 
              from a child, please contact us immediately.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy periodically. We will notify you of material changes 
              via email or platform notification. Your continued use of the platform after changes 
              constitutes acceptance of the updated policy.
            </p>
          </div>

          {/* Contact */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">
                If you have questions or concerns about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:privacy@bharatniyojak.in" className="text-primary-600 hover:underline">privacy@bharatniyojak.in</a></p>
                <p><strong>Phone:</strong> +91 123 456 7890</p>
                <p><strong>Address:</strong> Bharat Niyojak Office, New Delhi, India</p>
              </div>
            </div>
          </div>

          {/* India Flag */}
          <div className="h-1 w-full flex rounded-full overflow-hidden mt-12">
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
