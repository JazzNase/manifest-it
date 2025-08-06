'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Manifestation } from '../types/manifestation';

interface ManifestationCardProps {
  manifestation: Manifestation;
  user?: {
    name: string;
    avatar?: string;
    id: string;
  };
  showSocialActions?: boolean;
  onStateChange?: (id: string, newState: Manifestation['state']) => void;
  onUpdate?: (id: string, updates: Partial<Manifestation>) => void;
  onDelete?: (id: string) => void;
  onLike?: (id: string) => void;
  onSupport?: (id: string) => void;
}

export function ManifestationCard({ 
  manifestation, 
  user, 
  showSocialActions = false,
  onStateChange,
  onUpdate,
  onDelete,
  onLike,
  onSupport 
}: ManifestationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(manifestation.title);
  const [editDescription, setEditDescription] = useState(manifestation.description || '');
  const [editEmoji, setEditEmoji] = useState(manifestation.emoji || '✨');

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

  const handleSaveEdit = () => {
    if (onUpdate && editTitle.trim()) {
      onUpdate(manifestation.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        emoji: editEmoji,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(manifestation.title);
    setEditDescription(manifestation.description || '');
    setEditEmoji(manifestation.emoji || '✨');
    setIsEditing(false);
  };

  const emojis = ['✨', '🌟', '💫', '🔥', '🚀', '💎', '🌙', '☀️', '🌈', '💝'];

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
        {!user && !isEditing && (
          <div className="flex justify-end gap-1 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="text-xs h-6 px-2"
            >
              ✏️
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete?.(manifestation.id)}
              className="text-xs h-6 px-2 text-red-500 hover:text-red-700"
            >
              🗑️
            </Button>
          </div>
        )}

        <div className="flex items-start space-x-3">
          {isEditing ? (
            <div className="flex flex-wrap gap-1 mb-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setEditEmoji(emoji)}
                  className={`p-1 text-lg rounded border ${
                    editEmoji === emoji 
                      ? 'border-[var(--app-accent)] bg-[var(--app-accent)]/10' 
                      : 'border-[var(--app-card-border)] hover:border-[var(--app-accent)]/50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-2xl">{manifestation.emoji}</span>
          )}
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-semibold"
                  placeholder="Manifestation title..."
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Describe your manifestation..."
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleSaveEdit}
                    disabled={!editTitle.trim()}
                    className="bg-[var(--app-accent)] hover:bg-[var(--app-accent)]/80"
                  >
                    ✅ Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-[var(--app-foreground)] mb-2">
                  {manifestation.title}
                </h3>
                {manifestation.description && (
                  <p className="text-sm text-[var(--app-foreground-muted)] mb-4">
                    {manifestation.description}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Buttons - only show when not editing */}
        {!isEditing && (
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
        )}
      </CardContent>
    </Card>
  );
}