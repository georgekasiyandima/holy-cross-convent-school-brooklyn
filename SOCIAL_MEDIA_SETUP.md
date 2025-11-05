# Social Media Integration Setup Guide

## Overview

The Gallery system now supports automatic posting to social media platforms when images are uploaded. When admins upload an image and check "Post to Social Media", the image will be automatically posted to configured platforms.

## Supported Platforms

- ✅ **Facebook** (via Facebook Graph API)
- ✅ **Instagram** (via Facebook Graph API - Instagram Business Account)
- ✅ **TikTok** (via TikTok Content Publishing API)
- ⏳ **Twitter/X** (requires Twitter API v2 setup)

---

## Setup Instructions

### 1. Facebook Setup

#### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing app
3. Add "Facebook Login" product
4. Add "Instagram Basic Display" product (for Instagram)

#### Step 2: Get Page Access Token
1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Get a **Page Access Token** (not User Access Token)
4. Token must have these permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `instagram_basic` (for Instagram)

#### Step 3: Get Page ID
1. Go to your Facebook Page
2. Settings → Page Info
3. Find your Page ID (or use [Graph API](https://graph.facebook.com/me?access_token=YOUR_TOKEN))

#### Step 4: Add to Environment Variables
Add to `.env` file:
```env
FACEBOOK_ENABLED=true
FACEBOOK_PAGE_ID=your_page_id_here
FACEBOOK_ACCESS_TOKEN=your_page_access_token_here
```

---

### 2. Instagram Setup

#### Prerequisites
- Must have a Facebook Business Page connected to Instagram
- Instagram account must be a Business or Creator account

#### Step 1: Connect Instagram to Facebook
1. Go to Facebook Page Settings
2. Link Instagram account to Facebook Page
3. Ensure Instagram account is set to Business/Creator

#### Step 2: Get Instagram Account ID
1. Use Graph API: `GET /{page-id}?fields=instagram_business_account`
2. Get the `instagram_business_account.id`

#### Step 3: Add to Environment Variables
Add to `.env` file:
```env
INSTAGRAM_ENABLED=true
INSTAGRAM_ACCOUNT_ID=your_instagram_account_id
INSTAGRAM_ACCESS_TOKEN=same_as_facebook_token (must have instagram_basic permission)
```

---

### 3. TikTok Setup

#### Prerequisites
- TikTok Business account
- TikTok Developer account
- TikTok app created in Developer Portal

#### Step 1: Create TikTok App
1. Go to [TikTok Developers](https://developers.tiktok.com/)
2. Create a new app or use existing app
3. Add "Content Publishing" permission
4. Get Client Key and Client Secret

#### Step 2: Get Access Token
1. Use OAuth 2.0 flow to get access token
2. Token must have `video.upload` scope
3. For production, use long-lived tokens or refresh token flow

#### Step 3: Add to Environment Variables
Add to `.env` file:
```env
TIKTOK_ENABLED=true
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_ACCESS_TOKEN=your_access_token
```

**Note**: TikTok API requires video files, not images. The system will attempt to post images as videos, but for best results, upload videos directly.

---

### 4. Twitter Setup (Future)

Twitter integration requires Twitter API v2 setup:
1. Create Twitter Developer Account
2. Create App and get API keys
3. Set up OAuth 1.0a or OAuth 2.0
4. Add to environment variables

---

## Environment Variables

Add these to your `.env` file:

```env
# Facebook
FACEBOOK_ENABLED=true
FACEBOOK_PAGE_ID=your_page_id
FACEBOOK_ACCESS_TOKEN=your_page_access_token

# Instagram
INSTAGRAM_ENABLED=true
INSTAGRAM_ACCOUNT_ID=your_instagram_account_id
INSTAGRAM_ACCESS_TOKEN=your_access_token

# TikTok
TIKTOK_ENABLED=true
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_ACCESS_TOKEN=your_access_token

# Twitter (Future)
TWITTER_ENABLED=false
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_token_secret
```

---

## How It Works

### Upload Flow with Social Media

1. **Admin uploads image** with "Post to Social Media" checked
2. **Backend processes upload**:
   - Saves image to `uploads/gallery/`
   - Creates database record
   - If `postToSocial=true` and image is published:
     - Generates image URL
     - Creates caption with title, description, and hashtags
     - Posts to all enabled platforms
3. **Response includes**:
   - Gallery item data
   - Social media posting results (success/failure for each platform)

### Caption Format

```
{Title} - {Description}

#HolyCrossConventSchool #Brooklyn #CapeTown
```

---

## Testing

### Test Facebook Posting
1. Upload a test image with "Post to Social Media" checked
2. Check Facebook Page for the post
3. Verify image and caption appear correctly

### Test Instagram Posting
1. Upload a test image with "Post to Social Media" checked
2. Check Instagram Business account
3. Verify post appears in feed

### Test TikTok Posting
1. Upload a test video (or image) with "Post to Social Media" checked
2. Check TikTok account
3. Verify post appears in feed

**Note**: TikTok prefers video content. Images will be converted, but videos work best.

---

## Troubleshooting

### Facebook Errors
- **"Invalid OAuth Access Token"**: Token expired or invalid
- **"Page not found"**: Check Page ID is correct
- **"Permission denied"**: Token needs `pages_manage_posts` permission

### Instagram Errors
- **"Instagram account not found"**: Account must be Business/Creator
- **"Account not linked"**: Instagram must be linked to Facebook Page
- **"Invalid access token"**: Token needs `instagram_basic` permission

### TikTok Errors
- **"Invalid access token"**: Token expired or invalid
- **"Video upload failed"**: TikTok API requires video files (not images)
- **"Permission denied"**: Token needs `video.upload` scope
- **"Client key not found"**: Check TIKTOK_CLIENT_KEY environment variable

### General
- Check server logs for detailed error messages
- Verify environment variables are set correctly
- Ensure tokens have required permissions
- Social media failures don't block image uploads

---

## Security Notes

- ✅ Access tokens stored in environment variables (not in code)
- ✅ Tokens never exposed to frontend
- ✅ Social media posting is optional (doesn't block uploads)
- ✅ Errors logged but don't fail uploads

---

## Future Enhancements

- [ ] Scheduled posting
- [ ] Custom hashtags per post
- [ ] Social media analytics
- [ ] Multi-account support
- [ ] Post templates
- [ ] Social media preview before posting

