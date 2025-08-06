'use client';

import { useState } from 'react';
import { useManifestationStore } from '../store/manifestationStore';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DailyIntent() {
  const { dailyIntent, setDailyIntent, energyLevel, updateEnergyLevel } = useManifestationStore();
  const [currentIntent, setCurrentIntent] = useState(dailyIntent);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveIntent = () => {
    setDailyIntent(currentIntent);
    setIsEditing(false);
    // Boost energy when setting daily intent
    if (currentIntent.trim() && energyLevel < 90) {
      updateEnergyLevel(Math.min(100, energyLevel + 10));
    }
  };

  const promptQuestions = [
    "What are you manifesting today?",
    "What energy do you want to attract?",
    "How do you want to feel by the end of today?",
    "What would make today magical?",
    "What intention will guide your day?",
  ];

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅 Good Morning, Dreamer";
    if (hour < 17) return "☀️ Good Afternoon, Manifestor";
    return "🌙 Good Evening, Visionary";
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Your thoughts become your reality.",
      "What you seek is seeking you.",
      "Energy flows where attention goes.",
      "Believe in the magic of new beginnings.",
      "You are the author of your own story.",
      "Trust the process and stay aligned.",
      "Your vibe attracts your tribe.",
      "Manifest the life you&apos;ve always dreamed of."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <div className="space-y-6">
      {/* Greeting Card */}
      <Card className="bg-gradient-to-br from-[var(--app-accent)]/10 to-purple-500/10 border-[var(--app-card-border)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[var(--app-foreground)]">
            {getTimeBasedGreeting()}
          </CardTitle>
          <p className="text-sm text-[var(--app-foreground-muted)] italic">
            &ldquo;{getMotivationalQuote()}&rdquo;
          </p>
        </CardHeader>
      </Card>

      {/* Daily Intent Setting */}
      <Card className="bg-[var(--app-card-bg)] border-[var(--app-card-border)] backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg text-[var(--app-foreground)] flex items-center gap-2">
            🎯 Today&apos;s Intention
            {!isEditing && dailyIntent && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="ml-auto text-xs"
              >
                Edit
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing && dailyIntent ? (
            <div className="p-4 bg-[var(--app-accent)]/5 rounded-lg border border-[var(--app-accent)]/20">
              <p className="text-[var(--app-foreground)] leading-relaxed">
                {dailyIntent}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-sm text-[var(--app-foreground-muted)]">
                  Choose a prompt or write your own:
                </p>
                <div className="grid gap-2">
                  {promptQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIntent(question)}
                      className="text-left p-2 text-xs rounded-lg bg-[var(--app-card-bg)] border border-[var(--app-card-border)] hover:border-[var(--app-accent)] transition-colors text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="Set your intention for today..."
                value={currentIntent}
                onChange={(e) => setCurrentIntent(e.target.value)}
                className="border-[var(--app-card-border)] bg-[var(--app-background)] min-h-[100px]"
                rows={4}
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveIntent}
                  disabled={!currentIntent.trim()}
                  className="flex-1 bg-[var(--app-accent)] hover:bg-[var(--app-accent)]/80"
                >
                  ✨ Set Intention
                </Button>
                {isEditing && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentIntent(dailyIntent);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Energy Boost */}
      <Card className="bg-[var(--app-card-bg)] border-[var(--app-card-border)] backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg text-[var(--app-foreground)]">
            ⚡ Energy Alignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--app-foreground-muted)] mb-4">
            Take a moment to align your energy with your intentions.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateEnergyLevel(Math.min(100, energyLevel + 5))}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-lg mb-1">🧘‍♀️</span>
              <span className="text-xs">Breathe</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateEnergyLevel(Math.min(100, energyLevel + 8))}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-lg mb-1">🙏</span>
              <span className="text-xs">Gratitude</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateEnergyLevel(Math.min(100, energyLevel + 10))}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-lg mb-1">💫</span>
              <span className="text-xs">Visualize</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateEnergyLevel(Math.min(100, energyLevel + 15))}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-lg mb-1">🎯</span>
              <span className="text-xs">Affirm</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Energy Display */}
      <Card className="bg-[var(--app-card-bg)] border-[var(--app-card-border)] backdrop-blur-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl mb-2">
              {energyLevel >= 80 ? '🔥' : energyLevel >= 60 ? '⚡' : energyLevel >= 40 ? '✨' : '💫'}
            </div>
            <p className="text-sm text-[var(--app-foreground-muted)]">
              Energy Level: <span className="font-semibold text-[var(--app-accent)]">{energyLevel}%</span>
            </p>
            <div className="w-full bg-[var(--app-gray)] rounded-full h-2 mt-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-[var(--app-accent)] to-purple-500 transition-all duration-500"
                style={{ width: `${energyLevel}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}