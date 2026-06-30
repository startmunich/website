# START Munich Startups Website

A Next.js 14 application showcasing startups from the START Munich community. Features include
company listings, filtering, detailed company pages, and an admin interface for managing startup
data.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **NocoDB** for database (backend)

## Environment Variables

This project requires the following environment variables to be set:

### Required Variables

```env
NOCODB_API_TOKEN=your_nocodb_api_token_here
NOCODB_TABLE_ID=your_nocodb_table_id_here
NOCODB_BASE_URL=https://ndb.startmunich.de
NOCODB_STARTUPS_TABLE_ID=your_nocodb_table_id_here
NOCODB_MEMBERS_TABLE_ID=your_nocodb_members_table_id_here
NOCODB_WAITLIST_TABLE_ID=your_nocodb_waitlist_table_id_here
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key_here
TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here
```

For the waitlist table and Turnstile setup, see
[`docs/waitlist-nocodb-setup.md`](docs/waitlist-nocodb-setup.md).

### Where to Set Environment Variables

#### Local Development

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your NocoDB credentials in `.env.local`

#### Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - `NOCODB_API_TOKEN`: Your NocoDB API token (xc-token)
   - `NOCODB_TABLE_ID`: Your NocoDB table ID (e.g., `mf0gbvfzl1wkaha`)
   - `NOCODB_STARTUPS_TABLE_ID`: Same as NOCODB_TABLE_ID
   - `NOCODB_BASE_URL`: `https://ndb.startmunich.de`

4. After adding variables, redeploy:
   - Go to **Deployments** tab
   - Click the three dots on your latest deployment
   - Select **Redeploy**

### How to Find Your NocoDB Credentials

**NOCODB_API_TOKEN:**

- Log into your NocoDB instance
- Go to Account Settings → Tokens
- Create or copy an existing API token

**NOCODB_TABLE_ID:**

- Open your startups table in NocoDB
- Check the URL: `https://ndb.startmunich.de/nc/{workspace}/{project}/table/{TABLE_ID}`
- Or use the NocoDB API to list tables and find the ID

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Access to NocoDB instance with startups data

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/startmunich/WebsiteOurStartups.git
   cd WebsiteOurStartups
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see above)

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Brand Colors

The START Munich brand color scheme is defined in `tailwind.config.ts` for consistent use throughout
the application:

### Primary Brand Colors

| Color              | Hex Code  | Tailwind Class         | Usage                                     |
| ------------------ | --------- | ---------------------- | ----------------------------------------- |
| **Pink**           | `#d0006f` | `brand-pink`           | Primary accent color, buttons, highlights |
| **Dark Blue**      | `#00002c` | `brand-dark-blue`      | Main background color                     |
| **Secondary Blue** | `#011152` | `brand-secondary-blue` | Department cards, secondary backgrounds   |

### Usage Examples

```tsx
// Background
className = 'bg-brand-pink';
className = 'bg-brand-dark-blue';
className = 'bg-brand-secondary-blue';

// Text
className = 'text-brand-pink';

// Borders
className = 'border-brand-pink';

// With opacity
className = 'bg-brand-pink/20';
className = 'hover:bg-brand-pink/90';
```

### Color Customization

To modify brand colors, edit the `colors.brand` section in `tailwind.config.ts`:

```typescript
colors: {
  brand: {
    pink: "#d0006f",
    "dark-blue": "#00002c",
    "secondary-blue": "#011152",
  },
}
```
