import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CommunityManifestation {
  id: string;
  title: string;
  description: string;
  emoji: string;
  state: 'dream' | 'working' | 'done' | 'archived';
  author: {
    name: string;
    address: string;
    avatar?: string;
    verified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  supporters: string[]; // Array of user addresses who support this
  likes: string[]; // Array of user addresses who liked this
  comments: CommunityComment[];
  category: string;
  progress: number;
  isPublic: boolean;
  tags: string[];
}

export interface CommunityComment {
  id: string;
  author: {
    name: string;
    address: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  likes: string[];
}

export interface CommunityStats {
  totalDreamers: number;
  totalManifested: number;
  totalSupport: number;
  categoryCounts: Record<string, number>;
  trendingCategories: Array<{
    name: string;
    count: number;
    emoji: string;
    growth: string;
  }>;
}

interface CommunityStore {
  manifestations: CommunityManifestation[];
  stats: CommunityStats;
  isLoading: boolean;
  
  // Actions
  fetchCommunityData: () => Promise<void>;
  toggleLike: (manifestationId: string, userAddress: string) => void;
  toggleSupport: (manifestationId: string, userAddress: string) => void;
  addComment: (manifestationId: string, comment: Omit<CommunityComment, 'id' | 'createdAt' | 'likes'>) => void;
  shareManifestationToCommunity: (manifestation: any, userAddress: string) => void;
  updateCommunityStats: () => void;
}

// This would normally come from your backend/blockchain
const generateMockData = (): CommunityManifestation[] => [
  {
    id: crypto.randomUUID(),
    title: 'Build a $1M ARR SaaS',
    description: 'Creating a platform that helps indie developers monetize their side projects. Already have 100 beta users!',
    emoji: '💰',
    state: 'working',
    author: {
      name: 'Alex Chen',
      address: '0x1234567890123456789012345678901234567890',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=alex`,
      verified: true
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    supporters: [],
    likes: [],
    comments: [],
    category: 'Business',
    progress: 65,
    isPublic: true,
    tags: ['startup', 'saas', 'indie']
  },
  {
    id: crypto.randomUUID(),
    title: 'Complete Ironman Triathlon',
    description: 'Training for my first Ironman in Hawaii. 6 months of preparation, swimming 3km, cycling 180km, running 42km.',
    emoji: '🏊‍♂️',
    state: 'working',
    author: {
      name: 'Maria Santos',
      address: '0x9876543210987654321098765432109876543210',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=maria`,
      verified: false
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    supporters: [],
    likes: [],
    comments: [],
    category: 'Health',
    progress: 40,
    isPublic: true,
    tags: ['fitness', 'triathlon', 'endurance']
  }
  // Add more as needed...
];

export const useCommunityStore = create<CommunityStore>()(
  persist(
    (set, get) => ({
      manifestations: [],
      stats: {
        totalDreamers: 0,
        totalManifested: 0,
        totalSupport: 0,
        categoryCounts: {},
        trendingCategories: []
      },
      isLoading: false,
      
      fetchCommunityData: async () => {
        set({ isLoading: true });
        
        try {
          // In a real app, this would be an API call
          // const response = await fetch('/api/community/manifestations');
          // const data = await response.json();
          
          // For now, use mock data
          const mockData = generateMockData();
          
          set({ 
            manifestations: mockData,
            isLoading: false 
          });
          
          get().updateCommunityStats();
        } catch (error) {
          console.error('Failed to fetch community data:', error);
          set({ isLoading: false });
        }
      },
      
      toggleLike: (manifestationId: string, userAddress: string) => {
        set((state) => ({
          manifestations: state.manifestations.map((m) => {
            if (m.id === manifestationId) {
              const hasLiked = m.likes.includes(userAddress);
              return {
                ...m,
                likes: hasLiked 
                  ? m.likes.filter(addr => addr !== userAddress)
                  : [...m.likes, userAddress]
              };
            }
            return m;
          })
        }));
        
        get().updateCommunityStats();
      },
      
      toggleSupport: (manifestationId: string, userAddress: string) => {
        set((state) => ({
          manifestations: state.manifestations.map((m) => {
            if (m.id === manifestationId) {
              const hasSupported = m.supporters.includes(userAddress);
              return {
                ...m,
                supporters: hasSupported 
                  ? m.supporters.filter(addr => addr !== userAddress)
                  : [...m.supporters, userAddress]
              };
            }
            return m;
          })
        }));
        
        get().updateCommunityStats();
      },
      
      addComment: (manifestationId: string, comment: Omit<CommunityComment, 'id' | 'createdAt' | 'likes'>) => {
        const newComment: CommunityComment = {
          ...comment,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          likes: []
        };
        
        set((state) => ({
          manifestations: state.manifestations.map((m) => {
            if (m.id === manifestationId) {
              return {
                ...m,
                comments: [...m.comments, newComment]
              };
            }
            return m;
          })
        }));
      },
      
      shareManifestationToCommunity: (manifestation: any, userAddress: string) => {
        const communityManifestation: CommunityManifestation = {
          ...manifestation,
          author: {
            name: `User ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`,
            address: userAddress,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userAddress}`,
            verified: false
          },
          supporters: [],
          likes: [],
          comments: [],
          isPublic: true,
          tags: []
        };
        
        set((state) => ({
          manifestations: [communityManifestation, ...state.manifestations]
        }));
        
        get().updateCommunityStats();
      },
      
      updateCommunityStats: () => {
        const manifestations = get().manifestations;
        
        const categoryCounts = manifestations.reduce((acc, m) => {
          acc[m.category] = (acc[m.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const trendingCategories = Object.entries(categoryCounts)
          .map(([name, count]) => ({
            name,
            count,
            emoji: getCategoryEmoji(name),
            growth: `+${Math.floor(Math.random() * 20 + 5)}%` // Mock growth
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        const totalSupport = manifestations.reduce((acc, m) => acc + m.supporters.length + m.likes.length, 0);
        const totalManifested = manifestations.filter(m => m.state === 'done').length;
        
        set({
          stats: {
            totalDreamers: manifestations.length,
            totalManifested,
            totalSupport,
            categoryCounts,
            trendingCategories
          }
        });
      }
    }),
    {
      name: 'community-storage',
    }
  )
);

const getCategoryEmoji = (category: string): string => {
  const emojiMap: Record<string, string> = {
    'Business': '💼',
    'Health': '💪',
    'Learning': '📚',
    'Creative': '🎨',
    'Adventure': '🌍',
    'Technology': '💻',
    'Lifestyle': '🌟',
    'Finance': '💰'
  };
  return emojiMap[category] || '✨';
};