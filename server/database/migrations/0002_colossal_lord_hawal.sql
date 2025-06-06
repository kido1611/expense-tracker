CREATE TABLE `budget_transactions` (
	`transaction_id` text NOT NULL,
	`budget_id` text NOT NULL,
	PRIMARY KEY(`transaction_id`, `budget_id`)
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_wallet_transfers` (
	`source_transaction_id` text NOT NULL,
	`destination_transaction_id` text NOT NULL,
	`fee_transaction_id` text,
	PRIMARY KEY(`source_transaction_id`, `destination_transaction_id`),
	FOREIGN KEY (`source_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`destination_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`fee_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_wallet_transfers`("source_transaction_id", "destination_transaction_id", "fee_transaction_id") SELECT "source_transaction_id", "destination_transaction_id", "fee_transaction_id" FROM `wallet_transfers`;--> statement-breakpoint
DROP TABLE `wallet_transfers`;--> statement-breakpoint
ALTER TABLE `__new_wallet_transfers` RENAME TO `wallet_transfers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `budgets` ADD `type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `wallets` DROP COLUMN `balance`;--> statement-breakpoint
ALTER TABLE `wallets` DROP COLUMN `sort_order`;