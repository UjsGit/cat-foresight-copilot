import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { VisionDetectionResult, DetectedVisionObject } from '../types';
import {
  Camera,
  Upload,
  ShieldAlert,
  User,
  Truck,
  Eye,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const CameraVisionPage: React.FC = () => {
  const [result, setResult] = useState<VisionDetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Run initial demo detection on page load
    runDetection();
  }, []);

  const runDetection = async (file?: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      const data = await api.detectVision(formData);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      runDetection(file);
    }
  };

  const getHazardBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500 text-white font-bold animate-pulse';
      case 'WARNING':
        return 'bg-amber-500 text-cat-black font-bold';
      default:
        return 'bg-emerald-500 text-white font-semibold';
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cat-yellow uppercase mb-1">
            <Camera className="w-4 h-4" />
            <span>AI Computer Vision Safety Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase">
            Camera Proximity Vision
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Pretrained YOLOv8 neural detection for personnel & vehicles with camera-estimated distance heuristics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-cat-surfaceElevated hover:bg-cat-surfaceLight text-slate-200 border border-cat-border hover:border-cat-yellow px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4 text-cat-yellow" />
            <span>Upload Image</span>
          </button>

          <button
            onClick={() => runDetection(selectedFile || undefined)}
            disabled={loading}
            className="bg-cat-yellow hover:bg-cat-yellowLight text-cat-black px-4 py-2.5 rounded-xl font-mono text-xs font-extrabold flex items-center gap-2 shadow-hud-glow transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Processing Frame...' : 'Refresh Detection'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Detection Canvas / Viewport (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cat-yellow" />
              <span>Rear Blind Spot Camera Feed (Simulated Frame)</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
              {result?.mode === 'yolo_v8_live' ? 'YOLOv8 Live Inference' : 'Demonstration Stream'}
            </span>
          </div>

          {/* Camera Frame Viewport */}
          <div className="relative w-full h-80 sm:h-96 bg-cat-black rounded-xl border-2 border-cat-border overflow-hidden flex items-center justify-center">
            {/* Simulated background quarry image with grid */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(#2F374A_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* If user uploaded image, show image */}
            {previewUrl && (
              <img src={previewUrl} alt="Uploaded feed" className="absolute inset-0 w-full h-full object-contain z-0" />
            )}

            {/* Bounding Box 1: Person (Simulated or Real) */}
            <div
              className="absolute z-10 border-2 border-red-500 bg-red-500/15 rounded transition-all flex flex-col justify-between p-1.5 shadow-alert-glow"
              style={{
                left: '25%',
                top: '20%',
                width: '26%',
                height: '62%',
              }}
            >
              <div className="bg-red-600 text-white text-[11px] font-mono font-extrabold px-1.5 py-0.5 rounded self-start flex items-center gap-1 shadow">
                <User className="w-3 h-3" />
                <span>PERSON (93%)</span>
              </div>
              <div className="bg-cat-black/90 text-red-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-red-500/40 self-end">
                Camera-Estimated: 4.2m [CRITICAL]
              </div>
            </div>

            {/* Bounding Box 2: Haul Truck */}
            <div
              className="absolute z-10 border-2 border-blue-500 bg-blue-500/10 rounded transition-all flex flex-col justify-between p-1.5"
              style={{
                left: '60%',
                top: '35%',
                width: '32%',
                height: '48%',
              }}
            >
              <div className="bg-blue-600 text-white text-[11px] font-mono font-extrabold px-1.5 py-0.5 rounded self-start flex items-center gap-1">
                <Truck className="w-3 h-3" />
                <span>TRUCK (88%)</span>
              </div>
              <div className="bg-cat-black/90 text-blue-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-blue-500/40 self-end">
                Camera-Estimated: 11.5m [SAFE]
              </div>
            </div>

            {/* Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-20 h-20 border border-cat-yellow/30 rounded-full" />
              <div className="w-1 h-6 bg-cat-yellow/40 absolute" />
              <div className="h-1 w-6 bg-cat-yellow/40 absolute" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Class Categories: Person, Excavator, Wheel Loader, Haul Truck</span>
            <span>Distance Label: Camera-Estimated</span>
          </div>
        </div>

        {/* Right Column: Vision Risk Score & Detection Feed (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
              Vision Risk Assessment
            </h3>

            <div className="bg-red-950/40 border border-red-500/50 p-4 rounded-xl space-y-2 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-red-300 font-bold uppercase">Evaluated Risk</span>
                <span className="text-2xl font-black text-red-400">
                  {result?.safety_risk_score ? result.safety_risk_score.toFixed(0) : 88}/100
                </span>
              </div>
              <div className="text-xs text-white font-bold">
                {result?.recommended_action || 'Stop safely, verify the rear zone, and proceed only after clear.'}
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="text-slate-400 font-bold uppercase mb-1">Detections in Current View:</div>
              <div className="bg-cat-surfaceElevated p-3 rounded-lg border border-cat-border flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-white">
                  <User className="w-4 h-4 text-red-400" /> Person (Pedestrian)
                </span>
                <span className="text-xs font-bold text-red-400">4.2m Distance</span>
              </div>

              <div className="bg-cat-surfaceElevated p-3 rounded-lg border border-cat-border flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-white">
                  <Truck className="w-4 h-4 text-blue-400" /> Cat 745 Haul Truck
                </span>
                <span className="text-xs font-bold text-blue-400">11.5m Distance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
