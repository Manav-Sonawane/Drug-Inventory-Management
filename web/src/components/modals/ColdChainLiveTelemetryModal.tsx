'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Snowflake,
  Thermometer,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Clock,
  Battery,
  Wifi,
  ShieldCheck,
  PhoneCall,
  Sliders,
} from 'lucide-react';

interface ColdChainLiveTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRerouteModal?: (title?: string) => void;
  onEmergencyReroute?: (vaultName?: string) => void;
}

export function ColdChainLiveTelemetryModal({
  isOpen,
  onClose,
  onOpenRerouteModal,
  onEmergencyReroute,
}: ColdChainLiveTelemetryModalProps) {
  const [selectedVault, setSelectedVault] = useState('Central-Vault-Alpha');
  const [currentTemp, setCurrentTemp] = useState(4.2);
  const [humidity, setHumidity] = useState(48);
  const [batteryLevel, setBatteryLevel] = useState(96);
  const [simulatingExcursion, setSimulatingExcursion] = useState(false);
  const [logs, setLogs] = useState<
    { time: string; temp: number; humidity: number; status: 'nominal' | 'warning' | 'critical' }[]
  >([
    { time: '10:45:00', temp: 4.1, humidity: 48, status: 'nominal' },
    { time: '10:45:30', temp: 4.2, humidity: 48, status: 'nominal' },
    { time: '10:46:00', temp: 4.2, humidity: 49, status: 'nominal' },
    { time: '10:46:30', temp: 4.3, humidity: 48, status: 'nominal' },
    { time: '10:47:00', temp: 4.2, humidity: 48, status: 'nominal' },
  ]);

  // Minor live oscillation
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      if (!simulatingExcursion) {
        const delta = (Math.random() - 0.5) * 0.15;
        const newTemp = Math.round((currentTemp + delta) * 10) / 10;
        const safeTemp = Math.max(3.6, Math.min(4.8, newTemp));
        setCurrentTemp(safeTemp);

        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        setLogs((prev) => [
          ...prev.slice(-7),
          { time: timeStr, temp: safeTemp, humidity, status: 'nominal' },
        ]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, currentTemp, simulatingExcursion, humidity]);

  if (!isOpen) return null;

  const handleToggleExcursion = () => {
    if (simulatingExcursion) {
      setSimulatingExcursion(false);
      setCurrentTemp(4.2);
    } else {
      setSimulatingExcursion(true);
      setCurrentTemp(8.9);
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setLogs((prev) => [
        ...prev.slice(-7),
        { time: timeStr, temp: 8.9, humidity: 68, status: 'critical' },
      ]);
    }
  };

  const isExcursion = currentTemp > 8.0 || currentTemp < 2.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-50 text-cyan-700 rounded-xl border border-cyan-100">
              <Snowflake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-800 bg-cyan-100/70 px-2 py-0.5 rounded">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-600" />
                  Live Sensor Feed (2.4 GHz IoT Mesh)
                </span>
                <span className="text-xs font-mono text-slate-500">Probe #SN-8821-KOL</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                IoT Cold Chain Telemetry & Vaccine Vault Monitor
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Top Vault Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Monitored Cold Unit:</span>
              <select
                value={selectedVault}
                onChange={(e) => setSelectedVault(e.target.value)}
                className="bg-white px-3 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-hidden"
              >
                <option value="Central-Vault-Alpha">State Central Hub - Vault Alpha (2°C - 8°C)</option>
                <option value="Deep-Freeze-Beta">State Central Hub - Deep Freeze Beta (-20°C)</option>
                <option value="Siliguri-ILR-01">Siliguri Regional Depot - ILR Unit 01</option>
                <option value="Malda-Rural-Cold-02">Malda Rural Depot - Vaccine Vault 02</option>
              </select>
            </div>

            <div className="flex items-center gap-4 text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <Battery className="w-4 h-4 text-emerald-600" />
                Probe Battery: <strong>{batteryLevel}%</strong>
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Wifi className="w-4 h-4 text-blue-900" />
                Signal: <strong>-62 dBm (Excellent)</strong>
              </span>
            </div>
          </div>

          {/* Excursion Warning Banner (if triggered) */}
          {isExcursion && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start justify-between gap-3 text-rose-900 animate-pulse">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">CRITICAL COLD-CHAIN TEMPERATURE EXCURSION</h4>
                  <p className="text-xs text-rose-700 mt-0.5">
                    Temperature reached <strong>{currentTemp}°C</strong> (Upper safe limit is 8.0°C). Secondary compressor
                    failure detected. Emergency protocol triggered.
                  </p>
                </div>
              </div>

              {(onEmergencyReroute || onOpenRerouteModal) && (
                <button
                  onClick={() => {
                    onClose();
                    if (onEmergencyReroute) {
                      onEmergencyReroute(selectedVault);
                    } else if (onOpenRerouteModal) {
                      onOpenRerouteModal('Emergency Cold-Chain Rebalance for ' + selectedVault);
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shrink-0 shadow-xs"
                >
                  Emergency Stock Reroute
                </button>
              )}
            </div>
          )}

          {/* Primary Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Live Temp Card */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                isExcursion
                  ? 'bg-rose-50/50 border-rose-200 ring-2 ring-rose-300'
                  : 'bg-emerald-50/40 border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={isExcursion ? 'text-rose-800' : 'text-emerald-800'}>
                  Current Core Temp
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isExcursion ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                  }`}
                >
                  {isExcursion ? 'BREACH' : 'NOMINAL'}
                </span>
              </div>
              <div
                className={`text-4xl font-black mt-2 font-mono ${
                  isExcursion ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {currentTemp > 0 ? `+${currentTemp.toFixed(1)}` : currentTemp.toFixed(1)}°C
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                Safe Envelope: <strong>+2.0°C to +8.0°C</strong>
              </div>
            </div>

            {/* Relative Humidity Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Vault Humidity</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 text-[10px] font-bold">
                  OPTIMAL
                </span>
              </div>
              <div className="text-4xl font-black mt-2 font-mono text-cyan-700">{humidity}%</div>
              <div className="text-[11px] text-slate-500 mt-2">
                Target range: <strong>40% - 60% RH</strong>
              </div>
            </div>

            {/* Generator Grid Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Backup Power Grid</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                  AUTO-SYNC
                </span>
              </div>
              <div className="text-xl font-bold mt-2 text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>Diesel Gen #2 Ready</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                Fuel Level: <strong>88% (42h runtime)</strong>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Strip */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900">IoT Simulation & Testing Mode</div>
              <div className="text-[11px] text-slate-500">
                Test how the automated hospital warning matrix and stock rebalance protocol react to temperature spikes.
              </div>
            </div>

            <button
              onClick={handleToggleExcursion}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
                simulatingExcursion
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{simulatingExcursion ? 'Reset to Safe Nominal (+4.2°C)' : 'Simulate Excursion (+8.9°C Breach)'}</span>
            </button>
          </div>

          {/* Real-time Telemetry Tele-Log Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-900" />
              <span>Real-Time Sensor Log Buffer (30s Polling)</span>
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 font-medium">Timestamp</th>
                    <th className="p-2.5 font-medium">Temperature</th>
                    <th className="p-2.5 font-medium">Humidity</th>
                    <th className="p-2.5 font-medium">Compressor State</th>
                    <th className="p-2.5 font-medium text-right">Integrity Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {logs.slice().reverse().map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50/80">
                      <td className="p-2.5 text-slate-700">{log.time}</td>
                      <td
                        className={`p-2.5 font-bold ${
                          log.temp > 8 ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        +{log.temp.toFixed(1)}°C
                      </td>
                      <td className="p-2.5 text-slate-600">{log.humidity}% RH</td>
                      <td className="p-2.5 text-slate-700">Primary Dual-Stage (Active)</td>
                      <td className="p-2.5 text-right">
                        <span
                          className={`px-2 py-0.5 rounded font-sans font-bold text-[10px] uppercase ${
                            log.status === 'nominal'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-rose-50 text-rose-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-blue-900" />
            <span>Telemetry calibrated under NABL ISO/IEC 17025 standard.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Close Telemetry Monitor
          </button>
        </div>
      </div>
    </div>
  );
}
