import React, { useState, useRef, useCallback, useEffect } from 'react';
import CameraView, { CameraHandle } from './components/CameraView';
import UIOverlay from './components/UIOverlay';
import LoginPage from './components/LoginPage';
import { PRODUCTS } from './constants';
import { Product, StyleAnalysis } from './types';
import { generateTryOn, analyzeStyle } from './services/gemini';

const COMPLIMENTS = [
  "Slay! 💅",
  "It's giving... icon ✨",
  "Main character energy 💫",
  "No cap, you look fire 🔥",
  "Ate and left no crumbs 🍽️",
  "Absolute vibe 💯",
  "Drip check: Passed 💧",
  "Looking snatched 💅",
  "Periodt! ✨"
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const cameraRef = useRef<CameraHandle>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compliment, setCompliment] = useState<string | null>(null);
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysis | null>(null);
  
  // Countdown State
  const [countdown, setCountdown] = useState<number | null>(null);

  // 1. Triggered when user clicks a product
  const handleProductSelect = useCallback((product: Product) => {
    if (selectedProduct?.id === product.id && generatedImage) return; 
    
    // Reset states
    setSelectedProduct(product);
    setGeneratedImage(null);
    setCompliment(null);
    setStyleAnalysis(null);
    setError(null);
    
    // Start countdown
    setCountdown(3);
  }, [selectedProduct, generatedImage]);

  const handleReset = useCallback(() => {
    setSelectedProduct(null);
    setGeneratedImage(null);
    setCompliment(null);
    setStyleAnalysis(null);
    setError(null);
    setCountdown(null);
  }, []);

  // 2. Perform the actual capture and API call (Extracted function)
  const performCaptureAndGenerate = async (product: Product) => {
    // Capture current frame
    const imageBase64 = cameraRef.current?.capture();
    
    if (!imageBase64) {
      console.error("Camera capture failed - video might not be ready");
      setError("Could not capture camera. Please ensure camera is on.");
      setCountdown(null);
      return;
    }

    setIsProcessing(true);

    try {
      // Run analysis and try-on in parallel for better performance
      const [resultImage, analysis] = await Promise.all([
        generateTryOn(imageBase64, product.description, product.category),
        analyzeStyle(imageBase64)
      ]);

      setGeneratedImage(resultImage);
      setStyleAnalysis(analysis);
      setCompliment(COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)]);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.message || "Failed to generate try-on. Please try again.";
      setError(errorMessage);
      
      setTimeout(() => {
        setSelectedProduct(null);
        setError(null);
      }, 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Countdown Timer Effect
  useEffect(() => {
    if (countdown === null || !selectedProduct) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Timer finished, capture!
      setCountdown(null);
      performCaptureAndGenerate(selectedProduct);
    }
  }, [countdown, selectedProduct]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      
      {/* 1. Camera Feed (Background) */}
      <CameraView 
        ref={cameraRef} 
        isActive={!generatedImage} 
      />

      {/* 2. Generated Image Layer */}
      {generatedImage && (
        <div className="absolute inset-0 z-0">
           <img 
             src={generatedImage} 
             alt="Virtual Try-On Result" 
             className="w-full h-full object-cover"
           />
           {compliment && (
             <div className="absolute top-24 right-6 z-30 pointer-events-none">
               <h2 className="text-3xl md:text-4xl font-black italic text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)] animate-[popIn_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)] stroke-black tracking-tighter rotate-12">
                 {compliment}
               </h2>
             </div>
           )}
        </div>
      )}

      {/* 3. Countdown Overlay */}
      {countdown !== null && countdown > 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="text-[10rem] font-black text-white animate-pulse drop-shadow-2xl">
            {countdown}
          </div>
          <div className="absolute bottom-1/4 text-white text-xl font-medium tracking-widest uppercase bg-black/50 px-4 py-2 rounded-lg">
             Strike a Pose
          </div>
        </div>
      )}

      {/* 4. Processing State Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center pointer-events-none">
            <div className="text-white font-black uppercase tracking-[0.2em] text-xl animate-pulse">
              Processing...
            </div>
        </div>
      )}

      {/* 5. Error Toast */}
      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-sm bg-red-600/90 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-2xl z-50 text-sm font-medium text-center animate-bounce">
          {error}
        </div>
      )}

      {/* 6. Main UI Layer */}
      <UIOverlay 
        products={PRODUCTS}
        selectedProduct={selectedProduct}
        isProcessing={isProcessing}
        onSelectProduct={handleProductSelect}
        onReset={handleReset}
        hasResult={!!generatedImage}
        styleAnalysis={styleAnalysis}
      />
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          100% { opacity: 1; transform: scale(1) rotate(12deg); }
        }
      `}</style>
    </div>
  );
};

export default App;