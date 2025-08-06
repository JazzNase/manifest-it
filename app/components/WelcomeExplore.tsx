'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { supabase } from '../../lib/supabase';

// Updated interface to match Supabase response structure
interface CommunityManifestation {
  id: string;
  title: string;
  description: string | null;
  emoji: string;
  state: 'dream' | 'working' | 'done' | 'archived';
  category: string | null;
  created_at: string;
  users: {
    name: string | null;
    wallet_address: string;
  }; // Single object (not array)
  community_interactions: {
    id: string;
    type: string;
  }[];
}

interface CommunityStats {
  totalUsers: number;
  totalManifested: number;
  totalSupport: number;
}

export function WelcomeExplore() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [manifestations, setManifestations] = useState<CommunityManifestation[]>([]);
  const [stats, setStats] = useState<CommunityStats>({ totalUsers: 0, totalManifested: 0, totalSupport: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const categories = ['all', 'Business', 'Learning', 'Adventure', 'Lifestyle', 'Health', 'Creative'];
  
  // Fetch community stats
  const fetchCommunityStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      // Get completed manifestations
      const { count: totalManifested } = await supabase
        .from('manifestations')
        .select('*', { count: 'exact', head: true })
        .eq('state', 'done');
      
      // Get total support interactions
      const { count: totalSupport } = await supabase
        .from('community_interactions')
        .select('*', { count: 'exact', head: true });
      
      setStats({
        totalUsers: totalUsers || 0,
        totalManifested: totalManifested || 0,
        totalSupport: totalSupport || 0,
      });
    } catch (error) {
      console.error('Error fetching community stats:', error);
    }
  };

  // Fetch public manifestations
  const fetchPublicManifestations = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('manifestations')
        .select(`
          id,
          title,
          description,
          emoji,
          state,
          category,
          created_at,
          users (
            name,
            wallet_address
          ),
          community_interactions (
            id,
            type
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      // Filter by category if not 'all'
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        users: Array.isArray(item.users) ? item.users[0] : item.users
      })) as CommunityManifestation[];

      setManifestations(transformedData);
    } catch (error) {
      console.error('Error fetching manifestations:', error);
      setManifestations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and category change
  useEffect(() => {
    fetchCommunityStats();
    fetchPublicManifestations();
  }, [selectedCategory]);

  // Add support to a manifestation
  const addSupport = async (manifestationId: string) => {
    try {
      // For now, we'll just increment the interaction count
      // In a real app, you'd need user authentication
      console.log('Support added to manifestation:', manifestationId);
      
      // Refresh manifestations to show updated support count
      fetchPublicManifestations();
    } catch (error) {
      console.error('Error adding support:', error);
    }
  };

  const getStateBadge = (state: string) => {
    const styles = {
      dream: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      working: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return styles[state as keyof typeof styles] || styles.dream;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const getUserDisplayName = (user: CommunityManifestation['users']) => {
    if (!user) return 'Unknown User';
    if (user.name) return user.name;
    return `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <Card className="bg-gradient-to-br from-[var(--app-accent)]/10 to-purple-500/10 border-[var(--app-card-border)]">
        <CardContent className="text-center pt-8 pb-8">
          <div className="text-4xl mb-3">✨</div>
          <h2 className="text-2xl font-bold text-[var(--app-foreground)] mb-3">
            Welcome to Manifest It
          </h2>
          <p className="text-[var(--app-foreground-muted)] mb-6 leading-relaxed">
            Discover dreams from our community of manifestors. Get inspired, offer support, 
            and connect with others on their journey.
          </p>
          <ConnectWallet>
            <Button className="bg-gradient-to-r from-[var(--app-accent)] to-purple-500 text-white border-0">
              🌟 Start Your Journey
            </Button>
          </ConnectWallet>
        </CardContent>
      </Card>

      {/* Real-time Community Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-3 backdrop-blur-md">
          <div className="text-lg font-bold text-[var(--app-accent)]">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--app-foreground-muted)]">Dreamers</div>
        </div>
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-3 backdrop-blur-md">
          <div className="text-lg font-bold text-green-500">
            {stats.totalManifested.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--app-foreground-muted)]">Manifested</div>
        </div>
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-3 backdrop-blur-md">
          <div className="text-lg font-bold text-purple-500">
            {stats.totalSupport.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--app-foreground-muted)]">Support Given</div>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-[var(--app-foreground)]">
          🎯 Explore by Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 
                "bg-[var(--app-accent)] text-white" : 
                "border-[var(--app-card-border)] text-[var(--app-foreground-muted)]"
              }
            >
              {category === 'all' ? 'All Dreams' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Live Community Feed */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-[var(--app-foreground)]">
          💫 Live Community Dreams
        </h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[var(--app-card-bg)] border-[var(--app-card-border)]">
                <CardContent className="pt-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : manifestations.length === 0 ? (
          <Card className="bg-[var(--app-card-bg)] border-[var(--app-card-border)]">
            <CardContent className="text-center pt-8 pb-8">
              <div className="text-3xl mb-3">🌟</div>
              <h4 className="font-semibold text-[var(--app-foreground)] mb-2">
                No public dreams yet
              </h4>
              <p className="text-sm text-[var(--app-foreground-muted)]">
                Be the first to share your manifestation with the community!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {manifestations.map((manifestation) => (
              <Card key={manifestation.id} className="bg-[var(--app-card-bg)] border-[var(--app-card-border)] backdrop-blur-md hover:border-[var(--app-accent)]/50 transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{manifestation.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[var(--app-foreground)]">
                          {manifestation.title}
                        </h4>
                        <Badge className={getStateBadge(manifestation.state)}>
                          {manifestation.state === 'working' ? 'In Progress' : manifestation.state}
                        </Badge>
                      </div>
                      {manifestation.description && (
                        <p className="text-sm text-[var(--app-foreground-muted)] mb-3">
                          {manifestation.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-[var(--app-foreground-muted)]">
                          <span>by {getUserDisplayName(manifestation.users)}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(manifestation.created_at)}</span>
                          {manifestation.category && (
                            <>
                              <span>•</span>
                              <span>{manifestation.category}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-8"
                            onClick={() => addSupport(manifestation.id)}
                          >
                            ❤️ {manifestation.community_interactions?.length || 0}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-8"
                            onClick={() => addSupport(manifestation.id)}
                          >
                            💫 Support
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <Card className="bg-[var(--app-card-bg)] border-[var(--app-card-border)] backdrop-blur-md">
        <CardContent className="text-center pt-6 pb-6">
          <div className="text-2xl mb-3">🚀</div>
          <h3 className="font-semibold text-[var(--app-foreground)] mb-2">
            Ready to Start Your Journey?
          </h3>
          <p className="text-sm text-[var(--app-foreground-muted)] mb-4">
            Connect your wallet to create your first manifestation and join our community of dreamers.
          </p>
          <ConnectWallet>
            <Button className="bg-gradient-to-r from-[var(--app-accent)] to-purple-500 text-white">
              ✨ Connect & Manifest
            </Button>
          </ConnectWallet>
        </CardContent>
      </Card>
    </div>
  );
}