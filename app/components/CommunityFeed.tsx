'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useCommunityStore } from '../store/communityStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";

export function CommunityFeed() {
  const { address, isConnected } = useAccount();
  const { 
    manifestations, 
    stats, 
    isLoading,
    fetchCommunityData, 
    toggleLike, 
    toggleSupport 
  } = useCommunityStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');

  // Fetch community data on mount
  useEffect(() => {
    fetchCommunityData();
  }, [fetchCommunityData]);

  const categories = ['all', ...Object.keys(stats.categoryCounts)];

  const getStateBadge = (state: string) => {
    const styles = {
      dream: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      working: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return styles[state as keyof typeof styles] || styles.dream;
  };

  const filteredManifestations = manifestations.filter(m => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'trending') return matchesCategory && matchesSearch;
    if (activeTab === 'recent') return matchesCategory && matchesSearch;
    if (activeTab === 'completed') return matchesCategory && matchesSearch && m.state === 'done';
    
    return matchesCategory && matchesSearch;
  });

  const sortedManifestations = [...filteredManifestations].sort((a, b) => {
    if (activeTab === 'trending') return (b.supporters.length + b.likes.length) - (a.supporters.length + a.likes.length);
    if (activeTab === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return (b.supporters.length + b.likes.length) - (a.supporters.length + a.likes.length);
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  const handleLike = (manifestationId: string) => {
    if (address) {
      toggleLike(manifestationId, address);
    }
  };

  const handleSupport = (manifestationId: string) => {
    if (address) {
      toggleSupport(manifestationId, address);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-4xl mb-4">✨</div>
          <p className="text-[var(--app-foreground-muted)]">Loading community dreams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
          🌍 Community Dreams
        </h2>
        <p className="text-[var(--app-foreground-muted)]">
          Discover, support, and celebrate dreams from manifestors worldwide
        </p>
      </div>

      {/* Dynamic Community Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-3 backdrop-blur-md">
          <div className="text-lg font-bold text-[var(--app-accent)]">{stats.totalDreamers.toLocaleString()}</div>
          <div className="text-xs text-[var(--app-foreground-muted)]">Active Dreamers</div>
        </div>
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-3 backdrop-blur-md">
          <div className="text-lg font-bold text-green-500">{stats.totalManifested.toLocaleString()}</div>
          <div className="text-xs text-[var(--app-foreground-muted)]">Manifested</div>
        </div>
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-3 backdrop-blur-md">
          <div className="text-lg font-bold text-purple-500">{stats.totalSupport.toLocaleString()}</div>
          <div className="text-xs text-[var(--app-foreground-muted)]">Support Given</div>
        </div>
      </div>

      {/* Search & Dynamic Filters */}
      <div className="space-y-3">
        <Input
          placeholder="🔍 Search dreams, people, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-[var(--app-card-border)] bg-[var(--app-card-bg)]"
        />
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 
                "bg-[var(--app-accent)] text-white text-xs" : 
                "border-[var(--app-card-border)] text-[var(--app-foreground-muted)] text-xs"
              }
            >
              {category === 'all' ? 'All Categories' : `${category} (${stats.categoryCounts[category] || 0})`}
            </Button>
          ))}
        </div>
      </div>

      {/* Dynamic Trending Categories */}
      {stats.trendingCategories.length > 0 && (
        <Card className="bg-[var(--app-card-bg)] border-[var(--app-card-border)] backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--app-foreground)]">🔥 Trending Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {stats.trendingCategories.slice(0, 4).map((category) => (
                <div 
                  key={category.name}
                  className="p-3 bg-[var(--app-background)] rounded-lg border border-[var(--app-card-border)] cursor-pointer hover:border-[var(--app-accent)] transition-colors"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{category.emoji}</span>
                      <div>
                        <div className="text-sm font-medium text-[var(--app-foreground)]">{category.name}</div>
                        <div className="text-xs text-[var(--app-foreground-muted)]">{category.count} dreams</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      {category.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[var(--app-card-bg)] border border-[var(--app-card-border)]">
          <TabsTrigger value="trending" className="data-[state=active]:bg-[var(--app-accent)] data-[state=active]:text-white">
            🔥 Trending
          </TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-[var(--app-accent)] data-[state=active]:text-white">
            ⏰ Recent
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            ✅ Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {sortedManifestations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🌟</div>
              <p className="text-[var(--app-foreground-muted)]">
                No dreams found matching your filters.
              </p>
            </div>
          ) : (
            sortedManifestations.map((manifestation) => {
              const isLiked = address ? manifestation.likes.includes(address) : false;
              const isSupported = address ? manifestation.supporters.includes(address) : false;
              
              return (
                <Card key={manifestation.id} className="bg-[var(--app-card-bg)] border-[var(--app-card-border)] backdrop-blur-md hover:border-[var(--app-accent)]/50 transition-all">
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={manifestation.author.avatar} />
                        <AvatarFallback className="bg-[var(--app-accent)] text-white">
                          {manifestation.author.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-[var(--app-foreground)]">
                              {manifestation.author.name}
                            </span>
                            {manifestation.author.verified && (
                              <span className="text-blue-500">✓</span>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {manifestation.category}
                            </Badge>
                          </div>
                          <Badge className={getStateBadge(manifestation.state)}>
                            {manifestation.state === 'working' ? 'In Progress' : manifestation.state}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-xl">{manifestation.emoji}</span>
                          <h3 className="font-semibold text-[var(--app-foreground)]">
                            {manifestation.title}
                          </h3>
                        </div>
                        
                        <p className="text-sm text-[var(--app-foreground-muted)] mb-3">
                          {manifestation.description}
                        </p>

                        {/* Progress Bar */}
                        {manifestation.state === 'working' && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-[var(--app-foreground-muted)] mb-1">
                              <span>Progress</span>
                              <span>{manifestation.progress}%</span>
                            </div>
                            <div className="w-full bg-[var(--app-gray)] rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-[var(--app-accent)] to-purple-500 transition-all duration-500"
                                style={{ width: `${manifestation.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-[var(--app-foreground-muted)]">
                            <span>{formatTimeAgo(manifestation.createdAt)}</span>
                            <span>•</span>
                            <span>{manifestation.comments.length} comments</span>
                          </div>
                          
                          {isConnected ? (
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleLike(manifestation.id)}
                                className={`text-xs h-8 ${isLiked ? 'text-red-500' : ''}`}
                              >
                                {isLiked ? '❤️' : '🤍'} {manifestation.likes.length}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleSupport(manifestation.id)}
                                className={`text-xs h-8 ${isSupported ? 'text-purple-500' : ''}`}
                              >
                                {isSupported ? '💫' : '⭐'} {manifestation.supporters.length}
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-[var(--app-foreground-muted)]">
                                ❤️ {manifestation.likes.length}
                              </span>
                              <span className="text-xs text-[var(--app-foreground-muted)]">
                                💫 {manifestation.supporters.length}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Join Community CTA */}
      {!isConnected && (
        <Card className="bg-[var(--app-card-bg)] border-[var(--app-card-border)] backdrop-blur-md">
          <CardContent className="text-center pt-6 pb-6">
            <div className="text-2xl mb-3">🚀</div>
            <h3 className="font-semibold text-[var(--app-foreground)] mb-2">
              Join the Community
            </h3>
            <p className="text-sm text-[var(--app-foreground-muted)] mb-4">
              Connect your wallet to support dreams, share your journey, and be part of our manifestor community.
            </p>
            <ConnectWallet>
              <Button className="bg-gradient-to-r from-[var(--app-accent)] to-purple-500 text-white">
                ✨ Connect & Join
              </Button>
            </ConnectWallet>
          </CardContent>
        </Card>
      )}
    </div>
  );
}