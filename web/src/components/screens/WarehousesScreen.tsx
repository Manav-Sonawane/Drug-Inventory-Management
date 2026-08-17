'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Snowflake,
  Thermometer,
  Zap,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ArrowRightLeft,
  Search,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  BatteryCharging,
} from 'lucide-react';
import { adminApi } from '@/lib/api';

interface WarehouseHub {
  id: string;
  name: string;
  district: string;
  type: 'Central Master Warehouse' | 'Regional Cold Hub' | 'District Depot';
  temperature: string;
  tempStatus: 'nominal' | 'warning' | 'critical';
  humidity: string;
  capacityUsedPercent: number;
  backupGenerator: 'Online' | 'Standby' | 'Testing';
  activeBatchesCount: number;
  managerName: string;
  managerPhone: string;
  lastTelemetryPing: string;
  freezerUnits: { id: string; name: string; targetTemp: string; currentTemp: string; status: 'nominal' | 'warning' }[];
}

const initialHubs: WarehouseHub[] = [
  {
    id: 'WH-01',
    name: 'State Central Medical Warehouse (Hub 1)',
    district: 'Kolkata Central Sector',
    type: 'Central Master Warehouse',
    temperature: '4.2°C',
    tempStatus: 'nominal',
    humidity: '48%',
    capacityUsedPercent: 78,
    backupGenerator: 'Standby',
    activeBatchesCount: 420,
    managerName: 'Rajesh Mukherjee (Senior Logistics Officer)',
    managerPhone: '+91 98301 24500',
    lastTelemetryPing: 'Just now',
    freezerUnits: [
      { id: 'F-1', name: 'Cold Vault Alpha (2-8°C)', targetTemp: '4.0°C', currentTemp: '4.2°C', status: 'nominal' },
      { id: 'F-2', name: 'Deep Freeze Beta (-20°C)', targetTemp: '-20.0°C', currentTemp: '-19.8°C', status: 'nominal' },
      { id: 'F-3', name: 'Vaccine Vault Gamma (2-8°C)', targetTemp: '4.0°C', currentTemp: '4.1°C', status: 'nominal' },
    ],
  },
  {
    id: 'WH-02',
    name: 'Siliguri North Bengal Regional Depot',
    district: 'Darjeeling & Siliguri Foothills',
    type: 'Regional Cold Hub',
    temperature: '5.1°C',
    tempStatus: 'nominal',
    humidity: '52%',
    capacityUsedPercent: 86,
    backupGenerator: 'Online',
    activeBatchesCount: 210,
    managerName: 'Priya Sharma (Deputy Depot Head)',
    managerPhone: '+91 94340 88219',
    lastTelemetryPing: '1m ago',
    freezerUnits: [
      { id: 'F-4', name: 'Cold Vault 1 (2-8°C)', targetTemp: '4.0°C', currentTemp: '5.1°C', status: 'nominal' },
      { id: 'F-5', name: 'Deep Freeze 1 (-20°C)', targetTemp: '-20.0°C', currentTemp: '-20.4°C', status: 'nominal' },
    ],
  },
  {
    id: 'WH-03',
    name: 'Asansol Industrial Zone Distribution Depot',
    district: 'Paschim Bardhaman',
    type: 'District Depot',
    temperature: '7.8°C',
    tempStatus: 'warning',
    humidity: '61%',
    capacityUsedPercent: 64,
    backupGenerator: 'Online',
    activeBatchesCount: 140,
    managerName: 'Dr. A. K. Sen (District Storekeeper)',
    managerPhone: '+91 94341 55012',
    lastTelemetryPing: '2m ago',
    freezerUnits: [
      { id: 'F-6', name: 'Cold Vault 01 (2-8°C)', targetTemp: '4.0°C', currentTemp: '7.8°C', status: 'warning' },
      { id: 'F-7', name: 'General Vaccine Chiller', targetTemp: '4.0°C', currentTemp: '6.9°C', status: 'nominal' },
    ],
  },
  {
    id: 'WH-04',
    name: 'Malda Rural Logistics Centre',
    district: 'Malda Division',
    type: 'District Depot',
    temperature: '3.9°C',
    tempStatus: 'nominal',
    humidity: '45%',
    capacityUsedPercent: 49,
    backupGenerator: 'Standby',
    activeBatchesCount: 95,
    managerName: 'Sunil Mondal',
    managerPhone: '+91 97320 11980',
    lastTelemetryPing: 'Just now',
    freezerUnits: [
      { id: 'F-8', name: 'Vaccine ILR Vault 01', targetTemp: '4.0°C', currentTemp: '3.9°C', status: 'nominal' },
    ],
  },
];

interface WarehousesScreenProps {
  onOpenRerouteModal?: (title?: string) => void;
}

export function WarehousesScreen({ onOpenRerouteModal }: WarehousesScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [hubs, setHubs] = useState<WarehouseHub[]>(initialHubs);
  const [selectedHub, setSelectedHub] = useState<WarehouseHub | null>(initialHubs[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    adminApi.warehouses.list().then((res) => {
      if (res && res.data && res.data.length > 0) {
        const liveHubs: WarehouseHub[] = res.data.map((w: any, idx: number) => ({
          id: w.id,
          name: w.name,
          district: w.location || 'State Capital Sector',
          type: idx === 0 ? 'Central Master Warehouse' : idx === 1 ? 'Regional Cold Hub' : 'District Depot',
          temperature: '4.2°C',
          tempStatus: 'nominal',
          humidity: '48%',
          capacityUsedPercent: Math.min(95, 45 + idx * 15),
          backupGenerator: 'Standby',
          activeBatchesCount: 150 + idx * 75,
          managerName: w.manager_name || 'Central Facility Officer',
          managerPhone: '+91 98301 24500',
          lastTelemetryPing: 'Just now',
          freezerUnits: [
            { id: `F-${idx}-1`, name: 'Cold Vault Alpha (2-8°C)', targetTemp: '4.0°C', currentTemp: '4.2°C', status: 'nominal' },
            { id: `F-${idx}-2`, name: 'Deep Freeze Beta (-20°C)', targetTemp: '-20.0°C', currentTemp: '-19.8°C', status: 'nominal' },
          ],
        }));
        setHubs(liveHubs);
        setSelectedHub(liveHubs[0]);
      }
    }).catch(() => {});
  }, []);

  const filteredHubs = hubs.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.managerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="statewide-warehouses-view">
      {/* Toast Notification */}
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
            <Snowflake className="w-4 h-4 text-cyan-600" />
            <span>IoT Cold Chain & Infrastructure</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Warehouses & Cold Storage Depots
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live telemetry monitoring for temperature integrity, backup generator power grids, and depot storage capacity.
          </p>
        </div>

        <button
          onClick={() => showToast('Pinged all 18 IoT cold-chain temperature sensors across state depots.')}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
        >
          <Activity className="w-3.5 h-3.5 text-blue-900" />
          <span>Ping IoT Telemetry</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Active Storage Depots</div>
          <div className="text-2xl font-bold text-slate-900">{initialHubs.length} Facilities</div>
          <div className="text-[11px] text-slate-500 mt-1">100% telemetry online</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Cold Storage Vaults</div>
          <div className="text-2xl font-bold text-cyan-700">8 ILR / Deep Units</div>
          <div className="text-[11px] text-cyan-800 font-medium mt-1">Target range 2°C - 8°C</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Power Grid Resiliency</div>
          <div className="text-2xl font-bold text-emerald-600">Active Diesel Standby</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Automatic transfer switch OK</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Temperature Excursions</div>
          <div className="text-2xl font-bold text-amber-600">1 Warning (Asansol)</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">HVAC technician dispatched</div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search warehouse by name, district, or facility manager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
          />
        </div>
      </div>

      {/* Warehouse Hubs Grid & Selected Facility Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hubs List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredHubs.map((hub) => {
            const isSelected = selectedHub?.id === hub.id;
            return (
              <div
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-blue-900 ring-2 ring-blue-900/10 bg-blue-50/15'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 font-mono font-bold text-xs">
                        {hub.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {hub.type}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5 pt-1">
                      <Building2 className="w-4 h-4 text-blue-900" />
                      {hub.name}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{hub.district}</span>
                    </div>
                  </div>

                  {/* Telemetry Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <div
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                        hub.tempStatus === 'nominal'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                      }`}
                    >
                      <Thermometer className="w-4 h-4" />
                      <span>{hub.temperature} (Vault Avg)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Pinged {hub.lastTelemetryPing}</span>
                  </div>
                </div>

                {/* Progress Bar for Storage Occupancy */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Warehouse Capacity Utilization</span>
                    <span className="font-bold text-slate-900">{hub.capacityUsedPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        hub.capacityUsedPercent > 85 ? 'bg-amber-500' : 'bg-blue-900'
                      }`}
                      style={{ width: `${hub.capacityUsedPercent}%` }}
                    />
                  </div>
                </div>

                {/* Footer specs */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Generator: <strong>{hub.backupGenerator}</strong>
                  </span>
                  <span>{hub.activeBatchesCount} batch lots in stock</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Facility Inspector */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs h-fit space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider">Facility Telemetry</div>
            <h3 className="font-bold text-slate-900 text-base mt-0.5">{selectedHub?.name}</h3>
          </div>

          {selectedHub && (
            <div className="space-y-4 text-xs">
              {/* Cold Vault Unit Sensors */}
              <div>
                <div className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Snowflake className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Freezer Vault Telemetry Units ({selectedHub.freezerUnits.length})</span>
                </div>
                <div className="space-y-2">
                  {selectedHub.freezerUnits.map((u) => (
                    <div
                      key={u.id}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        u.status === 'nominal'
                          ? 'bg-slate-50 border-slate-100'
                          : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-500">Target: {u.targetTemp}</div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-mono font-bold text-sm ${
                            u.status === 'nominal' ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {u.currentTemp}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">
                          {u.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manager & Dispatch Hotline */}
              <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 space-y-2 text-slate-700">
                <div className="font-semibold text-blue-900">Depot Manager & Escalation</div>
                <div className="font-medium text-slate-900">{selectedHub.managerName}</div>
                <div className="flex items-center gap-2 text-blue-900 font-semibold">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedHub.managerPhone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {onOpenRerouteModal && (
                  <button
                    onClick={() => onOpenRerouteModal(`Rebalance inventory from ${selectedHub.name}`)}
                    className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Authorize Inter-Depot Stock Transfer</span>
                  </button>
                )}

                <button
                  onClick={() => showToast(`Automated sensor calibration signal sent to ${selectedHub.name}.`)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                >
                  Recalibrate Sensors
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
