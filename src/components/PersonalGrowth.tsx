import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { 
  getStartOfDay, 
  getStartOfWeek, 
  getStartOfMonth, 
  getPeriodLabel 
} from '../utils/dateUtils';

interface Goal {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetType: 'good' | 'bad' | 'both';
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  createdAt: Timestamp;
  lastCompleted?: Timestamp;
  completionHistory?: Timestamp[]; // Array of completion timestamps
  userId: string;
  isDeleted?: boolean;
  deletedAt?: Timestamp;
}

interface Deed {
  id: string;
  deedType: 'good' | 'bad';
  timestamp: Timestamp;
  userId: string;
}

const PersonalGrowth: React.FC = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [optimisticDeletedIds, setOptimisticDeletedIds] = useState<Set<string>>(new Set());
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    frequency: 'daily' as const,
    targetType: 'good' as const,
    targetCount: 1
  });
  const [completedFilter, setCompletedFilter] = useState<'today' | 'week' | 'month' | 'year' | 'alltime'>('today');

  // Manual refresh function
  const refreshGoals = () => {
    console.log('Manual refresh triggered, current refresh key:', refreshKey);
    setRefreshKey(prev => {
      const newKey = prev + 1;
      console.log('New refresh key:', newKey);
      return newKey;
    });
  };

  // Force refresh by directly fetching goals
  const forceRefreshGoals = async () => {
    if (!currentUser) return;
    
    try {
      console.log('Force refreshing goals...');
      const goalsQuery = query(
        collection(db, 'goals'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(goalsQuery);
      const goalsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Goal[];
      
      const activeGoals = goalsData.filter(goal => goal.isDeleted !== true);
      console.log('Force refresh - Active goals:', activeGoals);
      setGoals(activeGoals);
    } catch (error) {
      console.error('Error force refreshing goals:', error);
    }
  };

  // Fetch goals from Firestore
  useEffect(() => {
    if (!currentUser) return;

    console.log('Setting up goals listener, refresh key:', refreshKey);
    const goalsQuery = query(
      collection(db, 'goals'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeGoals = onSnapshot(goalsQuery, (querySnapshot) => {
      console.log('Goals listener triggered, snapshot size:', querySnapshot.size);
      
      const goalsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Goal[];
      console.log('Raw goals data:', goalsData);
      // Filter out soft-deleted goals in JavaScript
      const activeGoals = goalsData.filter(goal => goal.isDeleted !== true);
      // Deduplicate by id to avoid duplicate keys in React
      const uniqueGoalsMap = new Map<string, Goal>();
      for (const g of activeGoals) {
        uniqueGoalsMap.set(g.id, g);
      }
      const uniqueGoals = Array.from(uniqueGoalsMap.values());
      console.log('Active goals after filtering & dedupe:', uniqueGoals);
      setGoals(uniqueGoals);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching goals:', error);
      setHasError(true);
      setIsLoading(false);
    });

    return () => unsubscribeGoals();
  }, [currentUser, refreshKey]);

  // Fetch deeds for goal checking
  useEffect(() => {
    if (!currentUser) return;

    const deedsQuery = query(
      collection(db, 'deeds'),
      where('userId', '==', currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribeDeeds = onSnapshot(deedsQuery, (querySnapshot) => {
      const deedsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Deed[];
      // Store all deeds (both good and bad) since we need them for different goal types
      setDeeds(deedsData);
    }, (error) => {
      console.error('Error fetching deeds:', error);
      // Don't set hasError for deeds as goals can still work without them
    });

    return () => unsubscribeDeeds();
  }, [currentUser]);

  // Smart goal checking logic
  useEffect(() => {
    if (goals.length === 0 || deeds.length === 0) return;

    const checkAndUpdateGoals = async () => {
      const now = new Date();
      const updatedGoals = [...goals];
      let hasChanges = false;

      for (let i = 0; i < updatedGoals.length; i++) {
        const goal = updatedGoals[i];
        let startDate: Date;
        let endDate: Date;

        switch (goal.frequency) {
          case 'daily':
            startDate = getStartOfDay(now);
            endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
            break;
          case 'weekly':
            startDate = getStartOfWeek(now);
            endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case 'monthly':
            startDate = getStartOfMonth(now);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
            break;
          default:
            continue;
        }

        // Check if goal is already completed for this period
        let periodDeeds: Deed[];
        
        if (goal.targetType === 'good') {
          periodDeeds = deeds.filter(deed => {
            if (!deed.timestamp) return false;
            const deedDate = deed.timestamp.toDate();
            return deedDate >= startDate && deedDate < endDate && deed.deedType === 'good';
          });
        } else if (goal.targetType === 'bad') {
          periodDeeds = deeds.filter(deed => {
            if (!deed.timestamp) return false;
            const deedDate = deed.timestamp.toDate();
            return deedDate >= startDate && deedDate < endDate && deed.deedType === 'bad';
          });
        } else {
          // 'both' type - count all deeds
          periodDeeds = deeds.filter(deed => {
            if (!deed.timestamp) return false;
            const deedDate = deed.timestamp.toDate();
            return deedDate >= startDate && deedDate < endDate;
          });
        }

        const isCompleted = periodDeeds.length >= goal.targetCount;
        const currentCount = Math.min(periodDeeds.length, goal.targetCount);

        // Update goal if completion status changed
        if (goal.isCompleted !== isCompleted || goal.currentCount !== currentCount) {
          hasChanges = true;
          
          // Create completion history array if it doesn't exist
          const completionHistory = goal.completionHistory || [];
          
          // If goal just became completed, add to completion history
          if (isCompleted && !goal.isCompleted) {
            completionHistory.push(Timestamp.now());
          }
          
          updatedGoals[i] = {
            ...goal,
            isCompleted,
            currentCount,
            lastCompleted: isCompleted ? Timestamp.now() : goal.lastCompleted,
            completionHistory
          };

          // Update in Firestore
          try {
            const updatePayload: any = {
              isCompleted,
              currentCount,
              completionHistory
            };
            if (isCompleted) {
              updatePayload.lastCompleted = Timestamp.now();
            }
            await updateDoc(doc(db, 'goals', goal.id), updatePayload);
          } catch (error) {
            console.error('Error updating goal:', error);
          }
        }
      }

      if (hasChanges) {
        setGoals(updatedGoals);
      }
    };

    checkAndUpdateGoals();
  }, [goals, deeds]);

  const handleAddGoal = async () => {
    // Title and description are now optional - no validation needed

    try {
      const goalData = {
        ...newGoal,
        userId: currentUser!.uid,
        currentCount: 0,
        isCompleted: false,
        isDeleted: false,
        createdAt: Timestamp.now()
      };

      console.log('Creating goal with data:', goalData);
      const docRef = await addDoc(collection(db, 'goals'), goalData);
      console.log('Goal created with ID:', docRef.id);
      
      // Create the new goal object with the generated ID
      const newGoalWithId = {
        ...goalData,
        id: docRef.id
      };
      
      // Update local state immediately for instant UI update, guard against duplicates
      setGoals(prevGoals => {
        if (prevGoals.some(g => g.id === newGoalWithId.id)) return prevGoals;
        return [newGoalWithId, ...prevGoals];
      });
      
      // Reset form and close modal
      setNewGoal({
        title: '',
        description: '',
        frequency: 'daily',
        targetType: 'good',
        targetCount: 1
      });
      setShowAddGoal(false);
      
      // Force refresh as backup to ensure consistency
      setTimeout(() => forceRefreshGoals(), 500);
    } catch (error) {
      console.error('Error adding goal:', error);
      alert('Failed to create goal. Please try again.');
    }
  };

  const handleEditGoal = async () => {
    if (!editingGoal) return;
    // Title and description are now optional - no validation needed

    // Store original goal for potential rollback
    const originalGoal = goals.find(goal => goal.id === editingGoal.id);
    
    try {
      // Update local state immediately for instant UI update
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal.id === editingGoal.id 
            ? { ...goal, ...editingGoal }
            : goal
        )
      );
      
      // Close modal immediately
      setShowEditGoal(false);
      setEditingGoal(null);
      
      // Perform Firestore update
      await updateDoc(doc(db, 'goals', editingGoal.id), {
        title: editingGoal.title,
        description: editingGoal.description,
        frequency: editingGoal.frequency,
        targetType: editingGoal.targetType,
        targetCount: editingGoal.targetCount
      });
      
      console.log('Goal updated successfully:', editingGoal.id);
      
      // Force refresh as backup to ensure consistency
      setTimeout(() => forceRefreshGoals(), 500);
    } catch (error) {
      console.error('Error updating goal:', error);
      
      // Rollback local state changes on error
      if (originalGoal) {
        setGoals(prevGoals => 
          prevGoals.map(goal => 
            goal.id === editingGoal.id 
              ? originalGoal
              : goal
          )
        );
      }
      
      // Reopen modal to show error
      setShowEditGoal(true);
      setEditingGoal(editingGoal);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    // Store original goal for potential rollback
    const originalGoal = goals.find(goal => goal.id === goalId);
    console.log('Deleting goal:', goalId, 'Original goal:', originalGoal);
    
    // Add to optimistic deleted set
    setOptimisticDeletedIds(prev => {
      const next = new Set(prev);
      next.add(goalId);
      return next;
    });
    
    try {
      // Update local state immediately for instant UI update
      setGoals(prevGoals => {
        const filtered = prevGoals.filter(goal => goal.id !== goalId);
        console.log('Local state updated, remaining goals:', filtered.length);
        return filtered;
      });
      
      // Perform Firestore hard delete
      await deleteDoc(doc(db, 'goals', goalId));
      
      console.log('Goal hard-deleted from Firestore:', goalId);
      
      // Clear optimistic deleted set after successful operation
      setOptimisticDeletedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(goalId);
        return newSet;
      });
      
      // Force refresh as backup to ensure consistency
      setTimeout(() => {
        console.log('Running force refresh after delete');
        forceRefreshGoals();
      }, 500);
    } catch (error) {
      console.error('Error deleting goal:', error);
        
        // Clear optimistic deleted set on error
        setOptimisticDeletedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(goalId);
          return newSet;
        });
        
        // Rollback local state changes on error
        if (originalGoal) {
          setGoals(prevGoals => {
            // Replace or add back only if missing
            const exists = prevGoals.some(g => g.id === originalGoal.id);
            const restored = exists
              ? prevGoals.map(g => (g.id === originalGoal.id ? originalGoal : g))
              : [...prevGoals, originalGoal];
            console.log('Rolled back delete, goals count:', restored.length);
            return restored;
          });
        }
        
        alert('Failed to delete goal. Please try again.');
      }
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal({ ...goal });
    setShowEditGoal(true);
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return frequency;
    }
  };

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case 'good': return 'Good Deeds';
      case 'bad': return 'Bad Deeds';
      case 'both': return 'All Deeds';
      default: return targetType;
    }
  };

  const getTargetTypeColor = (targetType: string) => {
    switch (targetType) {
      case 'good': return 'bg-green-100 text-green-700 border-green-200';
      case 'bad': return 'bg-red-100 text-red-700 border-red-200';
      case 'both': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentCount / goal.targetCount) * 100, 100);
  };

  const getStatusColor = (goal: Goal) => {
    if (goal.isCompleted) return 'bg-success-100 text-success-700 border-success-200';
    if (goal.currentCount > 0) return 'bg-warning-100 text-warning-700 border-warning-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusText = (goal: Goal) => {
    if (goal.isCompleted) return 'Completed';
    if (goal.currentCount > 0) return 'In Progress';
    return 'Not Started';
  };

  // Helpers to filter completed goals by timeframe
  const isWithinRange = (date: Date, start?: Date, end?: Date) => {
    if (start && end) return date >= start && date <= end;
    if (start) return date >= start;
    return true;
  };

  const getTimeframeRange = (timeframe: 'today' | 'week' | 'month' | 'year' | 'alltime') => {
    const now = new Date();
    switch (timeframe) {
      case 'today': {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        return { start, end };
      }
      case 'week': {
        const start = getStartOfWeek(now);
        const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
        return { start, end };
      }
      case 'month': {
        const start = getStartOfMonth(now);
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        end.setMilliseconds(end.getMilliseconds() - 1);
        return { start, end };
      }
      case 'year': {
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        return { start, end };
      }
      case 'alltime':
      default:
        return { start: undefined, end: undefined };
    }
  };

  const getCompletedGoalsByTimeframe = () => {
    const { start, end } = getTimeframeRange(completedFilter);
    return goals.filter(g => {
      if (!g.isCompleted) return false;
      
      // If we have completion history, check if any completion falls within the timeframe
      if (g.completionHistory && g.completionHistory.length > 0) {
        return g.completionHistory.some(completionTimestamp => {
          const completedDate = completionTimestamp.toDate ? completionTimestamp.toDate() : new Date(completionTimestamp as any);
          return isWithinRange(completedDate, start, end);
        });
      }
      
      // Fallback to lastCompleted for backward compatibility
      const completedDate = g.lastCompleted?.toDate ? g.lastCompleted.toDate() : (g.lastCompleted ? new Date(g.lastCompleted as any) : null);
      if (!completedDate) return completedFilter === 'alltime';
      return isWithinRange(completedDate, start, end);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="ml-4 text-gray-600">Loading your goals...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">Personal Growth Journey</h2>
          <p className="text-gray-600">Set goals and track your spiritual development with smart automation</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Goals</h3>
          <p className="text-red-600 mb-4">
            There was an error loading your goals. This might be due to Firebase permissions or network issues.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
            <div className="text-sm text-red-500">
              <p>If the problem persists, please check:</p>
              <ul className="mt-2 space-y-1">
                <li>• You are properly logged in</li>
                <li>• Firebase security rules are updated</li>
                <li>• Required indexes are created</li>
                <li>• Browser console for detailed errors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h2 className="text-3xl font-bold text-black">Personal Growth Journey</h2>
          <button
            onClick={forceRefreshGoals}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            title="Refresh Goals"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600">Set goals and track your spiritual development with smart automation</p>
      </div>

      {/* Goal Statistics */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Completed Goals</h3>
              <p className="text-3xl font-bold text-success-600">
                {goals.filter(g => g.isCompleted).length}
              </p>
              <p className="text-sm text-gray-500">This period</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-warning-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Active Goals</h3>
              <p className="text-3xl font-bold text-warning-600">
                {goals.filter(g => !g.isCompleted && g.currentCount > 0).length}
              </p>
              <p className="text-sm text-gray-500">In progress</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Total Goals</h3>
              <p className="text-3xl font-bold text-primary-600">
                {goals.length}
              </p>
              <p className="text-sm text-gray-500">All time</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddGoal(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${optimisticDeletedIds.has(goal.id) ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black mb-2">
                  {goal.title || 'Untitled Goal'}
                </h3>
                {goal.description && (
                  <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                )}
                
                                 {/* Frequency and Target Type Badges */}
                 <div className="flex flex-wrap gap-2 mb-3">
                   <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                     {getFrequencyLabel(goal.frequency)}
                   </span>
                   <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getTargetTypeColor(goal.targetType)}`}>
                     {getTargetTypeLabel(goal.targetType)}
                   </span>
                 </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{goal.currentCount}/{goal.targetCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        goal.isCompleted 
                          ? 'bg-success-500' 
                          : goal.currentCount > 0 
                            ? 'bg-warning-500' 
                            : 'bg-gray-300'
                      }`}
                      style={{ width: `${getProgressPercentage(goal)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
                             {/* Status Badge and Action Buttons */}
               <div className="flex flex-col items-end space-y-2">
                 <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(goal)}`}>
                   {getStatusText(goal)}
                 </span>
                 <div className="flex space-x-2">
                   <button
                     onClick={() => openEditModal(goal)}
                     className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                     title="Edit Goal"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                     </svg>
                   </button>
                   <button
                     onClick={() => handleDeleteGoal(goal.id)}
                     className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                     title="Delete Goal"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                   </button>
                 </div>
               </div>
            </div>

            {/* Smart Completion Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                                     <span>
                     {goal.isCompleted 
                       ? `✅ Automatically completed! ${goal.currentCount} ${goal.targetType === 'good' ? 'good' : goal.targetType === 'bad' ? 'bad' : ''} deeds logged.`
                       : `📊 ${goal.currentCount} of ${goal.targetCount} ${goal.targetType === 'good' ? 'good' : goal.targetType === 'bad' ? 'bad' : ''} deeds needed.`
                     }
                   </span>
                </div>
                <div className="text-xs text-gray-500">
                  Current period: {getPeriodLabel(goal.frequency, new Date())}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">No goals set yet</h4>
          <p className="text-gray-500">Start your growth journey by setting your first goal!</p>
        </div>
      )}

      {/* Goal Achievements */}
      {goals.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
          <h3 className="text-lg font-semibold text-black mb-4">🏆 Goal Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Perfect Week</h4>
                  <p className="text-sm text-gray-600">
                    {goals.filter(g => g.frequency === 'weekly' && g.isCompleted).length} weekly goals completed
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Daily Master</h4>
                  <p className="text-sm text-gray-600">
                    {goals.filter(g => g.frequency === 'daily' && g.isCompleted).length} daily goals completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Goals with Time Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold text-black">Completed Goals</h3>
          <div className="bg-gray-100 rounded-lg p-1 flex flex-wrap gap-1">
            {(['today','week','month','year','alltime'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setCompletedFilter(tf)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  completedFilter === tf ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tf === 'today' ? 'Today' : tf === 'week' ? 'This Week' : tf === 'month' ? 'This Month' : tf === 'year' ? 'This Year' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {getCompletedGoalsByTimeframe().length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600">No completed goals in this period.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCompletedGoalsByTimeframe().map(goal => (
              <div key={goal.id} className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-black">{goal.title || 'Untitled Goal'}</h4>
                  <span className="px-3 py-1 text-xs font-medium rounded-full border bg-success-100 text-success-700 border-success-200">Completed</span>
                </div>
                {goal.description && (
                  <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  <span className="px-2 py-1 rounded-full bg-primary-50 text-primary-700">{getFrequencyLabel(goal.frequency)}</span>
                  <span className={`px-2 py-1 rounded-full border ${getTargetTypeColor(goal.targetType)}`}>{getTargetTypeLabel(goal.targetType)}</span>
                  {goal.lastCompleted && (
                    <span className="px-2 py-1 rounded-full bg-gray-100">
                      Completed on {goal.lastCompleted.toDate ? goal.lastCompleted.toDate().toLocaleDateString() : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

             {/* Add Goal Modal */}
       {showAddGoal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col">
             <div className="p-8 pb-4">
               <h3 className="text-xl font-semibold text-black mb-6">Set New Goal</h3>
             </div>
             
             <div className="flex-1 overflow-y-auto px-8 pb-4">
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Goal Title <span className="text-gray-400 text-xs">(Optional)</span>
                   </label>
                   <input
                     type="text"
                     value={newGoal.title}
                     onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                     placeholder="e.g., Perform one good deed daily"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Description <span className="text-gray-400 text-xs">(Optional)</span>
                   </label>
                   <textarea
                     value={newGoal.description}
                     onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                     rows={3}
                     placeholder="Describe your goal in detail..."
                   />
                 </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                 <select
                   value={newGoal.frequency}
                   onChange={(e) => setNewGoal({ ...newGoal, frequency: e.target.value as any })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                 >
                   <option value="daily">Daily</option>
                   <option value="weekly">Weekly</option>
                   <option value="monthly">Monthly</option>
                 </select>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Target Type</label>
                 <select
                   value={newGoal.targetType}
                   onChange={(e) => setNewGoal({ ...newGoal, targetType: e.target.value as any })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                 >
                   <option value="good">Good Deeds</option>
                   <option value="bad">Bad Deeds</option>
                   <option value="both">All Deeds</option>
                 </select>
               </div>
               
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Target Count</label>
                   <input
                     type="number"
                     min="1"
                     value={newGoal.targetCount}
                     onChange={(e) => setNewGoal({ ...newGoal, targetCount: parseInt(e.target.value) || 1 })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                   />
                 </div>
               </div>
             </div>
             
             <div className="p-8 pt-4 border-t border-gray-100">
               <div className="flex space-x-3">
                 <button
                   onClick={() => setShowAddGoal(false)}
                   className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleAddGoal}
                   className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                 >
                   Create Goal
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit Goal Modal */}
       {showEditGoal && editingGoal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col">
             <div className="p-8 pb-4">
               <h3 className="text-xl font-semibold text-black mb-6">Edit Goal</h3>
             </div>
             
             <div className="flex-1 overflow-y-auto px-8 pb-4">
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Goal Title <span className="text-gray-400 text-xs">(Optional)</span>
                   </label>
                   <input
                     type="text"
                     value={editingGoal.title}
                     onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                     placeholder="e.g., Perform one good deed daily"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Description <span className="text-gray-400 text-xs">(Optional)</span>
                   </label>
                   <textarea
                     value={editingGoal.description}
                     onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                     rows={3}
                     placeholder="Describe your goal in detail..."
                   />
                 </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                 <select
                   value={editingGoal.frequency}
                   onChange={(e) => setEditingGoal({ ...editingGoal, frequency: e.target.value as any })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                 >
                   <option value="daily">Daily</option>
                   <option value="weekly">Weekly</option>
                   <option value="monthly">Monthly</option>
                 </select>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Target Type</label>
                 <select
                   value={editingGoal.targetType}
                   onChange={(e) => setEditingGoal({ ...editingGoal, targetType: e.target.value as any })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                 >
                   <option value="good">Good Deeds</option>
                   <option value="bad">Bad Deeds</option>
                   <option value="both">All Deeds</option>
                 </select>
               </div>
               
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Target Count</label>
                   <input
                     type="number"
                     min="1"
                     value={editingGoal.targetCount}
                     onChange={(e) => setEditingGoal({ ...editingGoal, targetCount: parseInt(e.target.value) || 1 })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                   />
                 </div>
               </div>
             </div>
             
             <div className="p-8 pt-4 border-t border-gray-100">
               <div className="flex space-x-3">
                 <button
                   onClick={() => {
                     setShowEditGoal(false);
                     setEditingGoal(null);
                   }}
                   className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleEditGoal}
                   className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                 >
                   Update Goal
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

      {/* Smart Features Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-black mb-4">🤖 Smart Goal Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700">Goals automatically check your logged deeds</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700">Real-time progress updates based on your actions</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700">Supports daily, weekly, and monthly goal cycles</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700">Track good deeds, bad deeds, or both types</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalGrowth;
