import { Search, Calendar, CheckCircle } from 'lucide-react';
import { Navigation } from './Navigation';

const steps = [
  {
    id: 1,
    title: 'Choose a Service',
    description: 'Browse our categories and select the service you need for your home.',
    icon: Search,
  },
  {
    id: 2,
    title: 'Book a Professional',
    description: 'Pick a date and time that works for you and book a verified professional.',
    icon: Calendar,
  },
  {
    id: 3,
    title: 'Get It Done',
    description: 'Relax while our expert completes the job to your satisfaction.',
    icon: CheckCircle,
  },
];

export function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl text-gray-900 mb-4">How It Works</h1>
          <p className="text-xl text-gray-600">
            Get the help you need in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-blue-200">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full" />
                  </div>
                )}
                
                <div className="text-center space-y-6">
                  <div className="mx-auto w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-xl">
                    <Icon className="w-16 h-16 text-white" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-blue-600 text-xl">Step {step.id}</div>
                    <h3 className="text-3xl text-gray-900">{step.title}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-20 text-center">
          <button className="px-12 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg">
            Start Now
          </button>
        </div>
      </div>

    </div>
  );
}