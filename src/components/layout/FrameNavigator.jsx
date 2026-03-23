import { useLocation, Link } from 'react-router';

const frames = [
  { path: '/', label: 'Frame 1: Hero' },
  { path: '/services', label: 'Frame 2: Services' },
  { path: '/how-it-works', label: 'Frame 3: How It Works' },
  { path: '/cta', label: 'Frame 4: CTA' },
  { path: '/footer', label: 'Frame 5: Footer' },
  { path: '/login', label: 'Frame 6: Login' },
  { path: '/signup', label: 'Frame 7: Sign Up' },
  { path: '/profile', label: 'Frame 8: Profile' },
  { path: '/booking', label: 'Frame 9: Booking' },
  { path: '/admin', label: 'Frame 10: Admin Dashboard' },
  { path: '/payments', label: 'Frame 11: Payments' },
  { path: '/providers', label: 'Frame 12: Providers List' },
  { path: '/provider-dashboard', label: 'Frame 13: Provider Dashboard' },
];

export function FrameNavigator() {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-8 left-8 flex flex-col space-y-1.5 bg-white p-4 rounded-xl shadow-xl border border-gray-100 max-h-[600px] overflow-y-auto z-50">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 pb-1 border-b border-gray-100">
        Pages
      </p>
      {frames.map((frame) => {
        const isActive = pathname === frame.path;
        return (
          <Link
            key={frame.path}
            to={frame.path}
            className={`text-sm transition-colors ${
              isActive
                ? 'text-blue-600 font-medium'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {isActive && <span className="mr-1 text-blue-400">›</span>}
            {frame.label}
          </Link>
        );
      })}
    </div>
  );
}
