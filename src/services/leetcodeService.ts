/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { API_BASE_URL } from './api';

export interface LeetCodeStats {
  totalQuestions: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  userAvatar: string;
  streak: number;
  totalActiveDays: number;
  recentSubmissions: Array<{
    title: string;
    difficulty: string;
    status: string;
    date: string;
  }>;
  submissionCalendar: Record<string, number>;
}

export async function fetchLeetCodeStats(): Promise<LeetCodeStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/leetcode/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch LeetCode stats: ${response.status}`);
    }
    const json: any = await response.json();
    return {
      totalQuestions: json?.totalQuestions || 3500,
      totalSolved: json?.totalSolved || 352,
      easySolved: json?.easySolved || 180,
      mediumSolved: json?.mediumSolved || 157,
      hardSolved: json?.hardSolved || 15,
      ranking: json?.ranking || 363253,
      userAvatar: json?.userAvatar || 'https://assets.leetcode.com/users/default_avatar.png',
      streak: json?.streak || 136,
      totalActiveDays: json?.totalActiveDays || 162,
      recentSubmissions: json?.recentSubmissions || [],
      submissionCalendar: json?.submissionCalendar || {}
    };
  } catch (error) {
    console.warn('Using LeetCode stats fallback dataset:', error);
    return getFallbackLeetCodeStats();
  }
}

export function getFallbackLeetCodeStats(): LeetCodeStats {
  return {
    totalQuestions: 3500,
    totalSolved: 352,
    easySolved: 180,
    mediumSolved: 157,
    hardSolved: 15,
    ranking: 363253,
    userAvatar: 'https://assets.leetcode.com/users/default_avatar.png',
    streak: 136,
    totalActiveDays: 162,
    recentSubmissions: [
      { title: 'Interval List Intersections', difficulty: 'Medium', status: 'Accepted', date: '22h ago' },
      { title: 'Network Recovery Pathways', difficulty: 'Medium', status: 'Accepted', date: '1d ago' },
      { title: 'Number of Paths with Max Score', difficulty: 'Hard', status: 'Accepted', date: '1d ago' },
      { title: 'Rank Scores', difficulty: 'Medium', status: 'Accepted', date: '1d ago' },
      { title: 'Two Sum', difficulty: 'Easy', status: 'Accepted', date: '2d ago' }
    ],
    submissionCalendar: {}
  };
}
