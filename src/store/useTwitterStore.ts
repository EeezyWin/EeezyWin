import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Tweet, TwitterUser } from '@/types';

// Inspirational accounts
const inspirationalAccounts: TwitterUser[] = [
  {
    id: '1',
    username: 'stoic_wisdom',
    displayName: 'Stoic Wisdom',
    avatar: '🏛️',
    bio: 'Ancient wisdom for the modern warrior. Daily Stoic principles.',
    verified: true,
    followers: 2400000,
    following: 128,
  },
  {
    id: '2',
    username: 'iron_discipline',
    displayName: 'Iron Discipline',
    avatar: '⚔️',
    bio: 'Discipline equals freedom. No excuses, only results.',
    verified: true,
    followers: 1850000,
    following: 45,
  },
  {
    id: '3',
    username: 'mindset_warrior',
    displayName: 'Mindset Warrior',
    avatar: '🦁',
    bio: 'Your mind is your greatest weapon. Sharpen it daily.',
    verified: true,
    followers: 3200000,
    following: 200,
  },
  {
    id: '4',
    username: 'alpha_grindset',
    displayName: 'Alpha Grindset',
    avatar: '🔥',
    bio: 'Rise and grind. Outwork everyone. Become unstoppable.',
    verified: true,
    followers: 980000,
    following: 312,
  },
  {
    id: '5',
    username: 'success_blueprint',
    displayName: 'Success Blueprint',
    avatar: '👑',
    bio: 'Building empires. Teaching others to do the same.',
    verified: true,
    followers: 4100000,
    following: 89,
  },
  {
    id: '6',
    username: 'warrior_mindset',
    displayName: 'Warrior Mindset',
    avatar: '🗡️',
    bio: 'A warrior fights not because he hates what is in front of him, but because he loves what is behind him.',
    verified: true,
    followers: 1560000,
    following: 156,
  },
];

// Categories of inspirational quotes
const inspirationalQuotes: { content: string; category: Tweet['category'] }[] = [
  // Discipline
  { content: "Discipline is choosing between what you want now and what you want most. The man who masters himself can master anything.", category: 'discipline' },
  { content: "Every morning you have two choices: continue to sleep with your dreams, or wake up and chase them. The choice defines your character.", category: 'discipline' },
  { content: "The pain of discipline is nothing compared to the pain of regret. Choose your hard wisely.", category: 'discipline' },
  { content: "Motivation gets you started. Discipline keeps you going. Obsession makes you unstoppable.", category: 'discipline' },
  { content: "Your current habits are perfectly designed for your current results. Change the habits, change the life.", category: 'discipline' },
  { content: "Success isn't owned. It's rented. And rent is due every single day.", category: 'discipline' },
  { content: "The difference between who you are and who you want to be is what you do. Start today.", category: 'discipline' },
  { content: "Discipline is the bridge between goals and accomplishment. Build that bridge daily.", category: 'discipline' },
  { content: "While others sleep, you grind. While others complain, you execute. That's the difference.", category: 'discipline' },
  { content: "The man who conquers himself is more powerful than he who conquers a thousand battles.", category: 'discipline' },

  // Strength
  { content: "Hard times create strong men. Strong men create good times. Be the strong man this world needs.", category: 'strength' },
  { content: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.", category: 'strength' },
  { content: "A lion doesn't concern himself with the opinions of sheep. Know your worth and stand tall.", category: 'strength' },
  { content: "The world will try to break you. Let it forge you instead. Pressure creates diamonds.", category: 'strength' },
  { content: "Being powerful is like being a lady. If you have to tell people you are, you aren't.", category: 'strength' },
  { content: "Strength is not about how much you can handle before you break. It's about how much you can endure after you've been broken.", category: 'strength' },
  { content: "The strongest steel is forged in the hottest fire. Embrace the heat.", category: 'strength' },
  { content: "Real strength is being able to chill and let things slide. Not everything needs a reaction.", category: 'strength' },
  { content: "Physical strength is earned in the gym. Mental strength is earned in the struggle. Both require daily work.", category: 'strength' },
  { content: "A warrior is not someone who always wins, but someone who always fights.", category: 'strength' },

  // Perseverance
  { content: "Fall seven times, stand up eight. Your comeback story is being written right now.", category: 'perseverance' },
  { content: "The moment you feel like quitting is usually the moment right before a breakthrough. Keep pushing.", category: 'perseverance' },
  { content: "Success is not final, failure is not fatal. It's the courage to continue that counts.", category: 'perseverance' },
  { content: "Most people fail not because they aim too high and miss, but because they aim too low and hit.", category: 'perseverance' },
  { content: "Rock bottom became the solid foundation on which I rebuilt my life. Sometimes you need to hit the ground to launch.", category: 'perseverance' },
  { content: "Every master was once a disaster. Every pro was once an amateur. Keep going.", category: 'perseverance' },
  { content: "The man who moves mountains begins by carrying small stones. Progress is progress.", category: 'perseverance' },
  { content: "You're not tired, you're uninspired. Find your fire and keep it burning.", category: 'perseverance' },
  { content: "Champions aren't made in the ring, they're made in the hours of hard work when no one is watching.", category: 'perseverance' },
  { content: "The only time you should ever look back is to see how far you've come.", category: 'perseverance' },

  // Leadership
  { content: "Lead from the front. Eat last. Take responsibility. Protect your people. That's leadership.", category: 'leadership' },
  { content: "A true leader has the confidence to stand alone, the courage to make tough decisions, and the compassion to listen.", category: 'leadership' },
  { content: "Before you are a leader, success is about growing yourself. When you become a leader, success is about growing others.", category: 'leadership' },
  { content: "The task of leadership is not to put greatness into people, but to elicit it, for the greatness is there already.", category: 'leadership' },
  { content: "Don't follow the crowd, let the crowd follow you. Be the one who sets the standard.", category: 'leadership' },
  { content: "A leader takes people where they want to go. A great leader takes people where they need to be.", category: 'leadership' },
  { content: "The best leaders are those who lead by example, not by command. Actions speak louder.", category: 'leadership' },
  { content: "True leadership is not about being in charge. It's about taking care of those in your charge.", category: 'leadership' },
  { content: "You don't need a title to be a leader. You need courage, vision, and the will to act.", category: 'leadership' },
  { content: "A king is not born. He is made through fire, sacrifice, and unwavering determination.", category: 'leadership' },

  // Mindset
  { content: "Your mind is a weapon. Keep it loaded. Your body is a vehicle. Keep it running. Both need daily maintenance.", category: 'mindset' },
  { content: "The only limits that exist are the ones you place on yourself. Break free from mental chains.", category: 'mindset' },
  { content: "Weak minds discuss people. Average minds discuss events. Strong minds discuss ideas and possibilities.", category: 'mindset' },
  { content: "Your thoughts become your reality. Guard your mind like a fortress.", category: 'mindset' },
  { content: "Mindset isn't everything—it's the only thing. Everything starts in the mind.", category: 'mindset' },
  { content: "The graveyard is full of unfulfilled potential. Don't let your dreams die with you.", category: 'mindset' },
  { content: "Stop waiting for Friday, for summer, for someone to fall in love with you. Happiness is now.", category: 'mindset' },
  { content: "Your comfort zone is a beautiful place, but nothing ever grows there. Embrace discomfort.", category: 'mindset' },
  { content: "The battlefield is in the mind. Win there first, and you'll win everywhere.", category: 'mindset' },
  { content: "Every thought is a seed. If you plant crab apples, don't expect peaches.", category: 'mindset' },

  // Success
  { content: "Success is walking from failure to failure with no loss of enthusiasm. Keep your fire burning.", category: 'success' },
  { content: "Don't tell people your dreams. Show them your results. Let your success make the noise.", category: 'success' },
  { content: "Success is not about the destination, it's about the man you become on the journey.", category: 'success' },
  { content: "The successful warrior is the average man with laser-like focus.", category: 'success' },
  { content: "Work in silence, let your success be your noise. Results speak for themselves.", category: 'success' },
  { content: "Success comes to those who work hard while others are complaining. Stay focused.", category: 'success' },
  { content: "You don't have to be great to start, but you have to start to be great.", category: 'success' },
  { content: "The road to success is always under construction. Keep building, keep evolving.", category: 'success' },
  { content: "Success is the sum of small efforts repeated day in and day out. Stack the days.", category: 'success' },
  { content: "Rich people have big libraries. Poor people have big TVs. Invest in your mind.", category: 'success' },
  { content: "The harder you work, the luckier you get. There's no substitute for the grind.", category: 'success' },
  { content: "Build something so good that even your haters become customers. Excellence silences critics.", category: 'success' },
];

interface TwitterState {
  tweets: Tweet[];
  lastAutoPostTime: number;
  autoPostEnabled: boolean;
  postsPerDay: number;
  usedQuoteIndices: number[];

  // Actions
  addTweet: (content: string, category: Tweet['category']) => void;
  generateAutonomousTweet: () => void;
  likeTweet: (tweetId: string) => void;
  retweetTweet: (tweetId: string) => void;
  bookmarkTweet: (tweetId: string) => void;
  checkAndAutoPost: () => void;
  setAutoPostEnabled: (enabled: boolean) => void;
  setPostsPerDay: (count: number) => void;
  clearOldTweets: () => void;
}

const getRandomAccount = (): TwitterUser => {
  return inspirationalAccounts[Math.floor(Math.random() * inspirationalAccounts.length)];
};

const getRandomEngagement = () => ({
  likes: Math.floor(Math.random() * 50000) + 1000,
  retweets: Math.floor(Math.random() * 15000) + 500,
  replies: Math.floor(Math.random() * 2000) + 100,
  views: Math.floor(Math.random() * 500000) + 50000,
});

export const useTwitterStore = create<TwitterState>()(
  persist(
    (set, get) => ({
      tweets: [],
      lastAutoPostTime: 0,
      autoPostEnabled: true,
      postsPerDay: 8,
      usedQuoteIndices: [],

      addTweet: (content: string, category: Tweet['category']) => {
        const newTweet: Tweet = {
          id: uuidv4(),
          author: getRandomAccount(),
          content,
          timestamp: new Date(),
          ...getRandomEngagement(),
          liked: false,
          retweeted: false,
          bookmarked: false,
          category,
        };

        set((state) => ({
          tweets: [newTweet, ...state.tweets],
        }));
      },

      generateAutonomousTweet: () => {
        const state = get();
        let availableIndices = inspirationalQuotes
          .map((_, index) => index)
          .filter((index) => !state.usedQuoteIndices.includes(index));

        // Reset if we've used all quotes
        if (availableIndices.length === 0) {
          availableIndices = inspirationalQuotes.map((_, index) => index);
          set({ usedQuoteIndices: [] });
        }

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const quote = inspirationalQuotes[randomIndex];

        const newTweet: Tweet = {
          id: uuidv4(),
          author: getRandomAccount(),
          content: quote.content,
          timestamp: new Date(),
          ...getRandomEngagement(),
          liked: false,
          retweeted: false,
          bookmarked: false,
          category: quote.category,
        };

        set((state) => ({
          tweets: [newTweet, ...state.tweets],
          usedQuoteIndices: [...state.usedQuoteIndices, randomIndex],
          lastAutoPostTime: Date.now(),
        }));
      },

      likeTweet: (tweetId: string) => {
        set((state) => ({
          tweets: state.tweets.map((tweet) =>
            tweet.id === tweetId
              ? {
                  ...tweet,
                  liked: !tweet.liked,
                  likes: tweet.liked ? tweet.likes - 1 : tweet.likes + 1,
                }
              : tweet
          ),
        }));
      },

      retweetTweet: (tweetId: string) => {
        set((state) => ({
          tweets: state.tweets.map((tweet) =>
            tweet.id === tweetId
              ? {
                  ...tweet,
                  retweeted: !tweet.retweeted,
                  retweets: tweet.retweeted ? tweet.retweets - 1 : tweet.retweets + 1,
                }
              : tweet
          ),
        }));
      },

      bookmarkTweet: (tweetId: string) => {
        set((state) => ({
          tweets: state.tweets.map((tweet) =>
            tweet.id === tweetId
              ? { ...tweet, bookmarked: !tweet.bookmarked }
              : tweet
          ),
        }));
      },

      checkAndAutoPost: () => {
        const state = get();
        if (!state.autoPostEnabled) return;

        const now = Date.now();
        const msPerDay = 24 * 60 * 60 * 1000;
        const postInterval = msPerDay / state.postsPerDay;

        // Generate initial tweets if empty
        if (state.tweets.length === 0) {
          for (let i = 0; i < 10; i++) {
            state.generateAutonomousTweet();
          }
          return;
        }

        // Check if enough time has passed for a new post
        if (now - state.lastAutoPostTime >= postInterval) {
          state.generateAutonomousTweet();
        }
      },

      setAutoPostEnabled: (enabled: boolean) => {
        set({ autoPostEnabled: enabled });
      },

      setPostsPerDay: (count: number) => {
        set({ postsPerDay: Math.max(1, Math.min(20, count)) });
      },

      clearOldTweets: () => {
        const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
        set((state) => ({
          tweets: state.tweets.filter(
            (tweet) => new Date(tweet.timestamp).getTime() > threeDaysAgo
          ),
        }));
      },
    }),
    {
      name: 'twitter-autonomous-storage',
    }
  )
);
