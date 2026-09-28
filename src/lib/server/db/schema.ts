import { pgTable, serial, text, varchar, integer, date, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(true),
	image: text("image"),
	username: text("username").unique(),
	displayUsername: text("display_username"),
	role: text("role", { enum: ["admin_owner", "kasir"] }).notNull().default("kasir"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id),
	token: text("token").notNull().unique(),
	expiresAt: timestamp("expires_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	password: text("password"),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at"),
});

export const discountTypeEnum = pgEnum("discount_type", ["percent", "nominal"]);

export const products = pgTable("products", {
	id: serial("id").primaryKey(),
	code: varchar("code", { length: 20 }).notNull().unique(),
	name: varchar("name", { length: 100 }).notNull(),
	brand: varchar("brand", { length: 50 }),
	size: varchar("size", { length: 10 }),
	buyPrice: integer("buy_price").notNull(),
	sellPrice: integer("sell_price").notNull(),
	barcode: varchar("barcode", { length: 50 }).unique(),
});

export const stockEntries = pgTable("stock_entries", {
	id: serial("id").primaryKey(),
	productId: integer("product_id").notNull().references(() => products.id),
	quantityIn: integer("quantity_in").notNull(),
	quantityRemaining: integer("quantity_remaining").notNull(),
	entryDate: date("entry_date").notNull(),
	createdBy: text("created_by").notNull().references(() => user.id),
	createdAt: timestamp("created_at").defaultNow(),
});

export const vouchers = pgTable("vouchers", {
	id: serial("id").primaryKey(),
	code: varchar("code", { length: 20 }).notNull().unique(),
	discountType: discountTypeEnum("discount_type").notNull(),
	discountValue: integer("discount_value").notNull(),
	minPurchase: integer("min_purchase").default(0),
	validFrom: date("valid_from"),
	validUntil: date("valid_until"),
});

export const voucherProducts = pgTable("voucher_products", {
	id: serial("id").primaryKey(),
	voucherId: integer("voucher_id").notNull().references(() => vouchers.id),
	productId: integer("product_id").notNull().references(() => products.id),
});

export const sales = pgTable("sales", {
	id: serial("id").primaryKey(),
	transactionCode: varchar("transaction_code", { length: 30 }).notNull(),
	productId: integer("product_id").notNull().references(() => products.id),
	quantitySold: integer("quantity_sold").notNull(),
	unitPrice: integer("unit_price").notNull(),
	voucherId: integer("voucher_id").references(() => vouchers.id),
	discountAmount: integer("discount_amount").default(0),
	totalPaid: integer("total_paid").notNull(),
	cashierId: text("cashier_id").notNull().references(() => user.id),
	soldAt: timestamp("sold_at").defaultNow(),
});

export const saleAllocations = pgTable("sale_allocations", {
	id: serial("id").primaryKey(),
	saleId: integer("sale_id").notNull().references(() => sales.id),
	stockEntryId: integer("stock_entry_id").notNull().references(() => stockEntries.id),
	quantityTaken: integer("quantity_taken").notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	stockEntries: many(stockEntries),
	sales: many(sales),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const productsRelations = relations(products, ({ many }) => ({
	stockEntries: many(stockEntries),
	sales: many(sales),
	voucherRestrictions: many(voucherProducts),
}));

export const stockEntriesRelations = relations(stockEntries, ({ one, many }) => ({
	product: one(products, { fields: [stockEntries.productId], references: [products.id] }),
	creator: one(user, { fields: [stockEntries.createdBy], references: [user.id] }),
	allocations: many(saleAllocations),
}));

export const vouchersRelations = relations(vouchers, ({ many }) => ({
	sales: many(sales),
	productRestrictions: many(voucherProducts),
}));

export const voucherProductsRelations = relations(voucherProducts, ({ one }) => ({
	voucher: one(vouchers, { fields: [voucherProducts.voucherId], references: [vouchers.id] }),
	product: one(products, { fields: [voucherProducts.productId], references: [products.id] }),
}));

export const salesRelations = relations(sales, ({ one, many }) => ({
	product: one(products, { fields: [sales.productId], references: [products.id] }),
	voucher: one(vouchers, { fields: [sales.voucherId], references: [vouchers.id] }),
	cashier: one(user, { fields: [sales.cashierId], references: [user.id] }),
	allocations: many(saleAllocations),
}));

export const saleAllocationsRelations = relations(saleAllocations, ({ one }) => ({
	sale: one(sales, { fields: [saleAllocations.saleId], references: [sales.id] }),
	stockEntry: one(stockEntries, { fields: [saleAllocations.stockEntryId], references: [stockEntries.id] }),
}));
