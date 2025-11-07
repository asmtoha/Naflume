import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { affiliateStoreService, Product } from '../data/affiliateStoreService';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthor, setShowAuthor] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCoupon = async (code?: string) => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // Fallback: create a temp input
      try {
        const el = document.createElement('input');
        el.value = code;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!slug) return;
      const p = await affiliateStoreService.getProductBySlug(slug);
      if (mounted) {
        setProduct(p);
        setLoading(false);
        // Update document title with product name
        if (p) {
          document.title = `${p.title} - Store - Naflume - আত্মশুদ্ধি_Tazkiyah an-Nafs`;
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const discounted = useMemo(() => {
    if (!product) return 0;
    const percent = product.discountPercent || 0;
    const price = product.price || 0;
    const discountedPrice = price * (1 - percent / 100);
    return Math.max(0, discountedPrice);
  }, [product]);

  const currencySymbol = (currency?: string) => {
    return currency === 'USD' ? '$' : '৳';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <a href="/store" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Back to Store</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-10">
        {/* Title & Author */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
            {product.title}
          </h1>
          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-sm sm:text-base text-gray-600">
            {product.authorName ? (
              <>
                <span>By {product.authorName}</span>
                {product.authorIdentityUrl ? (
                  <a 
                    href={product.authorIdentityUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs sm:text-sm text-blue-600 hover:underline"
                  >
                    Verify author
                  </a>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        {/* Pricing bar (top) */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 neon-border">
            {/* Left side - Price and discount info */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 w-full xs:w-auto">
              <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                {currencySymbol(product.currency)}{discounted.toFixed(2)}
              </div>
              {product.discountPercent ? (
                <div className="flex flex-row items-center gap-2 xs:gap-3">
                  <div className="text-xs sm:text-sm md:text-base text-gray-500 line-through">
                    {currencySymbol(product.currency)}{product.price.toFixed(2)}
                  </div>
                  <div className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    -{product.discountPercent}%
                  </div>
                </div>
              ) : null}
            </div>
            
            {/* Right side - Coupon and Buy button */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3 w-full xs:w-auto">
              {/* Coupon section */}
              {product.couponCode ? (
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-1 xs:gap-2">
                  <div className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 text-center xs:text-left">
                    Coupon: {product.couponCode}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCoupon(product.couponCode || '')}
                    className="text-xs px-2 py-1 rounded border border-yellow-300 text-yellow-800 hover:bg-yellow-50 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ) : null}
              
              {/* Buy Now button */}
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm transition-colors w-auto"
              >
                Buy Now
              </a>
            </div>
          </div>
          
          {/* Coupon note - full width below */}
          {product.couponCode ? (
            <div className="mt-2 text-[10px] sm:text-[11px] text-gray-500 text-center">
              নোট: এই কুপনটি শুধুমাত্র এই অ্যাফিলিয়েট লিঙ্ক ব্যবহার করলে কাজ করবে।
            </div>
          ) : null}
        </div>

        {/* Blog-like content */}
        <article className="prose prose-blue max-w-none product-content">
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 leading-relaxed">
            {product.description}
          </p>
          {product.content ? (
            <div 
              className="prose max-w-none product-content text-sm sm:text-base" 
              dangerouslySetInnerHTML={{ __html: product.content }} 
            />
          ) : (
            <div className="text-gray-500 italic text-sm sm:text-base">
              No additional content available.
            </div>
          )}
        </article>

        {/* Highlights / Reviews */}
        {product.highlights && product.highlights.length > 0 ? (
          <div className="mt-6 sm:mt-10 space-y-3 sm:space-y-4">
            {product.highlights.map((q, idx) => (
              <blockquote 
                key={idx} 
                className="border-l-4 border-blue-500 pl-3 sm:pl-4 italic text-gray-800 bg-blue-50/50 py-3 px-3 sm:px-4 rounded text-sm sm:text-base"
              >
                "{q}"
              </blockquote>
            ))}
          </div>
        ) : null}

        {/* Mid CTA */}
        <div className="my-6 sm:my-8">
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow text-sm sm:text-base"
          >
            Buy Now
          </a>
        </div>

        {/* Pricing bar (bottom) */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 neon-border">
            {/* Left side - Price and discount info */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 w-full xs:w-auto">
              <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                {currencySymbol(product.currency)}{discounted.toFixed(2)}
              </div>
              {product.discountPercent ? (
                <div className="flex flex-row items-center gap-2 xs:gap-3">
                  <div className="text-xs sm:text-sm md:text-base text-gray-500 line-through">
                    {currencySymbol(product.currency)}{product.price.toFixed(2)}
                  </div>
                  <div className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    -{product.discountPercent}%
                  </div>
                </div>
              ) : null}
            </div>
            
            {/* Right side - Coupon and Buy button */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3 w-full xs:w-auto">
              {/* Coupon section */}
              {product.couponCode ? (
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-1 xs:gap-2">
                  <div className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 text-center xs:text-left">
                    Coupon: {product.couponCode}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCoupon(product.couponCode || '')}
                    className="text-xs px-2 py-1 rounded border border-yellow-300 text-yellow-800 hover:bg-yellow-50 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ) : null}
              
              {/* Buy Now button */}
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm transition-colors w-auto"
              >
                Buy Now
              </a>
            </div>
          </div>
          
          {/* Coupon note - full width below */}
          {product.couponCode ? (
            <div className="mt-2 text-[10px] sm:text-[11px] text-gray-500 text-center">
              নোট: এই কুপনটি শুধুমাত্র এই অ্যাফিলিয়েট লিঙ্ক ব্যবহার করলে কাজ করবে।
            </div>
          ) : null}
        </div>
      </div>

      {/* Author identity modal */}
      {showAuthor && product.authorIdentityUrl ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-4 relative">
            <button 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" 
              onClick={() => setShowAuthor(false)}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-3">Author Identity</h3>
            <div className="rounded-lg overflow-hidden border">
              <img 
                src={product.authorIdentityUrl} 
                alt="Author identity" 
                className="w-full object-contain" 
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetail;