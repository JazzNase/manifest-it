"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  useClose,
  useViewProfile,
  useNotification
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { Button, Icon } from "./components/DemoComponents";
import { Dashboard } from "./components/Dashboard";
import { ManifestationList } from "./components/ManifestationList";
import { DailyIntent } from "./components/DailyIntent";
import { WelcomeExplore } from "./components/WelcomeExplore";
import { CommunityFeed } from "./components/CommunityFeed";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { address, isConnected } = useAccount();

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const close = useClose();
  const viewProfile = useViewProfile();
  const sendNotification = useNotification();

  // Initialize frame when ready
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Auto-switch tabs based on connection status
  useEffect(() => {
    if (!isConnected && activeTab !== "explore" && activeTab !== "community") {
      setActiveTab("explore");
    }
  }, [isConnected, activeTab]);

  const handleAddFrame = useCallback(async () => {
    const result = await addFrame();
    if (result) {
      console.log('Frame added:', result.url, result.token);
      // In production, save these to your backend for notifications
      setFrameAdded(true);
    }
  }, [addFrame]);

  const handleSendNotification = useCallback(async () => {
    if (context?.client.added) {
      try {
        await sendNotification({
          title: '✨ Dream Update!',
          body: 'Your manifestation journey continues. Keep believing!'
        });
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }
  }, [sendNotification, context]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] px-2 py-1 text-xs"
        >
          ✨ Save
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-xs font-medium text-green-500">
          <span>✓ Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  const getNavigation = () => {
    if (!isConnected) {
      return (
        <nav className="flex justify-center mb-4">
          <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-full p-1 border border-[var(--app-card-border)]">
            <button
              onClick={() => setActiveTab("explore")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "explore"
                  ? "bg-gradient-to-r from-[var(--app-accent)] to-purple-500 text-white"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
            >
              ✨ Explore
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "community"
                  ? "bg-gradient-to-r from-[var(--app-accent)] to-purple-500 text-white"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
            >
              🌍 Community
            </button>
          </div>
        </nav>
      );
    }

    return (
      <nav className="flex justify-center mb-4">
        <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-full p-1 border border-[var(--app-card-border)]">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-[var(--app-accent)] text-white"
                : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("manifestations")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === "manifestations"
                ? "bg-[var(--app-accent)] text-white"
                : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
            }`}
          >
            Dreams
          </button>
          <button
            onClick={() => setActiveTab("intent")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === "intent"
                ? "bg-[var(--app-accent)] text-white"
                : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === "community"
                ? "bg-[var(--app-accent)] text-white"
                : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
            }`}
          >
            Community
          </button>
        </div>
      </nav>
    );
  };

  const getMainContent = () => {
    if (!isConnected) {
      if (activeTab === "explore") {
        return <WelcomeExplore />;
      }
      if (activeTab === "community") {
        return <CommunityFeed />;
      }
      return <WelcomeExplore />;
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "manifestations":
        return <ManifestationList />;
      case "intent":
        return <DailyIntent />;
      case "community":
        return <CommunityFeed />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme">
      <div className="w-full max-w-md mx-auto px-4 py-2">
        {/* MiniKit Header */}
        <header className="flex justify-between items-center mb-4 h-10">
          <div className="flex-1">
            <h1 className="text-lg font-bold bg-gradient-to-r from-[var(--app-accent)] to-purple-500 bg-clip-text text-transparent">
              ✨ Manifest It
            </h1>
            <Wallet>
              <ConnectWallet>
                <div className="flex items-center gap-1">
                  {isConnected ? (
                    <Name className="text-xs text-[var(--app-foreground-muted)]" />
                  ) : (
                    <span className="text-xs text-[var(--app-foreground-muted)]">
                      Connect wallet
                    </span>
                  )}
                </div>
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
          
          {/* MiniKit Controls */}
          <div className="flex items-center space-x-2">
            {saveFrameButton}
            {context?.client.added && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSendNotification}
                className="text-xs px-2 py-1"
              >
                🔔
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => viewProfile()}
              className="text-xs px-2 py-1"
            >
              👤
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={close}
              className="text-xs px-2 py-1"
            >
              ✕
            </Button>
          </div>
        </header>

        {getNavigation()}

        <main className="flex-1 pb-4">
          {getMainContent()}
        </main>

        <footer className="mt-4 pt-2 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs opacity-60"
            onClick={() => openUrl("https://basedgigs.com/listing/mini-app-challenge")}
          >
            💫 Built with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}