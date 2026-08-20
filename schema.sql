-- Run this against your Postgres database to create and seed the catalog.
-- Example:  psql "$DATABASE_URL" -f schema.sql

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  category    TEXT NOT NULL,
  in_stock    BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO products (name, description, price, category, in_stock) VALUES
  ('Aurora Wireless Headphones', 'Active noise cancelling, 40h battery.', 189.00, 'Audio', true),
  ('Nimbus Mechanical Keyboard', 'Hot-swappable switches, aluminum frame.', 145.00, 'Desk', true),
  ('Lumen 4K Monitor 27"', 'Factory-calibrated IPS panel, USB-C 90W.', 429.00, 'Displays', true),
  ('Drift Ergonomic Mouse', 'Vertical grip, silent clicks, 6 buttons.', 59.00, 'Desk', false),
  ('Halo Desk Lamp', 'Dimmable warm-to-cool, wireless charging base.', 78.00, 'Desk', true),
  ('Cobalt USB-C Dock', '11-in-1 hub, dual 4K output, GbE.', 112.00, 'Accessories', true)
ON CONFLICT DO NOTHING;
