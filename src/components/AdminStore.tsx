import React, { useEffect, useMemo, useState } from 'react';
import EnhancedRichTextEditor from './EnhancedRichTextEditor';
import { useAuth } from '../contexts/AuthContext';
import { affiliateStoreService, Product, NewProductInput } from '../data/affiliateStoreService';

const ADMIN_UID = 'RTQdWZYnp6MwC5qpGtgeSDvJoTp1'; // Only this UID can access

const AdminStore: React.FC = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<NewProductInput>({
    title: '',
    description: '',
    price: 0,
    affiliateUrl: '',
    isActive: true,
    imageUrl: '',
    slug: '',
    authorName: '',
    authorIdentityUrl: '',
    content: '',
    currency: 'BDT',
    discountPercent: 0,
    couponCode: '',
    highlights: [],
    vendorName: ''
  });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAuthorized = useMemo(() => currentUser?.uid === ADMIN_UID, [currentUser]);

  useEffect(() => {
    if (!isAuthorized) return;
    const unsub = affiliateStoreService.subscribeToProducts((items) => {
      setProducts(items);
      setLoading(false);
    });
    return () => unsub();
  }, [isAuthorized]);

  if (!currentUser) {
    return <div className="p-10 text-center">Please sign in.</div>;
  }
  if (!isAuthorized) {
    return <div className="p-10 text-center">Access denied.</div>;
  }

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      price: 0,
      affiliateUrl: '',
      isActive: true,
      imageUrl: '',
      slug: '',
      authorName: '',
      authorIdentityUrl: '',
      content: '',
      currency: 'BDT',
      discountPercent: 0,
      couponCode: '',
      highlights: [],
      vendorName: ''
    });
    setImageFile(undefined);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await affiliateStoreService.updateProduct(editingId, { ...form, imageFile });
      } else {
        await affiliateStoreService.addProduct({ ...form, imageFile });
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Operation failed');
    }
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      affiliateUrl: p.affiliateUrl,
      isActive: p.isActive,
      imageUrl: p.imageUrl,
      slug: p.slug || '',
      authorName: p.authorName || '',
      authorIdentityUrl: p.authorIdentityUrl || '',
      content: p.content || '',
      currency: p.currency || 'BDT',
      discountPercent: p.discountPercent ?? 0,
      couponCode: p.couponCode || '',
      highlights: p.highlights || [],
      vendorName: p.vendorName || ''
    });
    setImageFile(undefined);
  };

  const handleDelete = async (p: Product) => {
    if (!window.confirm(`Are you sure you want to delete "${p.title}"?`)) return;
    try {
      setDeletingId(p.id);
      console.log('Deleting product:', p.id, p.title);
      await affiliateStoreService.deleteProduct(p.id, p.imageUrl);
      console.log('Product deleted successfully');
      // The product will be removed from the list automatically due to the real-time listener
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(`Delete failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <h1 className="text-2xl font-bold">Affiliate Store Admin</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input className="w-full px-3 py-2 border rounded-lg" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input className="w-full px-3 py-2 border rounded-lg" placeholder="unique-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.trim() })} required />
              <p className="text-xs text-gray-500 mt-1">Used in URL: /store/{'{'}slug{'}'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" min="0" step="0.01" className="w-full px-3 py-2 border rounded-lg" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select className="w-full px-3 py-2 border rounded-lg" value={form.currency || 'BDT'} onChange={(e) => setForm({ ...form, currency: e.target.value as any })}>
                <option value="BDT">BDT</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
              <input type="number" min="0" max="100" step="1" className="w-full px-3 py-2 border rounded-lg" value={form.discountPercent || 0} onChange={(e) => setForm({ ...form, discountPercent: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
              <input className="w-full px-3 py-2 border rounded-lg" value={form.couponCode || ''} onChange={(e) => setForm({ ...form, couponCode: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-600">
                Computed price: <span className="font-semibold">{form.currency === 'USD' ? '$' : '৳'}{(form.price * (1 - (form.discountPercent || 0) / 100)).toFixed(2)}</span>
                {form.discountPercent ? <span className="ml-2 line-through text-gray-400">{form.currency === 'USD' ? '$' : '৳'}{form.price.toFixed(2)}</span> : null}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="w-full px-3 py-2 border rounded-lg" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Long Content</label>
              <EnhancedRichTextEditor 
                value={form.content || ''} 
                onChange={(html) => {
                  console.log('Content changed:', html);
                  setForm({ ...form, content: html });
                }} 
                placeholder="Write rich content with headings, lists, links, quotes, code, and emojis..." 
              />
              <div className="mt-2 text-xs text-gray-500">
                Content length: {form.content?.length || 0} characters
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Highlights / Reviews</label>
              <p className="text-xs text-gray-500 mb-1">Add one quote per line. These will be shown as highlighted quotes.</p>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows={4}
                placeholder={`Excellent book for beginners.\nInsightful and well-researched.`}
                value={(form.highlights || []).join('\n')}
                onChange={(e) => setForm({ ...form, highlights: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
              <input className="w-full px-3 py-2 border rounded-lg" value={form.authorName || ''} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor/Company Name</label>
              <input className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., Amazon, Daraz, Local Store" value={form.vendorName || ''} onChange={(e) => setForm({ ...form, vendorName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author Identity URL</label>
              <input className="w-full px-3 py-2 border rounded-lg" placeholder="https://... (image/page)" value={form.authorIdentityUrl || ''} onChange={(e) => setForm({ ...form, authorIdentityUrl: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate URL</label>
              <input className="w-full px-3 py-2 border rounded-lg" value={form.affiliateUrl} onChange={(e) => setForm({ ...form, affiliateUrl: e.target.value })} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
              <input
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://example.com/product.jpg"
                value={form.imageUrl || ''}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Provide either an Image URL or upload a file below. If both are provided, file upload will be used.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0])} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Active</label>
              <select className="w-full px-3 py-2 border rounded-lg" value={form.isActive ? '1' : '0'} onChange={(e) => setForm({ ...form, isActive: e.target.value === '1' })}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
            )}
          </div>
        </form>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Products</h2>
          {loading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : products.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No products</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="flex gap-4 p-4 border rounded-lg">
                  <img src={p.imageUrl} alt={p.title} className="w-28 h-28 object-cover rounded" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{p.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold">
                        {p.currency === 'BDT' ? '৳' : '$'}{p.price.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(p)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Edit</button>
                        <button onClick={() => handleDelete(p)} disabled={deletingId === p.id} className={`px-3 py-1 text-sm text-white rounded ${deletingId === p.id ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>{deletingId === p.id ? 'Deleting...' : 'Delete'}</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStore;
