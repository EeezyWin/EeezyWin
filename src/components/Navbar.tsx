'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Home, Trophy, User, ShoppingBag, Flame, Heart, Gem } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useStore();

  if (!isAuthenticated) return null;

  const navItems = [
    { href: '/learn', icon: Home, label: 'Learn' },
    { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '/shop', icon: ShoppingBag, label: 'Shop' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Top Stats Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <Link href="/learn" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#58cc02]">Lingo</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-[#ff9600]">
            <Flame className="w-6 h-6 fill-current" />
            <span className="font-bold">{user?.streak || 0}</span>
          </div>

          <div className="flex items-center gap-1 text-[#ff4b4b]">
            <Heart className="w-6 h-6 fill-current" />
            <span className="font-bold">{user?.hearts || 0}</span>
          </div>

          <div className="flex items-center gap-1 text-[#1cb0f6]">
            <Gem className="w-6 h-6 fill-current" />
            <span className="font-bold">{user?.gems || 0}</span>
          </div>
        </div>
      </header>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-50 md:hidden">
        <div className="flex items-center justify-around h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                  isActive ? 'text-[#1cb0f6]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Side Navigation (Desktop) */}
      <nav className="hidden md:flex fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-gray-200 z-40 flex-col p-4">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold ${
                  isActive
                    ? 'bg-[#ddf4ff] text-[#1cb0f6] border-2 border-[#84d8ff]'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? '' : ''}`} />
                <span className="text-sm uppercase tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
