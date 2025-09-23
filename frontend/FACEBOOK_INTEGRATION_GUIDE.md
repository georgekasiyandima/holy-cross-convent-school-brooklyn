# Facebook Integration Guide

## How Facebook Embedding Works Under the Hood

### 1. **Facebook SDK Loading**
When a Facebook post is embedded, the system:
- Loads the Facebook JavaScript SDK dynamically
- Initializes the Facebook API with your app ID
- Creates a container for the Facebook post embed

### 2. **Post Embedding Process**
```javascript
// The FacebookEmbed component:
1. Creates a div with class "fb-post"
2. Sets the Facebook post URL as data-href
3. Calls FB.XFBML.parse() to render the embed
4. Shows fallback image if embed fails
```

### 3. **Content Access**
- **Public Posts**: Any public Facebook post can be embedded
- **Private Posts**: Cannot be embedded (privacy restrictions)
- **Page Posts**: Must be from a public Facebook page
- **Content Types**: Photos, videos, text posts, albums

### 4. **Data Flow**
```
Facebook Post URL → Facebook SDK → Rendered Embed → Your Website
     ↓
Fallback Image (if embed fails)
```

## Adding Facebook Posts to Your Site

### Step 1: Get Facebook Post URL
1. **Go to the Facebook post** you want to embed
2. **Click the timestamp** (e.g., "2 hours ago") to get the direct link
3. **Copy the URL** from your browser address bar
4. **Example**: `https://www.facebook.com/holycrossbrooklyn/posts/123456789`

### Step 2: Add to Asset Manager
Open `frontend/src/utils/assetManager.ts` and add your Facebook post to the `facebookPostAssets` array:

```javascript
{
  id: 'fb-your-post-id',
  filename: 'Your Post Title',
  path: '/fallback-image.jpg',
  alt: 'Description of the post',
  category: 'events', // or 'spiritual', 'grades', etc.
  description: 'Detailed description of the post content',
  size: 'High Quality',
  isFacebookPost: true,
  facebookUrl: 'https://www.facebook.com/holycrossbrooklyn/posts/123456789',
  facebookPostId: '123456789',
  fallbackImage: '/fallback-image.jpg'
}
```

### Step 3: Required Properties

| Property | Description | Required |
|----------|-------------|----------|
| `id` | Unique identifier | Yes |
| `filename` | Display name | Yes |
| `path` | Fallback image path | Yes |
| `alt` | Alt text for accessibility | Yes |
| `category` | Gallery category | Yes |
| `description` | Post description | No |
| `size` | Quality indicator | No |
| `isFacebookPost` | Must be `true` | Yes |
| `facebookUrl` | Facebook post URL | Yes |
| `facebookPostId` | Post ID from URL | Yes |
| `fallbackImage` | Backup image path | Yes |

### Step 4: Categories Available
- `events` - School events and celebrations
- `spiritual` - Religious activities and masses
- `grades` - Class activities and photos
- `athletics` - Sports and physical activities
- `music` - Music performances and events
- `facilities` - School buildings and campus
- `computer-lab` - ICT activities
- `book-day` - Reading events
- `youth-day` - Youth Day celebrations
- `quiz-night` - Academic competitions
- `science-expo` - Science exhibitions

### Step 5: Test Your Integration

1. **Start the development server**: `npm start`
2. **Go to the Gallery page** to see your Facebook post
3. **Visit the demo page**: `/facebook-demo` to test the embed
4. **Check fallback behavior** by temporarily breaking the Facebook URL

## Benefits of Facebook Integration

✅ **Rich Context**: Shows captions, dates, and community reactions  
✅ **Real-time Updates**: Content stays current with Facebook  
✅ **Engagement**: Displays likes, comments, and shares  
✅ **Consistency**: Matches exactly what's on Facebook  
✅ **Fallback System**: Shows static image if embed fails  

## Troubleshooting

**Facebook embed not loading?**
- Check if the URL is correct and accessible
- Ensure the post is public
- Try the fallback image

**Post not appearing in gallery?**
- Verify the category is included in `getGalleryAssets()`
- Check that `isFacebookPost: true` is set
- Ensure the asset is added to `facebookPostAssets` array

**Layout issues?**
- Facebook embeds are responsive and will adjust to the grid
- Check the container width and grid settings

## Best Practices

1. **Use descriptive titles** and descriptions
2. **Choose appropriate categories** for easy filtering
3. **Always provide fallback images**
4. **Test on different devices** and screen sizes
5. **Keep Facebook URLs updated** if posts are moved or deleted

## Example: Adding a New Facebook Post

```javascript
// In assetManager.ts, add this to facebookPostAssets array:
{
  id: 'fb-sports-day-2024',
  filename: 'Sports Day 2024',
  path: '/sports-day-fallback.jpg',
  alt: 'Students participating in Sports Day activities',
  category: 'athletics',
  description: 'Annual Sports Day celebration with students competing in various athletic events',
  size: 'High Quality',
  isFacebookPost: true,
  facebookUrl: 'https://www.facebook.com/holycrossbrooklyn/posts/987654321',
  facebookPostId: '987654321',
  fallbackImage: '/sports-day-fallback.jpg'
}
```

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify Facebook post accessibility
3. Test with the demo page first
4. Ensure all required properties are set correctly 