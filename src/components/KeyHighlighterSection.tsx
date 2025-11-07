import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import HighlighterCard, { HighlighterItem } from './HighlighterCard';
import HighlighterModal, { HighlighterDraft } from './HighlighterModal';
import { trackKeyHighlighterCreated, trackKeyHighlighterCompleted, trackFeatureUsed } from '../utils/analytics';

interface KeyHighlighterSectionProps {
  mobileMenuOpen?: boolean;
}

const KeyHighlighterSection: React.FC<KeyHighlighterSectionProps> = ({ mobileMenuOpen = false }) => {
  const { currentUser } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed
  const [highlighters, setHighlighters] = useState<HighlighterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HighlighterItem | null>(null);

  // Fetch highlighters from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'keyHighlighters'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const highlightersData: HighlighterItem[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as HighlighterItem));
      setHighlighters(highlightersData);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching highlighters:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Auto-collapse on scroll
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Clear any existing timeout
      clearTimeout(scrollTimeout);
      
      // Set a timeout to collapse after scroll stops
      scrollTimeout = setTimeout(() => {
        if (!isCollapsed) {
          setIsCollapsed(true);
        }
      }, 100); // Small delay to avoid flickering
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isCollapsed]);

  const handleAddHighlighter = async (draft: HighlighterDraft) => {
    if (!currentUser) return;

    try {
      const now = new Date();
      const endDate = new Date(now);
      
      // Calculate end date based on duration
      switch (draft.durationUnit) {
        case 'days':
          endDate.setDate(now.getDate() + draft.durationNumber);
          break;
        case 'weeks':
          endDate.setDate(now.getDate() + (draft.durationNumber * 7));
          break;
        case 'months':
          endDate.setMonth(now.getMonth() + draft.durationNumber);
          break;
        case 'years':
          endDate.setFullYear(now.getFullYear() + draft.durationNumber);
          break;
      }

      await addDoc(collection(db, 'keyHighlighters'), {
        userId: currentUser.uid,
        title: draft.title,
        durationNumber: draft.durationNumber,
        durationUnit: draft.durationUnit,
        startDate: now,
        endDate: endDate,
        createdAt: now
      });

      // Track key highlighter creation
      trackKeyHighlighterCreated(draft.title, `${draft.durationNumber} ${draft.durationUnit}`);
    } catch (error) {
      console.error('Error adding highlighter:', error);
    }
  };

  const handleEditHighlighter = async (draft: HighlighterDraft) => {
    if (!editingItem) return;

    try {
      const now = new Date();
      const endDate = new Date(now);
      
      // Calculate end date based on duration
      switch (draft.durationUnit) {
        case 'days':
          endDate.setDate(now.getDate() + draft.durationNumber);
          break;
        case 'weeks':
          endDate.setDate(now.getDate() + (draft.durationNumber * 7));
          break;
        case 'months':
          endDate.setMonth(now.getMonth() + draft.durationNumber);
          break;
        case 'years':
          endDate.setFullYear(now.getFullYear() + draft.durationNumber);
          break;
      }

      await updateDoc(doc(db, 'keyHighlighters', editingItem.id), {
        title: draft.title,
        durationNumber: draft.durationNumber,
        durationUnit: draft.durationUnit,
        endDate: endDate
      });
    } catch (error) {
      console.error('Error updating highlighter:', error);
    }
  };

  const handleDeleteHighlighter = async (item: HighlighterItem) => {
    if (window.confirm('Are you sure you want to delete this highlighter?')) {
      try {
        await deleteDoc(doc(db, 'keyHighlighters', item.id));
      } catch (error) {
        console.error('Error deleting highlighter:', error);
      }
    }
  };

  const handleEdit = (item: HighlighterItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleModalSubmit = (draft: HighlighterDraft) => {
    if (editingItem) {
      handleEditHighlighter(draft);
    } else {
      handleAddHighlighter(draft);
    }
    handleModalClose();
  };

  return (
    <>
      {/* Key Highlighter Section */}
      <div className={`bg-white border-b border-gray-200 sticky z-40 transition-all duration-500 ease-in-out ${
        mobileMenuOpen ? 'top-[200px] sm:top-16' : 'top-16'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Toggle Header */}
          <div 
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              trackFeatureUsed('key_highlighter_section', isCollapsed ? 'expanded' : 'collapsed');
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                <svg className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] drop-shadow-[0_0_20px_rgba(168,85,247,0.3)] drop-shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                  Key Highlighters
                </h3>
                <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] drop-shadow-[0_0_16px_rgba(168,85,247,0.2)]">
                  {isLoading ? 'Loading...' : `${highlighters.length} active highlighters`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isCollapsed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  + Add Highlighter
                </button>
              )}
              
              <div className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Collapsible Content */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
          }`}>
            <div className="pb-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-500">Loading highlighters...</span>
                </div>
              ) : highlighters.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No highlighters yet</h4>
                  <p className="text-gray-500 mb-4">Create your first key highlighter to track important goals</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Create Your First Highlighter
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] drop-shadow-[0_0_16px_rgba(168,85,247,0.2)]">
                      Your Active Highlighters
                    </h4>
                    <span className="text-sm text-gray-500">{highlighters.length} total</span>
                  </div>
                  
                  {/* Horizontal scrolling container for highlighters */}
                  <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {highlighters.map((highlighter) => (
                      <HighlighterCard
                        key={highlighter.id}
                        item={highlighter}
                        onEdit={handleEdit}
                        onDelete={handleDeleteHighlighter}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Highlighter Modal */}
      <HighlighterModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={editingItem ? {
          id: editingItem.id,
          title: editingItem.title,
          durationNumber: editingItem.durationNumber,
          durationUnit: editingItem.durationUnit
        } : null}
      />
    </>
  );
};

export default KeyHighlighterSection;