"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
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
import { Button, Icon } from "./components/DemoComponents";
import { Dashboard } from "./components/Dashboard";
import { ManifestationList } from "./components/ManifestationList";
import { DailyIntent } from "./components/DailyIntent";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-6 h-11">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--app-accent)] to-purple-500 bg-clip-text text-transparent">
              ✨ Manifest It
            </h1>
            <Wallet className="mt-1">
              <ConnectWallet>
                <Name className="text-xs text-[var(--app-foreground-muted)]" />
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
          <div>{saveFrameButton}</div>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center mb-6">
          <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-full p-1 border border-[var(--app-card-border)]">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-[var(--app-accent)] text-white"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("manifestations")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === "manifestations"
                  ? "bg-[var(--app-accent)] text-white"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
            >
              Dreams
            </button>
            <button
              onClick={() => setActiveTab("intent")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === "intent"
                  ? "bg-[var(--app-accent)] text-white"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
            >
              Today
            </button>
          </div>
        </nav>

        <main className="flex-1">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "manifestations" && <ManifestationList />}
          {activeTab === "intent" && <DailyIntent />}
        </main>

        <footer className="mt-6 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://basedgigs.com/listing/mini-app-challenge")}
          >
            💫 Made with intention by Jazz Michael Nase
          </Button>
        </footer>
      </div>
    </div>
  );
}