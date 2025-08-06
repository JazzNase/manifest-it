'use client';

import { useState } from 'react';
import { useManifestationStore } from '../store/manifestationStore';
import { ManifestationCard } from './ManifestationCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Manifestation } from '../types/manifestation';

export function ManifestationList() {
  const { 
    manifestations, 
    addManifestation, 
    updateManifestationState, 
    updateManifestation, 
    deleteManifestation 
  } = useManifestationStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEmoji, setNewEmoji] = useState('✨');

  const handleCreateManifestation = () => {
    if (newTitle.trim()) {
      addManifestation(newTitle.trim(), newDescription.trim() || undefined, newEmoji);
      setNewTitle('');
      setNewDescription('');
      setNewEmoji('✨');
      setIsDialogOpen(false);
    }
  };

  const handleStateChange = (id: string, newState: Manifestation['state']) => {
    updateManifestationState(id, newState);
  };

  const handleUpdate = (id: string, updates: Partial<Manifestation>) => {
    updateManifestation(id, updates);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this manifestation? This action cannot be undone.')) {
      deleteManifestation(id);
    }
  };

  const filterManifestations = (state: Manifestation['state'] | 'all') => {
    if (state === 'all') return manifestations;
    return manifestations.filter(m => m.state === state);
  };

  const emojis = ['✨', '🌟', '💫', '🔥', '🚀', '💎', '🌙', '☀️', '🌈', '💝'];

  return (
    <div className="space-y-4">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">💭 Your Dreams</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[var(--app-accent)] to-purple-500 text-white border-0 hover:from-[var(--app-accent)]/80 hover:to-purple-500/80">
              ✨ New Dream
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[var(--app-background)] border-[var(--app-card-border)] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[var(--app-foreground)]">Create New Manifestation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Emoji Picker */}
              <div>
                <label className="text-sm font-medium text-[var(--app-foreground)] mb-2 block">
                  Choose an emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewEmoji(emoji)}
                      className={`p-2 text-xl rounded-lg border-2 transition-all hover:scale-110 ${
                        newEmoji === emoji 
                          ? 'border-[var(--app-accent)] bg-[var(--app-accent)]/10 scale-110' 
                          : 'border-[var(--app-card-border)] hover:border-[var(--app-accent)]/50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                placeholder="What do you want to manifest?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border-[var(--app-card-border)] bg-[var(--app-card-bg)] text-[var(--app-foreground)]"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleCreateManifestation()}
              />
              
              <Textarea
                placeholder="Describe your manifestation in detail..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="border-[var(--app-card-border)] bg-[var(--app-card-bg)] text-[var(--app-foreground)]"
                rows={3}
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateManifestation}
                  disabled={!newTitle.trim()}
                  className="flex-1 bg-[var(--app-accent)] hover:bg-[var(--app-accent)]/80 text-white"
                >
                  ✨ Manifest It
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setNewTitle('');
                    setNewDescription('');
                    setNewEmoji('✨');
                  }}
                  className="border-[var(--app-card-border)] text-[var(--app-foreground-muted)]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Summary */}
      {manifestations.length > 0 && (
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-2 backdrop-blur-md">
            <div className="text-lg font-bold text-[var(--app-accent)]">{manifestations.length}</div>
            <div className="text-xs text-[var(--app-foreground-muted)]">Total</div>
          </div>
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-2 backdrop-blur-md">
            <div className="text-lg font-bold text-blue-500">{filterManifestations('dream').length}</div>
            <div className="text-xs text-[var(--app-foreground-muted)]">Dreams</div>
          </div>
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-2 backdrop-blur-md">
            <div className="text-lg font-bold text-yellow-500">{filterManifestations('working').length}</div>
            <div className="text-xs text-[var(--app-foreground-muted)]">Working</div>
          </div>
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-2 backdrop-blur-md">
            <div className="text-lg font-bold text-green-500">{filterManifestations('done').length}</div>
            <div className="text-xs text-[var(--app-foreground-muted)]">Done</div>
          </div>
        </div>
      )}

      {/* Tabs for filtering */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] backdrop-blur-md">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-[var(--app-accent)] data-[state=active]:text-white"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="dream"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Dreams
          </TabsTrigger>
          <TabsTrigger 
            value="working"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
          >
            Working
          </TabsTrigger>
          <TabsTrigger 
            value="done"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Done
          </TabsTrigger>
          <TabsTrigger 
            value="archived"
            className="data-[state=active]:bg-gray-500 data-[state=active]:text-white"
          >
            Archived
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {manifestations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-lg font-semibold text-[var(--app-foreground)] mb-2">
                Start Your Manifestation Journey
              </h3>
              <p className="text-[var(--app-foreground-muted)] mb-6">
                Create your first dream and watch the magic unfold
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-[var(--app-accent)] to-purple-500 text-white"
              >
                ✨ Create Your First Dream
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {manifestations
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((manifestation) => (
                  <ManifestationCard
                    key={manifestation.id}
                    manifestation={manifestation}
                    onStateChange={handleStateChange}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        {(['dream', 'working', 'done', 'archived'] as const).map((state) => (
          <TabsContent key={state} value={state} className="space-y-3 mt-4">
            {filterManifestations(state).length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">
                  {state === 'dream' && '💭'}
                  {state === 'working' && '🚀'}
                  {state === 'done' && '🎉'}
                  {state === 'archived' && '📁'}
                </div>
                <p className="text-[var(--app-foreground-muted)]">
                  No {state === 'working' ? 'work in progress' : state} manifestations yet.
                </p>
                {state === 'dream' && (
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="mt-4 bg-[var(--app-accent)] text-white"
                  >
                    ✨ Create a Dream
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filterManifestations(state)
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .map((manifestation) => (
                    <ManifestationCard
                      key={manifestation.id}
                      manifestation={manifestation}
                      onStateChange={handleStateChange}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}