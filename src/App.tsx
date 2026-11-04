/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Header } from './components/Header';
import { MarqueeTicker } from './components/MarqueeTicker';
import { BottomNav } from './components/BottomNav';
import { CashierModal } from './components/CashierModal';
import { DailyBonusModal } from './components/DailyBonusModal';
import { VipClubModal } from './components/VipClubModal';
import { RulesModal } from './components/RulesModal';
import { AviatorGame } from './games/AviatorGame';

const MainContent: React.FC = () => {
  const [cashierOpen, setCashierOpen] = useState<boolean>(false);
  const [cashierTab, setCashierTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [dailyBonusOpen, setDailyBonusOpen] = useState<boolean>(false);
  const [vipClubOpen, setVipClubOpen] = useState<boolean>(false);
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);

  const openCashier = (tab: 'deposit' | 'withdraw' | 'history' = 'deposit') => {
    setCashierTab(tab);
    setCashierOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-[#e50539] selection:text-white pb-16 md:pb-6">
      {/* 1. Header with Aviator branding & BDT Wallet */}
      <Header
        onOpenCashier={openCashier}
        onOpenDaily={() => setDailyBonusOpen(true)}
        onOpenRules={() => setRulesOpen(true)}
      />

      {/* 2. Live Aviator Bangladesh Payouts Marquee */}
      <MarqueeTicker />

      {/* 3. 100% Dedicated 1:1 Spribe Aviator Crash Game Stage */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-2 sm:p-4 lg:p-6">
        <AviatorGame onOpenRules={() => setRulesOpen(true)} />
      </main>

      {/* 4. Cashier & Modals */}
      <CashierModal
        isOpen={cashierOpen}
        initialTab={cashierTab}
        onClose={() => setCashierOpen(false)}
      />

      <DailyBonusModal
        isOpen={dailyBonusOpen}
        onClose={() => setDailyBonusOpen(false)}
      />

      <VipClubModal
        isOpen={vipClubOpen}
        onClose={() => setVipClubOpen(false)}
      />

      <RulesModal
        isOpen={rulesOpen}
        onClose={() => setRulesOpen(false)}
      />

      {/* 5. Mobile Bottom Navigation Bar */}
      <BottomNav
        onOpenCashier={openCashier}
        onOpenDaily={() => setDailyBonusOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <WalletProvider>
      <MainContent />
    </WalletProvider>
  );
}
