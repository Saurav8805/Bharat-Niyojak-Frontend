'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, Heart, Users, Globe, Award, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              About Bharat Niyojak
            </h1>
            <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
              Building a smarter, more responsive India through AI-powered civic engagement
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-india-saffron"></div>
          <div className="flex-1 bg-india-white"></div>
          <div className="flex-1 bg-india-green"></div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">Our Mission</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                To empower every Indian citizen with a simple, intelligent platform that transforms 
                civic reporting from a frustrating bureaucratic process into a seamless, impactful 
                experience. We leverage cutting-edge AI to ensure every issue reaches the right 
                authority instantly.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">Our Vision</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                To create a future where every civic issue is resolved efficiently, transparently, 
                and collaboratively. We envision cities where citizens and governments work together 
                seamlessly, enabled by technology, to build cleaner, safer, and more livable communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto mb-6"></div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Bharat Niyojak was born from a simple observation: millions of Indians encounter civic 
              issues daily - potholes that damage vehicles, overflowing garbage bins, broken streetlights, 
              water leakages - yet reporting these problems remains unnecessarily complicated.
            </p>
            
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Traditional complaint systems involve multiple phone calls, visiting government offices, 
              filling endless forms, and often, not knowing which department to contact. Most issues 
              go unreported because the process is simply too cumbersome.
            </p>
            
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              We asked ourselves: What if reporting a civic issue was as simple as taking a photo? 
              What if artificial intelligence could instantly understand the problem and route it to 
              the exact right authority? What if citizens could track progress in real-time?
            </p>
            
            <p className="text-sm text-gray-700 leading-relaxed">
              That vision became Bharat Niyojak - "भारत नियोजक" - India's intelligent civic reporting 
              platform. Using advanced AI, computer vision, and smart routing algorithms, we've made 
              civic participation effortless, transparent, and impactful.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Core Values</h2>
            <p className="text-base text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Heart className="w-6 h-6" />,
                title: 'Citizen First',
                description: 'Every feature, every decision is made with citizens\' needs at the forefront. Simple, intuitive, and accessible to all.',
                color: 'bg-red-100 text-red-600'
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: 'Excellence',
                description: 'We strive for the highest standards in technology, security, and service delivery. Quality is non-negotiable.',
                color: 'bg-yellow-100 text-yellow-600'
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Transparency',
                description: 'Complete visibility into every step of the process. Citizens deserve to know exactly what happens to their reports.',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Collaboration',
                description: 'Building bridges between citizens, government departments, and communities for collective impact.',
                color: 'bg-green-100 text-green-600'
              },
              {
                icon: <Lightbulb className="w-6 h-6" />,
                title: 'Innovation',
                description: 'Constantly evolving with the latest AI and technology to serve India better, faster, and smarter.',
                color: 'bg-purple-100 text-purple-600'
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Impact Driven',
                description: 'We measure success by real-world impact - cleaner streets, safer neighborhoods, happier communities.',
                color: 'bg-indigo-100 text-indigo-600'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:border-primary-300 transition-all duration-300 group cursor-pointer transform hover:-translate-y-1">
                <div className={`w-12 h-12 ${value.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Our Impact</h2>
            <p className="text-base opacity-90">Real numbers, real change</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '50,000+', label: 'Issues Resolved' },
              { number: '500+', label: 'Cities Covered' },
              { number: '2M+', label: 'Citizens Served' },
              { number: '95%', label: 'Success Rate' }
            ].map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-110 transition-transform duration-300 cursor-pointer">
                <div className="text-3xl font-bold mb-2 hover:text-primary-100 transition-colors">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Meet Our Team</h2>
            <p className="text-base text-gray-600">Passionate technologists building a better India</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Rahul Sharma', role: 'Founder & CEO', avatar: '👨‍💼' },
              { name: 'Priya Patel', role: 'Chief Technology Officer', avatar: '👩‍💻' },
              { name: 'Amit Kumar', role: 'Head of AI', avatar: '👨‍🔬' },
              { name: 'Sneha Reddy', role: 'Head of Operations', avatar: '👩‍💼' }
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                  {member.avatar}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Join Us in Building Better Cities
          </h2>
          <p className="text-base text-gray-600 mb-6">
            Every report makes a difference. Start making an impact today.
          </p>
          <a 
            href="/register"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-bold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get Started Now
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
