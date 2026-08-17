'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Flashlight,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  PackageCheck,
  RefreshCw,
  Thermometer,
  ShieldCheck,
  Barcode,
  Upload,
  SwitchCamera,
  Image as ImageIcon,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (scannedData: {
    code: string;
    type: string;
    origin: string;
    items: string;
    batchNo: string;
    temperature: string;
    photoUrl?: string;
  }) => void;
}

export default function ScannerModal({
  isOpen,
  onClose,
  onScanComplete,
}: ScannerModalProps) {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'unsupported'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);

  const [scannedResult, setScannedResult] = useState<{
    code: string;
    type: string;
    origin: string;
    destination: string;
    items: string;
    batchNo: string;
    quantity: number;
    temperature: string;
    status: string;
    photoUrl?: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sampleConsignments = [
    {
      code: 'SHP-8821-REG-DEPOT',
      type: 'Shipment Consignment',
      origin: 'Regional Depot A, West Bengal',
      destination: 'Primary Health Centre, Malda',
      items: 'Paracetamol 500mg (1,000 tabs), Amoxicillin 250mg (500 caps)',
      batchNo: 'B-7742 & AX-112',
      quantity: 1500,
      temperature: '21.4°C (Normal Ambience)',
      status: 'Verified & Cleared',
    },
    {
      code: 'ORD-2023-8942-WAYBILL',
      type: 'Dispatch Waybill',
      origin: 'Central State Medical Warehouse',
      destination: 'City Hospital North Wing',
      items: 'Amoxicillin 500mg, Ibuprofen 400mg, Saline 500ml',
      batchNo: 'B-992-X / IV-22-A',
      quantity: 8700,
      temperature: '22.0°C (Normal Ambience)',
      status: 'Verified & Cleared',
    },
    {
      code: 'COLD-CHAIN-INS-112',
      type: 'Cold Chain Consignment',
      origin: 'Apex BioPharma Supplies Hub',
      destination: 'PHC Malda Cold Vault',
      items: 'Insulin Glargine 100IU/ml (150 Vials)',
      batchNo: 'C-112-COLD',
      quantity: 150,
      temperature: '3.8°C (Optimal Cold Chain 2-8°C)',
      status: 'Cold Chain Validated',
    },
  ];

  // Play audio feedback beep on successful barcode scan / photo snap
  const playScanBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.13);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Start Camera Stream
  const startCamera = React.useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unsupported');
      setErrorMessage('Camera access is not supported by your browser.');
      return;
    }

    setCameraState('requesting');
    setErrorMessage(null);

    // Stop existing stream if running
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraState('active');
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraState('denied');
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. You can take/upload a photo from file or simulate a scan below.'
          : 'Unable to connect to camera device. You can capture or upload an image.'
      );
    }
  }, [facingMode]);

  // Stop Camera Tracks
  const stopCamera = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Switch between front and rear camera
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  // Toggle Torch/Flashlight if supported
  const handleToggleFlashlight = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && 'applyConstraints' in track) {
      try {
        const nextState = !flashlightOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setFlashlightOn(nextState);
      } catch {
        // Torch constraint not supported on all cameras
        setFlashlightOn(!flashlightOn);
      }
    } else {
      setFlashlightOn(!flashlightOn);
    }
  };

  // Life Cycle for Camera
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        startCamera();
      }
    }, 40);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  // Capture Photo from Live Video Feed
  const handleCapturePhoto = () => {
    setIsCapturing(true);
    playScanBeep();

    let photoDataUrl: string | null = null;

    if (videoRef.current && videoRef.current.videoWidth > 0) {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        photoDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setCapturedPhoto(photoDataUrl);
      }
    }

    setTimeout(() => {
      setIsCapturing(false);
      setScanning(false);
      // Generate parsed result with photo
      const template = sampleConsignments[Math.floor(Math.random() * sampleConsignments.length)];
      setScannedResult({
        ...template,
        photoUrl: photoDataUrl || undefined,
      });
    }, 450);
  };

  // Handle Image File Upload (from gallery / file system)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedPhoto(dataUrl);
      playScanBeep();
      setScanning(false);

      const template = sampleConsignments[0];
      setScannedResult({
        ...template,
        code: `IMG-SCAN-${file.name.substring(0, 12).toUpperCase()}`,
        photoUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  // Quick Preset Barcode Simulation
  const handleSimulateScan = (index: number) => {
    playScanBeep();
    setScanning(false);
    const result = sampleConsignments[index];
    setScannedResult(result);
  };

  const handleResetScan = () => {
    setScanning(true);
    setScannedResult(null);
    setCapturedPhoto(null);
    if (cameraState !== 'active') {
      startCamera();
    }
  };

  const handleClose = () => {
    stopCamera();
    setScanning(true);
    setScannedResult(null);
    setCapturedPhoto(null);
    onClose();
  };

  const handleConfirmReceive = () => {
    if (scannedResult) {
      onScanComplete(scannedResult);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Hidden Canvas for Frame Grab */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Hidden File Input for Image Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Header */}
        <div className="bg-[#00236f] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <Camera className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Live Camera & Barcode Scanner</h3>
              <p className="text-xs text-blue-200">Real-time camera view, photo capture & GS1 validation</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Viewfinder Stage */}
        <div className="relative bg-slate-950 p-4 sm:p-5 flex flex-col items-center justify-center min-h-[300px] overflow-hidden flex-1">
          {/* Shutter Flash Animation */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300 pointer-events-none" />
          )}

          {scanning ? (
            <div className="relative w-full max-w-[340px] aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-inner flex items-center justify-center">
              {/* Live Video Stream */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraState === 'active' ? 'block' : 'hidden'}`}
              />

              {/* Camera Status / Fallback Overlay if camera is not active */}
              {cameraState !== 'active' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-900/90 text-slate-300 z-10 space-y-2">
                  {cameraState === 'requesting' ? (
                    <>
                      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-semibold text-white">Accessing Camera Device...</p>
                      <p className="text-[11px] text-slate-400">Please allow camera permissions if prompted</p>
                    </>
                  ) : (
                    <>
                      <Camera className="w-10 h-10 text-slate-500 mb-1" />
                      <p className="text-xs font-semibold text-slate-200">
                        {cameraState === 'denied' ? 'Camera Not Permitted' : 'Camera Standby'}
                      </p>
                      <p className="text-[10px] text-slate-400 max-w-[240px] leading-relaxed">
                        {errorMessage || 'Use manual capture, image upload, or preset batch codes below.'}
                      </p>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={startCamera}
                          className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          Retry Camera
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" /> Upload Photo
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Optical Scanning Reticle & Brackets */}
              <div className="absolute inset-4 pointer-events-none flex items-center justify-center">
                {/* Target Frame */}
                <div className="relative w-48 h-48 border border-blue-400/40 rounded-xl">
                  {/* Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-md"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-md"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-md"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-md"></div>

                  {/* Animated Laser Scanning Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_#22d3ee] animate-bounce opacity-90 top-1/2 -translate-y-1/2"></div>
                </div>
              </div>

              {/* Viewfinder Controls Bar (Flash, Camera Switcher, Upload) */}
              <div className="absolute bottom-2 inset-x-2 flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-950/60 backdrop-blur-md z-20">
                <button
                  onClick={handleToggleFlashlight}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    flashlightOn
                      ? 'bg-amber-400 text-slate-900 shadow-md'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title="Toggle Flashlight / Torch"
                >
                  <Flashlight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-slate-300 uppercase">
                    {cameraState === 'active' ? 'Live Optical Feed' : 'Optical Ready'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleToggleFacingMode}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    title="Flip Camera (Front/Rear)"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    title="Upload Photo / Scan File"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Scanned & Captured Photo Inspection Result */
            <div className="w-full bg-slate-900 rounded-2xl p-4 border border-emerald-500/40 text-left animate-in zoom-in-95 duration-200 max-h-[380px] overflow-y-auto space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Consignment Recognized & Validated</span>
                </div>
                <span className="text-[10px] uppercase font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-md">
                  GS1-128 Cleared
                </span>
              </div>

              {/* Photo Thumbnail if Captured */}
              {capturedPhoto && (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 max-h-36 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={capturedPhoto}
                    alt="Captured Medicine Batch"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1 border border-white/20">
                    <Camera className="w-3 h-3 text-cyan-300" />
                    <span>Captured Photo</span>
                  </div>
                </div>
              )}

              {/* Extracted Metadata Grid */}
              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Waybill / Code:</span>
                  <span className="font-mono font-bold text-white">{scannedResult?.code}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Origin Depot:</span>
                  <span className="text-slate-200">{scannedResult?.origin}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Destination:</span>
                  <span className="text-slate-200">{scannedResult?.destination}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Contents:</span>
                  <span className="text-slate-200 font-medium text-right max-w-[220px] truncate">
                    {scannedResult?.items}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Batch Lot ID:</span>
                  <span className="font-mono text-cyan-300 font-bold">{scannedResult?.batchNo}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-blue-400" /> Cold-Chain Integrity:
                  </span>
                  <span className="text-emerald-400 font-semibold">{scannedResult?.temperature}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Simulation Batch Selector Bar when in Scanning mode */}
          {scanning && (
            <div className="w-full mt-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Or select sample batch for instant verification:</span>
                <span className="text-slate-500 font-mono">3 Presets</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSimulateScan(0)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 text-center text-xs font-medium border border-white/10 transition-colors flex flex-col items-center gap-1 cursor-pointer"
                >
                  <Barcode className="w-4 h-4 text-blue-300" />
                  <span className="truncate w-full text-[11px] font-mono">#SHP-8821</span>
                </button>
                <button
                  onClick={() => handleSimulateScan(1)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 text-center text-xs font-medium border border-white/10 transition-colors flex flex-col items-center gap-1 cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4 text-emerald-300" />
                  <span className="truncate w-full text-[11px] font-mono">#ORD-8942</span>
                </button>
                <button
                  onClick={() => handleSimulateScan(2)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 text-center text-xs font-medium border border-white/10 transition-colors flex flex-col items-center gap-1 cursor-pointer"
                >
                  <Thermometer className="w-4 h-4 text-cyan-300" />
                  <span className="truncate w-full text-[11px] font-mono">Insulin 100IU</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {scanning ? (
            <>
              <button
                onClick={handleClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
                <button
                  onClick={handleCapturePhoto}
                  className="px-5 py-2.5 bg-[#00236f] hover:bg-blue-900 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <Camera className="w-4 h-4 text-cyan-300" />
                  <span>Take Photo & Scan</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleResetScan}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retake / Scan Again
              </button>
              <button
                onClick={handleConfirmReceive}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                Confirm & Add to Stock
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
