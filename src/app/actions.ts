'use server';

import { revalidatePath } from 'next/cache';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './lib/firebase';
import type { User } from './lib/types';
import {
  generatePersonalizedGoals,
  type GeneratePersonalizedGoalsInput,
} from './ai/flows/generate-personalized-goals';

export async function completeQuest(payload: {
  userId: string;
  xpReward: number;
}): Promise<{ success: boolean; message: string }> {
  const { userId, xpReward } = payload;
  if (!userId) {
    return { success: false, message: 'User not found.' };
  }

  const userRef = doc(db, 'users', userId);

  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return { success: false, message: 'User data not found.' };
    }

    const currentUserData = userDoc.data() as Omit<User, 'uid'>;
    const currentXp = currentUserData.xp;
    const newXp = currentXp + xpReward;
    const newLevel = Math.floor(newXp / 1000) + 1;

    await updateDoc(userRef, {
      xp: increment(xpReward),
      level: newLevel,
    });

    revalidatePath('/dashboard');
    return { success: true, message: `Gained ${xpReward} XP!` };
  } catch (error) {
    console.error('Error completing quest:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to complete quest: ${errorMessage}` };
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
