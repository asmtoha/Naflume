import React, { useState } from 'react';
import { db } from '../firebase/config';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Deed {
  id: string;
  deedType: 'good' | 'bad';
  description: string;
  timestamp: any;
  createdAt: string;
}

interface DeedItemProps {
  deed: Deed;
  onDeedUpdated: () => void;
}

const DeedItem: React.FC<DeedItemProps> = ({ deed, onDeedUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(deed.description);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTimestamp = (timestamp: any) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    if (deed.createdAt) {
      return new Date(deed.createdAt).toLocaleString();
    }
    return 'Unknown time';
  };

  const handleEdit = async () => {
    if (!editDescription.trim() || editDescription === deed.description) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await updateDoc(doc(db, 'deeds', deed.id), {
        description: editDescription.trim(),
        updatedAt: new Date().toISOString()
      });
      
      onDeedUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating deed:', error);
      alert('Failed to update deed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this deed?')) return;

    setIsSubmitting(true);
    
    try {
      await deleteDoc(doc(db, 'deeds', deed.id));
      onDeedUpdated();
    } catch (error) {
      console.error('Error deleting deed:', error);
      alert('Failed to delete deed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDeedIcon = () => {
    if (deed.deedType === 'good') {
      return (
        <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    }
  };

  const getDeedTypeLabel = () => {
    return deed.deedType === 'good' ? 'Good Deed' : 'Bad Deed';
  };

  const getDeedTypeColor = () => {
    return deed.deedType === 'good' 
      ? 'from-success-50 to-green-50 border-success-200' 
      : 'from-red-50 to-pink-50 border-red-200';
  };

  if (isEditing) {
    return (
      <div className={`p-6 bg-gradient-to-r ${getDeedTypeColor()} rounded-xl border`}>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {getDeedIcon()}
            <div className="flex-1">
              <h4 className="font-semibold text-black">{getDeedTypeLabel()}</h4>
              <p className="text-sm text-gray-500">{formatTimestamp(deed.timestamp)}</p>
            </div>
          </div>
          
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
          />
          
          <div className="flex space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              disabled={isSubmitting || !editDescription.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-gradient-to-r ${getDeedTypeColor()} rounded-xl border hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center space-x-4">
        {getDeedIcon()}
        
        <div className="flex-1">
          <h4 className="font-semibold text-black">{getDeedTypeLabel()}</h4>
          <p className="text-gray-700 mt-1">{deed.description}</p>
          <p className="text-sm text-gray-500 mt-2">{formatTimestamp(deed.timestamp)}</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit deed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete deed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeedItem;
