import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { affiliateStoreService, Product } from '../data/affiliateStoreService';

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'newest' | 'oldest' | 'priceAsc' | 'priceDesc'>('newest');

  useEffect(() => {
    // Update document title for store page
    document.title = 'Store - Naflume - আত্মশুদ্ধি_Tazkiyah an-Nafs';
    
    const unsub = affiliateStoreService.subscribeToProducts((items) => {
      setProducts(items.filter((p) => p.isActive !== false));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (sort === 'priceAsc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'priceDesc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'oldest') list.sort((a, b) => (a.updatedAt || a.createdAt) - (b.updatedAt || b.createdAt));
    else list.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
    return list;
  }, [products, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">Store</h1>
              <p className="text-gray-600">Curated books and goods</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-200" style={{ paddingTop: '75%' }} />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-8 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ffe4de' }}>
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#ff6347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7H4l2-4h12l2 4z" />
                <path d="M4 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500">Try a different sort option or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                title={p.title}
                description={p.description}
                imageUrl={p.imageUrl}
                slug={p.slug}
                price={p.price}
                currency={p.currency}
                discountPercent={p.discountPercent}
                highlights={p.highlights}
                authorName={p.authorName}
                vendorName={p.vendorName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
