'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  PhoneCall,
  FileText,
  AlertTriangle,
  Snowflake,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface SOPItem {
  id: string;
  title: string;
  category: 'Cold Chain Failure' | 'Emergency Reroute' | 'Vaccine Recall' | 'Disaster Preparedness';
  steps: string[];
  lastUpdated: string;
}

const sops: SOPItem[] = [
  {
    id: 'SOP-01',
    title: 'Protocol for Cold Vault Power Outage / Excursion > 8°C',
    category: 'Cold Chain Failure',
    steps: [
      'Immediately verify backup diesel generator automatic transfer switch (ATS) activation within 60 seconds.',
      'If ATS fails, engage manual generator ignition and notify Depot Chief Engineer.',
      'Deploy pre-conditioned freeze packs into Ice-Lined Refrigerators (ILRs) to sustain 2-8°C for up to 24 hours.',
      'Log temperature hourly in the statewide portal and request emergency refrigerated mobile van if breach exceeds 3 hours.',
    ],
    lastUpdated: 'Updated Jan 2024',
  },
  {
    id: 'SOP-02',
    title: 'Emergency Stock Re-routing & Mutual Aid Protocol',
    category: 'Emergency Reroute',
    steps: [
      'Identify district nodes reporting < 48-hour essential drug supply via the Statewide Control Heatmap.',
      'Locate adjacent buffer warehouses with surplus (> 80% capacity) within 90km radius.',
      'Authorize Emergency Dispatch Order with Priority Rush flag in the portal.',
      'Print QR-coded transport waybill and assign dedicated fast-track cold-chain vehicle.',
    ],
    lastUpdated: 'Updated Feb 2024',
  },
  {
    id: 'SOP-03',
    title: 'Batch Quarantine & Rapid Recall Workflow',
    category: 'Vaccine Recall',
    steps: [
      'Issue statewide quarantine freeze on the affected batch number via Central Ledger.',
      'Automated SMS alert dispatched to all PHC clinics and hospital dispensaries to halt administration.',
      'Physically isolate remaining vials/boxes in designated red quarantine cages.',
      'Coordinate sample handover to Central Drugs Laboratory for chemical assay verification.',
    ],
    lastUpdated: 'Updated Mar 2024',
  },
];

export function SupportScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSOP, setSelectedSOP] = useState<SOPItem | null>(sops[0]);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([
    {
      sender: 'assistant',
      text: 'Hello! I am the SwasthyaSupply Medical Logistics SOP Assistant. Ask me any question regarding cold-chain protocols, batch recall procedures, or emergency re-routing.',
    },
  ]);

  const filteredSOPs = sops.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    const userText = chatQuestion;
    const newMessages = [...chatMessages, { sender: 'user' as const, text: userText }];
    setChatMessages(newMessages);
    setChatQuestion('');

    setTimeout(() => {
      let answer = 'According to standard state healthcare logistics guidelines:';
      if (userText.toLowerCase().includes('temperature') || userText.toLowerCase().includes('cold')) {
        answer = 'For cold chain vaccines (2°C - 8°C), ensure Ice-Lined Refrigerators (ILRs) have pre-frozen ice packs placed in the bottom and sides. If the temperature exceeds 8°C for more than 60 minutes, immediately trigger the Emergency Stock Re-route protocol in the dashboard and notify the district storekeeper.';
      } else if (userText.toLowerCase().includes('expiry') || userText.toLowerCase().includes('waste')) {
        answer = 'Batches within 30 days of expiry should be prioritized for First-Expiry-First-Out (FEFO) redistribution to high-consumption tertiary hospitals rather than smaller clinics.';
      } else {
        answer = `Regarding your query "${userText}": Verify stock levels via the Central Inventory screen, ensure all dispatches carry a valid QR waybill, and contact the 24/7 State Emergency Logistics Desk at 1800-112-MED-SUPPLY if immediate field intervention is needed.`;
      }
      setChatMessages((prev) => [...prev, { sender: 'assistant', text: answer }]);
    }, 600);
  };

  return (
    <div className="space-y-6" id="support-sop-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 tracking-wider uppercase mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Operational Manuals & Emergency Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Standard Operating Procedures & Helpdesk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official Ministry cold-chain protocols, batch recall SOPs, and 24/7 emergency dispatch command contacts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl text-rose-900 text-xs font-bold">
          <PhoneCall className="w-4 h-4 text-rose-600 animate-bounce" />
          <span>24/7 Emergency Hotline: 1800-112-9988</span>
        </div>
      </div>

      {/* Emergency Contacts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            State Logistics Control Room
          </div>
          <div className="text-sm font-bold text-slate-900">+91 33 2214-5500 / 5501</div>
          <div className="text-[11px] text-slate-500 mt-1">Direct link to Chief Medical Logistics Officer</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-cyan-800 uppercase tracking-wider mb-1">
            Cold Chain Engineering Desk
          </div>
          <div className="text-sm font-bold text-slate-900">+91 33 2214-8890 (Ext. 4)</div>
          <div className="text-[11px] text-slate-500 mt-1">HVAC & Solar Refrigerator Rapid Repair Team</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-purple-800 uppercase tracking-wider mb-1">
            Pharmacovigilance & Recall
          </div>
          <div className="text-sm font-bold text-slate-900">recall-alert@health.gov.in</div>
          <div className="text-[11px] text-slate-500 mt-1">Report adverse events or suspected counterfeit lots</div>
        </div>
      </div>

      {/* SOP Browser & Interactive Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SOP Library */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-900" />
              Standard Operating Protocols (SOPs)
            </h3>
            <span className="text-xs text-slate-400">National Health Mission</span>
          </div>

          <div className="space-y-3">
            {filteredSOPs.map((sop) => (
              <div
                key={sop.id}
                onClick={() => setSelectedSOP(sop)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedSOP?.id === sop.id
                    ? 'border-blue-900 bg-blue-50/30 ring-1 ring-blue-900/15'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-blue-900">{sop.category}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{sop.id}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">{sop.title}</h4>
              </div>
            ))}
          </div>

          {selectedSOP && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div className="font-bold text-slate-900 text-xs">Protocol Implementation Steps:</div>
              <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside bg-slate-50 p-4 rounded-xl border border-slate-100">
                {selectedSOP.steps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-slate-900 font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Interactive SOP Assistant Bot */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[520px]">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-900" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Smart Logistics SOP Assistant</h3>
              <p className="text-[11px] text-slate-500">Ask operational questions in plain language</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3 text-xs pr-1">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-900 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Ask about cold-chain thresholds, FEFO dispatch, recall..."
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
