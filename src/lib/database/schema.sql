-- ====================================================
-- LUMORA AI - Database Schema
-- ====================================================
-- MySQL Database Structure
-- Run this file to create all required tables
-- ====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ====================================================
-- USERS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(500) DEFAULT NULL,
  `role` ENUM('user', 'admin', 'moderator') DEFAULT 'user',
  `status` ENUM('active', 'inactive', 'banned', 'pending') DEFAULT 'pending',
  `email_verified` BOOLEAN DEFAULT FALSE,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `verification_token` VARCHAR(255) DEFAULT NULL,
  `reset_token` VARCHAR(255) DEFAULT NULL,
  `reset_token_expires` TIMESTAMP NULL DEFAULT NULL,
  `last_login` TIMESTAMP NULL DEFAULT NULL,
  `login_attempts` INT DEFAULT 0,
  `locked_until` TIMESTAMP NULL DEFAULT NULL,
  `preferences` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- USER SESSIONS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `token` VARCHAR(500) NOT NULL,
  `refresh_token` VARCHAR(500) DEFAULT NULL,
  `device_info` VARCHAR(500) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `last_active` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_sessions` (`user_id`),
  INDEX `idx_token` (`token`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- CONVERSATIONS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(500) DEFAULT 'New Chat',
  `model` VARCHAR(100) DEFAULT 'gemini-1.5-flash',
  `provider` VARCHAR(50) DEFAULT 'gemini',
  `status` ENUM('active', 'archived', 'deleted') DEFAULT 'active',
  `pinned` BOOLEAN DEFAULT FALSE,
  `shared` BOOLEAN DEFAULT FALSE,
  `share_id` VARCHAR(36) DEFAULT NULL,
  `message_count` INT DEFAULT 0,
  `total_tokens` INT DEFAULT 0,
  `last_message_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_conversations` (`user_id`, `status`),
  INDEX `idx_share_id` (`share_id`),
  INDEX `idx_pinned` (`pinned`),
  INDEX `idx_last_message` (`last_message_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- MESSAGES TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `messages` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `conversation_id` VARCHAR(36) NOT NULL,
  `role` ENUM('user', 'assistant', 'system') NOT NULL,
  `content` LONGTEXT NOT NULL,
  `tokens_used` INT DEFAULT 0,
  `model` VARCHAR(100) DEFAULT NULL,
  `metadata` JSON DEFAULT NULL,
  `edited` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  INDEX `idx_conversation_messages` (`conversation_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- SUBSCRIPTION PLANS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `subscription_plans` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `features` JSON DEFAULT NULL,
  `price_monthly` DECIMAL(10,2) DEFAULT 0.00,
  `price_yearly` DECIMAL(10,2) DEFAULT 0.00,
  `messages_per_day` INT DEFAULT 50,
  `max_tokens` INT DEFAULT 2048,
  `image_generation` BOOLEAN DEFAULT FALSE,
  `image_credits` INT DEFAULT 0,
  `allowed_models` JSON DEFAULT NULL,
  `trial_days` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- USER SUBSCRIPTIONS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `user_subscriptions` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `plan_id` VARCHAR(36) NOT NULL,
  `status` ENUM('active', 'cancelled', 'expired', 'past_due', 'trialing') DEFAULT 'active',
  `payment_gateway` VARCHAR(50) DEFAULT NULL,
  `gateway_subscription_id` VARCHAR(255) DEFAULT NULL,
  `gateway_customer_id` VARCHAR(255) DEFAULT NULL,
  `billing_cycle` ENUM('monthly', 'yearly') DEFAULT 'monthly',
  `current_period_start` TIMESTAMP NULL DEFAULT NULL,
  `current_period_end` TIMESTAMP NULL DEFAULT NULL,
  `trial_ends_at` TIMESTAMP NULL DEFAULT NULL,
  `cancelled_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans`(`id`),
  INDEX `idx_user_subscription` (`user_id`, `status`),
  INDEX `idx_gateway` (`payment_gateway`, `gateway_subscription_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- PAYMENTS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `subscription_id` VARCHAR(36) DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(3) DEFAULT 'USD',
  `status` ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  `payment_gateway` VARCHAR(50) NOT NULL,
  `gateway_payment_id` VARCHAR(255) DEFAULT NULL,
  `gateway_response` JSON DEFAULT NULL,
  `invoice_number` VARCHAR(100) DEFAULT NULL,
  `description` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_payments` (`user_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_gateway_payment` (`payment_gateway`, `gateway_payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- AI PROVIDERS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `ai_providers` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `api_key_encrypted` TEXT DEFAULT NULL,
  `models` JSON DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `settings` JSON DEFAULT NULL,
  `usage_count` BIGINT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- USAGE TRACKING TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `usage_logs` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `type` ENUM('message', 'image', 'api_call') NOT NULL,
  `provider` VARCHAR(50) DEFAULT NULL,
  `model` VARCHAR(100) DEFAULT NULL,
  `tokens_input` INT DEFAULT 0,
  `tokens_output` INT DEFAULT 0,
  `cost` DECIMAL(10,6) DEFAULT 0.000000,
  `metadata` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_usage` (`user_id`, `created_at`),
  INDEX `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- COUPONS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `type` ENUM('percentage', 'fixed') NOT NULL,
  `value` DECIMAL(10,2) NOT NULL,
  `max_uses` INT DEFAULT NULL,
  `used_count` INT DEFAULT 0,
  `min_amount` DECIMAL(10,2) DEFAULT 0.00,
  `valid_from` TIMESTAMP NULL DEFAULT NULL,
  `valid_until` TIMESTAMP NULL DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_code` (`code`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- SUPPORT TICKETS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `subject` VARCHAR(500) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `category` VARCHAR(100) DEFAULT 'general',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_tickets` (`user_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TICKET REPLIES TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `ticket_replies` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `ticket_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `message` TEXT NOT NULL,
  `is_admin` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- ANNOUNCEMENTS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `content` TEXT NOT NULL,
  `type` ENUM('info', 'warning', 'success', 'error') DEFAULT 'info',
  `is_active` BOOLEAN DEFAULT TRUE,
  `starts_at` TIMESTAMP NULL DEFAULT NULL,
  `ends_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- SITE SETTINGS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `key_name` VARCHAR(255) NOT NULL UNIQUE,
  `value` LONGTEXT DEFAULT NULL,
  `group_name` VARCHAR(100) DEFAULT 'general',
  `type` ENUM('text', 'number', 'boolean', 'json', 'html') DEFAULT 'text',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_key` (`key_name`),
  INDEX `idx_group` (`group_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- BLOG POSTS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) NOT NULL UNIQUE,
  `excerpt` TEXT DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `featured_image` VARCHAR(500) DEFAULT NULL,
  `author_id` VARCHAR(36) NOT NULL,
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `meta_title` VARCHAR(500) DEFAULT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `views` INT DEFAULT 0,
  `published_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- IMAGE GENERATIONS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `image_generations` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `prompt` TEXT NOT NULL,
  `image_url` VARCHAR(1000) DEFAULT NULL,
  `provider` VARCHAR(50) DEFAULT NULL,
  `model` VARCHAR(100) DEFAULT NULL,
  `settings` JSON DEFAULT NULL,
  `status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_images` (`user_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- SAVED PROMPTS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `saved_prompts` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `category` VARCHAR(100) DEFAULT 'general',
  `is_public` BOOLEAN DEFAULT FALSE,
  `usage_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_prompts` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- NOTIFICATIONS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'info',
  `read_at` TIMESTAMP NULL DEFAULT NULL,
  `action_url` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_notifications` (`user_id`, `read_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- LICENSE ACTIVATIONS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `license_activations` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `purchase_code` VARCHAR(255) NOT NULL,
  `buyer_name` VARCHAR(255) DEFAULT NULL,
  `buyer_email` VARCHAR(255) DEFAULT NULL,
  `domain` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `status` ENUM('active', 'deactivated', 'expired') DEFAULT 'active',
  `activated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `verified_at` TIMESTAMP NULL DEFAULT NULL,
  `metadata` JSON DEFAULT NULL,
  INDEX `idx_purchase_code` (`purchase_code`),
  INDEX `idx_domain` (`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- SYSTEM LOGS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS `system_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `level` ENUM('info', 'warning', 'error', 'critical') DEFAULT 'info',
  `message` TEXT NOT NULL,
  `context` JSON DEFAULT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_level` (`level`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- DEFAULT DATA INSERTS
-- ====================================================

-- Default subscription plans
INSERT INTO `subscription_plans` (`id`, `name`, `slug`, `description`, `price_monthly`, `price_yearly`, `messages_per_day`, `max_tokens`, `image_generation`, `image_credits`, `allowed_models`, `sort_order`) VALUES
('plan-free', 'Free', 'free', 'Get started with basic AI chat', 0.00, 0.00, 50, 2048, FALSE, 0, '["gemini-1.5-flash"]', 1),
('plan-pro', 'Pro', 'pro', 'Unlock all models and features', 19.00, 190.00, 500, 4096, TRUE, 50, '["all"]', 2),
('plan-enterprise', 'Enterprise', 'enterprise', 'Unlimited access for teams', 49.00, 490.00, -1, 8192, TRUE, 500, '["all"]', 3);

-- Default AI providers
INSERT INTO `ai_providers` (`id`, `name`, `slug`, `models`, `is_active`) VALUES
('provider-gemini', 'Google Gemini', 'gemini', '["gemini-pro", "gemini-1.5-pro", "gemini-1.5-flash"]', TRUE),
('provider-openai', 'OpenAI', 'openai', '["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"]', TRUE),
('provider-claude', 'Anthropic Claude', 'claude', '["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"]', TRUE),
('provider-grok', 'xAI Grok', 'grok', '["grok-2", "grok-2-mini"]', TRUE);

-- Default site settings
INSERT INTO `site_settings` (`key_name`, `value`, `group_name`, `type`) VALUES
('site_name', 'Lumora AI', 'general', 'text'),
('site_description', 'Next-generation AI chat platform', 'general', 'text'),
('maintenance_mode', 'false', 'general', 'boolean'),
('registration_enabled', 'true', 'general', 'boolean'),
('default_theme', 'dark', 'appearance', 'text'),
('primary_color', '#6366f1', 'appearance', 'text'),
('hero_title', 'Experience the Future of AI Conversation', 'landing', 'text'),
('hero_subtitle', 'Powered by the world''s most advanced AI models', 'landing', 'text'),
('show_testimonials', 'true', 'landing', 'boolean'),
('show_blog', 'true', 'landing', 'boolean');

SET FOREIGN_KEY_CHECKS = 1;
