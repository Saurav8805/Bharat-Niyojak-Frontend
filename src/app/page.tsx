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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-14 sm:pt-16 pb-16 sm:pb-20">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-15 pointer-events-none"></div>
        
        {/* India Flag Background - Behind Title */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none" style={{ zIndex: 0, paddingTop: '28px' }}>
          <Image
            src="/logo2.png"
            alt="India Flag Background"
            width={500}
            height={320}
            className="object-contain"
            style={{ opacity: 0.35 }}
            priority
          />
        </div>
        
        <div className="max-w-6xl mx-auto px-3 sm:px-6 relative z-10 w-full">
          <div className="text-center">
            <div className="inline-flex items-center px-2.5 py-1 bg-primary-100/80 rounded-full text-primary-700 text-[11px] font-semibold mb-3">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered Civic Intelligence
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">
              भारत नियोजक
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-primary-700 font-bold mb-2">
              Report. Route. Resolve.
            </p>
            
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 max-w-xl mx-auto font-medium">
              &quot;One Photo. One Click. The Right Authority.&quot;
            </p>
            
            <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-lg mx-auto">
              Transform your city with intelligent civic reporting. AI-powered issue detection, 
              smart routing, and real-time resolution tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-2.5 mb-8">
              <Link 
                href="/register"
                className="group px-4.5 py-2 bg-primary-600 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-primary-700 transition-all shadow-xs flex items-center justify-center"
              >
                Report an Issue
                <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/about"
                className="px-4.5 py-2 bg-white text-primary-700 text-xs sm:text-sm font-semibold rounded-md border border-primary-200 hover:border-primary-400 hover:bg-primary-50/60 transition-all shadow-xs"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {[
                { value: '50K+', label: 'Issues Resolved' },
                { value: '95%', label: 'Success Rate' },
                { value: '24/7', label: 'AI Support' },
                { value: '500+', label: 'Cities Covered' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-xs border border-gray-200 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200 cursor-pointer">
                  <div className="text-xl sm:text-2xl font-bold text-primary-700 mb-0.5">{stat.value}</div>
                  <div className="text-[11px] font-medium text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* India Flag Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-india-saffron"></div>
          <div className="flex-1 bg-india-white"></div>
          <div className="flex-1 bg-india-green"></div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Three simple steps to make your city better
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Camera,
                step: 'Step 1',
                title: 'Capture the Issue',
                description: 'Take a photo of any civic problem - potholes, garbage, broken streetlights, water leakage, or infrastructure.',
                color: 'from-blue-600 to-blue-700'
              },
              {
                icon: Bot,
                step: 'Step 2',
                title: 'AI Analysis',
                description: 'Our advanced AI instantly identifies the problem type, assesses severity, and automatically routes it to the correct department.',
                color: 'from-primary-600 to-primary-700'
              },
              {
                icon: CheckCircle,
                step: 'Step 3',
                title: 'Track & Resolve',
                description: 'Monitor real-time status updates, receive notifications, and see your issue progress from reported to resolved on your dashboard.',
                color: 'from-emerald-600 to-emerald-700'
              }
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="bg-white p-4 sm:p-5 rounded-lg shadow-xs border border-gray-200 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200 cursor-pointer h-full flex flex-col items-center text-center">
                  <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-xs group-hover:scale-105 transition-transform duration-200`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary-700 mb-1">{item.step}</div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 group-hover:text-primary-700 transition-colors">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-2.5 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-14 bg-gray-50/60">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5">
              Powerful Features
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Built with cutting-edge technology for maximum civic impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              {
                icon: <Shield className="w-4 h-4" />,
                title: 'Secure & Private',
                description: 'Enterprise-grade security with end-to-end encryption. Your identity and data are always protected.',
                color: 'bg-primary-50 text-primary-700'
              },
              {
                icon: <Zap className="w-4 h-4" />,
                title: 'Lightning Fast',
                description: 'AI processes your report in seconds. Get instant feedback and automated department assignment.',
                color: 'bg-amber-50 text-amber-700'
              },
              {
                icon: <MapPin className="w-4 h-4" />,
                title: 'GPS Tracking',
                description: 'Automatic location detection ensures precise issue mapping and rapid field inspection.',
                color: 'bg-rose-50 text-rose-700'
              },
              {
                icon: <Users className="w-4 h-4" />,
                title: 'Community Driven',
                description: 'Join thousands of citizens making a real difference in their neighborhoods together.',
                color: 'bg-emerald-50 text-emerald-700'
              },
              {
                icon: <TrendingUp className="w-4 h-4" />,
                title: 'Analytics Dashboard',
                description: 'Track your impact with transparent live metrics, charts, and departmental statistics.',
                color: 'bg-indigo-50 text-indigo-700'
              },
              {
                icon: <Clock className="w-4 h-4" />,
                title: '24/7 Monitoring',
                description: 'Round-the-clock automated monitoring ensures complaints are routed without administrative delays.',
                color: 'bg-sky-50 text-sky-700'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-3.5 sm:p-4 rounded-lg shadow-xs border border-gray-200 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200 group cursor-pointer">
                <div className={`w-8 h-8 ${feature.color} rounded-md flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">{feature.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Issue Categories */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5">
              Report Any Civic Issue
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              From potholes to sanitation - streamlined reporting across departments
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {[
              { icon: CircleAlert, name: 'Potholes' },
              { icon: Wrench, name: 'Damaged Roads' },
              { icon: Trash2, name: 'Garbage & Waste' },
              { icon: Lightbulb, name: 'Streetlights' },
              { icon: Droplet, name: 'Water Leakage' },
              { icon: TreeDeciduous, name: 'Fallen Trees' },
              { icon: Droplet, name: 'Drainage Issues' },
              { icon: CircleAlert, name: 'Open Manholes' },
              { icon: TrafficCone, name: 'Traffic Issues' },
              { icon: Construction, name: 'Infrastructure' },
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white p-3 rounded-lg shadow-xs border border-gray-200 text-center transition-all duration-200 cursor-pointer hover:border-primary-400 hover:ring-2 hover:ring-primary-50 hover:bg-primary-50/40"
              >
                <item.icon className="w-5 h-5 mx-auto mb-1.5 text-gray-700" />
                <div className="text-xs font-semibold text-gray-800">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
