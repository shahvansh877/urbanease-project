import { Search } from 'lucide-react';
import { Navigation } from './Navigation';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HomeHero() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl text-gray-900">
              Home Services,
              <span className="block text-blue-600">Made Simple</span>
            </h1>
            
            <p className="text-xl text-gray-600">
              Connect with trusted local professionals for all your home service needs. 
              From cleaning to repairs, we've got you covered.
            </p>
            
            <div className="bg-white rounded-2xl shadow-xl p-3 flex items-center space-x-3">
              <div className="flex-1 flex items-center space-x-3 px-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for a service..."
                  className="flex-1 py-3 outline-none text-gray-700"
                />
              </div>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
            
            <div className="pt-4">
              <button className="px-10 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg">
                Get Started Today
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1600210492493-0946911123ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob21lJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcwNjYxMzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern home interior"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 space-y-2">
              <div className="text-4xl text-blue-600">500+</div>
              <div className="text-gray-600">Verified Professionals</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}