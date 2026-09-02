'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Camera, Upload, Brain, Send, Bell, CheckCircle, BarChart } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            How It Works
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Simple, Fast, and Intelligent - Report civic issues in 3 easy steps
          </p>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Step 1 */}
          <div className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-bold mb-4">
                  Step 1
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Capture the Issue</h2>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  See a pothole, garbage pile, or broken streetlight? Simply take a photo using your 
                  smartphone camera or upload an existing image from your gallery.
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: <Camera className="w-6 h-6" />, text: 'Use your phone camera or upload from gallery' },
                    { icon: <Upload className="w-6 h-6" />, text: 'Add multiple photos for better context' },
                    { icon: <CheckCircle className="w-6 h-6" />, text: 'GPS automatically captures location' }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600">
                        {item.icon}
                      </div>
                      <span className="text-lg text-gray-700 mt-2">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-3xl p-12 text-center">
                <Camera className="w-32 h-32 mx-auto text-blue-600 dark:text-blue-400 mb-6" />
                <p className="text-2xl font-bold text-gray-800 dark:text-white">Take a Photo</p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full font-bold mb-4">
                  Step 2
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">AI Analyzes & Routes</h2>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  Our advanced AI instantly analyzes your photo, identifies the issue type, assesses 
                  severity, and automatically routes it to the correct government department.
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: <Brain className="w-6 h-6" />, text: 'AI identifies issue category (pothole, garbage, etc.)' },
                    { icon: <BarChart className="w-6 h-6" />, text: 'Severity assessment (low, medium, high, critical)' },
                    { icon: <Send className="w-6 h-6" />, text: 'Auto-routing to correct municipal department' }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 text-purple-600">
                        {item.icon}
                      </div>
                      <span className="text-lg text-gray-700 mt-2">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:order-1 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-3xl p-12 text-center">
                <Brain className="w-32 h-32 mx-auto text-purple-600 dark:text-purple-400 mb-6" />
                <p className="text-2xl font-bold text-gray-800 dark:text-white">AI Processing</p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full font-bold mb-4">
                  Step 3
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Track & Get Resolved</h2>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  Monitor real-time status updates on your dashboard. Receive notifications as your 
                  issue progresses from 'Reported' to 'Resolved'.
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: <Bell className="w-6 h-6" />, text: 'Real-time push notifications on status changes' },
                    { icon: <BarChart className="w-6 h-6" />, text: 'View progress timeline and department actions' },
                    { icon: <CheckCircle className="w-6 h-6" />, text: 'Verify resolution with before/after photos' }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 text-green-600">
                        {item.icon}
                      </div>
                      <span className="text-lg text-gray-700 mt-2">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-3xl p-12 text-center">
                <CheckCircle className="w-32 h-32 mx-auto text-green-600 dark:text-green-400 mb-6" />
                <p className="text-2xl font-bold text-gray-800 dark:text-white">Issue Resolved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Lifecycle */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Issue Status Lifecycle</h2>
            <p className="text-xl text-gray-600">Track your report through every stage</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { status: 'Reported', color: 'bg-blue-500', icon: '📝' },
              { status: 'Verified', color: 'bg-indigo-500', icon: '✓' },
              { status: 'Assigned', color: 'bg-purple-500', icon: '👷' },
              { status: 'In Progress', color: 'bg-orange-500', icon: '🔧' },
              { status: 'Resolved', color: 'bg-green-500', icon: '🎉' }
            ].map((stage, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <div className={`w-16 h-16 ${stage.color} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl`}>
                    {stage.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{stage.status}</h3>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-400 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">See It In Action</h2>
          <p className="text-xl text-gray-600 mb-10">Watch how easy it is to report and track civic issues</p>
          <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center shadow-xl">
            <div className="text-center">
              <div className="text-8xl mb-4">🎬</div>
              <p className="text-2xl font-bold text-gray-700">Demo Video Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands making their cities better
          </p>
          <a 
            href="/register"
            className="inline-block px-10 py-4 bg-white text-primary-600 text-lg font-bold rounded-xl hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105"
          >
            Report Your First Issue
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
