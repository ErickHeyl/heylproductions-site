CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  date_label TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  -- Which service a post is "about". Drives the category filter on /blog and
  -- the "Related" link on each post. 'general' posts aren't tied to one service.
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('weddings', 'business', 'events', 'general')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
