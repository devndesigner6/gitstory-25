# Scoring Algorithm v2 - 12-Factor System

## Overview

The new scoring system provides a more nuanced and accurate representation of a developer's work and impact.

## Components

### Language Scoring (calculateLanguageScores)
- **Base Weight**: 1 point per repo
- **Recent Activity Bonus**: Extra points for 2025 activity
- **Diversity Bonus**: 0.5 points per language repo above 3 repos threshold
- **Fork Filtering**: Excludes forks (represents user's own code only)

### Repository Scoring (calculateRepositoryScore)
Evaluates repos using 12 factors:

1. **Stars** (max 30 points) - logarithmic scaling
2. **Forks** (max 15 points) - logarithmic scaling
3. **Recency** (max 25 points) - activity in 2025
4. **Original Work** (15 points) - non-fork bonus
5. **Has Description** (5 points)
6. **Has Topics** (5 points)
7. **Has Language Tag** (3 points)
8. **Watchers** (max 5 points) - 0.5x multiplier
9. **Size/Complexity** (max 15 points) - line count
10. **Open Issues** (max 8 points) - activity indicator
11. **Created in 2025** (10 points) - bonus for new projects
12. **Archived Penalty** (-20 points) - for inactive repos

### Accuracy Improvements
- Fixed calculation bugs in language stats
- Expanded language color palette from 15 to 55+ official colors
- Better handling of edge cases
- More accurate PR/Issue counts via GitHub Search API

## Configuration

All weights are tunable via `SCORING_CONFIG` object in `services/scoringAlgorithms.ts`
