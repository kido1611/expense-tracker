CREATE TABLE `wallet_transfers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_wallet_id` integer NOT NULL,
	`source_transaction_id` integer NOT NULL,
	`target_wallet_id` integer NOT NULL,
	`target_transaction_id` integer NOT NULL,
	`fee_transaction_id` integer,
	FOREIGN KEY (`source_wallet_id`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_wallet_id`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fee_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE no action
);
