'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Disclaimer</h1>
          <p className="text-xl opacity-90">Important information about using Bharat Niyojak</p>
          <p className="text-sm opacity-75 mt-4">Last Updated: September 2, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-12">
            <p className="text-gray-800 font-semibold">
              Please read this disclaimer carefully before using the Bharat Niyojak platform. 
              Your use of our services indicates your acceptance of this disclaimer.
            </p>
          </div>

          {/* General Disclaimer */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. General Information</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Bharat Niyojak is an independent technology platform that facilitates the reporting 
                of civic issues to relevant government authorities. We are NOT:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>A government agency or official government service</li>
                <li>Affiliated with any specific municipal corporation or government body</li>
                <li>Responsible for government response times or actions</li>
                <li>A substitute for official emergency services</li>
              </ul>
            </div>
          </div>

          {/* Service Limitations */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Service Limitations</h2>
            <div className="text-gray-700 space-y-4">
              <p><strong>Platform Role:</strong></p>
              <p>
                Bharat Niyojak acts solely as an intermediary to facilitate communication between 
                citizens and government authorities. We forward your reports but cannot guarantee:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>That authorities will respond to or resolve reported issues</li>
                <li>Any specific timeline for issue resolution</li>
                <li>The quality or adequacy of government response</li>
                <li>That all issues will be addressed or prioritized</li>
              </ul>
            </div>
          </div>

          {/* AI Technology */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. AI Technology Disclaimer</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Our AI-powered issue detection and routing system is provided for convenience and 
                assistance purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>AI classifications may not always be 100% accurate</li>
                <li>Users should review and correct AI-generated categorizations</li>
                <li>We are not liable for errors or delays resulting from AI misclassification</li>
                <li>The AI is continuously learning and improving but may make mistakes</li>
              </ul>
            </div>
          </div>

          {/* Emergency Services */}
          <div className="mb-12">
            <div className="bg-red-50 border-2 border-red-500 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3" />
                4. Emergency Services Warning
              </h2>
              <div className="text-gray-800 space-y-3">
                <p className="font-bold">
                  IMPORTANT: Bharat Niyojak is NOT an emergency service!
                </p>
                <p>
                  For life-threatening emergencies, fires, medical emergencies, or crimes in progress, 
                  IMMEDIATELY contact official emergency services:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4 font-semibold">
                  <li>Police: 100</li>
                  <li>Fire: 101</li>
                  <li>Ambulance: 102 or 108</li>
                  <li>Women Helpline: 1091</li>
                  <li>National Emergency Number: 112</li>
                </ul>
                <p className="mt-4">
                  Do NOT use our platform for urgent, time-sensitive, or emergency situations.
                </p>
              </div>
            </div>
          </div>

          {/* Accuracy of Information */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Accuracy of Information</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                While we strive to maintain accurate and up-to-date information:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>We cannot guarantee the accuracy of user-submitted reports</li>
                <li>Status updates depend on information from government departments</li>
                <li>We are not responsible for outdated or incorrect information</li>
                <li>Users should independently verify critical information</li>
              </ul>
            </div>
          </div>

          {/* Liability */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Limitation of Liability</h2>
            <div className="text-gray-700 space-y-4">
              <p>To the maximum extent permitted by law:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>We are not liable for any damages arising from the use or inability to use our platform</li>
                <li>We do not guarantee uninterrupted, timely, secure, or error-free service</li>
                <li>We are not responsible for government inaction or delayed responses</li>
                <li>Users assume all risks associated with using the platform</li>
                <li>Our total liability is limited to the amount you paid for services (if any)</li>
              </ul>
            </div>
          </div>

          {/* User Responsibility */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. User Responsibility</h2>
            <div className="text-gray-700 space-y-4">
              <p>Users are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Providing accurate and truthful information</li>
                <li>Not submitting false, fraudulent, or misleading reports</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Respecting privacy and not photographing people without consent</li>
                <li>Not using the platform for harassment or malicious purposes</li>
              </ul>
            </div>
          </div>

          {/* Third-Party Links */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Third-Party Content</h2>
            <p className="text-gray-700">
              Our platform may contain links to third-party websites or services. We are not 
              responsible for the content, privacy policies, or practices of third-party sites. 
              Access such sites at your own risk.
            </p>
          </div>

          {/* No Warranty */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. No Warranty</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                The platform is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, 
                either express or implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Warranties of merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Security or accuracy of data</li>
              </ul>
            </div>
          </div>

          {/* Changes */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Changes to Disclaimer</h2>
            <p className="text-gray-700">
              We reserve the right to modify this disclaimer at any time. Material changes will be 
              notified through the platform. Your continued use after changes constitutes acceptance 
              of the updated disclaimer.
            </p>
          </div>

          {/* Contact */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">
                Questions about this disclaimer? Contact us:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> <a href="mailto:legal@bharatniyojak.in" className="text-primary-600 hover:underline">legal@bharatniyojak.in</a>
              </p>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-r-lg">
            <p className="text-gray-800 font-semibold">
              By using Bharat Niyojak, you acknowledge that you have read, understood, and agree to 
              this disclaimer and its terms.
            </p>
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
