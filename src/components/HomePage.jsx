import { Search, Calendar, CheckCircle, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { useRef } from 'react'; // Ex No: 3b — useRef
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

export function HomePage() {
  // Ex No: 3b — useRef
  // searchRef holds a direct reference to the <input> DOM node.
  // When the user clicks "Search", we imperatively focus the input
  // without re-rendering the component (no state change needed).
  const searchRef = useRef(null);

  const handleSearchClick = () => {
    if (searchRef.current) searchRef.current.focus();
  };

  return (
    <div className="bg-white">
      {/* Single Navigation for the whole page */}
      <Navigation />

      {/* ── Hero Section ── */}
      <section id="home" className="bg-gradient-to-b from-blue-50 to-white">
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
                  {/* ref attached so handleSearchClick can focus this input */}
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search for a service..."
                  className="flex-1 py-3 outline-none text-gray-700"
                />
              </div>
              <button
                onClick={handleSearchClick}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
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
      </section>

      {/* ── How It Works Section ── */}
      <section id="how-it-works" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg md:text-xl text-gray-600">
              Get the help you need in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
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
                    <div className="mx-auto w-24 h-24 md:w-32 md:h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-xl">
                      <Icon className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>

                    <div className="space-y-3">
                      <div className="text-blue-600 text-lg md:text-xl">Step {step.id}</div>
                      <h3 className="text-2xl md:text-3xl text-gray-900">{step.title}</h3>
                      <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 md:mt-20 text-center">
            <Link to="/login">
              <button className="w-full sm:w-auto px-12 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg">
                Start Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer Section ── */}
      <section id="footer" className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
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
      </section>
    </div>
  );
}
