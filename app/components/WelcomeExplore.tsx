'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";

// Mock data for inspiration - in real app this would come from your backend
const inspirationManifestations = [
  {
    id: '1',
    title: 'Launch my first startup',
    description: 'Building a web3 platform to help creators monetize their content',
    emoji: '🚀',
    state: 'working',
    author: 'Sarah Chen',
    timeAgo: '2 days ago',
    supporters: 23,
    category: 'Business'
  },
  {
    id: '2', 
    title: 'Learn blockchain development',
    description: 'Master Solidity and build my first DeFi protocol',
    emoji: '🔗',
    state: 'working',
    author: 'Alex Rivera',
    timeAgo: '1 day ago',
    supporters: 45,
    category: 'Learning'
  },
  {
    id: '3',
    title: 'Travel to 10 countries',
    description: 'Experience different cultures and expand my worldview',
    emoji: '✈️',
    state: 'done',
    author: 'Maya Patel',
    timeAgo: '3 hours ago',
    supporters: 67,
    category: 'Adventure'
  },
  {
    id: '4',
    title: 'Build a sustainable lifestyle',
    description: 'Reduce my carbon footprint and live more mindfully',
    emoji: '🌱',
    state: 'working',
    author: 'Jordan Kim',
    timeAgo: '5 hours ago',
    supporters: 34,
    category: 'Lifestyle'
  }
];

export function WelcomeExplore() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', 'Business', 'Learning', 'Adventure', 'Lifestyle', 'Health', 'Creative'];
  
  const filteredManifestations = selectedCategory === 'all' 
    ? inspirationManifestations 
    : inspirationManifestations.filter(m => m.category === selectedCategory);

  const getStateBadge = (state: string) => {
    const styles = {
      dream: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      working: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return styles[state as keyof typeof styles] || styles.dream;
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

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-3 backdrop-blur-md">
          <div className="text-lg font-bold text-[var(--app-accent)]">1,247</div>
          <div className="text-xs text-[var(--app-foreground-muted)]">Dreamers</div>
        </div>
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-3 backdrop-blur-md">
          <div className="text-lg font-bold text-green-500">892</div>
          <div className="text-xs text-[var(--app-foreground-muted)]">Manifested</div>
        </div>
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-3 backdrop-blur-md">
          <div className="text-lg font-bold text-purple-500">3,456</div>
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

      {/* Inspiration Feed */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-[var(--app-foreground)]">
          💫 Community Dreams
        </h3>
        <div className="space-y-3">
          {filteredManifestations.map((manifestation) => (
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
                    <p className="text-sm text-[var(--app-foreground-muted)] mb-3">
                      {manifestation.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-[var(--app-foreground-muted)]">
                        <span>by {manifestation.author}</span>
                        <span>•</span>
                        <span>{manifestation.timeAgo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-xs h-8">
                          ❤️ {manifestation.supporters}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-8">
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