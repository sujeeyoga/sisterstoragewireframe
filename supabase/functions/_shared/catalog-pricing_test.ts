import { strict as assert } from 'node:assert';
import { resolveCatalogItem, discountedCatalogPrice, validateGiftItems } from './catalog-pricing.ts';

const large = { id: 25814004, slug: 'large-bangle-box', name: 'Large Bangle Box', price: 30,
  regular_price: 30, sale_price: null, visible: true, in_stock: true };

Deno.test('October $24 cart resolves to $30 each and $90 for three', () => {
  const item = resolveCatalogItem({ id: '25814004', price: 24, salePrice: 24,
    regularPrice: 30, quantity: 3 }, [large]);
  assert.equal(item.price, 30);
  assert.equal(item.salePrice, undefined);
  assert.equal(discountedCatalogPrice(item, null, 0) * item.quantity, 90);
});

Deno.test('tampered zero and one-cent prices cannot override $30', () => {
  for (const price of [0, 0.01]) {
    assert.equal(resolveCatalogItem({ id: large.slug, price, quantity: 1 }, [large]).price, 30);
  }
});

Deno.test('missing products and malformed identifiers fail closed', () => {
  assert.throws(() => resolveCatalogItem({ id: 'missing', quantity: 1 }, [large]));
  assert.throws(() => resolveCatalogItem({ id: null, quantity: 1 }, [large]));
  assert.throws(() => resolveCatalogItem({ id: '25814004garbage', quantity: 1 }, [large]));
});

Deno.test('missing or invalid catalog prices fail closed', () => {
  for (const price of [null, '', 'NaN', -1]) {
    assert.throws(() => resolveCatalogItem({ id: large.id, quantity: 1 }, [{ ...large, price }]));
  }
});

Deno.test('fractional, negative and zero quantities cannot create a checkout', () => {
  for (const quantity of [0, -1, 1.5]) {
    assert.throws(() => resolveCatalogItem({ id: large.id, quantity }, [large]));
  }
});

Deno.test('flash sale wins over sale price and store-wide; sale does not stack', () => {
  const saleItem = resolveCatalogItem({ id: large.id, quantity: 1 },
    [{ ...large, price: 24, sale_price: 24 }]);
  assert.equal(discountedCatalogPrice(saleItem, { discount_type: 'percentage', discount_value: 10 }, 20), 21.6);
  assert.equal(discountedCatalogPrice(saleItem, null, 20), 24);
  assert.equal(discountedCatalogPrice(resolveCatalogItem({ id: large.id, quantity: 1 }, [large]), null, 20), 24);
});

Deno.test('a client cannot make a Large Bangle Box free by setting isFreeGift', () => {
  assert.throws(() => validateGiftItems([{ id: large.id, quantity: 1, isFreeGift: true }], null, 'CA', 90));
  const promotion = { enabled: true, setting_value: { gift_product_id: 25814005,
    min_order_amount: 100, countries: ['US'] } };
  assert.throws(() => validateGiftItems([{ id: large.id, quantity: 1, isFreeGift: true }], promotion, 'US', 120));
  assert.doesNotThrow(() => validateGiftItems([{ id: 25814005, quantity: 1, isFreeGift: true }], promotion, 'US', 120));
});