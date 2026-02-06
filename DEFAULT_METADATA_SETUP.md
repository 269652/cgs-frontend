# Default Metadata Setup Guide

This guide explains how to create and manage the default metadata in your Strapi CMS that will be used as fallback for all pages without specific metadata.

## 1. Create Site Metadata Content Type (if not exists)

In your Strapi admin panel, create a new Content Type called "Site Metadata" with these fields:

### Basic Fields:
- **name** (Text, required) - Used to identify the metadata entry
- **metaTitle** (Text) - Default page title
- **metaDescription** (Text, long text) - Default meta description
- **keywords** (Text) - Comma-separated keywords

### SEO Fields:
- **canonicalUrl** (Text) - Default canonical URL
- **robots** (Text) - Robots meta tag content
- **themeColor** (Text) - Browser theme color

### Open Graph Fields:
- **ogTitle** (Text) - Open Graph title
- **ogDescription** (Text, long text) - Open Graph description
- **ogType** (Enumeration) - Values: website, article, profile, book
- **ogLocale** (Text) - Default: de_DE
- **ogSiteName** (Text) - Site name for Open Graph
- **ogImage** (Media, single) - Default Open Graph image

### Twitter Fields:
- **twitterCard** (Enumeration) - Values: summary, summary_large_image, app, player
- **twitterTitle** (Text) - Twitter card title
- **twitterDescription** (Text, long text) - Twitter card description
- **twitterImage** (Media, single) - Twitter card image
- **twitterSite** (Text) - Twitter site handle (@yoursite)
- **twitterCreator** (Text) - Twitter creator handle

### Icon Fields:
- **favicon** (Media, single) - Site favicon
- **appleTouchIcon** (Media, single) - Apple touch icon

## 2. Create the Default Entry

1. Go to Content Manager → Site Metadatas
2. Click "Create new entry"
3. Set the **name** field to exactly: `Default`
4. Fill in your default metadata values:

### Example Default Values:
```
Name: Default
Meta Title: Clara Grunwald Schule
Meta Description: Welcome to Clara Grunwald Schule - Excellence in Education
Keywords: school, education, Clara Grunwald, learning, students
OG Title: Clara Grunwald Schule
OG Description: Welcome to Clara Grunwald Schule - Excellence in Education
OG Type: website
OG Locale: de_DE
OG Site Name: Clara Grunwald Schule
Twitter Card: summary_large_image
Twitter Site: @cgsschool
Theme Color: #1a56db
```

## 3. How It Works

- **Page with metadata**: Uses the page-specific metadata from Strapi
- **Page without metadata**: Automatically uses the "Default" metadata entry
- **No default entry**: Falls back to the hardcoded metadata in layout.tsx
- **Caching**: Default metadata is cached for 5 minutes to improve performance

## 4. Testing

To test the default metadata system:

1. Create a page in Strapi without any metadata
2. Visit that page on your website
3. Check the page source or browser dev tools to see the metadata
4. You should see the default metadata values you configured

## 5. Cache Management

The default metadata is cached for performance. If you update the default metadata:

- **Development**: Restart your Next.js dev server
- **Production**: The cache will refresh automatically after 5 minutes, or restart the application

## 6. Content Structure

Your Strapi content type should have this structure:
```
Site Metadata
├── Basic Info
│   ├── name (Text, required)
│   ├── metaTitle (Text)
│   ├── metaDescription (Long Text)
│   └── keywords (Text)
├── SEO
│   ├── canonicalUrl (Text)
│   ├── robots (Text)
│   └── themeColor (Text)
├── Open Graph
│   ├── ogTitle (Text)
│   ├── ogDescription (Long Text)
│   ├── ogType (Enumeration)
│   ├── ogLocale (Text)
│   ├── ogSiteName (Text)
│   └── ogImage (Media)
├── Twitter
│   ├── twitterCard (Enumeration)
│   ├── twitterTitle (Text)
│   ├── twitterDescription (Long Text)
│   ├── twitterImage (Media)
│   ├── twitterSite (Text)
│   └── twitterCreator (Text)
└── Icons
    ├── favicon (Media)
    └── appleTouchIcon (Media)
```

## 7. API Endpoint

The system fetches default metadata from:
```
GET /api/site-metadatas?filters[name][$eq]=Default&populate[siteMetadata][populate]=*
```

Make sure this endpoint is accessible and returns the expected data structure.