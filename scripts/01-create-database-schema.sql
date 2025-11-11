-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stores Shopify shop information
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  scope TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stores file delivery configurations
CREATE TABLE delivery_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_key TEXT NOT NULL,
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('email', 'download')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(shop_id, product_id)
);

-- Stores uploaded files
CREATE TABLE uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_key TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stores order data and delivery history
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  shopify_order_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  product_ids TEXT[] NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed')),
  delivery_method TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  UNIQUE(shop_id, shopify_order_id)
);

-- Stores email notifications sent
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'bounced', 'complained'))
);

-- Create indexes for common queries
CREATE INDEX idx_delivery_configs_shop_id ON delivery_configs(shop_id);
CREATE INDEX idx_uploaded_files_shop_id ON uploaded_files(shop_id);
CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_orders_status ON orders(delivery_status);
CREATE INDEX idx_email_logs_order_id ON email_logs(order_id);
