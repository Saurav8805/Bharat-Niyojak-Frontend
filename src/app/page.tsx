'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Check, Zap, Shield, TrendingUp, Users, MapPin, Clock, Camera, Bot, CheckCircle, Wrench, Trash2, Lightbulb, Droplet, TreeDeciduous, CircleAlert, TrafficCone, Construction } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-16 pb-20">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-15 -z-10"></div>
        
        {/* India Flag Background - Very Faint Behind Title */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none" style={{ zIndex: 0, paddingTop: '40px' }}>
          <Image
            src="/logo2.png"
            alt="India Flag Background"
            width={600}
            height={400}
            className="object-contain"
            style={{ opacity: 0.18 }}
            priority
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1.5 bg-primary-100 rounded-full text-primary-700 text-xs font-semibold mb-4">
              <Zap className="w-3 h-3 mr-1.5" />
              AI-Powered Civic Intelligence
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              भारत नियोजक
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-600 font-bold mb-3">
              Report. Route. Resolve.
            </p>
            
            <p className="text-base md:text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
              "One Photo. One Click. The Right Authority."
            </p>
            
            <p className="text-sm text-gray-500 mb-8 max-w-xl mx-auto">
              Transform your city with intelligent civic reporting. AI-powered issue detection, 
              smart routing, and real-time resolution tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
              <Link 
                href="/register"
                className="group px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                Report an Issue
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/about"
                className="px-6 py-2.5 bg-white text-primary-600 text-sm font-semibold rounded-lg border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all shadow-md"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: '50K+', label: 'Issues Resolved' },
                { value: '95%', label: 'Success Rate' },
                { value: '24/7', label: 'AI Support' },
                { value: '500+', label: 'Cities Covered' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-xl hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <div className="text-2xl font-bold text-primary-600 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* India Flag Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-india-saffron"></div>
          <div className="flex-1 bg-india-white"></div>
          <div className="flex-1 bg-india-green"></div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Three simple steps to make your city better
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Camera,
                step: 'Step 1',
                title: 'Capture the Issue',
                description: 'Take a photo of any civic problem - potholes, garbage, broken streetlights, water leakage, or any infrastructure issue.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Bot,
                step: 'Step 2',
                title: 'AI Analysis',
                description: 'Our advanced AI instantly identifies the problem type, assesses severity, and automatically routes it to the correct government department.',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: CheckCircle,
                step: 'Step 3',
                title: 'Track & Resolve',
                description: 'Monitor real-time status updates, receive notifications, and see your issue progress from reported to resolved on your dashboard.',
                color: 'from-green-500 to-green-600'
              }
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-primary-300 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 cursor-pointer">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs font-bold text-primary-600 mb-2">{item.step}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-primary-400 transition-colors" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
              Powerful Features
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Built with cutting-edge technology for maximum impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Secure & Private',
                description: 'Enterprise-grade security with end-to-end encryption. Your data is always protected.',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Lightning Fast',
                description: 'AI processes your report in seconds. Get instant feedback and confirmation.',
                color: 'bg-yellow-100 text-yellow-600'
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: 'GPS Tracking',
                description: 'Automatic location detection ensures precise issue mapping and quick resolution.',
                color: 'bg-red-100 text-red-600'
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Community Driven',
                description: 'Join thousands of citizens making a real difference in their neighborhoods.',
                color: 'bg-green-100 text-green-600'
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Analytics Dashboard',
                description: 'Track your impact with detailed reports and city-wide statistics.',
                color: 'bg-purple-100 text-purple-600'
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: '24/7 Monitoring',
                description: 'Round-the-clock AI monitoring ensures no issue goes unnoticed.',
                color: 'bg-indigo-100 text-indigo-600'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-300 group cursor-pointer transform hover:-translate-y-1">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Issue Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
              Report Any Civic Issue
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              From potholes to pollution - we cover it all
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[
              { icon: CircleAlert, name: 'Potholes', color: 'hover:border-orange-400 hover:bg-orange-50' },
              { icon: Wrench, name: 'Damaged Roads', color: 'hover:border-gray-400 hover:bg-gray-50' },
              { icon: Trash2, name: 'Garbage', color: 'hover:border-green-400 hover:bg-green-50' },
              { icon: Lightbulb, name: 'Streetlights', color: 'hover:border-yellow-400 hover:bg-yellow-50' },
              { icon: Droplet, name: 'Water Leakage', color: 'hover:border-blue-400 hover:bg-blue-50' },
              { icon: TreeDeciduous, name: 'Fallen Trees', color: 'hover:border-emerald-400 hover:bg-emerald-50' },
              { icon: Droplet, name: 'Drainage', color: 'hover:border-cyan-400 hover:bg-cyan-50' },
              { icon: CircleAlert, name: 'Open Manholes', color: 'hover:border-red-400 hover:bg-red-50' },
              { icon: TrafficCone, name: 'Traffic Issues', color: 'hover:border-amber-400 hover:bg-amber-50' },
              { icon: Construction, name: 'Infrastructure', color: 'hover:border-slate-400 hover:bg-slate-50' },
            ].map((item, index) => (
              <div 
                key={index}
                className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center transition-all duration-300 cursor-pointer transform hover:scale-110 hover:shadow-lg ${item.color}`}
              >
                <item.icon className="w-7 h-7 mx-auto mb-2 text-gray-700 transition-transform duration-300 hover:rotate-12" />
                <div className="text-xs font-semibold text-gray-700">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
