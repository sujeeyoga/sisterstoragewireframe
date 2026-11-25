import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { refreshCartPrices } from './cartCatalog';

test('saved $24 cart refreshes to $30 while preserving three boxes and sleeve choice', () => {
  const result = refreshCartPrices([{ id: '25814004', name: 'Large Bangle Box', price: 24,
    regularPrice: 30, salePrice: 24, image: '', quantity: 3, sleeve: 'Pink' }],
    [{ id: 25814004, slug: 'large-bangle-box', name: 'Large Bangle Box', price: 30,
      regular_price: 30, sale_price: null }]);
  assert.equal(result[0].price, 30);
  assert.equal(result[0].price * result[0].quantity, 90);
  assert.equal(result[0].salePrice, undefined);
  assert.equal(result[0].quantity, 3);
  assert.equal(result[0].sleeve, 'Pink');
});

test('unresolved products remain in the cart for the shopper to remove', () => {
  const item = { id: 'missing', name: 'Unavailable box', price: 30, image: '', quantity: 1 };
  assert.deepEqual(refreshCartPrices([item], []), [item]);
});