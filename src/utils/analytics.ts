import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/config';

// Analytics utility functions for Naflume

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, parameters);
  }
};

// Spiritual Growth Events
export const trackDeedLogged = (deedType: 'good' | 'bad', description?: string) => {
  trackEvent('deed_logged', {
    deed_type: deedType,
    description: description || '',
    timestamp: new Date().toISOString()
  });
};

export const trackGoalCompleted = (goalType: string, goalTitle: string) => {
  trackEvent('goal_completed', {
    goal_type: goalType,
    goal_title: goalTitle,
    timestamp: new Date().toISOString()
  });
};

export const trackGoalCreated = (goalType: string, frequency: string) => {
  trackEvent('goal_created', {
    goal_type: goalType,
    frequency: frequency,
    timestamp: new Date().toISOString()
  });
};

export const trackKeyHighlighterCreated = (title: string, duration: string) => {
  trackEvent('key_highlighter_created', {
    title: title,
    duration: duration,
    timestamp: new Date().toISOString()
  });
};

export const trackKeyHighlighterCompleted = (title: string, progressPercent: number) => {
  trackEvent('key_highlighter_completed', {
    title: title,
    progress_percent: progressPercent,
    timestamp: new Date().toISOString()
  });
};

// User Engagement Events
export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_name: pageName,
    timestamp: new Date().toISOString()
  });
};

export const trackFeatureUsed = (featureName: string, action: string) => {
  trackEvent('feature_used', {
    feature_name: featureName,
    action: action,
    timestamp: new Date().toISOString()
  });
};

export const trackSpiritualGuidanceViewed = (guidanceType: string) => {
  trackEvent('spiritual_guidance_viewed', {
    guidance_type: guidanceType,
    timestamp: new Date().toISOString()
  });
};

// Progress Sharing Events
export const trackProgressShared = (shareMethod: string) => {
  trackEvent('progress_shared', {
    share_method: shareMethod,
    timestamp: new Date().toISOString()
  });
};

// User Journey Events
export const trackUserSignUp = (method: string) => {
  trackEvent('user_sign_up', {
    sign_up_method: method,
    timestamp: new Date().toISOString()
  });
};

export const trackUserLogin = (method: string) => {
  trackEvent('user_login', {
    login_method: method,
    timestamp: new Date().toISOString()
  });
};

// Spiritual Milestones
export const trackSpiritualMilestone = (milestoneType: string, value: number) => {
  trackEvent('spiritual_milestone', {
    milestone_type: milestoneType,
    value: value,
    timestamp: new Date().toISOString()
  });
};

// Error Tracking
export const trackError = (errorType: string, errorMessage: string, context?: string) => {
  trackEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    context: context || '',
    timestamp: new Date().toISOString()
  });
};

// Custom Event for any spiritual activity
export const trackSpiritualActivity = (activityType: string, details?: Record<string, any>) => {
  trackEvent('spiritual_activity', {
    activity_type: activityType,
    ...details,
    timestamp: new Date().toISOString()
  });
};
