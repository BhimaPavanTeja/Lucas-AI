'use server';

import { revalidatePath } from 'next/cache';
import { doc, getDoc, getDocs, updateDoc, increment, setDoc, collection, serverTimestamp, query, where, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User } from '../lib/types';
import {
  generatePersonalizedGoals,
  type GeneratePersonalizedGoalsInput,
} from '../ai/flows/generate-personalized-goals';

export async function completeQuest(payload: {
  userId: string;
  xpReward: number;
  questId: string;
  idToken?: string; // Add optional ID token for authentication
}): Promise<{ success: boolean; message: string; levelUp?: boolean; newLevel?: number }> {
  const { userId, xpReward, questId, idToken } = payload;
  console.log('🎯 completeQuest called with:', { userId, xpReward, questId });
  
  if (!userId || !questId) {
    console.error('❌ Missing userId or questId:', { userId, questId });
    return { success: false, message: 'User ID or Quest ID not provided.' };
  }

  // Validate that userId is a valid Firebase Auth UID format
  if (typeof userId !== 'string' || userId.length < 10) {
    console.error('❌ Invalid userId format:', userId);
    return { success: false, message: 'Invalid user ID format.' };
  }

  const userRef = doc(db, 'users', userId);

  try {
    console.log('📖 Fetching user document for userId:', userId);
    
    // Check if user document exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.error('❌ User document not found for userId:', userId);
      return { success: false, message: 'User data not found. Please try logging out and back in.' };
    }

    console.log('✅ User document found, checking quest completion status...');

    // Check if this quest was already completed by this user
    const completionDocId = `${userId}_${questId}`;
    const completionDocRef = doc(db, 'questCompletions', completionDocId);
    
    console.log('🔍 Checking completion document:', completionDocId);
    const existingCompletion = await getDoc(completionDocRef);
    
    if (existingCompletion.exists()) {
      console.log('⚠️ Quest already completed by this user');
      return { success: false, message: 'Quest already completed!' };
    }

    const currentUserData = userDoc.data() as Omit<User, 'uid'>;
    const currentXp = currentUserData.xp || 0;
    const currentLevel = currentUserData.level || 0;
    const newXp = currentXp + xpReward;
    
    // Calculate new level with 300 XP per level
    const newLevel = Math.floor(newXp / 300);
    const levelUp = newLevel > currentLevel;

    console.log('📊 User progression data:', { 
      currentXp, 
      currentLevel, 
      xpReward, 
      newXp, 
      newLevel, 
      levelUp 
    });

    // Step 1: Update user XP and level first
    console.log('💾 Updating user XP and level...');
    await updateDoc(userRef, {
      xp: newXp, // Use direct value instead of increment for reliability
      level: newLevel,
    });
    console.log('✅ User document updated successfully');

    // Step 2: Create quest completion record
    console.log('📝 Creating quest completion record...');
    await setDoc(completionDocRef, {
      questId: questId,
      userId: userId,
      xpAwarded: xpReward,
      completedAt: serverTimestamp(),
      levelBefore: currentLevel,
      levelAfter: newLevel,
      levelUp: levelUp,
      // Add metadata for debugging
      createdBy: 'quest-completion-system',
      version: '2.0'
    });
    console.log('✅ Quest completion record created successfully');

    revalidatePath('/dashboard');
    
    const successMessage = levelUp 
      ? `🎉 Gained ${xpReward} XP! Level up! You're now level ${newLevel}!` 
      : `✨ Gained ${xpReward} XP! (${currentXp + xpReward}/${(newLevel + 1) * 300} to next level)`;
    
    console.log('🎊 Quest completion successful!', successMessage);
    
    return { 
      success: true, 
      message: successMessage,
      levelUp,
      newLevel: levelUp ? newLevel : undefined
    };
  } catch (error) {
    console.error('💥 Error completing quest:', error);
    
    // Enhanced error handling with specific error types
    let errorMessage = 'An unknown error occurred.';
    
    if (error instanceof Error) {
      if (error.message.includes('permission')) {
        errorMessage = 'Permission denied. Please try logging out and back in.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('not-found')) {
        errorMessage = 'Data not found. Please refresh the page and try again.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return { 
      success: false, 
      message: `Failed to complete quest: ${errorMessage}`
    };
  }
}

export async function getAiGeneratedGoals(input: GeneratePersonalizedGoalsInput) {
  try {
    const result = await generatePersonalizedGoals(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating AI goals:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to generate goals: ${errorMessage}` };
  }
}

// Ultra-simple quest completion with maximum error handling
export async function completeQuestUltraSimple(payload: {
  userId: string;
  xpReward: number;
  questId: string;
  idToken?: string; // Add optional ID token for authentication
}): Promise<{ success: boolean; message: string; levelUp?: boolean; newLevel?: number }> {
  const { userId, xpReward, questId, idToken } = payload;
  console.log('� Ultra-simple quest completion starting...', { userId, xpReward, questId });
  
  if (!userId || !questId || !xpReward) {
    console.log('❌ Missing required parameters');
    return { success: false, message: 'Missing required data' };
  }

  try {
    console.log('🔗 Testing Firebase connection...');
    
    // Step 1: Test basic Firebase connection
    const userRef = doc(db, 'users', userId);
    console.log('📍 User reference created:', userRef.path);
    
    // Step 2: Try to read user document
    console.log('📖 Attempting to read user document...');
    const userDoc = await getDoc(userRef);
    console.log('📖 User document read result:', { exists: userDoc.exists() });
    
    if (!userDoc.exists()) {
      console.log('❌ User document does not exist');
      return { success: false, message: 'User document not found. Please log out and log back in.' };
    }
    
    // Step 3: Get current user data
    const userData = userDoc.data();
    console.log('👤 Current user data:', { 
      xp: userData?.xp || 0, 
      level: userData?.level || 0,
      name: userData?.name 
    });
    
    const currentXp = userData?.xp || 0;
    const currentLevel = userData?.level || 0;
    const newXp = currentXp + xpReward;
    const newLevel = Math.floor(newXp / 300);
    const levelUp = newLevel > currentLevel;
    
    console.log('🧮 XP calculation:', { currentXp, xpReward, newXp, currentLevel, newLevel, levelUp });
    
    // Step 4: Update user XP (most important operation)
    console.log('💾 Updating user XP...');
    await updateDoc(userRef, {
      xp: newXp,
      level: newLevel,
      lastQuestCompleted: questId,
      lastUpdated: new Date().toISOString()
    });
    console.log('✅ User XP updated successfully');
    
    // Step 5: Try to mark quest as completed (optional, don't fail if this doesn't work)
    try {
      console.log('📝 Attempting to create completion record...');
      const completionRef = doc(db, 'questCompletions', `${userId}_${questId}`);
      await setDoc(completionRef, {
        questId,
        userId,
        xpAwarded: xpReward,
        completedAt: new Date().toISOString(),
        method: 'ultra-simple'
      });
      console.log('✅ Completion record created');
    } catch (completionError) {
      console.warn('⚠️ Could not create completion record (but XP was saved):', completionError);
      // Don't fail the entire operation if completion record fails
    }
    
    revalidatePath('/dashboard');
    
    const message = levelUp 
      ? `🎉 LEVEL UP! Gained ${xpReward} XP and reached level ${newLevel}!`
      : `✨ Gained ${xpReward} XP! (${newXp}/${(newLevel + 1) * 300} to next level)`;
    
    console.log('🎊 Quest completion successful:', message);
    
    return {
      success: true,
      message,
      levelUp,
      newLevel: levelUp ? newLevel : undefined
    };
    
  } catch (error) {
    console.error('💥 Ultra-simple completion failed:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's a specific Firebase error
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      if (error.message.includes('permission-denied')) {
        errorMessage = 'Permission denied. Please log out and log back in.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('not-found')) {
        errorMessage = 'User data not found. Please refresh the page.';
      } else if (error.message.includes('unauthenticated')) {
        errorMessage = 'Not authenticated. Please log in again.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return { 
      success: false, 
      message: `Quest completion failed: ${errorMessage}`
    };
  }
}
