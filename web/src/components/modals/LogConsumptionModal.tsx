'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Building2,
  Pill,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { ConsumptionLog, LowStockAlert } from '@/lib/types';
import { warehouseApi, adminApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface LogConsumptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddConsumption: (newLog: ConsumptionLog) => void;
  stockList?: LowStockAlert[];
}

export default function LogConsumptionModal({
  isOpen,
  onClose,
  onAddConsumption,
  stockList = [],
}: LogConsumptionModalProps) {
  const { user } = useAuth();
  const [wardName, setWardName] = useState('Maternity Ward');
  const [selectedDrug, setSelectedDrug] = useState('Oxytocin Injection');
  const [batchNo, setBatchNo] = useState('OXY-902');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState('Ampoules');
  const [requestedBy, setRequestedBy] = useState('Dr. Sharma');
  const [issuedBy, setIssuedBy] = useState('Pharmacist on Duty');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');

  const [drugOptions, setDrugOptions] = useState([
    { id: '', name: 'Oxytocin Injection', batch: 'OXY-902', unit: 'Ampoules', current: 45 },
    { id: '', name: 'Paracetamol 500mg (Tab)', batch: 'B-7742', unit: 'Tabs', current: 15 },
    { id: '', name: 'Saline IV Fluid (500ml)', batch: 'IV-091', unit: 'Bottles', current: 42 },
    { id: '', name: 'Amoxicillin 250mg (Cap)', batch: 'AX-112', unit: 'Caps', current: 100 },
    { id: '', name: 'Gauze Rolls', batch: 'GZ-332', unit: 'Rolls', current: 200 },
    { id: '', name: 'Surgical Tape 1-inch', batch: 'ST-101', unit: 'Packs', current: 80 },
    { id: '', name: 'Insulin Glargine 100IU/ml', batch: 'C-112', unit: 'Vials', current: 8 },
  ]);

  useEffect(() => {
    if (!isOpen) return;

    warehouseApi.inventory().then((res) => {
      if (res && res.data && res.data.length > 0) {
        const mapped = res.data.map((b: any) => ({
          id: b.id,
          name: b.drug_name,
          batch: b.batch_number,
          unit: b.unit_price ? 'Units' : 'Doses',
          current: b.current_qty,
        }));
        setDrugOptions(mapped);
        if (mapped[0]) {
          setSelectedDrug(mapped[0].name);
          setBatchNo(mapped[0].batch);
          setSelectedBatchId(mapped[0].id);
          setUnit(mapped[0].unit);
        }
      }
    }).catch(() => {});

    adminApi.hospitals.list().then((res) => {
      if (res && res.data && res.data.length > 0) {
        setHospitals(res.data);
        setSelectedHospitalId(user?.hospital_id || res.data[0].id);
      }
    }).catch(() => {});
  }, [isOpen, user]);

  const handleDrugChange = (drugName: string) => {
    setSelectedDrug(drugName);
    const found = drugOptions.find((d) => d.name === drugName);
    if (found) {
      setBatchNo(found.batch);
      setSelectedBatchId(found.id);
      setUnit(found.unit);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    const iconMap: Record<string, 'local_hospital' | 'healing' | 'child_care' | 'emergency'> = {
      'Maternity Ward': 'local_hospital',
      'Emergency Dept (ER)': 'healing',
      'Pediatric ICU': 'child_care',
      'Surgical Theater': 'healing',
      'General Medicine': 'local_hospital',
    };

    const newLog: ConsumptionLog & { batch_id?: string; hospital_id?: string } = {
      id: `LOG-${Date.now()}`,
      wardName,
      icon: iconMap[wardName] || 'local_hospital',
      timestamp: 'Just now',
      items: [{ name: selectedDrug, quantity, unit }],
      requestedBy: requestedBy || 'Duty Officer',
      issuedBy: issuedBy || 'Admin',
      batch_id: selectedBatchId || undefined,
      hospital_id: selectedHospitalId || undefined,
    };

    onAddConsumption(newLog);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#00236f] flex items-center justify-center border border-blue-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">Log Stock Consumption</h3>
              <p className="text-xs text-slate-500">Record medicine issued to hospital wards & clinics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Consumption Logged!</h4>
            <p className="text-sm text-slate-600">
              Issued {quantity} {unit} of {selectedDrug} to {wardName}.
            </p>
            <p className="text-xs text-slate-400">Ledger balance updated automatically.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
            {/* Ward / Dept selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Recipient Ward / Department
              </label>
              <div className="relative">
                <select
                  value={wardName}
                  onChange={(e) => setWardName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-medium"
                >
                  <option value="Maternity Ward">Maternity Ward</option>
                  <option value="Emergency Dept (ER)">Emergency Dept (ER)</option>
                  <option value="Pediatric ICU">Pediatric ICU</option>
                  <option value="Surgical Theater">Surgical Theater</option>
                  <option value="General Medicine Ward">General Medicine Ward</option>
                  <option value="Outpatient Dept (OPD)">Outpatient Dept (OPD)</option>
                </select>
              </div>
            </div>

            {/* Medicine selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Drug / Consumable
              </label>
              <select
                value={selectedDrug}
                onChange={(e) => handleDrugChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-medium"
              >
                {drugOptions.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name} (Batch: {opt.batch} | In Stock: {opt.current} {opt.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Quantity Issued
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Unit Type
                </label>
                <input
                  type="text"
                  disabled
                  value={unit}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-600 text-sm font-medium cursor-not-allowed"
                />
              </div>
            </div>

            {/* Requested By & Issued By */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Prescribing Doctor / Staff
                </label>
                <input
                  type="text"
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                  placeholder="e.g. Dr. Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Issued By (Pharmacist)
                </label>
                <input
                  type="text"
                  value={issuedBy}
                  onChange={(e) => setIssuedBy(e.target.value)}
                  placeholder="e.g. Admin / Pharmacist"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-medium"
                />
              </div>
            </div>

            {/* Batch Info Tag */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <span className="font-medium">Active Batch Code:</span>
              <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
                {batchNo}
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#00236f] text-white font-semibold text-xs rounded-lg hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Submit Consumption Entry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
