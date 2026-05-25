import React, { useState, useMemo } from 'react';
import { Product, StyleAnalysis } from '../types';
import { Camera, RefreshCw, ShoppingBag, Heart, MoreVertical, Sparkles, Ruler, Palette, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface UIOverlayProps {
  products: Product[];
  selectedProduct: Product | null;
  isProcessing: boolean;
  onSelectProduct: (product: Product) => void;
  onReset: () => void;
  hasResult: boolean;
  styleAnalysis: StyleAnalysis | null;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  products,
  selectedProduct,
  isProcessing,
  onReset,
  onSelectProduct,
  hasResult,
  styleAnalysis
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLiked, setIsLiked] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isStyleGuideExpanded, setIsStyleGuideExpanded] = useState(true);

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleAction = (action: string) => {
    if (action === 'like') {
      setIsLiked(!isLiked);
    } else {
      setShowToast(`${action.charAt(0).toUpperCase() + action.slice(1)} feature coming soon!`);
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl text-white text-xs font-black uppercase tracking-widest animate-[slideDown_0.3s_ease-out] shadow-2xl">
          {showToast}
        </div>
      )}

      {/* Top Bar - Simplified */}
      {!hasResult && (
        <div className="flex justify-between items-center p-6 bg-gradient-to-b from-black/20 to-transparent pointer-events-auto">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tighter italic">TRYVERA</h1>
          </div>
        </div>
      )}

      {/* Floating Actions - Exact Top Center - Hidden on Result */}
      {!hasResult && (
        <div className="absolute top-7 left-1/2 -translate-x-1/2 flex flex-row gap-3 items-center pointer-events-auto z-30">
          <button 
            onClick={() => handleAction('like')}
            className={`p-2.5 backdrop-blur-2xl rounded-full border transition-all duration-500 ${
              isLiked 
                ? 'bg-red-500 border-red-500' 
                : 'bg-white/10 border-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-white fill-white' : 'text-white'}`} />
          </button>
          
          <button 
            onClick={() => handleAction('shop')}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black rounded-full font-black uppercase tracking-widest text-[9px]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop</span>
          </button>

          <button 
            onClick={() => handleAction('more')}
            className="p-2.5 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20"
          >
            <MoreVertical className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Spacer to push content to bottom */}
      <div className="flex-grow" />

      {/* Bottom Area - Product Showcase */}
      <div className={`flex flex-col justify-end relative pointer-events-auto ${!hasResult ? 'pb-12 bg-gradient-to-t from-black/20 via-black/10 to-transparent' : 'pb-12'}`}>
        
        {/* Status / Action Button */}
        <div className="flex justify-center mb-6">
          {isProcessing ? (
             <div className="flex items-center gap-4 px-10 py-4 bg-white text-black rounded-3xl font-black uppercase tracking-tighter">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="text-base">Processing...</span>
             </div>
          ) : hasResult ? (
            <div className="flex flex-col items-center gap-4 w-full px-8">
              {/* Style Analysis Card */}
              {styleAnalysis && (
                <div className="w-full bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 p-6 mb-4 animate-[slideUp_0.6s_ease-out] transition-all duration-500">
                  <button 
                    onClick={() => setIsStyleGuideExpanded(!isStyleGuideExpanded)}
                    className="w-full flex items-center justify-between mb-0"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-white font-black uppercase tracking-widest text-xs">AI Style Guide</h4>
                    </div>
                    {isStyleGuideExpanded ? (
                      <ChevronDown className="w-5 h-5 text-white/50" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-white/50" />
                    )}
                  </button>
                  
                  {isStyleGuideExpanded && (
                    <div className="mt-4 animate-[fadeIn_0.3s_ease-out]">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-white/50 text-[9px] font-black uppercase tracking-wider">
                            <Palette className="w-3 h-3" />
                            <span>Skin Tone</span>
                          </div>
                          <p className="text-white text-xs font-bold">{styleAnalysis.skinTone}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-white/50 text-[9px] font-black uppercase tracking-wider">
                            <Ruler className="w-3 h-3" />
                            <span>Recommended Size</span>
                          </div>
                          <p className="text-white text-xs font-bold">{styleAnalysis.sizeRecommendation}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1.5 text-white/50 text-[9px] font-black uppercase tracking-wider mb-2">
                          <Palette className="w-3 h-3" />
                          <span>Best Colors for You</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {styleAnalysis.recommendedColors.map((color, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-[10px] text-white font-bold border border-white/10">
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1.5 text-white/50 text-[9px] font-black uppercase tracking-wider mb-1">
                          <Info className="w-3 h-3" />
                          <span>Pro Tip</span>
                        </div>
                        <p className="text-white/80 text-[11px] leading-relaxed italic font-medium">
                          "{styleAnalysis.styleAdvice}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={onReset}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black uppercase tracking-tighter shadow-2xl active:scale-95 transition-all w-auto justify-center ${
                  isStyleGuideExpanded 
                    ? 'bg-white text-black' 
                    : 'bg-white/10 text-white backdrop-blur-xl border border-white/20'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="text-sm">New Capture</span>
              </button>
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>

        {/* Category Filter Bar - Editorial Style */}
        {!hasResult && !isProcessing && (
          <div className="flex gap-3 overflow-x-auto px-8 mb-8 no-scrollbar pointer-events-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-6 py-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-500 border-2 ${
                  activeCategory === cat 
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Selected Product Info Card - Premium Floating */}
        {selectedProduct && !hasResult && !isProcessing && (
          <div className="mx-8 mb-8 p-6 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex items-center justify-between pointer-events-auto animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)] shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 border-white/10 shadow-2xl transform -rotate-3">
                <img src={selectedProduct.thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-[10px] text-yellow-400 font-black uppercase tracking-[0.3em] mb-1 block">{selectedProduct.brand}</span>
                <h3 className="text-white font-black text-xl leading-none uppercase tracking-tighter mb-1">{selectedProduct.name}</h3>
                <p className="text-white/60 font-bold text-sm italic">{selectedProduct.price}</p>
              </div>
            </div>
          </div>
        )}

        {/* Product Carousel - Hidden on Result */}
        {!hasResult && (
          <div className="flex gap-6 overflow-x-auto px-8 pb-6 no-scrollbar pointer-events-auto snap-x">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => !isProcessing && onSelectProduct(product)}
                className={`relative group flex-shrink-0 snap-center transition-all duration-500 ${
                  selectedProduct?.id === product.id 
                    ? 'w-44 h-64' 
                    : 'w-32 h-44 opacity-40 scale-95'
                }`}
              >
                <div className={`w-full h-full rounded-[2rem] overflow-hidden border-2 transition-all duration-500 ${
                   selectedProduct?.id === product.id 
                     ? 'border-yellow-400' 
                     : 'border-white/10'
                }`}>
                  <img 
                    src={product.thumbnail} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/80 rounded-xl text-[10px] font-black text-white border border-white/10">
                    {product.price.split('.')[0]}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[8px] text-yellow-400 font-black uppercase tracking-widest block mb-0.5">{product.brand}</span>
                    <span className="text-[10px] text-white font-bold uppercase truncate block">{product.name}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UIOverlay;