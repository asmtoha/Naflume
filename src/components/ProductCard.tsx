import React from 'react';

interface Props {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  price?: number;
  currency?: 'BDT' | 'USD';
  discountPercent?: number;
  highlights?: string[];
  authorName?: string;
  vendorName?: string;
}

const fallbackImg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="%239ca3af">Image unavailable</text></svg>';

const ProductCard: React.FC<Props> = ({ 
  title, 
  description, 
  imageUrl, 
  slug, 
  price, 
  currency = 'BDT', 
  discountPercent = 0,
  highlights = [],
  authorName,
  vendorName
}) => {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'BDT') {
      return `৳${price.toLocaleString()}`;
    }
    return `$${price.toLocaleString()}`;
  };

  // Treat `price` as original/base price. Compute discounted price when discount applies.
  const hasDiscount = (discountPercent || 0) > 0;
  const discountedPrice = hasDiscount && price
    ? Math.max(0, Math.round(price * (1 - (discountPercent as number) / 100)))
    : null;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-96">
      {/* Floating particles for visual appeal */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-particle" style={{ top: '10%', left: '20%', animationDelay: '0s' }}></div>
        <div className="floating-particle" style={{ top: '30%', right: '15%', animationDelay: '1s' }}></div>
        <div className="floating-particle" style={{ bottom: '20%', left: '10%', animationDelay: '2s' }}></div>
        <div className="floating-particle" style={{ bottom: '40%', right: '25%', animationDelay: '3s' }}></div>
      </div>
      {/* Image section with overlay badges - 60% */}
      <div className="relative bg-gray-100 overflow-hidden" style={{ height: '60%' }}>
        <div className="w-full h-full">
          <img
            src={imageUrl || fallbackImg}
            alt={title}
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== fallbackImg) target.src = fallbackImg;
            }}
            className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discountPercent}%
          </div>
        )}
        
        {/* Trusted vendor badge */}
        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
          ✓ Trusted
        </div>

        {/* Special Coupon Code Banner - appears on hover */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl border-2 border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span className="tracking-wider">COUPON INSIDE</span>
              <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Price overlay with neon border effect */}
        {price && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="relative bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg neon-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-gray-900">
                    {formatPrice(hasDiscount && discountedPrice !== null ? discountedPrice : price, currency)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(price, currency)}
                    </span>
                  )}
                </div>
                
                {/* Coupon code indicator */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg coupon-indicator">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full coupon-badge">
                      <div className="w-full h-full bg-red-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  
                  {vendorName && (
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {vendorName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

       {/* Content - 40% */}
       <div className="p-3 flex flex-col justify-between" style={{ height: '40%' }}>
         <div>
           {/* Author info */}
           {authorName && (
             <div className="flex items-center gap-1.5 mb-1">
               <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                 <span className="text-xs font-bold text-white">
                   {authorName.charAt(0).toUpperCase()}
                 </span>
               </div>
               <span className="text-xs text-gray-600 font-medium">{authorName}</span>
             </div>
           )}

           {/* Title */}
           <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
             {title}
           </h3>
           
           {/* Description */}
           <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
             {description}
           </p>
         </div>

         {/* View Details button */}
         <a
           href={`/store/${slug}`}
           className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-full text-xs"
         >
           <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M9 18l6-6-6-6" />
           </svg>
           View Details
         </a>
       </div>

      {/* Hover effects */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-blue-200 group-hover:ring-offset-1 transition-all duration-300" />
    </div>
  );
};

export default ProductCard;
