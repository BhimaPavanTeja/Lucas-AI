'use client';

import { doc, getDoc, updateDoc, setDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from './firebase';

export async function completeQuestClientSide(payload: {
  userId: string;
  xpReward: number;
  questId: string;
}): Promise<{ success: boolean; message: string; levelUp?: boolean; newLevel?: number }> {
  const { userId, xpReward, questId } = payload;
  console.log('🎯 Client-side quest completion starting...', { userId, xpReward, questId });
  
  if (!userId || !questId || !xpReward) {
    console.log('❌ Missing required parameters');
    return { success: false, message: 'Missing required data' };
  }

  try {
    // Check if quest already completed
    const completionDocId = `${userId}_${questId}`;
    const completionDocRef = doc(db, 'questCompletions', completionDocId);
    
    console.log('🔍 Checking if quest already completed...');
    const existingCompletion = await getDoc(completionDocRef);
    
    if (existingCompletion.exists()) {
      console.log('⚠️ Quest already completed');
      return { success: false, message: 'Quest already completed!' };
    }

    // Get current user data
    console.log('📖 Fetching user data...');
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('❌ User document not found');
      return { success: false, message: 'User data not found. Please refresh the page.' };
    }

    const userData = userDoc.data();
    const currentXp = userData?.xp || 0;
    const currentLevel = userData?.level || 0;
    const newXp = currentXp + xpReward;
    const newLevel = Math.floor(newXp / 300);
    const levelUp = newLevel > currentLevel;

    console.log('🧮 XP calculation:', { currentXp, xpReward, newXp, currentLevel, newLevel, levelUp });

    // Update user XP and level
    console.log('💾 Updating user XP and level...');
    await updateDoc(userRef, {
      xp: newXp,
      level: newLevel,
      lastQuestCompleted: questId,
      lastUpdated: serverTimestamp()
    });
    console.log('✅ User data updated successfully');

    // Create completion record
    console.log('📝 Creating quest completion record...');
    await setDoc(completionDocRef, {
      questId: questId,
      userId: userId,
      xpAwarded: xpReward,
      completedAt: serverTimestamp(),
      levelBefore: currentLevel,
      levelAfter: newLevel,
      levelUp: levelUp,
      method: 'client-side',
      version: '3.0'
    });
    console.log('✅ Quest completion record created successfully');

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
    console.error('💥 Client-side quest completion failed:', error);
    
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