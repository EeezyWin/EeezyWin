'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/Button';
import { courses } from '@/data/courses';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, login, selectCourse } = useStore();
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/learn');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && email.trim()) {
      login(username, email);
      if (selectedCourseId) {
        selectCourse(selectedCourseId);
      }
      router.push('/learn');
    }
  };

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  if (showAuth && !selectedCourseId) {
    return (
      <div className="min-h-screen bg-[#235390] flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-white mb-8">I want to learn...</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className="bg-white rounded-2xl p-6 flex items-center gap-4 hover:scale-105 transition-transform shadow-lg"
            >
              <span className="text-4xl">{course.flag}</span>
              <div className="text-left">
                <h3 className="font-bold text-lg">{course.name}</h3>
                <p className="text-sm text-gray-500">{course.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-[#235390] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#58cc02] mb-2">Lingo</h1>
            <p className="text-white text-lg">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1cb0f6] focus:outline-none transition-colors"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1cb0f6] focus:outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <Button type="submit" fullWidth size="lg">
                {isLogin ? 'Log In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#1cb0f6] font-medium hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Log in'}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setShowAuth(false);
              setSelectedCourseId(null);
            }}
            className="mt-4 text-white/80 hover:text-white text-sm"
          >
            ← Back to language selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#235390] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-[#58cc02] mb-4">
            Lingo
          </h1>
          <p className="text-white text-xl md:text-2xl mb-2">
            The free, fun, and effective way to learn a language!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button onClick={handleGetStarted} fullWidth size="lg">
            Get Started
          </Button>
          <Button
            onClick={() => {
              setShowAuth(true);
              setIsLogin(true);
            }}
            variant="outline"
            fullWidth
            size="lg"
            className="bg-white"
          >
            I Already Have an Account
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-white font-bold text-lg mb-2">Effective</h3>
            <p className="text-white/70 text-sm">
              Our courses effectively teach reading, listening, and speaking skills.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🎮</div>
            <h3 className="text-white font-bold text-lg mb-2">Fun</h3>
            <p className="text-white/70 text-sm">
              Game-like lessons and fun challenges make learning addictive.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-white font-bold text-lg mb-2">Free</h3>
            <p className="text-white/70 text-sm">
              Learn languages without spending a dime. No hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-white/50 text-sm">
        <p>A Duolingo Clone - Built with Next.js</p>
      </footer>
    </div>
  );
}
