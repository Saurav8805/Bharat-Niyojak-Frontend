'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Zap, Shield, MapPin, Bell, BarChart3, Users, Globe, Clock, Smartphone, Award, TrendingUp, Lock, Rocket, X, Check } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI-Powered Detection',
      description: 'Advanced computer vision identifies issue types, severity levels, and suggests appropriate departments automatically.',
      color: 'bg-yellow-100 text-yellow-600',
      benefits: ['99% accuracy', 'Instant classification', 'Smart routing']
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'GPS Location Tracking',
      description: 'Automatic location capture ensures precise issue mapping. Authorities know exactly where to go.',
      color: 'bg-red-100 text-red-600',
      benefits: ['Auto-detect location', 'Accurate coordinates', 'Area-wise reports']
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Real-Time Notifications',
      description: 'Stay updated with push notifications as your issue progresses through verification, assignment, and resolution.',
      color: 'bg-blue-100 text-blue-600',
      benefits: ['Instant alerts', 'Status updates', 'Resolution confirmation']
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Analytics Dashboard',
      description: 'Visualize your impact with detailed statistics, charts, and city-wide civic health metrics.',
      color: 'bg-purple-100 text-purple-600',
      benefits: ['Personal stats', 'City insights', 'Trend analysis']
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, secure data storage, and compliance with data protection regulations.',
      color: 'bg-green-100 text-green-600',
      benefits: ['End-to-end encryption', 'GDPR compliant', 'Secure storage']
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Features',
      description: 'Upvote important issues, see what others reported, and collaborate for collective impact.',
      color: 'bg-indigo-100 text-indigo-600',
      benefits: ['Issue voting', 'Community feed', 'Social sharing']
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Multi-Platform Access',
      description: 'Report from anywhere - web, iOS, Android. Your data syncs seamlessly across all devices.',
      color: 'bg-pink-100 text-pink-600',
      benefits: ['Web & mobile', 'Cross-device sync', 'Offline mode']
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '24/7 Availability',
      description: 'Report issues anytime, anywhere. Our AI never sleeps and processes requests instantly.',
      color: 'bg-orange-100 text-orange-600',
      benefits: ['Always available', 'Instant processing', 'No waiting']
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Multi-Language Support',
      description: 'Available in Hindi, English, and 10+ regional languages for pan-India accessibility.',
      color: 'bg-teal-100 text-teal-600',
      benefits: ['12+ languages', 'Regional support', 'Voice input']
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Impact Tracking',
      description: 'See the real-world impact of your reports with resolution timelines and success metrics.',
      color: 'bg-cyan-100 text-cyan-600',
      benefits: ['Success tracking', 'Resolution time', 'Impact score']
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Privacy Protection',
      description: 'Your personal information is protected. Report anonymously if you prefer.',
      color: 'bg-gray-100 text-gray-600',
      benefits: ['Anonymous option', 'Data control', 'Privacy first']
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Gamification & Rewards',
      description: 'Earn badges, points, and recognition for making your city better. Top contributors featured monthly.',
      color: 'bg-amber-100 text-amber-600',
      benefits: ['Achievement badges', 'Leaderboards', 'Recognition']
    }
  ];

  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            Powerful Features
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            Everything you need to report, track, and resolve civic issues efficiently
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-india-saffron"></div>
          <div className="flex-1 bg-india-white"></div>
          <div className="flex-1 bg-india-green"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-300 group cursor-pointer transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <ul className="space-y-1.5">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-xs text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Traditional vs Bharat Niyojak</h2>
            <p className="text-base text-gray-600">See the difference for yourself</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional Way */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="text-center mb-4">
                <div className="text-3xl mb-3">😓</div>
                <h3 className="text-lg font-bold text-gray-900">Traditional Reporting</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Multiple phone calls to different departments',
                  'Long waiting times and bureaucratic delays',
                  'No tracking or status updates',
                  'Manual forms and paperwork',
                  'Uncertainty about which department to contact',
                  'No transparency or accountability',
                  'Often requires physical visits'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bharat Niyojak Way */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl shadow-md border border-primary-300">
              <div className="text-center mb-4">
                <Rocket className="w-12 h-12 mx-auto text-primary-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900">With Bharat Niyojak</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'One photo - instant submission',
                  'AI routes to correct department in seconds',
                  'Real-time tracking and notifications',
                  'Completely paperless and digital',
                  'Smart categorization automatically',
                  'Full transparency with status updates',
                  'Report from anywhere, anytime'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Experience the Future of Civic Reporting</h2>
          <p className="text-base mb-6 opacity-90">
            Join thousands of citizens already making a difference
          </p>
          <a 
            href="/register"
            className="inline-block px-6 py-2.5 bg-white text-primary-600 text-sm font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105"
          >
            Get Started Free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
