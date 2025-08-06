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
  const { manifestations, addManifestation, updateManifestationState } = useManifestationStore();
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
            <Button className="bg-gradient-to-r from-[var(--app-accent)] to-purple-500 text-white border-0">
              ✨ New Dream
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[var(--app-background)] border-[var(--app-card-border)]">
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
                      className={`p-2 text-xl rounded-lg border-2 transition-all ${
                        newEmoji === emoji 
                          ? 'border-[var(--app-accent)] bg-[var(--app-accent)]/10' 
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
                className="border-[var(--app-card-border)] bg-[var(--app-card-bg)]"
              />
              
              <Textarea
                placeholder="Describe your manifestation in detail..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="border-[var(--app-card-border)] bg-[var(--app-card-bg)]"
                rows={3}
              />
              
              <Button 
                onClick={handleCreateManifestation}
                disabled={!newTitle.trim()}
                className="w-full bg-[var(--app-accent)] hover:bg-[var(--app-accent)]/80"
              >
                ✨ Manifest It
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs for filtering */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-[var(--app-card-bg)] border border-[var(--app-card-border)]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="dream">Dreams</TabsTrigger>
          <TabsTrigger value="working">Working</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {manifestations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[var(--app-foreground-muted)]">No manifestations yet. Create your first dream!</p>
            </div>
          ) : (
            manifestations.map((manifestation) => (
              <ManifestationCard
                key={manifestation.id}
                manifestation={manifestation}
                onStateChange={handleStateChange}
              />
            ))
          )}
        </TabsContent>

        {(['dream', 'working', 'done', 'archived'] as const).map((state) => (
          <TabsContent key={state} value={state} className="space-y-3 mt-4">
            {filterManifestations(state).map((manifestation) => (
              <ManifestationCard
                key={manifestation.id}
                manifestation={manifestation}
                onStateChange={handleStateChange}
              />
            ))}
            {filterManifestations(state).length === 0 && (
              <div className="text-center py-8">
                <p className="text-[var(--app-foreground-muted)]">No {state} manifestations yet.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}