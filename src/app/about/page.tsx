'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, Heart, Users, Globe, Award, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
              About Bharat Niyojak
            </h1>
            <p className="text-xs sm:text-sm md:text-base opacity-90 max-w-xl mx-auto">
              Building a smarter, more responsive India through AI-powered civic engagement
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-india-saffron"></div>
          <div className="flex-1 bg-india-white"></div>
          <div className="flex-1 bg-india-green"></div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-primary-50/60 p-4 sm:p-5 rounded-lg border border-primary-200 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200 shadow-xs group">
              <div className="w-10 h-10 bg-primary-600 rounded-md flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">Our Mission</h2>
              <p className="text-xs text-gray-700 leading-relaxed">
                To empower every Indian citizen with a simple, intelligent platform that transforms 
                civic reporting from a frustrating bureaucratic process into a seamless, impactful 
                experience. We leverage cutting-edge AI to ensure every issue reaches the right 
                authority instantly.
              </p>
            </div>

            <div className="bg-emerald-50/60 p-4 sm:p-5 rounded-lg border border-emerald-200 hover:border-emerald-400 hover:ring-2 hover:ring-emerald-50 transition-all duration-200 shadow-xs group">
              <div className="w-10 h-10 bg-emerald-600 rounded-md flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">Our Vision</h2>
              <p className="text-xs text-gray-700 leading-relaxed">
                To create a future where every civic issue is resolved efficiently, transparently, 
                and collaboratively. We envision cities where citizens and governments work together 
                seamlessly, enabled by technology, to build cleaner, safer, and more livable communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-10 sm:py-12 bg-gray-50/60">
        <div className="max-w-3xl mx-auto px-3 sm:px-6">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Our Story</h2>
            <div className="w-12 h-1 bg-primary-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <p>
              Bharat Niyojak was born from a simple observation: millions of Indians encounter civic 
              issues daily - potholes that damage vehicles, overflowing garbage bins, broken streetlights, 
              water leakages - yet reporting these problems remains unnecessarily complicated.
            </p>
            
            <p>
              Traditional complaint systems involve multiple phone calls, visiting government offices, 
              filling endless forms, and often, not knowing which department to contact. Most issues 
              go unreported because the process is simply too cumbersome.
            </p>
            
            <p>
              We asked ourselves: What if reporting a civic issue was as simple as taking a photo? 
              What if artificial intelligence could instantly understand the problem and route it to 
              the exact right authority? What if citizens could track progress in real-time?
            </p>
            
            <p>
              That vision became Bharat Niyojak - &quot;भारत नियोजक&quot; - India&apos;s intelligent civic reporting 
              platform. Using advanced AI, computer vision, and smart routing algorithms, we&apos;ve made 
              civic participation effortless, transparent, and impactful.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5">Our Core Values</h2>
            <p className="text-xs sm:text-sm text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-3.5">
            {[
              {
                icon: <Heart className="w-4 h-4" />,
                title: 'Citizen First',
                description: 'Every feature, every decision is made with citizens\' needs at the forefront. Simple, intuitive, and accessible to all.',
                color: 'bg-rose-50 text-rose-700'
              },
              {
                icon: <Award className="w-4 h-4" />,
                title: 'Excellence',
                description: 'We strive for the highest standards in technology, security, and service delivery. Quality is non-negotiable.',
                color: 'bg-amber-50 text-amber-700'
              },
              {
                icon: <Globe className="w-4 h-4" />,
                title: 'Transparency',
                description: 'Complete visibility into every step of the process. Citizens deserve to know exactly what happens to their reports.',
                color: 'bg-primary-50 text-primary-700'
              },
              {
                icon: <Users className="w-4 h-4" />,
                title: 'Collaboration',
                description: 'Building bridges between citizens, government departments, and communities for collective impact.',
                color: 'bg-emerald-50 text-emerald-700'
              },
              {
                icon: <Lightbulb className="w-4 h-4" />,
                title: 'Innovation',
                description: 'Constantly evolving with the latest AI and technology to serve India better, faster, and smarter.',
                color: 'bg-purple-50 text-purple-700'
              },
              {
                icon: <Target className="w-4 h-4" />,
                title: 'Impact Driven',
                description: 'We measure success by real-world impact - cleaner streets, safer neighborhoods, happier communities.',
                color: 'bg-indigo-50 text-indigo-700'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-3.5 sm:p-4 rounded-lg shadow-xs border border-gray-200 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200 group cursor-pointer">
                <div className={`w-8 h-8 ${value.color} rounded-md flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform duration-200`}>
                  {value.icon}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">{value.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-8 sm:py-10 bg-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">Our Impact</h2>
            <p className="text-xs sm:text-sm opacity-90">Real numbers, real change</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { number: '50,000+', label: 'Issues Resolved' },
              { number: '500+', label: 'Cities Covered' },
              { number: '2M+', label: 'Citizens Served' },
              { number: '95%', label: 'Success Rate' }
            ].map((stat, index) => (
              <div key={index} className="text-center cursor-pointer">
                <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-xs opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5">Meet Our Team</h2>
            <p className="text-xs sm:text-sm text-gray-600">Passionate technologists building a better India</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Rahul Sharma', role: 'Founder & CEO', avatar: '👨‍💼' },
              { name: 'Priya Patel', role: 'Chief Technology Officer', avatar: '👩‍💻' },
              { name: 'Amit Kumar', role: 'Head of AI', avatar: '👨‍🔬' },
              { name: 'Sneha Reddy', role: 'Head of Operations', avatar: '👩‍💼' }
            ].map((member, index) => (
              <div key={index} className="text-center p-3 rounded-lg border border-gray-100 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                  {member.avatar}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">{member.name}</h3>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-10 bg-gray-50/60">
        <div className="max-w-xl mx-auto px-3 sm:px-6 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Join Us in Building Better Cities
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Every report makes a difference. Start making an impact today.
          </p>
          <a 
            href="/register"
            className="inline-block px-4.5 py-2 bg-primary-600 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-primary-700 transition-all shadow-xs"
          >
            Get Started Now
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
