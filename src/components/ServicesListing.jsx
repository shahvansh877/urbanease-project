import React, { Component } from 'react';
import { Sparkles, Wrench, Zap, Hammer, Paintbrush, Settings } from 'lucide-react';
import { Navigation } from './Navigation';
import { ImageWithFallback } from './figma/ImageWithFallback';

const services = [
  {
    id: 1,
    title: 'Cleaning',
    description: 'Professional cleaning services for your home, office, or commercial space.',
    image: 'https://images.unsplash.com/photo-1769788161278-8dc624a2d537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHNlcnZpY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcwNTc5NTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: Sparkles,
  },
  {
    id: 2,
    title: 'Plumbing',
    description: 'Expert plumbers for repairs, installations, and maintenance services.',
    image: 'https://images.unsplash.com/photo-1723988429049-0a42e45e8501?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmluZyUyMHJlcGFpciUyMHRvb2xzfGVufDF8fHx8MTc3MDU5NDUxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: Wrench,
  },
  {
    id: 3,
    title: 'Electrical',
    description: 'Licensed electricians for safe and reliable electrical work.',
    image: 'https://images.unsplash.com/photo-1767514536570-83d70c024247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwd2lyaW5nJTIwd29ya3xlbnwxfHx8fDE3NzA2Mjg5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: Zap,
  },
  {
    id: 4,
    title: 'Carpentry',
    description: 'Skilled carpenters for custom woodwork and furniture repairs.',
    image: 'https://images.unsplash.com/photo-1626081063434-79a2169791b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZW50cnklMjB3b29kd29ya3xlbnwxfHx8fDE3NzA2MjQxMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: Hammer,
  },
  {
    id: 5,
    title: 'Painting',
    description: 'Professional painters for interior and exterior painting projects.',
    image: 'https://images.unsplash.com/photo-1643804475756-ca849847c78a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMHBhaW50aW5nJTIwd2FsbHN8ZW58MXx8fHwxNzcwNjYxMzc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: Paintbrush,
  },
  {
    id: 6,
    title: 'General',
    description: 'Handyman services for all your home maintenance and repair needs.',
    image: 'https://images.unsplash.com/photo-1608752503578-52f35965e3d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwcmVwYWlyJTIwdG9vbHN8ZW58MXx8fHwxNzcwNjYxMzc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: Settings,
  },
];

// ─────────────────────────────────────────────────────────
// Ex No: 2b  —  Stateless Class Component
// ServiceCard only receives data through props and renders it.
// It has NO state (no this.state / this.setState).
// ─────────────────────────────────────────────────────────
class ServiceCard extends Component {
  render() {
    const { service, onBook } = this.props;
    const Icon = service.icon;
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group">
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="p-6 space-y-4">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
            <Icon className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="text-2xl text-gray-900">{service.title}</h3>
          <p className="text-gray-600">{service.description}</p>
          <button
            onClick={() => onBook(service.title)}
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    );
  }
}

// ─────────────────────────────────────────────────────────
// Ex No: 2a  —  Stateful Class Component
// ServicesListing manages its own state:
//   • searchQuery  — text the user types in the search box
//   • selectedCategory — the active category filter pill
// this.setState() triggers a re-render whenever state changes.
// ─────────────────────────────────────────────────────────
export class ServicesListing extends Component {
  // Initialise state via class field (no constructor needed)
  state = {
    searchQuery: '',
    selectedCategory: 'All',
  };

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleCategory = (category) => {
    this.setState({ selectedCategory: category });
  };

  handleBook = (title) => {
    window.location.href = `/providers?service=${encodeURIComponent(title)}`;
  };

  render() {
    const { searchQuery, selectedCategory } = this.state;

    const categories = ['All', ...services.map((s) => s.title)];

    const filtered = services.filter((s) => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || s.title === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-center mb-10">
            <h1 className="text-5xl text-gray-900 mb-4">Popular Services</h1>
            <p className="text-xl text-gray-600">
              Choose from our wide range of professional home services
            </p>
          </div>

          {/* Search box — updates state on every keystroke */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={this.handleSearch}
              placeholder="Search services..."
              className="w-full px-5 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Category filter pills — setState on click */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => this.handleCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of ServiceCard (stateless class components) */}
          <div className="grid grid-cols-3 gap-8">
            {filtered.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={this.handleBook}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}