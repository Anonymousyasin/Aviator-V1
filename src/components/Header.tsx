import React from 'react';
import { useWallet } from '../context/WalletContext';
import { formatBDT } from '../utils/format';
import { Volume2, VolumeX, Gift, ShieldCheck, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenCashier: (tab: 'deposit' | 'withdraw' | 'history') => void;
  onOpenDaily: () => void;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCashier,
  onOpenDaily,
  onOpenRules,
}) => {
  const { balance, vipTier, language, setLanguage, soundMuted, toggleSound } = useWallet();

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e14]/98 backdrop-blur-md border-b border-[#1f2433] px-3.5 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Zone 1: Official Aviator Brand */}
        <div className="flex items-center gap-2.5 shrink-0 select-none">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#e50539]/60 shadow-md shadow-red-500/20">
            <img
              src="/assets/aistudio/download_5e885c0f.jpeg"
              alt="Aviator"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black italic tracking-tighter text-xl sm:text-2xl text-[#e50539]">
              Aviator
            </span>
            <span className="text-[10px] font-bold text-slate-400 border border-slate-700 rounded px-1 py-0.2 hidden sm:inline-block">
              Spribe 1:1
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation & Quick Actions */}
        <div className="hidden md:flex items-center gap-4 text-xs font-bold text-slate-300">
          <button
            onClick={onOpenDaily}
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg cursor-pointer"
          >
            <Gift className="w-4 h-4" />
            <span>{language === 'bn' ? 'ফ্রি ৳১০০ দাবি' : 'Claim Free ৳100'}</span>
          </button>

          <button
            onClick={onOpenRules}
            className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'নিয়মাবলী' : 'How to Play'}</span>
          </button>

          <button
            onClick={() => onOpenCashier('history')}
            className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400 cursor-pointer"
          >
            <span>{language === 'bn' ? 'লেনদেন হিস্ট্রি' : 'History'}</span>
          </button>
        </div>

        {/* Zone 3: Wallet Action Cluster & Settings */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-1.5 text-slate-400 hover:text-white bg-[#151924] border border-[#232b3d] rounded-lg transition-colors cursor-pointer"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="px-2 py-1 text-xs font-bold text-slate-300 bg-[#151924] hover:bg-[#1c2232] border border-[#232b3d] rounded-lg transition-colors cursor-pointer"
          >
            {language === 'en' ? 'বাংলা' : 'ENG'}
          </button>

          {/* Balance Chip */}
          <div
            onClick={() => onOpenCashier('deposit')}
            className="flex items-center gap-2 bg-[#121622] border border-[#222a3d] hover:border-emerald-500/50 rounded-xl px-2.5 sm:px-3 py-1.5 cursor-pointer shadow-inner transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-[#00e701] animate-pulse" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                BDT ({vipTier})
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#00e701] font-mono tabular-nums leading-none">
                {formatBDT(balance)}
              </span>
            </div>
          </div>

          {/* Deposit Button */}
          <button
            onClick={() => onOpenCashier('deposit')}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-black tracking-wide rounded-xl bg-gradient-to-r from-[#ffd75e] via-[#eab308] to-[#d97706] text-[#1c1200] hover:brightness-110 active:scale-95 shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            {language === 'bn' ? 'ডিপোজিট' : 'Deposit'}
          </button>
        </div>

      </div>
    </header>
  );
};
