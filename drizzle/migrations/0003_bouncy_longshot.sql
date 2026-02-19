CREATE TABLE `discount_code_uses` (
	`id` text PRIMARY KEY NOT NULL,
	`code_id` text NOT NULL,
	`customer_email` text NOT NULL,
	`order_id` text NOT NULL,
	`used_at` text NOT NULL,
	FOREIGN KEY (`code_id`) REFERENCES `discount_codes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `discount_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`type` text NOT NULL,
	`value` integer NOT NULL,
	`max_uses` integer,
	`used_count` integer DEFAULT 0 NOT NULL,
	`per_customer_limit` integer DEFAULT 1 NOT NULL,
	`expires_at` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `discount_codes_code_unique` ON `discount_codes` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_discount_codes_code` ON `discount_codes` (`code`);--> statement-breakpoint
ALTER TABLE `orders` ADD `discount_code` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `discount_amount` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `stock` integer;