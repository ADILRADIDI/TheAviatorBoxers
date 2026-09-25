import { config } from "dotenv";
config({ path: ".env" });

import { createDatabase } from './packages/db/src/index.js';
import { products, colors, productVariants } from './packages/db/src/schema.js';

async function main() {
  const { db, pool } = createDatabase(process.env.DATABASE_URL);

  const prods = await db.select().from(products);
  console.log('Products:', prods.map(p => ({ name: p.name, slug: p.slug, price: p.price, colorName: p.colorName, sizes: p.sizes })));

  const cols = await db.select().from(colors);
  console.log('Colors:', cols.map(c => ({ name: c.name, hex: c.hex })));

  const variants = await db.select().from(productVariants);
  console.log('Variants count:', variants.length);
  const packVariants = variants.filter(v => v.sku?.includes('PACK'));
  console.log('Pack variants:', packVariants.map(v => ({ sku: v.sku, color: v.color, size: v.size, stock: v.stock })));

  await pool.end();
}
main();
