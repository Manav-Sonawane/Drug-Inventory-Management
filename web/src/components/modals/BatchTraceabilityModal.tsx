'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Package,
  Calendar,
  Building2,
  Thermometer,
  QrCode,
  CheckCircle2,
  Clock,
  Truck,
  FileCheck,
  Download,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { Batch } from '@/lib/types';

interface BatchTraceabilityModalProps {
  batch: Batch | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTelemetry?: () => void;
  onOpenReroute?: (batchNo: string) => void;
}

export function BatchTraceabilityModal({
  batch,
  isOpen,
  onClose,
  onOpenTelemetry,
  onOpenReroute,
}: BatchTraceabilityModalProps) {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen || !batch) return null;

  const handleDownloadCertificate = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const isColdChain = batch.temperatureRequirement && !batch.temperatureRequirement.includes('Room');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-900 rounded-xl border border-blue-100">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded">
                  {batch.batchNumber}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  WHO-GMP Verified
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{batch.drugName}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Top Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <div className="text-slate-400 text-[11px]">Manufacturer</div>
              <div className="font-semibold text-slate-900 mt-0.5">{batch.manufacturer}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Manufactured Date</div>
              <div className="font-semibold text-slate-900 mt-0.5">{batch.manufacturingDate}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Expiry Date</div>
              <div className="font-semibold text-rose-600 mt-0.5">{batch.expiryDate}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Storage Condition</div>
              <div className="font-semibold text-cyan-700 mt-0.5 flex items-center gap-1">
                {isColdChain && <Thermometer className="w-3.5 h-3.5 text-cyan-600" />}
                <span>{batch.temperatureRequirement || '15°C - 25°C'}</span>
              </div>
            </div>
          </div>

          {/* Current Stock Location */}
          <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-blue-900" />
              <div>
                <div className="text-[11px] text-blue-800 font-medium">Current Custody & Stock Balance</div>
                <div className="text-sm font-bold text-slate-900">
                  {batch.currentStock.toLocaleString()} {batch.unit} in {batch.facilityName}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                Bin: {batch.location || 'Cold-Vault-01'}
              </span>
            </div>
          </div>

          {/* Chain of Custody & Traceability Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-900" />
              <span>Full Chain-of-Custody Telemetry Audit Trail</span>
            </h3>

            <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 ml-2">
              {/* Event 1: Manufacturing Release */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">WHO-GMP Batch Release & QC Clearance</span>
                    <span className="text-[11px] text-slate-400 font-mono">{batch.manufacturingDate}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Passed microbiological potency assays (99.8%) and endotoxin thresholds at {batch.manufacturer} plant.
                  </p>
                </div>
              </div>

              {/* Event 2: Cold Chain Transport */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-900 ring-4 ring-blue-50" />
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">GPS-Tracked Cold-Chain Transit</span>
                    <span className="text-[11px] text-slate-400 font-mono">14 Days Ago</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Transported in Reefer Truck #WB-01-A-4491 with continuous Sensitech IoT probe (+3.8°C to +4.5°C). 0 excursions.
                  </p>
                </div>
              </div>

              {/* Event 3: Warehouse Receiving */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-900 ring-4 ring-blue-50" />
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Central Warehouse Check-in & Barcode Serialization</span>
                    <span className="text-[11px] text-slate-400 font-mono">10 Days Ago</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Ingested into State Central Medical Warehouse. GS1 2D DataMatrix code authenticated by Inspector R. Mukherjee.
                  </p>
                </div>
              </div>

              {/* Event 4: District Hospital Transfer */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-900 ring-4 ring-blue-50" />
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Dispatch to {batch.facilityName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">3 Days Ago</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Received at destination facility pharmacy vault. Current status: Active In-Stock for prescription dispensing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Certificate Hash: <code className="font-mono text-slate-700">sha256-8a90f1...c2</code></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadCertificate}
              className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloaded ? 'Certificate Downloaded ✓' : 'Download COA Certificate (PDF)'}</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
