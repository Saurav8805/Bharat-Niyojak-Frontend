'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, HelpCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-base opacity-90">We're here to help. Reach out anytime!</p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Have questions, feedback, or need support? We'd love to hear from you. 
                Our team is available to assist you with any inquiries.
              </p>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:support@bharatniyojak.in" className="text-sm text-primary-600 hover:underline">
                      support@bharatniyojak.in
                    </a>
                    <p className="text-xs text-gray-500 mt-0.5">For general inquiries</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Phone</h3>
                    <a href="tel:+911234567890" className="text-sm text-primary-600 hover:underline">
                      +91 123 456 7890
                    </a>
                    <p className="text-xs text-gray-500 mt-0.5">Mon-Fri, 9 AM - 6 PM IST</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Office</h3>
                    <p className="text-sm text-gray-700">
                      Bharat Niyojak Headquarters<br />
                      Connaught Place<br />
                      New Delhi - 110001, India
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-sm text-gray-700">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                <div className="flex items-center space-x-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-primary-600" />
                  <h3 className="text-base font-bold text-gray-900">Need Quick Help?</h3>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Check our FAQ section for instant answers to common questions.
                </p>
                <a 
                  href="/faq"
                  className="inline-block px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all"
                >
                  View FAQ
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
              
              {submitted && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                  ✓ Thank you! Your message has been sent successfully.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder="+91 1234567890"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                    <option value="press">Press & Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-sm rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Visit Our Office</h2>
            <p className="text-base text-gray-600">Located in the heart of New Delhi</p>
          </div>
          <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl shadow-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-3" />
              <p className="text-lg font-bold text-gray-700">Interactive Map</p>
              <p className="text-sm text-gray-600">Connaught Place, New Delhi</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
