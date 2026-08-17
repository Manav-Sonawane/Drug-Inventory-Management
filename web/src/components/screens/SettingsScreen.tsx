'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Sliders,
  Database,
  Snowflake,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Save,
  RefreshCw,
} from 'lucide-react';

export function SettingsScreen() {
  const [criticalStockThreshold, setCriticalStockThreshold] = useState<number>(20);
  const [coldChainTolerance, setColdChainTolerance] = useState<number>(1.5);
  const [expiryWarningDays, setExpiryWarningDays] = useState<number>(30);
  const [autoReorderEnabled, setAutoReorderEnabled] = useState<boolean>(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState<boolean>(true);
  const [emailDigestFrequency, setEmailDigestFrequency] = useState<string>('Daily Morning 08:00 AM');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveSettings = () => {
    showToast('System configuration & alert thresholds saved successfully.');
  };

  return (
    <div className="space-y-6" id="settings-view">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 tracking-wider uppercase mb-1">
            <Settings className="w-4 h-4" />
            <span>Statewide Parameters</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            System & Alert Threshold Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure automated replenishment trigger points, cold-chain sensor deviation allowances, and notification routing.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cold Chain & Inventory Threshold Rules */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-slate-900 text-sm">Inventory & Cold Chain Trigger Rules</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between font-medium text-slate-700 mb-1">
                <span>Critical Stock Warning Threshold (%)</span>
                <span className="font-bold text-blue-900">{criticalStockThreshold}% of minimum buffer</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={criticalStockThreshold}
                onChange={(e) => setCriticalStockThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Triggers statewide urgent re-route banner when facility stock drops below this capacity.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between font-medium text-slate-700 mb-1">
                <span>Cold Chain IoT Temperature Deviation Allowance</span>
                <span className="font-bold text-cyan-700">±{coldChainTolerance}°C</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={coldChainTolerance}
                onChange={(e) => setColdChainTolerance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Target range is 2°C - 8°C. Excursions beyond {coldChainTolerance}°C trigger immediate SMS alerts.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between font-medium text-slate-700 mb-1">
                <span>Near-Expiry Priority Flag (Days)</span>
                <span className="font-bold text-amber-600">{expiryWarningDays} Days</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={expiryWarningDays}
                onChange={(e) => setExpiryWarningDays(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Batches with expiry closer than {expiryWarningDays} days will appear on first-in-first-out priority queues.
              </p>
            </div>
          </div>
        </div>

        {/* Automated Protocols & Notification Dispatch */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-slate-900 text-sm">Automated Dispatch & Notification Matrix</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <div className="font-semibold text-slate-900">AI Auto-Reorder Replenishment</div>
                <div className="text-[11px] text-slate-500">Automatically draft purchase orders when primary depot runs low</div>
              </div>
              <input
                type="checkbox"
                checked={autoReorderEnabled}
                onChange={(e) => setAutoReorderEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-900 accent-blue-900 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <div className="font-semibold text-slate-900">SMS Critical Dispatch Alerts</div>
                <div className="text-[11px] text-slate-500">Instant SMS dispatch to District Medical Officers on cold chain breach</div>
              </div>
              <input
                type="checkbox"
                checked={smsAlertsEnabled}
                onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-900 accent-blue-900 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Statewide Executive Digest Delivery</label>
              <select
                value={emailDigestFrequency}
                onChange={(e) => setEmailDigestFrequency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden"
              >
                <option>Daily Morning 08:00 AM</option>
                <option>Twice Daily (08:00 AM & 18:00 PM)</option>
                <option>Weekly Consolidated Monday</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
