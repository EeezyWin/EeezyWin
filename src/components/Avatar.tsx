'use client';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

export function Avatar({ src, alt = 'Avatar', size = 'md', fallback }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  const colors = [
    'bg-[#58cc02]',
    'bg-[#1cb0f6]',
    'bg-[#ff4b4b]',
    'bg-[#ffc800]',
    'bg-[#ce82ff]',
    'bg-[#ff9600]',
  ];

  const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = fallback
    ? fallback
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  if (src) {
    return (
      <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0`}>
        <div
          className="w-full h-full flex items-center justify-center text-2xl"
          style={{ fontSize: size === 'sm' ? '1rem' : size === 'md' ? '1.5rem' : size === 'lg' ? '2rem' : '3rem' }}
        >
          {initials.slice(0, 1)}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${sizes[size]} ${getColorFromName(fallback || 'user')} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}
