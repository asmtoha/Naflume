import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  affiliateUrl: string;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
  isActive: boolean;
  // New blog-style fields
  slug: string; // unique slug for detail route
  authorName?: string;
  authorIdentityUrl?: string; // link to identity proof/card image
  content?: string; // long blog-style content (markdown or HTML string)
  currency?: 'BDT' | 'USD';
  discountPercent?: number; // 0-100
  couponCode?: string;
  highlights?: string[]; // highlighted quotes/reviews
  vendorName?: string; // vendor or company name
}

export interface NewProductInput {
  title: string;
  description: string;
  price: number;
  imageFile?: File;
  imageUrl?: string;
  affiliateUrl: string;
  isActive?: boolean;
  // New fields for blog-style details
  slug: string;
  authorName?: string;
  authorIdentityUrl?: string;
  content?: string;
  currency?: 'BDT' | 'USD';
  discountPercent?: number;
  couponCode?: string;
  highlights?: string[];
  vendorName?: string;
}

const COLLECTION = 'products';

export const affiliateStoreService = {
  subscribeToProducts(callback: (products: Product[]) => void) {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items: Product[] = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      callback(items);
    });
  },

  async listProducts(): Promise<Product[]> {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  },

  async addProduct(input: NewProductInput): Promise<string> {
    const now = Date.now();
    let imageUrl = '';

    if (input.imageFile) {
      const imageRef = ref(storage, `store/${now}-${input.imageFile.name}`);
      await uploadBytes(imageRef, input.imageFile, { contentType: input.imageFile.type || 'application/octet-stream' });
      imageUrl = await getDownloadURL(imageRef);
    } else if (input.imageUrl) {
      imageUrl = input.imageUrl;
    }

    const docRef = await addDoc(collection(db, COLLECTION), {
      title: input.title,
      description: input.description,
      price: input.price,
      imageUrl,
      affiliateUrl: input.affiliateUrl,
      isActive: input.isActive ?? true,
      slug: input.slug,
      authorName: input.authorName || '',
      authorIdentityUrl: input.authorIdentityUrl || '',
      content: input.content || '',
      currency: input.currency || 'BDT',
      discountPercent: input.discountPercent ?? 0,
      couponCode: input.couponCode || '',
      highlights: input.highlights || [],
      vendorName: input.vendorName || '',
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  async updateProduct(id: string, update: Partial<NewProductInput> & { imageFile?: File; imageUrl?: string }): Promise<void> {
    const payload: any = { updatedAt: Date.now() };
    if (update.title !== undefined) payload.title = update.title;
    if (update.description !== undefined) payload.description = update.description;
    if (update.price !== undefined) payload.price = update.price;
    if (update.affiliateUrl !== undefined) payload.affiliateUrl = update.affiliateUrl;
    if (update.isActive !== undefined) payload.isActive = update.isActive;
    if (update.slug !== undefined) payload.slug = update.slug;
    if (update.authorName !== undefined) payload.authorName = update.authorName;
    if (update.authorIdentityUrl !== undefined) payload.authorIdentityUrl = update.authorIdentityUrl;
    if (update.content !== undefined) payload.content = update.content;
    if (update.currency !== undefined) payload.currency = update.currency;
    if (update.discountPercent !== undefined) payload.discountPercent = update.discountPercent;
    if (update.couponCode !== undefined) payload.couponCode = update.couponCode;
    if (update.highlights !== undefined) payload.highlights = update.highlights;
    if (update.vendorName !== undefined) payload.vendorName = update.vendorName;

    if (update.imageFile) {
      const imageRef = ref(storage, `store/${Date.now()}-${update.imageFile.name}`);
      await uploadBytes(imageRef, update.imageFile, { contentType: update.imageFile.type || 'application/octet-stream' });
      payload.imageUrl = await getDownloadURL(imageRef);
    } else if (update.imageUrl !== undefined) {
      payload.imageUrl = update.imageUrl;
    }

    await updateDoc(doc(db, COLLECTION, id), payload);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    // Firestore needs a where filter; but to keep dependencies minimal here, we'll
    // do a client-side filter on the initial list. For scale, add a composite index with where('slug','==',slug).
    const snap = await getDocs(q);
    const match = snap.docs
      .map((d) => ({ ...(d.data() as any), id: d.id } as Product))
      .find((p: any) => p.slug === slug);
    return match || null;
  },

  async deleteProduct(id: string, existingImageUrl?: string): Promise<void> {
    console.log('Service: Deleting product with ID:', id);
    
    // Delete the product document first
    await deleteDoc(doc(db, COLLECTION, id));
    console.log('Service: Product document deleted successfully');
    
    // Try to delete the image if it exists (non-critical operation)
    if (existingImageUrl) {
      try {
        console.log('Service: Attempting to delete image:', existingImageUrl);
        
        // Check if it's a Firebase Storage URL
        if (existingImageUrl.includes('firebasestorage.googleapis.com')) {
          const url = new URL(existingImageUrl);
          const pathStart = url.pathname.indexOf('/o/') + 3;
          const encodedPath = url.pathname.substring(pathStart);
          const objectPath = decodeURIComponent(encodedPath);
          
          console.log('Service: Extracted storage path:', objectPath);
          await deleteObject(ref(storage, objectPath));
          console.log('Service: Image deleted successfully');
        } else {
          console.log('Service: Image is not from Firebase Storage, skipping deletion');
        }
      } catch (err) {
        console.log('Service: Image deletion failed (non-critical):', err);
        // Don't throw the error - product is already deleted
      }
    }
  },
};
