'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Check, Zap, Shield, TrendingUp, Users, MapPin, Clock, Camera, Bot, CheckCircle, Wrench, Trash2, Lightbulb, Droplet, TreeDeciduous, CircleAlert, TrafficCone, Construction } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-32 transition-colors duration-300">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-20 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-semibold mb-6">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Civic Intelligence
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight transition-colors">
              भारत नियोजक
            </h1>
            
            <p className="text-3xl md:text-4xl text-primary-600 dark:text-primary-400 font-bold mb-4 transition-colors">
              Report. Route. Resolve.
            </p>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors">
              "One Photo. One Click. The Right Authority."
            </p>
            
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto transition-colors">
              Transform your city with intelligent civic reporting. AI-powered issue detection, 
              smart routing, and real-time resolution tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link 
                href="/register"
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                Report an Issue
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/about"
                className="px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-xl border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all shadow-lg"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: '50K+', label: 'Issues Resolved' },
                { value: '95%', label: 'Success Rate' },
                { value: '24/7', label: 'AI Support' },
                { value: '500+', label: 'Cities Covered' },
              ].map((stat, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1 transition-colors">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* India Flag Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-india-saffron"></div>
          <div className="flex-1 bg-india-white"></div>
          <div className="flex-1 bg-india-green"></div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
              Three simple steps to make your city better
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-600 transition-all hover:shadow-2xl transform hover:-translate-y-2">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-sm font-bold text-primary-600 dark:text-primary-400 mb-2">{item.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
              Built with cutting-edge technology for maximum impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Secure & Private',
                description: 'Enterprise-grade security with end-to-end encryption. Your data is always protected.',
                color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'AI processes your report in seconds. Get instant feedback and confirmation.',
                color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: 'GPS Tracking',
                description: 'Automatic location detection ensures precise issue mapping and quick resolution.',
                color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Community Driven',
                description: 'Join thousands of citizens making a real difference in their neighborhoods.',
                color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Analytics Dashboard',
                description: 'Track your impact with detailed reports and city-wide statistics.',
                color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: '24/7 Monitoring',
                description: 'Round-the-clock AI monitoring ensures no issue goes unnoticed.',
                color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-600 group">
                <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Issue Categories */}
      <section className="py-20 bg-white dark:bg-gray-800 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
              Report Any Civic Issue
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
              From potholes to pollution - we cover it all
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { icon: CircleAlert, name: 'Potholes', color: 'hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20' },
              { icon: Wrench, name: 'Damaged Roads', color: 'hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50' },
              { icon: Trash2, name: 'Garbage', color: 'hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20' },
              { icon: Lightbulb, name: 'Streetlights', color: 'hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' },
              { icon: Droplet, name: 'Water Leakage', color: 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20' },
              { icon: TreeDeciduous, name: 'Fallen Trees', color: 'hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' },
              { icon: Droplet, name: 'Drainage', color: 'hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20' },
              { icon: CircleAlert, name: 'Open Manholes', color: 'hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' },
              { icon: TrafficCone, name: 'Traffic Issues', color: 'hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20' },
              { icon: Construction, name: 'Infrastructure', color: 'hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/20' },
            ].map((item, index) => (
              <div 
                key={index}
                className={`bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-600 text-center transition-all cursor-pointer transform hover:scale-105 hover:shadow-xl ${item.color}`}
              >
                <item.icon className="w-10 h-10 mx-auto mb-3 text-gray-700 dark:text-gray-200" />
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
