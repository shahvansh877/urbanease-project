import { ArrowRight } from 'lucide-react';
import { Navigation } from './Navigation';

export function CallToAction() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-16 py-24 text-center space-y-8">
            <h1 className="text-6xl text-white max-w-4xl mx-auto">
              Ready to Transform Your Home?
            </h1>
            
            <p className="text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of homeowners who trust UrbanEase for their home service needs. 
              Get started today and experience the convenience of professional services at your fingertips.
            </p>
            
            <div className="pt-8">
              <button className="px-12 py-5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors text-xl flex items-center space-x-3 mx-auto shadow-xl">
                <span>Get Started Now</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="pt-12 flex items-center justify-center space-x-12 text-white">
              <div className="space-y-2">
                <div className="text-5xl">10k+</div>
                <div className="text-blue-200 text-lg">Happy Customers</div>
              </div>
              
              <div className="w-px h-16 bg-blue-400" />
              
              <div className="space-y-2">
                <div className="text-5xl">500+</div>
                <div className="text-blue-200 text-lg">Professionals</div>
              </div>
              
              <div className="w-px h-16 bg-blue-400" />
              
              <div className="space-y-2">
                <div className="text-5xl">4.9★</div>
                <div className="text-blue-200 text-lg">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}