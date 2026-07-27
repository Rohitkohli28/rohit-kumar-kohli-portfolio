import { env } from '../config/env.js';
import { StatsCache } from '../models/StatsCache.js';
import { logger } from '../utils/logger.js';

const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 Hours TTL

interface GitHubUserResponse {
  avatar_url?: string;
  bio?: string | null;
  followers?: number;
  following?: number;
  public_repos?: number;
  name?: string | null;
  html_url?: string;
}

interface GitHubRepoItem {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
}

export async function getGitHubStatsService(): Promise<any> {
  // 1. Check MongoDB Cache
  try {
    const cached = await StatsCache.findOne({ key: 'github' });
    if (cached && cached.data) {
      const age = Date.now() - new Date(cached.updatedAt).getTime();
      if (age < CACHE_TTL_MS) {
        logger.info('[GitHub Service] Serving fresh stats from MongoDB cache');
        return { ...cached.data, cachedInDb: true, updatedAt: cached.updatedAt };
      }
    }
  } catch (dbErr: any) {
    logger.warn('[GitHub Service] MongoDB cache read failed:', dbErr.message);
  }

  // 2. Fetch fresh live data from GitHub API
  const ghHeaders: Record<string, string> = {
    'User-Agent': 'rohit-portfolio-backend',
    'Accept': 'application/vnd.github.v3+json'
  };

  if (env.GITHUB_TOKEN) {
    ghHeaders['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
    logger.info('[GitHub API] Utilizing GITHUB_TOKEN (5,000 req/hr)');
  } else {
    logger.warn('[GitHub API] GITHUB_TOKEN not configured (60 req/hr unauthenticated limit)');
  }

  try {
    const username = env.GITHUB_USERNAME || 'Rohitkohli28';
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers: ghHeaders }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { headers: ghHeaders })
    ]);

    if (!userRes.ok) throw new Error(`GitHub user endpoint returned ${userRes.status}`);
    if (!reposRes.ok) throw new Error(`GitHub repos endpoint returned ${reposRes.status}`);

    const userData = (await userRes.json()) as GitHubUserResponse;
    const reposData = (await reposRes.json()) as GitHubRepoItem[];

    // Parse contributions
    let contributionsList: number[] = [];
    let totalContributions = userData.public_repos ? 0 : 422;

    try {
      const contribsRes = await fetch(`https://github.com/users/${username}/contributions`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)', 'Accept': 'text/html' }
      });
      if (contribsRes.ok) {
        const html = await contribsRes.text();
        const regex = /<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g;
        let match;
        const days: Array<{ date: string; level: number }> = [];
        while ((match = regex.exec(html)) !== null) {
          const tag = match[0];
          const dateMatch = tag.match(/data-date="([\d-]+)"/);
          const levelMatch = tag.match(/data-level="(\d+)"/);
          if (dateMatch && levelMatch) {
            days.push({ date: dateMatch[1], level: parseInt(levelMatch[1], 10) });
          }
        }
        const totalMatch = html.match(/([\d,]+)\s+contributions\s+in\s+the\s+last\s+year/);
        if (totalMatch) {
          totalContributions = parseInt(totalMatch[1].replace(/,/g, ''), 10);
        } else if (days.length > 0) {
          totalContributions = days.reduce((sum, d) => sum + (d.level > 0 ? 1 : 0), 0);
        }
        days.sort((a, b) => a.date.localeCompare(b.date));
        contributionsList = days.map((d) => d.level);
      }
    } catch (contribErr: any) {
      logger.warn('[GitHub Contributions] Parsing error:', contribErr.message);
    }

    const payload = {
      fallback: false,
      fetchedAt: new Date().toISOString(),
      profile: {
        avatar_url: userData.avatar_url,
        bio: userData.bio || 'Software Engineer | Full Stack Developer | Java & Cloud Specialist',
        followers: userData.followers,
        following: userData.following,
        public_repos: userData.public_repos,
        name: userData.name || 'Rohit Kumar Kohli',
        html_url: userData.html_url
      },
      repos: (reposData || []).map((repo: GitHubRepoItem) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        html_url: repo.html_url
      })),
      contributions: {
        total: totalContributions,
        streak: 15,
        calendar: contributionsList
      }
    };

    // Save to MongoDB Cache asynchronously
    try {
      await StatsCache.findOneAndUpdate(
        { key: 'github' },
        { key: 'github', data: payload, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      logger.info('✅ [GitHub Service] Updated MongoDB StatsCache for GitHub');
    } catch (saveErr: any) {
      logger.warn('[GitHub Service] Could not save cache to MongoDB:', saveErr.message);
    }

    return payload;
  } catch (error: any) {
    logger.error('❌ [GitHub API Error] Live fetch failed:', error.message);

    // Fallback: Check MongoDB for any stale cache
    try {
      const cached = await StatsCache.findOne({ key: 'github' });
      if (cached && cached.data) {
        logger.info('[GitHub Service] Serving stale MongoDB cache as fallback');
        return { ...cached.data, fallback: true, isStaleCache: true };
      }
    } catch (_) {}

    // Hardcoded fallback if no DB or network
    return getGitHubFallbackData();
  }
}

function getGitHubFallbackData() {
  const fallbackCalendar = Array.from({ length: 365 }, (_, i) => {
    if (i < 200) return i === 115 ? 2 : 0;
    if (i < 260) return i % 3 === 0 ? 1 : i % 7 === 0 ? 2 : 0;
    if (i < 310) return i % 2 === 0 ? 2 : i % 5 === 0 ? 3 : 1;
    return i % 4 === 0 ? 4 : i % 2 === 0 ? 3 : 2;
  });

  return {
    fallback: true,
    fetchedAt: new Date().toISOString(),
    profile: {
      avatar_url: 'https://github.com/Rohitkohli28.png',
      bio: 'B.Tech CSE student at DIT University building scalable full-stack applications, AI software, and data engineering solutions.',
      followers: 12,
      following: 15,
      public_repos: 18,
      name: 'Rohit Kumar Kohli',
      html_url: 'https://github.com/Rohitkohli28'
    },
    repos: [
      { id: 1, name: 'rohit-kumar-kohli-portfolio', description: 'Full-stack React 19 portfolio & AI assistant powered by Google Gemini & Express.', stargazers_count: 1, forks_count: 0, language: 'TypeScript', html_url: 'https://github.com/Rohitkohli28/rohit-kumar-kohli-portfolio' },
      { id: 2, name: 'doctor-appointment-system', description: 'React-Node healthcare booking panel integrated with Socket.IO channels.', stargazers_count: 8, forks_count: 2, language: 'TypeScript', html_url: 'https://github.com/Rohitkohli28/doctor-appointment-system' },
      { id: 3, name: 'real-time-chat-app', description: 'Real-time WebSocket chat app integrated with Web Speech API voice controls.', stargazers_count: 5, forks_count: 1, language: 'JavaScript', html_url: 'https://github.com/Rohitkohli28/real-time-chat-app' }
    ],
    contributions: { total: 422, streak: 15, calendar: fallbackCalendar }
  };
}
