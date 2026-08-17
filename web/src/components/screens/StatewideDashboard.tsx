'use client';

import React, { useState } from 'react';
import {
  Download,
  Building,
  AlertTriangle,
  Hourglass,
  Award,
  Search,
  ArrowUp,
  Plus,
  Minus,
  Star,
  StarHalf,
  Truck,
  ExternalLink,
  Filter,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Bell,
  HelpCircle,
  Package,
  Snowflake,
  Activity,
  Layers,
  Compass,
  Radio,
  Maximize2,
  RotateCcw,
  Thermometer,
  ShieldCheck,
} from 'lucide-react';
import { HeatmapNode, UrgentAlert, Vendor } from '@/lib/types';

interface StatewideDashboardProps {
  onOpenReroute: (alertTitle?: string) => void;
  onOpenExport: () => void;
  urgentAlerts: UrgentAlert[];
  vendors: Vendor[];
  heatmapNodes: HeatmapNode[];
}

interface MovingVehicle {
  id: string;
  name: string;
  type: 'Refrigerated Reefer' | 'Standard Freight' | 'Emergency Van';
  x: number;
  y: number;
  heading: string;
  speed: string;
  temp: string;
  cargo: string;
  orderRef: string;
  destination: string;
}

const mockVehicles: MovingVehicle[] = [
  {
    id: 'VEH-01',
    name: 'Reefer Van #WB-04-E-8812',
    type: 'Refrigerated Reefer',
    x: 46,
    y: 52,
    heading: 'Northbound on NH-12',
    speed: '58 km/h',
    temp: '3.6°C (Optimal)',
    cargo: '150 Vials Insulin Glargine + 2000 Doses Rotavirus',
    orderRef: 'ORD-8812',
    destination: 'PHC Malda Cold Vault',
  },
  {
    id: 'VEH-02',
    name: 'Rapid Dispatch #WB-02-C-4419',
    type: 'Emergency Van',
    x: 68,
    y: 40,
    heading: 'North-East on AH-2',
    speed: '64 km/h',
    temp: '22.1°C (Ambient)',
    cargo: '5000 Tabs Amoxicillin + 1200 Bottles Saline IV',
    orderRef: 'ORD-8942',
    destination: 'Siliguri Regional Depot',
  },
  {
    id: 'VEH-03',
    name: 'Heavy Transit #WB-19-K-0921',
    type: 'Standard Freight',
    x: 32,
    y: 65,
    heading: 'Westbound on NH-19',
    speed: '48 km/h',
    temp: '21.8°C (Ambient)',
    cargo: '3000 Pairs Surgical Gloves + 1000 PPE Kits',
    orderRef: 'ORD-8892',
    destination: 'Asansol Industrial Hospital',
  },
];

export default function StatewideDashboard({
  onOpenReroute,
  onOpenExport,
  urgentAlerts,
  vendors,
  heatmapNodes,
}: StatewideDashboardProps) {
  const [vendorFilter, setVendorFilter] = useState('');
  const [mapFilter, setMapFilter] = useState<'all' | 'critical' | 'warning' | 'optimal'>('all');
  const [mapLayer, setMapLayer] = useState<'network' | 'coldchain' | 'fleet' | 'surge'>('network');
  const [selectedNode, setSelectedNode] = useState<HeatmapNode | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<MovingVehicle | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapSearch, setMapSearch] = useState('');

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(vendorFilter.toLowerCase())
  );

  const filteredNodes = heatmapNodes.filter((node) => {
    const matchesFilter = mapFilter === 'all' || node.status === mapFilter;
    const matchesSearch =
      !mapSearch ||
      node.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
      node.type.toLowerCase().includes(mapSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#00236f] tracking-tight">
            Statewide Operations & GIS Command
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time health logistics overview, live fleet telemetry and emergency supply diversion.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenExport}
            className="bg-white border border-[#00236f] text-[#00236f] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-2xs cursor-pointer active:scale-98"
          >
            <Download className="w-4 h-4" />
            Export State Report
          </button>
        </div>
      </div>

      {/* KPI Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Institutions */}
        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl flex flex-col justify-between h-34 hover:border-blue-900 transition-colors shadow-2xs group">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Total Facilities
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-[#00236f]">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">1,248</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">+12</span> new PHCs integrated
            </div>
          </div>
        </div>

        {/* KPI 2: Critical Stockouts */}
        <div className="bg-white border-2 border-red-500 p-4.5 rounded-2xl flex flex-col justify-between h-34 shadow-[0_4px_14px_-2px_rgba(220,38,38,0.12)]">
          <div className="flex justify-between items-start">
            <span className="text-red-700 text-xs font-bold uppercase tracking-wider">
              Critical Stockouts
            </span>
            <div className="p-2 rounded-xl bg-red-600 text-white animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600 tracking-tight">47</div>
            <div className="text-xs text-red-700/80 mt-1 font-medium">
              Facilities requiring immediate diversion
            </div>
          </div>
        </div>

        {/* KPI 3: Near Expiry Batches */}
        <div className="bg-white border-2 border-amber-400 p-4.5 rounded-2xl flex flex-col justify-between h-34 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-amber-800 text-xs font-semibold uppercase tracking-wider">
              Near Expiry Batches
            </span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">312</div>
            <div className="text-xs text-slate-500 mt-1">Expiring within 30 days (FEFO active)</div>
          </div>
        </div>

        {/* KPI 4: Avg Vendor SLA */}
        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl flex flex-col justify-between h-34 hover:border-blue-900 transition-colors shadow-2xs group">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Avg Vendor SLA
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-[#00236f]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">94.2%</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">+0.5%</span> procurement target
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: GIS Supply Chain Map (2 cols) & Urgent Alerts (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Advanced GIS Vector Map Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-xs min-h-[520px]">
          {/* Map Top Bar with Layer Controls & Status */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#00236f] text-white rounded-lg">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">State GIS Health Logistics Map</h3>
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Telemetry
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Highway supply corridors, cold vaults & GPS fleet</p>
              </div>
            </div>

            {/* Layer & Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex bg-slate-200/80 p-0.5 rounded-lg">
                <button
                  onClick={() => setMapLayer('network')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    mapLayer === 'network' ? 'bg-white text-[#00236f] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Network
                </button>
                <button
                  onClick={() => setMapLayer('coldchain')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    mapLayer === 'coldchain' ? 'bg-white text-cyan-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ❄️ Cold Corridors
                </button>
                <button
                  onClick={() => setMapLayer('fleet')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    mapLayer === 'fleet' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🚚 Fleet GPS
                </button>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMapFilter(mapFilter === 'critical' ? 'all' : 'critical')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                    mapFilter === 'critical'
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  Critical (47)
                </button>
                <button
                  onClick={() => setMapFilter(mapFilter === 'warning' ? 'all' : 'warning')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                    mapFilter === 'warning'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Warning (86)
                </button>
                <button
                  onClick={() => setMapFilter(mapFilter === 'optimal' ? 'all' : 'optimal')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                    mapFilter === 'optimal'
                      ? 'bg-[#00236f] text-white shadow-2xs'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Optimal (1,115)
                </button>
              </div>
            </div>
          </div>

          {/* Interactive GIS Stage */}
          <div className="flex-1 relative bg-[#0b132b] overflow-hidden select-none min-h-[420px]">
            {/* Topographic GIS Vector Canvas */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 600"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease-out',
              }}
            >
              <defs>
                {/* Tactical Dot Grid */}
                <pattern id="gis-tactical-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="0.8" fill="#1e293b" />
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.4" opacity="0.6" />
                </pattern>

                {/* Gradients */}
                <linearGradient id="terrain-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.85" />
                </linearGradient>

                <linearGradient id="river-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.7" />
                </linearGradient>

                <linearGradient id="corridor-arterial" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>

                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Grid */}
              <rect width="1000" height="600" fill="#090d16" />
              <rect width="1000" height="600" fill="url(#gis-tactical-grid)" />

              {/* Stylized State Geographical Boundary Contours (Stylized West Bengal & Regional Corridor) */}
              <g className="state-topography opacity-60">
                {/* Outer State Contour */}
                <path
                  d="M 680,60 C 780,90 820,160 770,220 C 720,280 620,290 560,340 C 500,390 540,490 580,540 C 540,580 430,560 380,510 C 310,480 230,460 210,380 C 190,300 290,260 340,210 C 380,160 480,140 520,90 Z"
                  fill="url(#terrain-grad-1)"
                  stroke="#334155"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />

                {/* Elevated Foothill Zone (North) */}
                <path
                  d="M 650,70 Q 740,110 790,170 Q 710,210 630,160 Z"
                  fill="#0c4a6e"
                  fillOpacity="0.25"
                  stroke="#0284c7"
                  strokeWidth="1"
                />

                {/* Gangetic Plain & River Hooghly Arterial Vector */}
                <path
                  d="M 620,160 Q 560,250 490,320 T 430,430 T 470,540"
                  fill="none"
                  stroke="url(#river-grad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
                <path
                  d="M 430,430 Q 360,450 280,440"
                  fill="none"
                  stroke="url(#river-grad)"
                  strokeWidth="2.5"
                />
              </g>

              {/* Major Highway Logistics Supply Arteries */}
              <g className="highway-corridors">
                {/* NH-12 North-South Spinal Artery (Siliguri -> Malda -> Kolkata) */}
                <path
                  d="M 740,180 Q 560,280 480,410 T 520,530"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                  className="animate-pulse"
                />
                <path
                  d="M 740,180 Q 560,280 480,410 T 520,530"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 8"
                />

                {/* NH-19 Western Industrial Corridor (Kolkata -> Asansol) */}
                <path
                  d="M 520,530 Q 400,490 280,430"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeDasharray="7 5"
                />

                {/* North Bengal Foothills Connector */}
                <path
                  d="M 740,180 Q 640,120 540,130"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />

                {/* Lateral Emergency Diversion Routes */}
                <path
                  d="M 480,410 Q 360,360 280,430"
                  fill="none"
                  stroke="#e0e7ff"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
              </g>

              {/* Geographic Region Watermarks */}
              <text x="730" y="140" fill="#64748b" fontSize="11" fontWeight="bold" opacity="0.6" letterSpacing="1.5">
                NORTH BENGAL FOOTHILLS
              </text>
              <text x="490" y="310" fill="#64748b" fontSize="11" fontWeight="bold" opacity="0.6" letterSpacing="1.5">
                MALDA CENTRAL CORRIDOR
              </text>
              <text x="230" y="410" fill="#64748b" fontSize="11" fontWeight="bold" opacity="0.6" letterSpacing="1.5">
                ASANSOL INDUSTRIAL BELT
              </text>
              <text x="540" y="550" fill="#64748b" fontSize="11" fontWeight="bold" opacity="0.6" letterSpacing="1.5">
                KOLKATA APEX METRO
              </text>

              {/* Radiating Heatmap Hotspots in Surge / Outbreak Mode */}
              {(mapLayer === 'surge' || mapLayer === 'network') && (
                <g className="heat-hotspots pointer-events-none">
                  {/* Malda Dengue Buffer Surge Hotspot */}
                  <circle cx="480" cy="410" r="60" fill="url(#heat-glow-red)" opacity="0.4" />
                  {/* Asansol Critical Hotspot */}
                  <circle cx="280" cy="430" r="50" fill="url(#heat-glow-amber)" opacity="0.35" />
                  {/* Siliguri Regional Buffer */}
                  <circle cx="740" cy="180" r="55" fill="url(#heat-glow-blue)" opacity="0.3" />
                </g>
              )}
            </svg>

            {/* Real-time Moving Fleet Reefer Vans Layer */}
            {(mapLayer === 'fleet' || mapLayer === 'network' || mapLayer === 'coldchain') && (
              <>
                {mockVehicles.map((veh) => (
                  <div
                    key={veh.id}
                    onClick={() => {
                      setSelectedVehicle(veh);
                      setSelectedNode(null);
                    }}
                    style={{ left: `${veh.x}%`, top: `${veh.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
                  >
                    {/* Vehicle Radar Ping Ring */}
                    <span className="absolute -inset-2 rounded-full bg-cyan-400 opacity-40 animate-ping"></span>

                    {/* Vehicle Icon Badge */}
                    <div className="relative bg-slate-900 border-2 border-cyan-400 text-cyan-300 p-1.5 rounded-xl shadow-[0_0_12px_rgba(34,211,238,0.6)] flex items-center gap-1 hover:scale-125 transition-transform">
                      <Truck className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-mono font-bold text-white px-1 hidden group-hover:inline">
                        {veh.temp}
                      </span>
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-xl p-2.5 z-40 text-xs border border-cyan-500/40 pointer-events-none">
                      <p className="font-bold text-cyan-300 text-[11px] truncate">{veh.name}</p>
                      <p className="text-[10px] text-slate-300 mt-0.5">{veh.heading}</p>
                      <div className="mt-1 pt-1 border-t border-slate-800 flex justify-between text-[10px]">
                        <span className="text-slate-400">Payload Temp:</span>
                        <span className="text-emerald-400 font-bold">{veh.temp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Render Facility / Hospital / Warehouse Nodes */}
            {filteredNodes.map((node) => {
              const isCritical = node.status === 'critical';
              const isWarning = node.status === 'warning';
              const isOptimal = node.status === 'optimal';
              const isMasterHub = node.type.includes('Central Warehouse') || node.name.includes('Apex');

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    setSelectedVehicle(null);
                  }}
                  style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Outer Pulsing Aura */}
                  {isCritical && (
                    <span className="absolute -inset-3 rounded-full bg-red-500 opacity-60 animate-ping"></span>
                  )}
                  {isWarning && (
                    <span className="absolute -inset-2 rounded-full bg-amber-400 opacity-50 animate-pulse"></span>
                  )}
                  {isMasterHub && (
                    <span className="absolute -inset-2.5 rounded-full bg-blue-400 opacity-30 animate-pulse"></span>
                  )}

                  {/* Marker Pin Visual */}
                  <div
                    className={`relative rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-130 shadow-lg ${
                      isMasterHub
                        ? 'w-7 h-7 bg-[#00236f] border-2 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(2,132,199,0.8)]'
                        : isCritical
                        ? 'w-6 h-6 bg-red-600 border-2 border-white text-white shadow-[0_0_15px_rgba(220,38,38,0.9)]'
                        : isWarning
                        ? 'w-5.5 h-5.5 bg-amber-500 border-2 border-white text-slate-900 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                        : 'w-5 h-5 bg-blue-700 border-2 border-blue-200 text-white shadow-[0_0_10px_rgba(30,58,138,0.7)]'
                    }`}
                  >
                    {isMasterHub ? (
                      <Building className="w-3.5 h-3.5" />
                    ) : node.type === 'PHC Clinic' ? (
                      <MapPin className="w-3 h-3" />
                    ) : (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>

                  {/* Facility Label Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl p-3 z-40 text-xs border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-1.5 mb-1.5">
                      <span className="font-bold text-white truncate max-w-[140px]">{node.name}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isCritical
                            ? 'bg-red-600 text-white'
                            : isWarning
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {node.stockLevelPercent}% Stock
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300">{node.type}</p>
                    {node.criticalItems.length > 0 ? (
                      <div className="mt-1 text-red-300 text-[10px] space-y-0.5">
                        {node.criticalItems.map((item, idx) => (
                          <div key={idx}>• {item}</div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-emerald-400 mt-1">✓ Vital drug reserves optimal</p>
                    )}

                    <div className="mt-2 pt-1.5 border-t border-slate-800 flex justify-between items-center text-[9px] text-slate-400">
                      <span>Updated: {node.lastUpdated}</span>
                      <span className="text-cyan-300 font-semibold">Click to inspect</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Map Search Facility Floating Input */}
            <div className="absolute top-3 left-3 z-20 w-48 sm:w-60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Find hub / facility..."
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-medium"
                />
              </div>
            </div>

            {/* Map Control Buttons (Zoom & Reset) */}
            <div className="absolute top-3 right-3 flex flex-col bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700 shadow-md overflow-hidden z-20">
              <button
                onClick={() => setZoomLevel(Math.min(zoomLevel + 0.25, 2.2))}
                className="p-2 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom in"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="h-px bg-slate-800"></div>
              <button
                onClick={() => setZoomLevel(Math.max(zoomLevel - 0.25, 0.8))}
                className="p-2 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="h-px bg-slate-800"></div>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-2 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Floating Legend / Telemetry Dock */}
            <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-3 bg-slate-900/85 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl text-[11px] text-slate-300 z-20">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>Critical (&lt;30%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Optimal</span>
              </div>
              <div className="flex items-center gap-1.5 border-l border-slate-700 pl-2">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-300 font-bold">3 Reefers En-route</span>
              </div>
            </div>

            {/* Selected Node Details Card Dock */}
            {selectedNode && (
              <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-700 shadow-2xl text-xs z-30 max-w-sm w-full animate-in slide-in-from-bottom-2 text-white">
                <div className="flex justify-between items-start gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
                  <div>
                    <h4 className="font-bold text-white text-sm">{selectedNode.name}</h4>
                    <p className="text-slate-400 text-[11px]">{selectedNode.type} • {selectedNode.bedCapacity} Beds</p>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stock Buffer:</span>
                    <span
                      className={`font-bold ${
                        selectedNode.status === 'critical'
                          ? 'text-red-400'
                          : selectedNode.status === 'warning'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {selectedNode.stockLevelPercent}% Available
                    </span>
                  </div>

                  {selectedNode.criticalItems.length > 0 && (
                    <div className="bg-red-950/60 border border-red-800/80 p-2 rounded-xl text-red-200 text-[11px]">
                      <span className="font-bold block mb-0.5">Shortage Warning:</span>
                      {selectedNode.criticalItems.join(', ')}
                    </div>
                  )}

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => onOpenReroute(`${selectedNode.name} Shortage Diversion`)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      Emergency Reroute
                    </button>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3 rounded-xl font-medium transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Vehicle Details Card Dock */}
            {selectedVehicle && (
              <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-cyan-500/40 shadow-2xl text-xs z-30 max-w-sm w-full animate-in slide-in-from-bottom-2 text-white">
                <div className="flex justify-between items-start gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{selectedVehicle.name}</h4>
                      <p className="text-cyan-300 text-[11px]">{selectedVehicle.type} • {selectedVehicle.speed}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Heading:</span>
                    <span className="text-slate-200 font-medium">{selectedVehicle.heading}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cargo Temperature:</span>
                    <span className="text-emerald-400 font-bold">{selectedVehicle.temp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Destination Hub:</span>
                    <span className="text-white font-semibold">{selectedVehicle.destination}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                    <strong className="text-slate-200 block mb-0.5">Manifest Payload:</strong>
                    {selectedVehicle.cargo}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alerts Side Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl flex flex-col shadow-xs h-[520px] overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/90">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Statewide Urgent Alerts</span>
            </h3>
            <span className="text-xs font-bold bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200">
              {urgentAlerts.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {urgentAlerts.map((alert) => {
              const isCrit = alert.severity === 'critical';
              return (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border-l-4 transition-all ${
                    isCrit
                      ? 'bg-red-50/80 border-red-600 text-slate-900 border-t border-r border-b border-red-200/80'
                      : 'bg-amber-50/70 border-amber-500 text-slate-900 border-t border-r border-b border-amber-200/80'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-xs leading-snug text-slate-900">
                      {alert.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap font-mono">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {alert.description}
                  </p>
                  {alert.canReroute && (
                    <div className="mt-2.5 pt-2 border-t border-red-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-red-700">Immediate Action:</span>
                      <button
                        onClick={() => onOpenReroute(alert.title)}
                        className="text-xs font-bold text-[#00236f] hover:text-blue-800 bg-white px-3 py-1 rounded-lg border border-blue-200 shadow-2xs hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" /> Re-route Stock
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-200 text-center bg-slate-50/50">
            <button
              onClick={() => onOpenReroute()}
              className="text-xs font-semibold text-[#00236f] hover:underline cursor-pointer"
            >
              View All Statewide Dispatch Directives →
            </button>
          </div>
        </div>
      </div>

      {/* Vendor Performance Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-slate-50/80">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Manufacturer & Vendor Performance Directory</h3>
            <p className="text-xs text-slate-500">Procurement SLA compliance, fulfillment rate & quality reliability matrix</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter vendors by name..."
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/70 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Vendor Name</th>
                <th className="px-4 py-3">Fulfillment Rate</th>
                <th className="px-4 py-3">Avg Delay</th>
                <th className="px-4 py-3">Quality Score</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVendors.map((vendor) => {
                const isUnderReview = vendor.status === 'Under Review';
                return (
                  <tr key={vendor.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      <div>
                        {vendor.name}
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {vendor.activeOrders} active state consignments
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                      {vendor.fulfillmentRate}%
                    </td>
                    <td className={`px-4 py-3.5 font-medium ${isUnderReview ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                      {vendor.avgDelay}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center text-amber-500 gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {vendor.qualityRating >= 4 ? (
                          <Star className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Star className="w-3.5 h-3.5 text-slate-300" />
                        )}
                        {vendor.qualityRating >= 4.5 ? (
                          <StarHalf className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Star className="w-3.5 h-3.5 text-slate-300" />
                        )}
                        <span className="text-slate-600 text-[11px] font-mono ml-1">
                          ({vendor.qualityRating})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`inline-block text-[11px] px-2.5 py-1 rounded-full font-bold ${
                          vendor.status === 'Excellent'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : vendor.status === 'Good'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
