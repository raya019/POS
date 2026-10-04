import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import * as schema from './schema.js';

// Menghindari virtual module SvelteKit ($env) saat dijalankan lewat CLI murni
const dbUrl = process.env.DATABASE_URL;
const authSecret = process.env.BETTER_AUTH_SECRET || 'secret';
const origin = process.env.ORIGIN || 'http://localhost:5173';

if (!dbUrl) throw new Error('DATABASE_URL must be set in environment');

const client = postgres(dbUrl);
const db = drizzle(client, { schema });

const auth = betterAuth({
	baseURL: origin,
	secret: authSecret,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true, requireEmailVerification: false },
	plugins: [username()],
	user: {
		additionalFields: {
			role: { type: 'string', required: true, defaultValue: 'kasir', input: false }
		}
	}
});

async function main() {
	console.log('Seeding first admin account...');
	try {
		await db.delete(schema.saleAllocations);
		await db.delete(schema.sales);
		await db.delete(schema.stockEntries);
		await db.delete(schema.voucherProducts);
		await db.delete(schema.vouchers);
		await db.delete(schema.products);
		await db.delete(schema.session);
		await db.delete(schema.account);
		await db.delete(schema.user);

		const res = await auth.api.signUpEmail({
			body: {
				email: 'admin@toko.local',
				username: 'admin',
				name: 'Admin Owner',
				password: 'password123'
			}
		});

		if (res?.user?.id) {
			await db
				.update(schema.user)
				.set({ role: 'admin_owner' })
				.where(eq(schema.user.id, res.user.id));
			console.log('✅ Admin account created successfully.');
			console.log('Username: admin');
			console.log('Password: password123');
		} else {
			console.error('Failed to create admin account.');
		}

		console.log('Membuat daftar produk untuk 3 Merek (Rabbani, Zoya, Elzatta)...');

		const productTemplates = [
			// Merek 1: Rabbani
			{
				code: 'RAB-001',
				name: "Gamis Syar'i Khadijah",
				brand: 'Rabbani',
				size: 'L',
				buyPrice: 150000,
				sellPrice: 200000
			}, // <-- Bintang Demo
			{
				code: 'RAB-002',
				name: 'Tunik Casual Aisyah',
				brand: 'Rabbani',
				size: 'M',
				buyPrice: 120000,
				sellPrice: 160000
			},
			{
				code: 'RAB-003',
				name: 'Hijab Instan Amira',
				brand: 'Rabbani',
				size: 'All Size',
				buyPrice: 45000,
				sellPrice: 65000
			},
			{
				code: 'RAB-004',
				name: 'Pashmina Ceruty Babydoll',
				brand: 'Rabbani',
				size: '175x75',
				buyPrice: 35000,
				sellPrice: 55000
			},
			{
				code: 'RAB-005',
				name: 'Mukena Dewasa Katun',
				brand: 'Rabbani',
				size: 'All Size',
				buyPrice: 180000,
				sellPrice: 250000
			},

			// Merek 2: Zoya
			{
				code: 'ZOY-001',
				name: 'Bergo Maryam Premium',
				brand: 'Zoya',
				size: 'L',
				buyPrice: 50000,
				sellPrice: 75000
			},
			{
				code: 'ZOY-002',
				name: 'Gamis Pesta Sabrina',
				brand: 'Zoya',
				size: 'XL',
				buyPrice: 220000,
				sellPrice: 300000
			},
			{
				code: 'ZOY-003',
				name: 'Blouse Muslimah Keisha',
				brand: 'Zoya',
				size: 'M',
				buyPrice: 110000,
				sellPrice: 150000
			},
			{
				code: 'ZOY-004',
				name: 'Rok Plisket Premium',
				brand: 'Zoya',
				size: 'All Size',
				buyPrice: 70000,
				sellPrice: 95000
			},
			{
				code: 'ZOY-005',
				name: 'Cardigan Rajut Panjang',
				brand: 'Zoya',
				size: 'L',
				buyPrice: 85000,
				sellPrice: 120000
			},

			// Merek 3: Elzatta
			{
				code: 'ELZ-001',
				name: 'Scarf Motif Zahrani',
				brand: 'Elzatta',
				size: '115x115',
				buyPrice: 60000,
				sellPrice: 89000
			},
			{
				code: 'ELZ-002',
				name: 'Tunik Asimetris',
				brand: 'Elzatta',
				size: 'L',
				buyPrice: 140000,
				sellPrice: 185000
			},
			{
				code: 'ELZ-003',
				name: 'Gamis Daily Jersey',
				brand: 'Elzatta',
				size: 'M',
				buyPrice: 130000,
				sellPrice: 175000
			},
			{
				code: 'ELZ-004',
				name: 'Manset Baju Spandex',
				brand: 'Elzatta',
				size: 'All Size',
				buyPrice: 25000,
				sellPrice: 40000
			},
			{
				code: 'ELZ-005',
				name: 'Hijab Segi Empat Voal',
				brand: 'Elzatta',
				size: '110x110',
				buyPrice: 40000,
				sellPrice: 60000
			}
		];

		const insertedProducts = await db.insert(schema.products).values(productTemplates).returning();

		console.log('Produk berhasil dibuat!');
		console.log('Menyiapkan simulasi FIFO...');

		const demoProduct = insertedProducts.find((p) => p.code === 'RAB-001')!;

		console.log('demo product', demoProduct);

		// Batch dates
		const dateOld = new Date();
		dateOld.setDate(dateOld.getDate() - 10);
		const dateMid = new Date();
		dateMid.setDate(dateMid.getDate() - 5);
		const dateNew = new Date();
		dateNew.setDate(dateNew.getDate() - 2);

		const stockEntriesData: {
			productId: number;
			quantityIn: number;
			quantityRemaining: number;
			entryDate: string;
			createdBy: string;
		}[] = [];

		// 1. Masukkan stok spesifik untuk barang DEMO (RAB-001) agar mudah ditunjukkan FIFO-nya
		stockEntriesData.push(
			{
				productId: demoProduct.id,
				quantityIn: 10,
				quantityRemaining: 10,
				entryDate: dateOld.toISOString(),
				createdBy: res.user.id
			},
			{
				productId: demoProduct.id,
				quantityIn: 20,
				quantityRemaining: 20,
				entryDate: dateMid.toISOString(),
				createdBy: res.user.id
			},
			{
				productId: demoProduct.id,
				quantityIn: 15,
				quantityRemaining: 15,
				entryDate: dateNew.toISOString(),
				createdBy: res.user.id
			}
		);

		// 2. Masukkan stok acak untuk 14 produk lainnya (agar aplikasi terlihat hidup/nyata saat presentasi)
		for (const prod of insertedProducts) {
			if (prod.code === 'RAB-001') continue;
			stockEntriesData.push({
				productId: prod.id,
				quantityIn: 15,
				quantityRemaining: 15,
				entryDate: dateMid.toISOString(),
				createdBy: res.user.id
			});
		}

		await db.insert(schema.stockEntries).values(stockEntriesData);

		console.log('Menyiapkan simulasi Voucher...');
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 30); // Berakhir 30 hari dari sekarang
		const futureDateStr = futureDate.toISOString().split('T')[0];

		// 1. Voucher Nominal (Berlaku untuk semua)
		const [voucherNominal] = await db.insert(schema.vouchers).values({
			code: 'HEMAT10K',
			discountType: 'nominal',
			discountValue: 10000,
			minPurchase: 50000,
			validUntil: futureDateStr
		}).returning();

		// 2. Voucher Persentase (Berlaku untuk semua)
		const [voucherPercent] = await db.insert(schema.vouchers).values({
			code: 'DISKON20',
			discountType: 'percent',
			discountValue: 20,
			minPurchase: 100000,
			validUntil: futureDateStr
		}).returning();

		// 3. Voucher Khusus Produk Tertentu
		const [voucherSpesifik] = await db.insert(schema.vouchers).values({
			code: 'PROMORAB',
			discountType: 'nominal',
			discountValue: 50000,
			minPurchase: 150000,
			validUntil: futureDateStr
		}).returning();

		// Mengaitkan Voucher 'PROMORAB' khusus ke 2 produk pertama dari Merek Rabbani
		const rabbaniProducts = insertedProducts.filter(p => p.brand === 'Rabbani').slice(0, 2);
		if (rabbaniProducts.length > 0) {
			const vpData = rabbaniProducts.map(p => ({
				voucherId: voucherSpesifik.id,
				productId: p.id
			}));
			await db.insert(schema.voucherProducts).values(vpData);
		}

		console.log('? Seed Toko Baju Muslimah Siap (Termasuk Data Voucher)!');
		console.log('--------------------------------------------------');
		console.log("Barang Bintang Demo: Gamis Syar'i Khadijah (RAB-001)");
		console.log('Total Stok: 45 pcs');
		console.log('Rincian Batch:');
		console.log(`- Terlama : 10 pcs (${dateOld.toISOString().split('T')[0]})`);
		console.log(`- Tengah  : 20 pcs (${dateMid.toISOString().split('T')[0]})`);
		console.log(`- Baru    : 15 pcs (${dateNew.toISOString().split('T')[0]})`);
		console.log('--------------------------------------------------');
	} catch (error) {
		console.error('Error during seeding:', error);
	}
	process.exit(0);
}

main();
