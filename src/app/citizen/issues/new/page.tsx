'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { Camera, Upload, Trash2, CheckCircle, AlertCircle, X, Image as ImageIcon } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export default function ReportIssuePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [location, setLocation] = useState<Location | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  
  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // AI Analysis results (will be populated after submission)
  const [analyzing, setAnalyzing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved !== null) {
      setSidebarCollapsed(saved === 'true');
    }
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {}
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }

    // Get location on mount
    getCurrentLocation();

    // Cleanup camera on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Connect live stream to video element when camera is activated
  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.warn('Video auto-play warning:', err);
      });
    }
  }, [cameraActive, stream]);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        const { latitude, longitude } = position.coords;
        
        // Get address from coordinates using reverse geocoding
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          
          setLocation({
            latitude,
            longitude,
            address: response.data.display_name
          });
        } catch (err) {
          setLocation({ latitude, longitude });
        }
      } catch (err) {
        console.error('Location error:', err);
        setError('Could not get your location. Please enable location services.');
      }
    } else {
      setError('Geolocation is not supported by your browser.');
    }
    setLocationLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size must be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Stop camera if running
      stopCamera();

      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const startCamera = async () => {
    setError('');
    // Stop any existing stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    try {
      let mediaStream: MediaStream;
      try {
        // Try ideal environment camera first (good for back camera on mobile)
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (err) {
        // Fallback for laptops / desktop webcams that don't match specific constraints
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      setStream(mediaStream);
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera error:', err);
      // If camera access fails (or user denies/browser unsupported), trigger mobile native camera or file input
      if (nativeCameraInputRef.current) {
        nativeCameraInputRef.current.click();
      } else {
        setError('Could not access camera. Please check permissions or upload a photo.');
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');

      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], `issue-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setImage(capturedFile);
            setImagePreview(canvas.toDataURL('image/jpeg'));
            stopCamera();
            setError('');
          }
        }, 'image/jpeg', 0.92);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!image) {
      setError('Please upload or capture an image');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a brief description');
      return;
    }

    if (!location) {
      setError('Location is required. Please enable location services.');
      return;
    }

    setLoading(true);
    setAnalyzing(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('image', image);
      formData.append('description', description);
      formData.append('latitude', location.latitude.toString());
      formData.append('longitude', location.longitude.toString());
      if (location.address) {
        formData.append('address', location.address);
      }

      const response = await axios.post(`${API_URL}/issues/report`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess('Issue reported successfully! AI is analyzing your report...');
        
        // Show AI analysis results
        const { issue } = response.data.data;
        setTimeout(() => {
          router.push(`/citizen/issues/${issue.id}`);
        }, 2000);
      }
    } catch (err: any) {
      console.error('Report error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to report issue. Please try again.';
      const errorDetails = err.response?.data?.details;
      
      if (errorDetails) {
        setError(`${errorMessage}\n\n${errorDetails}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="citizen" collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          userName={user?.full_name || 'Citizen'}
          userRole="Citizen"
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Report New Issue</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Upload an image and describe the problem</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Image Upload / Capture Section */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">1. Issue Photo (Upload or Capture)</h2>
              <span className="text-[11px] text-primary-700 font-semibold px-2 py-0.5 bg-primary-50 rounded">Required</span>
            </div>

            {/* Hidden Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={nativeCameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* When No Image is Selected and Camera is NOT Active */}
            {!imagePreview && !cameraActive && (
              <div className="space-y-3">
                {/* Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-5 sm:p-6 text-center hover:border-primary-400 hover:bg-primary-50/40 transition cursor-pointer group"
                >
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-800 font-semibold">
                    Click to browse or drag & drop issue photo
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Supports PNG, JPG, WebP up to 10MB</p>
                </div>

                {/* Camera / Upload Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-2xs"
                  >
                    <Camera className="w-4 h-4" />
                    Open Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-700 border border-gray-300 hover:border-primary-300 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-4 h-4 text-gray-500" />
                    Upload from Device
                  </button>
                </div>
              </div>
            )}

            {/* Live Camera Viewfinder */}
            {cameraActive && (
              <div className="space-y-3">
                <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-[260px] max-h-[400px]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                  {/* Viewfinder crosshairs overlay */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-white/20 rounded-lg flex items-center justify-center">
                    <div className="w-48 h-48 border border-white/40 rounded-lg"></div>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium rounded flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Live Camera Feed
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 justify-center items-center">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-3.5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Cancel Camera
                  </button>
                </div>
              </div>
            )}

            {/* Photo Captured / Uploaded Preview */}
            {imagePreview && !cameraActive && (
              <div className="space-y-3">
                <div className="relative max-h-80 overflow-hidden rounded-lg border border-gray-200 bg-gray-900/5 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Captured or Uploaded Issue Photo"
                    className="w-full max-h-80 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition shadow-sm"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-900">
                        {image?.name ? image.name : 'Photo ready for report'}
                      </p>
                      <p className="text-[10px] text-emerald-700">
                        {image?.size ? `${(image.size / (1024 * 1024)).toFixed(2)} MB` : ''} • Image ready for AI analysis
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-2.5 py-1 text-xs bg-white text-gray-700 hover:text-primary-700 border border-gray-300 hover:border-primary-300 rounded hover:bg-primary-50 transition flex items-center gap-1 font-medium"
                    >
                      <Camera className="w-3.5 h-3.5 text-primary-600" />
                      Retake
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs bg-white text-gray-700 hover:text-primary-700 border border-gray-300 hover:border-primary-300 rounded hover:bg-primary-50 transition flex items-center gap-1 font-medium"
                    >
                      <Upload className="w-3.5 h-3.5 text-primary-600" />
                      Change
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">2. Brief Description</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the issue (e.g., 'Large pothole', 'No water supply', 'Broken streetlight')..."
              rows={3}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none bg-white"
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-1 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                💡 <strong>Tip:</strong> AI will analyze your image and generate a detailed description automatically
              </span>
              <span>{description.length}/500</span>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 hover:border-primary-400 hover:ring-2 hover:ring-primary-50 transition-all duration-200">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2.5">3. Location</h2>
            {locationLoading ? (
              <div className="flex items-center gap-2 text-xs text-gray-600 py-2">
                <svg className="animate-spin h-4 w-4 text-primary-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Getting your location...
              </div>
            ) : location ? (
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-emerald-900">Location captured</p>
                    {location.address && (
                      <p className="text-xs text-emerald-800 mt-0.5">{location.address}</p>
                    )}
                    <p className="text-[10px] text-emerald-600 mt-0.5">
                      Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Update Location
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800">Location not available</p>
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-xs font-medium"
                >
                  Enable Location
                </button>
              </div>
            )}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg text-xs font-medium">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-2.5">
            <button
              type="submit"
              disabled={loading || !image || !description || !location}
              className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {analyzing ? 'AI Analyzing...' : 'Submitting...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Report Issue
                </span>
              )}
            </button>
            <Link
              href="/citizen/dashboard"
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
          </div>

          {/* Info Box */}
          <div className="bg-primary-50/70 border border-primary-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2.5">
              <svg className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-primary-900 mb-0.5">How it works</h4>
                <ul className="text-xs text-primary-800 space-y-0.5">
                  <li>• AI will analyze your image and generate detailed description</li>
                  <li>• AI will automatically detect the appropriate department (electric, road, water, forest)</li>
                  <li>• The issue will be assigned to the relevant department admin</li>
                  <li>• You can track the progress from your dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
          </div>
        </main>
      </div>
    </div>
  );
}
