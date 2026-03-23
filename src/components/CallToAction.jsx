import { ArrowRight } from 'lucide-react';
import { Navigation } from './Navigation';

export function CallToAction() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-6 md:px-16 py-12 md:py-24 text-center space-y-6 md:space-y-8">
            <h1 className="text-3xl md:text-6xl text-white max-w-4xl mx-auto leading-tight">
              Ready to Transform Your Home?
            </h1>
            
            <p className="text-lg md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of homeowners who trust UrbanEase for their home service needs. 
              Get started today and experience the convenience of professional services at your fingertips.
            </p>
            
            <div className="pt-6 md:pt-8">
              <button className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors text-lg md:text-xl flex items-center justify-center space-x-3 mx-auto shadow-xl">
                <span>Get Started Now</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="pt-8 md:pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 text-white">
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl">10k+</div>
                <div className="text-blue-200 text-base md:text-lg">Happy Customers</div>
              </div>
              
              <div className="hidden sm:block w-px h-16 bg-blue-400 mx-auto" />
              
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl">500+</div>
                <div className="text-blue-200 text-base md:text-lg">Professionals</div>
              </div>
              
              <div className="hidden sm:block w-px h-16 bg-blue-400 mx-auto" />
              
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl">4.9★</div>
                <div className="text-blue-200 text-base md:text-lg">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}