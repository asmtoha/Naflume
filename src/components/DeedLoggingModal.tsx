import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { trackDeedLogged } from '../utils/analytics';

interface DeedLoggingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeedAdded: () => void;
}

const DeedLoggingModal: React.FC<DeedLoggingModalProps> = ({ isOpen, onClose, onDeedAdded }) => {
  const { currentUser } = useAuth();
  const [deedType, setDeedType] = useState<'good' | 'bad'>('good');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !currentUser) return;

    setIsSubmitting(true);
    
    try {
      console.log('Adding new deed:', { userId: currentUser.uid, deedType, description: description.trim() });
      
      const docRef = await addDoc(collection(db, 'deeds'), {
        userId: currentUser.uid,
        deedType,
        description: description.trim(),
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });

      console.log('Deed added successfully with ID:', docRef.id);

      // Track the deed logging event
      trackDeedLogged(deedType, description.trim());

      setDescription('');
      setDeedType('good');
      onDeedAdded();
      onClose();
    } catch (error) {
      console.error('Error adding deed:', error);
      alert('Failed to log deed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Log New Deed</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Deed Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Deed Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeedType('good')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    deedType === 'good'
                      ? 'border-success-500 bg-success-50 text-success-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-success-300 hover:bg-success-25'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      deedType === 'good' ? 'bg-success-500' : 'bg-gray-200'
                    }`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">Good Deed</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setDeedType('bad')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    deedType === 'bad'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:bg-red-25'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      deedType === 'bad' ? 'bg-red-500' : 'bg-gray-200'
                    }`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="font-medium">Bad Deed</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you did..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Logging...' : 'Log Deed'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeedLoggingModal;
