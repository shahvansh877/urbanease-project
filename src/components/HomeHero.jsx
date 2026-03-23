import { Search } from 'lucide-react';
import { Navigation } from './Navigation';

export function HomeHero() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl text-gray-900 leading-tight">
              Home Services,
              <span className="block text-blue-600">Made Simple</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600">
              Connect with trusted local professionals for all your home service needs. 
              From cleaning to repairs, we've got you covered.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 flex items-center space-x-3 px-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for a service..."
                  className="flex-1 py-3 outline-none text-gray-700"
                />
              </div>
              <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                Search
              </button>
          </div>

          <div className="pt-2">
            <button className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg">
              Get Started Today
            </button>
          </div>

          <div className="inline-flex items-center justify-center bg-white rounded-2xl shadow-xl px-6 py-4">
            <div>
              <div className="text-3xl md:text-4xl text-blue-600">500+</div>
              <div className="text-gray-600">Verified Professionals</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}