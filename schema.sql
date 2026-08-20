-- Run this against your Postgres database to create and seed the catalog.
-- On Cloudways, open the Database Manager (or use psql) and run this whole file.
--
--   psql "$DATABASE_URL" -f schema.sql

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  category    TEXT NOT NULL,
  in_stock    BOOLEAN NOT NULL DEFAULT true,
  image_url   TEXT NOT NULL DEFAULT ''
);

-- If the table already existed without the image column, add it:
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT '';

INSERT INTO products (name, description, price, category, in_stock, image_url) VALUES
  ('Aurora Wireless Headphones', 'Active noise cancelling, 40h battery.', 189.00, 'Audio', true, '/products/aurora-headphones.svg'),
  ('Nimbus Mechanical Keyboard', 'Hot-swappable switches, aluminum frame.', 145.00, 'Desk', true, '/products/nimbus-keyboard.svg'),
  ('Lumen 4K Monitor 27"', 'Factory-calibrated IPS panel, USB-C 90W.', 429.00, 'Displays', true, '/products/lumen-monitor.svg'),
  ('Drift Ergonomic Mouse', 'Vertical grip, silent clicks, 6 buttons.', 59.00, 'Desk', false, '/products/drift-mouse.svg'),
  ('Halo Desk Lamp', 'Dimmable warm-to-cool, wireless charging base.', 78.00, 'Desk', true, '/products/halo-lamp.svg'),
  ('Cobalt USB-C Dock', '11-in-1 hub, dual 4K output, GbE.', 112.00, 'Accessories', true, '/products/cobalt-dock.svg')
ON CONFLICT DO NOTHING;
