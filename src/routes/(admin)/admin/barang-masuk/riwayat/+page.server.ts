import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/index.js';
import { stockEntries, products, user } from '$lib/server/db/schema.js';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const history = await db
		.select({
			id: stockEntries.id,
			productCode: products.code,
			productName: products.name,
			quantityIn: stockEntries.quantityIn,
			quantityRemaining: stockEntries.quantityRemaining,
			entryDate: stockEntries.entryDate,
			creatorName: user.name
		})
		.from(stockEntries)
		.innerJoin(products, eq(stockEntries.productId, products.id))
		.innerJoin(user, eq(stockEntries.createdBy, user.id))
		.orderBy(desc(stockEntries.entryDate), desc(stockEntries.id));

	return { history };
};
