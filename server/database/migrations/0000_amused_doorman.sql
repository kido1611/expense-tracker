CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`key` text,
	`name` text NOT NULL,
	`is_expense` integer DEFAULT false,
	`icon` text,
	`sort_order` integer DEFAULT 1,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`wallet_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	`nanoid` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`real_amount` integer DEFAULT 0 NOT NULL,
	`image_path` text,
	`note` text,
	`is_visible_in_report` integer DEFAULT true,
	`spend_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_nanoid_unique` ON `transactions` (`nanoid`);--> statement-breakpoint
CREATE INDEX `transactions_nanoid_idx` ON `transactions` (`nanoid`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_uuid_unique` ON `users` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_uuid_idx` ON `users` (`uuid`);--> statement-breakpoint
CREATE TABLE `wallet_transfers` (
	`source_transaction_id` integer NOT NULL,
	`target_transaction_id` integer NOT NULL,
	`fee_transaction_id` integer,
	PRIMARY KEY(`source_transaction_id`, `target_transaction_id`),
	FOREIGN KEY (`source_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`fee_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`nanoid` text NOT NULL,
	`name` text NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL,
	`icon` text,
	`sort_order` integer DEFAULT 1,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wallets_nanoid_unique` ON `wallets` (`nanoid`);--> statement-breakpoint
CREATE INDEX `wallets_nanoid_idx` ON `wallets` (`nanoid`);--> statement-breakpoint
CREATE INDEX `wallets_user_id_idx` ON `wallets` (`user_id`);--> statement-breakpoint
CREATE INDEX `wallets_name_idx` ON `wallets` (`name`);