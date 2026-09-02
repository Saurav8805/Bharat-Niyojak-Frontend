'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Camera, Upload, Brain, Send, Bell, CheckCircle, BarChart } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            How It Works
          </h1>
          <p className="text-base md:text-lg opacity-90">
            Simple, Fast, and Intelligent - Report civic issues in 3 easy steps
          </p>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Step 1 */}
          <div className="mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-block px-3 py-1.5 bg-blue-100 text-blue-600 rounded-full font-bold text-xs mb-3">
                  Step 1
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Capture the Issue</h2>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  See a pothole, garbage pile, or broken streetlight? Simply take a photo using your 
                  smartphone camera or upload an existing image from your gallery.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: <Camera className="w-5 h-5" />, text: 'Use your phone camera or upload from gallery' },
                    { icon: <Upload className="w-5 h-5" />, text: 'Add multiple photos for better context' },
                    { icon: <CheckCircle className="w-5 h-5" />, text: 'GPS automatically captures location' }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600">
                        {item.icon}
                      </div>
                      <span className="text-sm text-gray-700 mt-1.5">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 text-center">
                <Camera className="w-24 h-24 mx-auto text-blue-600 mb-4" />
                <p className="text-lg font-bold text-gray-800">Take a Photo</p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="md:order-2">
                <div className="inline-block px-3 py-1.5 bg-purple-100 text-purple-600 rounded-full font-bold text-xs mb-3">
                  Step 2
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Analyzes & Routes</h2>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Our advanced AI instantly analyzes your photo, identifies the issue type, assesses 
                  severity, and automatically routes it to the correct government department.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: <Brain className="w-5 h-5" />, text: 'AI identifies issue category (pothole, garbage, etc.)' },
                    { icon: <BarChart className="w-5 h-5" />, text: 'Severity assessment (low, medium, high, critical)' },
                    { icon: <Send className="w-5 h-5" />, text: 'Auto-routing to correct municipal department' }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 text-purple-600">
                        {item.icon}
                      </div>
                      <span className="text-sm text-gray-700 mt-1.5">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:order-1 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-8 text-center">
                <Brain className="w-24 h-24 mx-auto text-purple-600 mb-4" />
                <p className="text-lg font-bold text-gray-800">AI Processing</p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-block px-3 py-1.5 bg-green-100 text-green-600 rounded-full font-bold text-xs mb-3">
                  Step 3
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Track & Get Resolved</h2>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Monitor real-time status updates on your dashboard. Receive notifications as your 
                  issue progresses from 'Reported' to 'Resolved'.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: <Bell className="w-5 h-5" />, text: 'Real-time push notifications on status changes' },
                    { icon: <BarChart className="w-5 h-5" />, text: 'View progress timeline and department actions' },
                    { icon: <CheckCircle className="w-5 h-5" />, text: 'Verify resolution with before/after photos' }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 text-green-600">
                        {item.icon}
                      </div>
                      <span className="text-sm text-gray-700 mt-1.5">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 text-center">
                <CheckCircle className="w-24 h-24 mx-auto text-green-600 mb-4" />
                <p className="text-lg font-bold text-gray-800">Issue Resolved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Lifecycle */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Issue Status Lifecycle</h2>
            <p className="text-base text-gray-600">Track your report through every stage</p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { status: 'Reported', color: 'bg-blue-500', icon: '📝' },
              { status: 'Verified', color: 'bg-indigo-500', icon: '✓' },
              { status: 'Assigned', color: 'bg-purple-500', icon: '👷' },
              { status: 'In Progress', color: 'bg-orange-500', icon: '🔧' },
              { status: 'Resolved', color: 'bg-green-500', icon: '🎉' }
            ].map((stage, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <div className={`w-12 h-12 ${stage.color} rounded-full flex items-center justify-center mx-auto mb-3 text-xl`}>
                    {stage.icon}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{stage.status}</h3>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-400 text-lg">
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
