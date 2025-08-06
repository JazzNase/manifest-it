'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Manifestation } from '../types/manifestation';

interface ManifestationCardProps {
  manifestation: Manifestation;
  user?: {
    name: string;
    avatar?: string;
    id: string;
  };
  isPublic?: boolean;
  showSocialActions?: boolean;
  onStateChange?: (id: string, newState: Manifestation['state']) => void;
  onLike?: (id: string) => void;
  onSupport?: (id: string) => void;
}

export function ManifestationCard({ 
  manifestation, 
  user, 
  isPublic = false,
  showSocialActions = false,
  onStateChange,
  onLike,
  onSupport 
}: ManifestationCardProps) {
  const getStateBadgeColor = (state: Manifestation['state']) => {
    switch (state) {
      case 'dream': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'working': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  return (
    <Card className="w-full bg-[var(--app-card-bg)] border-[var(--app-card-border)] backdrop-blur-md">
      {user && (
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-[var(--app-accent)] text-white">
              {user.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-2 flex-1">
            <p className="text-sm font-medium text-[var(--app-foreground)]">{user.name}</p>
            <p className="text-xs text-[var(--app-foreground-muted)]">
              {formatDate(manifestation.createdAt)}
            </p>
          </div>
          <Badge className={getStateBadgeColor(manifestation.state)}>
            {manifestation.state === 'working' ? 'Working On It' : manifestation.state}
          </Badge>
        </CardHeader>
      )}
      
      <CardContent className={user ? '' : 'pt-6'}>
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{manifestation.emoji}</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--app-foreground)] mb-2">
              {manifestation.title}
            </h3>
            {manifestation.description && (
              <p className="text-sm text-[var(--app-foreground-muted)] mb-4">
                {manifestation.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {!user && onStateChange && (
            <>
              {manifestation.state === 'dream' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStateChange(manifestation.id, 'working')}
                  className="text-xs"
                >
                  🚀 Start Working
                </Button>
              )}
              {manifestation.state === 'working' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStateChange(manifestation.id, 'done')}
                  className="text-xs"
                >
                  ✅ Mark Complete
                </Button>
              )}
              {manifestation.state === 'done' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStateChange(manifestation.id, 'archived')}
                  className="text-xs"
                >
                  📁 Archive
                </Button>
              )}
            </>
          )}

          {showSocialActions && (
            <>
              <Button variant="ghost" size="sm" onClick={() => onLike?.(manifestation.id)}>
                ❤️ Support
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onSupport?.(manifestation.id)}>
                💫 Inspired
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}