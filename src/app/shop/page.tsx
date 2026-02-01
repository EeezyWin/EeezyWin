'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Navbar, Card, Button } from '@/components';
import { Gem, Heart, Zap, Shield, Clock } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  action: () => void;
  disabled?: boolean;
}

export default function ShopPage() {
  const router = useRouter();
  const { user, isAuthenticated, spendGems, refillHearts, addGems } = useStore();
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const showMessage = (message: string) => {
    setPurchaseMessage(message);
    setTimeout(() => setPurchaseMessage(null), 3000);
  };

  const handleHeartRefill = () => {
    if (user.hearts >= 5) {
      showMessage('Your hearts are already full!');
      return;
    }
    if (spendGems(350)) {
      refillHearts();
      showMessage('Hearts refilled!');
    } else {
      showMessage('Not enough gems!');
    }
  };

  const handleFreeGems = () => {
    addGems(50);
    showMessage('You received 50 gems!');
  };

  const shopItems: ShopItem[] = [
    {
      id: 'heart-refill',
      name: 'Heart Refill',
      description: 'Refill your hearts to 5',
      price: 350,
      icon: <Heart className="w-8 h-8 text-[#ff4b4b] fill-current" />,
      action: handleHeartRefill,
      disabled: user.hearts >= 5,
    },
    {
      id: 'streak-freeze',
      name: 'Streak Freeze',
      description: 'Protect your streak for one day',
      price: 200,
      icon: <Shield className="w-8 h-8 text-[#1cb0f6]" />,
      action: () => showMessage('Streak freeze equipped!'),
    },
    {
      id: 'double-xp',
      name: 'Double XP',
      description: '15 minutes of double XP',
      price: 500,
      icon: <Zap className="w-8 h-8 text-[#ffc800] fill-current" />,
      action: () => showMessage('Double XP activated!'),
    },
    {
      id: 'timed-practice',
      name: 'Timed Practice',
      description: 'Unlock timed practice mode',
      price: 100,
      icon: <Clock className="w-8 h-8 text-[#ce82ff]" />,
      action: () => showMessage('Timed practice unlocked!'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <main className="pt-16 pb-20 md:pb-4 md:pl-64">
        <div className="max-w-2xl mx-auto p-4">
          {/* Header with Gems balance */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Shop</h1>
              <p className="text-gray-500">Spend your gems on power-ups</p>
            </div>
            <Card variant="outline" padding="sm" className="flex items-center gap-2">
              <Gem className="w-6 h-6 text-[#1cb0f6] fill-current" />
              <span className="font-bold text-lg">{user.gems}</span>
            </Card>
          </div>

          {/* Purchase message */}
          {purchaseMessage && (
            <div className="mb-4 p-4 bg-[#d7ffb8] text-[#58cc02] rounded-xl text-center font-bold animate-pulse">
              {purchaseMessage}
            </div>
          )}

          {/* Shop Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {shopItems.map((item) => (
              <Card key={item.id} variant="elevated" className="flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <Button
                  onClick={item.action}
                  variant={user.gems >= item.price && !item.disabled ? 'primary' : 'outline'}
                  disabled={user.gems < item.price || item.disabled}
                  fullWidth
                  className="mt-auto"
                >
                  <Gem className="w-4 h-4 mr-1 fill-current" />
                  {item.price}
                </Button>
              </Card>
            ))}
          </div>

          {/* Free Gems Section */}
          <Card variant="elevated" className="bg-gradient-to-r from-[#1cb0f6] to-[#ce82ff] text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Daily Reward</h3>
                <p className="text-white/80 text-sm">Claim your free gems!</p>
              </div>
              <Button
                onClick={handleFreeGems}
                variant="outline"
                className="bg-white text-[#1cb0f6] border-white hover:bg-white/90"
              >
                Claim 50 <Gem className="w-4 h-4 ml-1 fill-current" />
              </Button>
            </div>
          </Card>

          {/* Hearts Info */}
          <Card variant="outline" className="mt-6">
            <div className="flex items-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-6 h-6 ${
                      i < user.hearts ? 'text-[#ff4b4b] fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">
                  {user.hearts < 5
                    ? `${5 - user.hearts} heart${5 - user.hearts > 1 ? 's' : ''} needed for full health`
                    : 'Your hearts are full!'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
