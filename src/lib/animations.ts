/**
 * Professional Animation System
 * 
 * This file documents the standardized animation approach used throughout
 * the Film Folio application for consistent, professional user experience.
 */

export const ANIMATION_CONFIG = {
  // Standard durations (in milliseconds)
  DURATIONS: {
    FAST: 150,      // Quick feedback (buttons, hover states)
    STANDARD: 200,  // Most UI transitions
    MEDIUM: 300,    // Content transitions, modals
    SLOW: 700,      // Hero carousel slides
  },

  // Professional easing curves
  EASING: {
    STANDARD: 'cubic-bezier(0.4, 0.0, 0.2, 1)',    // Material Design standard
    DECELERATE: 'cubic-bezier(0.0, 0.0, 0.2, 1)',  // Entering elements
    ACCELERATE: 'cubic-bezier(0.4, 0.0, 1, 1)',    // Exiting elements
    EASE_OUT: 'ease-out',                           // General purpose
  },

  // Animation principles applied:
  PRINCIPLES: {
    // 1. Subtle and purposeful - animations enhance UX without being distracting
    // 2. Consistent timing - standardized durations across components
    // 3. Reduced motion respect - minimal animations for accessibility
    // 4. Performance focused - avoid complex transforms and excessive layering
    // 5. Contextual - different speeds for different interaction types
  }
} as const;

/**
 * Animation Guidelines:
 * 
 * ✅ DO:
 * - Use 150ms for button hover states and quick feedback
 * - Use 200ms for most UI transitions (borders, colors)
 * - Use 300ms for content appearing/disappearing
 * - Use subtle scale (1.05 max) and opacity changes
 * - Prefer transform over changing layout properties
 * 
 * ❌ AVOID:
 * - Durations over 500ms (except hero carousel)
 * - Complex multi-layer animations
 * - Excessive stagger delays (max 150ms)
 * - Dramatic scale changes (>1.1x)
 * - Rotating elements (unless essential)
 * - Multiple simultaneous animations on hover
 */

export type AnimationDuration = keyof typeof ANIMATION_CONFIG.DURATIONS;
export type AnimationEasing = keyof typeof ANIMATION_CONFIG.EASING;