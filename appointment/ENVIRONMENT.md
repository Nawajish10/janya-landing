# Environment Setup

This project uses a static file structure. There are no `.env` files or backend Node servers required to run the frontend.

## Runtime Architecture
Since this is a client-side application, environment variables are managed directly in `assets/js/config.js`. 

This is safe because:
- The custom API uses a public webhook endpoint.
- Google Sheets uses a public Web App URL.
- Supabase uses the strictly scoped `anon` key, with Row Level Security (RLS) configured to allow only inserts.

**Do not** put any secret admin keys or service role keys into the frontend code.
