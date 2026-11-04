import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { PaymentMethod, Transaction } from '../types';
import { formatBDT, isValidBDPhone } from '../utils/format';
import { X, CheckCircle, Clock, AlertCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck, Copy, Sparkles } from 'lucide-react';

interface CashierModalProps {
  isOpen: boolean;
  initialTab?: 'deposit' | 'withdraw' | 'history';
  onClose: () => void;
}

export const CashierModal: React.FC<CashierModalProps> = ({
  isOpen,
  initialTab = 'deposit',
  onClose,
}) => {
  const { balance, transactions, deposit, withdraw, firstDepositBonusClaimed } = useWallet();
  const [tab, setTab] = useState<'deposit' | 'withdraw' | 'history'>(initialTab);
  const [method, setMethod] = useState<PaymentMethod>('bKash');
  const [phone, setPhone] = useState<string>('01712345678');
  const [amount, setAmount] = useState<string>('1000');
  const [trxId, setTrxId] = useState<string>('');
  const [step, setStep] = useState<1 | 2>(1);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const handleDepositStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!isValidBDPhone(phone)) {
      setMessage({ text: 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).', type: 'error' });
      return;
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val < 200 || val > 50000) {
      setMessage({ text: 'Deposit amount must be between ৳200 and ৳50,000.', type: 'error' });
      return;
    }
    setStep(2);
  };

  const handleDepositFinal = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const cleanId = trxId.trim().toUpperCase();
    if (cleanId.length < 8) {
      setMessage({ text: 'Transaction ID must be at least 8 characters (e.g. 9B8N4K2L).', type: 'error' });
      return;
    }

    const val = parseFloat(amount);
    const result = deposit(method, phone, val, cleanId);
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      setStep(1);
      setTrxId('');
      setTimeout(() => {
        setTab('history');
      }, 1200);
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!isValidBDPhone(phone)) {
      setMessage({ text: 'Please enter a valid 11-digit Bangladeshi mobile number.', type: 'error' });
      return;
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val < 500) {
      setMessage({ text: 'Minimum withdrawal is ৳500.', type: 'error' });
      return;
    }
    if (val > balance) {
      setMessage({ text: 'Insufficient balance in your wallet.', type: 'error' });
      return;
    }

    const result = withdraw(method, phone, val);
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      setTimeout(() => {
        setTab('history');
      }, 1500);
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  const autofillDemoTrx = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = '';
    for (let i = 0; i < 10; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTrxId(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0f1726] border border-[#f5c242]/25 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0b101c]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400">
              ৳
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-lg leading-tight">Cashier & Wallet</h3>
              <p className="text-xs text-slate-400">Balance: <span className="text-amber-400 font-bold font-mono">{formatBDT(balance)}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-3 p-1.5 bg-[#080d16] border-b border-slate-800 gap-1 text-xs font-semibold">
          <button
            onClick={() => { setTab('deposit'); setStep(1); setMessage(null); }}
            className={`py-2 rounded-xl transition-all ${tab === 'deposit' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Deposit (ডিপোজিট)
          </button>
          <button
            onClick={() => { setTab('withdraw'); setMessage(null); }}
            className={`py-2 rounded-xl transition-all ${tab === 'withdraw' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Withdraw (উইথড্র)
          </button>
          <button
            onClick={() => { setTab('history'); setMessage(null); }}
            className={`py-2 rounded-xl transition-all ${tab === 'history' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            History (হিস্ট্রি)
          </button>
        </div>

        {/* Notification Banner */}
        {message && (
          <div className={`mx-5 mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' : 'bg-red-950/80 border border-red-500/40 text-red-300'}`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* DEPOSIT TAB */}
          {tab === 'deposit' && (
            <div>
              {/* Payment Method Selector */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-400 mb-2">Select Payment Method (পদ্ধতি নির্বাচন)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('bKash')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${method === 'bKash' ? 'bg-[#e2136e]/20 border-[#e2136e] text-white shadow-lg' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#e2136e] flex items-center justify-center font-black text-white text-xs">
                      bK
                    </div>
                    <span className="text-xs font-bold">bKash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('Nagad')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${method === 'Nagad' ? 'bg-[#f6921e]/20 border-[#f6921e] text-white shadow-lg' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#f6921e] flex items-center justify-center font-black text-white text-xs">
                      Ng
                    </div>
                    <span className="text-xs font-bold">Nagad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('Rocket')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${method === 'Rocket' ? 'bg-[#8c3494]/20 border-[#8c3494] text-white shadow-lg' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#8c3494] flex items-center justify-center font-black text-white text-xs">
                      Rk
                    </div>
                    <span className="text-xs font-bold">Rocket</span>
                  </button>
                </div>
              </div>

              {!firstDepositBonusClaimed && (
                <div className="p-3 mb-4 rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/30 flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-amber-300 block">100% First Deposit Match Bonus</span>
                    <span className="text-slate-400">Deposit now and get up to ৳10,000 extra free credits!</span>
                  </div>
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleDepositStep1} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Your {method} Mobile Number (আপনার মোবাইল নম্বর)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      maxLength={11}
                      className="w-full bg-[#080d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Deposit Amount (৳200 – ৳50,000)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="200"
                      max="50000"
                      className="w-full bg-[#080d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                      required
                    />
                    <div className="grid grid-cols-5 gap-1.5 mt-2">
                      {quickAmounts.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setAmount(q.toString())}
                          className="py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg transition-colors"
                        >
                          +{q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                  >
                    Continue to Payment Instructions →
                  </button>
                </form>
              ) : (
                <form onSubmit={handleDepositFinal} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#080d16] border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                      <span>Method: <b className="text-slate-200">{method}</b></span>
                      <span>Amount: <b className="text-amber-400 font-mono">৳{parseFloat(amount).toLocaleString()}</b></span>
                    </div>

                    <p className="text-slate-300 font-medium">
                      1. Open your <b>{method} App</b> and tap <b>Send Money</b>.
                    </p>
                    <p className="text-slate-300 font-medium">
                      2. Send <b className="text-amber-400">৳{parseFloat(amount).toLocaleString()}</b> to Merchant/Agent Number:
                    </p>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-sm text-amber-300 font-bold">
                      <span>01789-224466</span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Ace67 Merchant</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      3. After sending, enter your Transaction ID (TrxID) below to receive instant credits.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-400">
                        Enter {method} Transaction ID (TrxID)
                      </label>
                      <button
                        type="button"
                        onClick={autofillDemoTrx}
                        className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Sparkles className="w-3 h-3" /> Auto-fill Demo TrxID
                      </button>
                    </div>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      placeholder="e.g. 9H7K2LMN4P"
                      maxLength={14}
                      className="w-full bg-[#080d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase text-slate-100 tracking-wider focus:outline-none focus:border-amber-400 font-bold"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                    >
                      Confirm Deposit (নিশ্চিত করুন)
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* WITHDRAW TAB */}
          {tab === 'withdraw' && (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Withdraw to (পদ্ধতি নির্বাচন)</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bKash', 'Nagad', 'Rocket'] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${method === m ? 'bg-amber-500/20 border-amber-400 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Recipient {method} Account Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  maxLength={11}
                  className="w-full bg-[#080d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-400">
                    Withdrawal Amount (Min ৳500)
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmount(balance.toString())}
                    className="text-[11px] text-amber-400 hover:underline font-semibold"
                  >
                    All In (৳{Math.floor(balance).toLocaleString()})
                  </button>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="500"
                  max={balance}
                  className="w-full bg-[#080d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p>• Fast withdrawal processing (average 3-5 minutes).</p>
                <p>• 0% withdrawal processing fee for Ace67 members.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
              >
                Request Withdrawal (উইথড্র রিকোয়েস্ট)
              </button>
            </form>
          )}

          {/* HISTORY TAB */}
          {tab === 'history' && (
            <div className="space-y-2.5">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No transaction history recorded yet.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-[#080d16] border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${tx.type === 'Withdraw' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {tx.type === 'Withdraw' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">{tx.type} ({tx.method})</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          ID: {tx.id} · {tx.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-bold ${tx.type === 'Withdraw' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {tx.type === 'Withdraw' ? '-' : '+'}{formatBDT(tx.amount)}
                      </div>
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${tx.status === 'Success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-amber-950 text-amber-400 border border-amber-800/50'}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#080d16] border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Secured</span>
          </div>
          <span>Demo credits only (18+)</span>
        </div>
      </div>
    </div>
  );
};
