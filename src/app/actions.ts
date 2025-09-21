'use server';

import { revalidatePath } from 'next/cache';
import { doc, getDoc, getDocs, updateDoc, increment, setDoc, collection, serverTimestamp, query, where, limit, addDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User } from '../lib/types';
import {
  generatePersonalizedGoals,
  type GeneratePersonalizedGoalsInput,
} from '../ai/flows/generate-personalized-goals';
import {
  generateCareerAdvice,
  type CareerAdviceInput,
} from '../ai/flows/generate-career-advice';

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

export async function getCareerAdvice(input: CareerAdviceInput) {
  try {
    console.log('Generating career advice with input:', input);
    const result = await generateCareerAdvice(input);
    console.log('Career advice generated successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating career advice:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to generate career advice: ${errorMessage}` };
  }
}

export async function saveChatMessage(payload: {
  userId: string;
  message: string;
  role: 'user' | 'assistant';
  sessionId?: string;
}): Promise<{ success: boolean; sessionId: string }> {
  try {
    const { userId, message, role, sessionId } = payload;
    
    // Create or use existing session ID
    const chatSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Try to save to Firestore, but don't fail if it doesn't work
    try {
      // Save to a simpler structure that doesn't require complex permissions
      const chatRef = collection(db, 'chat_messages');
      await addDoc(chatRef, {
        userId,
        message,
        role,
        sessionId: chatSessionId,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
      
      // Also save session info
      const sessionRef = collection(db, 'chat_sessions');
      const sessionQuery = query(sessionRef, where('sessionId', '==', chatSessionId), where('userId', '==', userId));
      const sessionSnap = await getDocs(sessionQuery);
      
      if (sessionSnap.empty) {
        await addDoc(sessionRef, {
          sessionId: chatSessionId,
          userId,
          createdAt: serverTimestamp(),
          lastMessageAt: serverTimestamp(),
          messageCount: 1,
          lastMessage: message.substring(0, 100)
        });
      } else {
        const sessionDoc = sessionSnap.docs[0];
        await updateDoc(sessionDoc.ref, {
          lastMessageAt: serverTimestamp(),
          messageCount: increment(1),
          lastMessage: message.substring(0, 100)
        });
      }
    } catch (firestoreError) {
      console.warn('Firestore save failed, continuing anyway:', firestoreError);
    }
    
    return { success: true, sessionId: chatSessionId };
  } catch (error) {
    console.error('Error in saveChatMessage:', error);
    return { success: false, sessionId: payload.sessionId || '' };
  }
}

export async function getChatSessions(userId: string): Promise<{ success: boolean; sessions: any[] }> {
  // First try to get from localStorage as a fallback
  const localSessions = typeof window !== 'undefined' ? 
    JSON.parse(localStorage.getItem(`chat_sessions_${userId}`) || '[]') : [];
  
  try {
    // Try to get from Firestore
    const sessionsRef = collection(db, 'chat_sessions');
    const sessionsQuery = query(
      sessionsRef,
      where('userId', '==', userId),
      orderBy('lastMessageAt', 'desc'),
      limit(20)
    );
    
    const sessionsSnap = await getDocs(sessionsQuery);
    const sessions = sessionsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        sessionId: data.sessionId || doc.id,
        userId: data.userId,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
        lastMessageAt: data.lastMessageAt?.toDate ? data.lastMessageAt.toDate() : new Date(data.lastMessageAt || Date.now()),
        messageCount: data.messageCount || 0,
        lastMessage: data.lastMessage || 'No preview available'
      };
    });
    
    // Update localStorage with Firestore data
    if (typeof window !== 'undefined' && sessions.length > 0) {
      localStorage.setItem(`chat_sessions_${userId}`, JSON.stringify(sessions));
    }
    
    return { success: true, sessions: sessions.length > 0 ? sessions : localSessions };
  } catch (error) {
    console.error('Error fetching from Firestore, using localStorage:', error);
    return { success: true, sessions: localSessions };
  }
}

export async function getChatMessages(userId: string, sessionId: string): Promise<{ success: boolean; messages: any[] }> {
  // First try to get from localStorage as a fallback
  const localMessages = typeof window !== 'undefined' ? 
    JSON.parse(localStorage.getItem(`chat_messages_${userId}_${sessionId}`) || '[]') : [];
  
  try {
    // Try to get from Firestore
    const messagesRef = collection(db, 'chat_messages');
    const messagesQuery = query(
      messagesRef,
      where('userId', '==', userId),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );
    
    const messagesSnap = await getDocs(messagesQuery);
    const messages = messagesSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        message: data.message,
        role: data.role,
        sessionId: data.sessionId,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.createdAt || data.timestamp || Date.now()),
        suggestedSkills: data.suggestedSkills,
        actionItems: data.actionItems,
        resources: data.resources
      };
    });
    
    // Update localStorage with Firestore data
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem(`chat_messages_${userId}_${sessionId}`, JSON.stringify(messages));
    }
    
    return { success: true, messages: messages.length > 0 ? messages : localMessages };
  } catch (error) {
    console.error('Error fetching from Firestore, using localStorage:', error);
    return { success: true, messages: localMessages };
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
