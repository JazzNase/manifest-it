'use client';

import { useManifestationStore } from '../store/manifestationStore';
import { Button } from './DemoComponents';

export function Dashboard() {
  const { user, energyLevel, getStats } = useManifestationStore();
  const stats = getStats();

  // Use user data if available, otherwise fallback to store
  const currentEnergyLevel = user?.energy_level ?? energyLevel;

  const getEnergyEmoji = (level: number) => {
    if (level >= 80) return '🔥';
    if (level >= 60) return '⚡';
    if (level >= 40) return '✨';
    if (level >= 20) return '🌟';
    return '💫';
  };

  const getEnergyColor = (level: number) => {
    if (level >= 80) return 'from-red-500 to-orange-500';
    if (level >= 60) return 'from-orange-500 to-yellow-500';
    if (level >= 40) return 'from-yellow-500 to-green-500';
    if (level >= 20) return 'from-green-500 to-blue-500';
    return 'from-blue-500 to-purple-500';
  };

  const getWelcomeMessage = () => {
    if (!user) return "🌟 Welcome, Dreamer";
    
    const name = user.name || `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`;
    return `🌟 Welcome Back, ${name}`;
  };

  const getSubMessage = () => {
    if (stats.total === 0) {
      return "Ready to manifest your first dream?";
    }
    if (user?.daily_streak && user.daily_streak > 0) {
      return `${user.daily_streak} day streak! Keep the momentum going...`;
    }
    return "Your manifestation journey continues...";
  };

  return (
    <div className="space-y-4">
      {/* Welcome Message */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{getWelcomeMessage()}</h2>
        <p className="text-[var(--app-foreground-muted)] text-sm">
          {getSubMessage()}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-2xl p-4 backdrop-blur-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--app-accent)]">{stats.total}</div>
            <div className="text-xs text-[var(--app-foreground-muted)]">Total Dreams</div>
          </div>
        </div>
        
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-2xl p-4 backdrop-blur-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{user?.completed_count || stats.done}</div>
            <div className="text-xs text-[var(--app-foreground-muted)]">Manifested</div>
          </div>
        </div>
      </div>

      {/* Streak & Total Stats */}
      {user && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-2xl p-4 backdrop-blur-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{user.daily_streak}</div>
              <div className="text-xs text-[var(--app-foreground-muted)]">Day Streak 🔥</div>
            </div>
          </div>
          
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-2xl p-4 backdrop-blur-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{user.total_manifestations}</div>
              <div className="text-xs text-[var(--app-foreground-muted)]">All Time</div>
            </div>
          </div>
        </div>
      )}

      {/* Energy Meter */}
      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Energy Level</span>
          <span className="text-2xl">{getEnergyEmoji(currentEnergyLevel)}</span>
        </div>
        
        <div className="w-full bg-[var(--app-gray)] rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full bg-gradient-to-r ${getEnergyColor(currentEnergyLevel)} transition-all duration-500`}
            style={{ width: `${currentEnergyLevel}%` }}
          />
        </div>
        
        <div className="text-xs text-[var(--app-foreground-muted)] text-center">
          {currentEnergyLevel}% - {currentEnergyLevel === 50 && stats.total === 0 ? 'Start manifesting to boost your energy!' : 'Keep manifesting!'}
        </div>
      </div>

      {/* Progress Breakdown */}
      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-2xl p-4 backdrop-blur-md">
        <h3 className="text-sm font-medium mb-3">Progress Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--app-foreground-muted)]">💭 Dreams</span>
            <span className="text-sm font-medium">{stats.dream}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--app-foreground-muted)]">🚀 Working On It</span>
            <span className="text-sm font-medium">{stats.working}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--app-foreground-muted)]">✅ Done</span>
            <span className="text-sm font-medium">{stats.done}</span>
          </div>
        </div>
      </div>

      {/* Daily Intent Section */}
      {user?.daily_intent && (
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-2xl p-4 backdrop-blur-md">
          <h3 className="text-sm font-medium mb-2">Today's Intent</h3>
          <p className="text-xs text-[var(--app-foreground-muted)] italic">
            "{user.daily_intent}"
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="pt-2">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full bg-gradient-to-r from-[var(--app-accent)] to-purple-500 text-white border-0 rounded-xl"
        >
          ✨ Create New Manifestation
        </Button>
      </div>
    </div>
  );
}