import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Navigation } from './Navigation';

export function FooterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <footer className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-6 md:px-16 py-10 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
              {/* Company Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl">U</span>
                  </div>
                  <span className="text-2xl text-white">UrbanEase</span>
                </div>
                
                <p className="text-gray-400 leading-relaxed">
                  Your trusted platform for connecting with verified home service professionals. 
                  Making home maintenance simple and stress-free.
                </p>
                
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
              
              {/* Services */}
              <div className="space-y-6">
                <h3 className="text-xl text-white">Services</h3>
                <ul className="space-y-3">
                  {['Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'General'].map((service) => (
                    <li key={service}>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Company */}
              <div className="space-y-6">
                <h3 className="text-xl text-white">Company</h3>
                <ul className="space-y-3">
                  {['About Us', 'How It Works', 'Careers', 'Blog', 'Press', 'Partners'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Support */}
              <div className="space-y-6">
                <h3 className="text-xl text-white">Support</h3>
                <ul className="space-y-3">
                  {['Help Center', 'Contact Us', 'Terms of Service', 'Privacy Policy', 'Refund Policy'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-6 space-y-3">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Mail className="w-5 h-5" />
                    <span>support@urbanease.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Phone className="w-5 h-5" />
                    <span>1-800-URBAN-EASE</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <MapPin className="w-5 h-5" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 md:mt-16 pt-8 border-t border-gray-800">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <p className="text-gray-400">
                  © 2026 UrbanEase. All rights reserved.
                </p>
                
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Terms
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Privacy
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Cookies
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}