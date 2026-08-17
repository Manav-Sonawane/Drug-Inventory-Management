'use client';

import React, { useState } from 'react';
import {
  QrCode,
  FileEdit,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  WifiOff,
  Wifi,
  CheckCircle2,
  Package,
  Calendar,
  Building,
  User,
  Activity,
  ChevronRight,
  Barcode,
  Truck,
  HeartPulse,
  Syringe,
} from 'lucide-react';
import { ShipmentItem, LowStockAlert, ConsumptionLog } from '@/lib/types';

interface PHCClinicDashboardProps {
  onOpenScanner: () => void;
  onOpenLogConsumption: () => void;
  shipments: ShipmentItem[];
  lowStockAlerts: LowStockAlert[];
  consumptionLogs: ConsumptionLog[];
  onRestockItem?: (drugName: string) => void;
}

export default function PHCClinicDashboard({
  onOpenScanner,
  onOpenLogConsumption,
  shipments,
  lowStockAlerts,
  consumptionLogs,
  onRestockItem,
}: PHCClinicDashboardProps) {
  const [isOffline, setIsOffline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(3);
  const [syncing, setSyncing] = useState(false);

  const handleToggleSync = () => {
    if (isOffline) {
      setSyncing(true);
      setTimeout(() => {
        setIsOffline(false);
        setPendingSyncCount(0);
        setSyncing(false);
      }, 1000);
    } else {
      setIsOffline(true);
      setPendingSyncCount(3);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 md:pb-6">
      {/* Clinic Header Bar & Sync Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#00236f] tracking-tight">
              Primary Health Centre, Malda
            </h2>
            <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
              PHC #WB-MLD-04
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            District Medical Dispensing, Ward Inventory & Consignment Receiving
          </p>
        </div>

        {/* Sync Status Toggle */}
        <button
          onClick={handleToggleSync}
          disabled={syncing}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
            isOffline
              ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
          }`}
          title="Click to toggle sync status"
        >
          {syncing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
              <span>Syncing with Central Ledger...</span>
            </>
          ) : isOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-slate-500" />
              <span>Offline (Pending Sync: {pendingSyncCount})</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>Online (Central Ledger Synced)</span>
            </>
          )}
        </button>
      </div>

      {/* Top Bento Row: Quick Action Cards (Scan & Log) + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Action Bento Cards (8 cols on lg) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Scan Shipment Card (Deep Blue) */}
          <div className="bg-[#1e3a8a] text-white rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300 border border-blue-950">
            {/* Background Watermark QR */}
            <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none group-hover:scale-105 transition-transform duration-500">
              <QrCode className="w-36 h-36" />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-1 tracking-tight text-white">Scan Shipment</h3>
              <p className="text-sm text-blue-200">Receive incoming stock via QR code or barcode.</p>
            </div>

            <div className="mt-8">
              <button
                onClick={onOpenScanner}
                className="bg-white text-[#1e3a8a] font-bold text-xs py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-sm active:scale-95 cursor-pointer"
              >
                <Barcode className="w-4 h-4" />
                Open Scanner
              </button>
            </div>
          </div>

          {/* Log Consumption Card (Clean White) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Log Consumption</h3>
                <div className="p-2 rounded-lg bg-blue-100 text-[#00236f]">
                  <FileEdit className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-slate-500">Issue stock to wards or departments with doctor prescription.</p>
            </div>

            <div className="mt-8">
              <button
                onClick={onOpenLogConsumption}
                className="w-full border-2 border-[#00236f] text-[#00236f] font-bold text-xs py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Entry
              </button>
            </div>
          </div>
        </div>

        {/* Alerts Side Panel: Low Stock Alerts (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-red-600 fill-red-100" />
            <h3 className="font-bold text-slate-900 text-sm">Low Stock Alerts</h3>
            <span className="ml-auto text-[11px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              {lowStockAlerts.length} Warnings
            </span>
          </div>

          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[220px] pr-1">
            {lowStockAlerts.map((item) => {
              const isCrit = item.severity === 'critical';
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                    isCrit
                      ? 'bg-red-50/90 border-red-200'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div>
                    <p
                      className={`text-xs font-bold ${
                        isCrit ? 'text-red-900' : 'text-slate-900'
                      }`}
                    >
                      {item.drugName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Batch: {item.batchNo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs font-bold ${
                        isCrit ? 'text-red-600' : 'text-[#00236f]'
                      }`}
                    >
                      {item.currentUnits} {item.unitType}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Min: {item.minThreshold}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Main Data Area: Recent Shipments & Daily Consumption Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shipments Table Card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/80">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Shipments</h3>
              <p className="text-[11px] text-slate-500">Incoming consignments from Central Warehouses & Depots</p>
            </div>
            <button
              onClick={onOpenScanner}
              className="text-[#00236f] text-xs font-bold hover:underline flex items-center gap-1"
            >
              Scan New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/60 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <th className="p-3 pl-4">ID</th>
                  <th className="p-3">Origin</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 pr-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shipments.map((shp) => (
                  <tr
                    key={shp.id}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                  >
                    <td className="p-3 pl-4 font-mono font-bold text-[#00236f]">
                      {shp.id}
                    </td>
                    <td className="p-3 text-slate-800 font-medium">
                      {shp.origin}
                    </td>
                    <td className="p-3">
                      {shp.status === 'In Transit' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-700 animate-pulse"></span>
                          In Transit
                        </span>
                      )}
                      {shp.status === 'Received' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Received
                        </span>
                      )}
                      {shp.status === 'Delayed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          Delayed
                        </span>
                      )}
                    </td>
                    <td className="p-3 pr-4 text-slate-500">{shp.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Consumption Log Stream */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/80">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Daily Consumption</h3>
              <p className="text-[11px] text-slate-500">Live ward dispensations & emergency requisitions</p>
            </div>
            <button
              onClick={onOpenLogConsumption}
              className="text-[#00236f] text-xs font-bold hover:underline"
            >
              + Add Entry
            </button>
          </div>

          <div className="flex flex-col divide-y divide-slate-100 overflow-y-auto max-h-[300px]">
            {consumptionLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex items-start gap-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="bg-slate-100 text-slate-700 p-2.5 rounded-xl shrink-0 mt-0.5 border border-slate-200">
                  {log.wardName.includes('Maternity') ? (
                    <HeartPulse className="w-4 h-4 text-pink-600" />
                  ) : log.wardName.includes('Pediatric') ? (
                    <Syringe className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Activity className="w-4 h-4 text-blue-700" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="text-xs font-bold text-slate-900">{log.wardName}</h4>
                    <span className="text-[11px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Issued:{' '}
                    {log.items.map((i, idx) => (
                      <span key={idx} className="font-bold text-slate-900">
                        {i.name} × {i.quantity} {i.unit}
                        {idx < log.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    Req: {log.requestedBy} | Issued by: {log.issuedBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
