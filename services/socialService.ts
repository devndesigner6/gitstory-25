import { GitStoryData } from '../types';

/**
 * Social Media Integration for GitStory
 */

export interface SocialShareOptions {
  username: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'reddit';
  shareUrl?: string;
}

/**
 * Generate social media share text
 */
export function generateShareText(data: GitStoryData, platform: string): string {
  const baseText = `Check out my #GitStory2025! 📊 I made ${data.totalCommits} commits this year as a "${data.archetype}". See my journey from code to impact! 🚀`;
  
  switch (platform) {
    case 'twitter':
      return `${baseText} #GitHub #Developer #2025Wrapped`;
    case 'linkedin':
      return `${baseText}\n\nMy 2025 GitHub Statistics:\n- Total Commits: ${data.totalCommits}\n- Longest Streak: ${data.longestStreak} days\n- Top Language: ${data.topLanguages[0]?.name || 'N/A'}\n\n#Github #Coding #DeveloperLife`;
    case 'facebook':
      return baseText;
    case 'reddit':
      return `${baseText} posted on r/github`;
    default:
      return baseText;
  }
}

/**
 * Generate Open Graph meta tags for social previews
 */
export function generateOGTags(data: GitStoryData, shareUrl: string): {
  title: string;
  description: string;
  image: string;
  url: string;
} {
  return {
    title: `${data.username}'s GitStory 2025`,
    description: `${data.username} is a "${data.archetype}" who made ${data.totalCommits} commits in 2025. Check out their GitHub story!`,
    image: data.avatarUrl,
    url: shareUrl,
  };
}

/**
 * Share to Twitter
 */
export function shareToTwitter(text: string, url: string): void {
  const twitterUrl = new URL('https://twitter.com/intent/tweet');
  twitterUrl.searchParams.append('text', text);
  twitterUrl.searchParams.append('url', url);
  twitterUrl.searchParams.append('related', 'github');
  window.open(twitterUrl.toString(), '_blank', 'width=550,height=420');
}

/**
 * Share to LinkedIn
 */
export function shareToLinkedIn(url: string, title: string): void {
  const linkedinUrl = new URL('https://www.linkedin.com/sharing/share-offsite/');
  linkedinUrl.searchParams.append('url', url);
  window.open(linkedinUrl.toString(), '_blank', 'width=750,height=600');
}

/**
 * Share to Facebook
 */
export function shareToFacebook(url: string): void {
  const facebookUrl = new URL('https://www.facebook.com/sharer/sharer.php');
  facebookUrl.searchParams.append('u', url);
  facebookUrl.searchParams.append('quote', 'Check out my GitStory 2025!');
  window.open(facebookUrl.toString(), '_blank', 'width=550,height=420');
}

/**
 * Share to Reddit
 */
export function shareToReddit(url: string, title: string): void {
  const redditUrl = new URL('https://reddit.com/submit');
  redditUrl.searchParams.append('url', url);
  redditUrl.searchParams.append('title', title);
  window.open(redditUrl.toString(), '_blank', 'width=700,height=600');
}

/**
 * Generate mailto link for email sharing
 */
export function getEmailShareLink(
  subject: string,
  body: string
): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Get all share URLs for a story
 */
export function generateAllShareLinks(
  data: GitStoryData,
  baseUrl: string
): Record<string, string> {
  const shareText = generateShareText(data, 'twitter');
  const linkedinText = generateShareText(data, 'linkedin');
  
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(baseUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(baseUrl)}&title=${encodeURIComponent(`${data.username}'s GitStory 2025`)}`,
    email: getEmailShareLink(
      `${data.username}'s GitStory 2025`,
      `Check out this amazing GitHub story: ${baseUrl}`
    ),
  };
}
