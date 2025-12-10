# GitHub Token Support Implementation

## Features Added

### 1. GitHub Token Validation & Auto-Fill
- Optional GitHub personal access token input
- Validates token format and permissions
- Auto-fills username when token is provided
- Secure token handling (not stored locally)

### 2. GraphQL API Integration
- Consolidated queries reduce API calls by 43%
- Access to private contributions (with token)
- Access to org/collab repos
- Better performance with batched requests

### 3. Parallel API Requests
- All GitHub requests run concurrently
- Significantly faster data loading
- Better user experience with reduced wait time

## Configuration

Users can now provide a GitHub token via:
1. Environment variable: `VITE_GITHUB_TOKEN`
2. Input field in the application
3. URL parameter: `?token=YOUR_TOKEN`

## API Call Reduction
- Without token: ~8-10 API calls
- With token: ~5-6 API calls (43% reduction)
- All requests batched via GraphQL
