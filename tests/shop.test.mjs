import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createStores,addCartItem,cartTotals,placeDemoOrder,formatMoney} from '../lib/shop.mjs';
const data=JSON.parse(readFileSync(new URL('../lib/catalog-data.json',import.meta.url),'utf8'));
test('cada país tiene catálogo y referencias independientes',()=>{
 const stores=createStores(data);stores.PA.products[0].price=999;
 assert.equal(stores.NI.products[0].price,1590);
 assert.notEqual(stores.PA.products.length,stores.NI.products.length);
 assert.equal(stores.PA.products.find(p=>p.id===3)?.name,'Jersey Half Zip');
 assert.equal(stores.NI.products.find(p=>p.id===3),undefined);
});
test('carrito conserva talla y no modifica otras tiendas',()=>{
 const stores=createStores(data),next=addCartItem(stores.PA,1,'S',2);
 assert.equal(next.cart[0].size,'S');assert.equal(next.cart[0].qty,2);
 assert.equal(stores.PA.cart.length,0);assert.equal(stores.NI.cart.length,0);
 assert.equal(cartTotals(next,data.markets.PA).total,90);
 assert.throws(()=>addCartItem(next,1,'XXL',1));
});
test('cantidades y stock se validan incluso entre tallas',()=>{
 let st=createStores(data).PA;st.products[0].stock=3;st=addCartItem(st,1,'S',2);
 assert.throws(()=>addCartItem(st,1,'M',2));
 assert.throws(()=>addCartItem(st,1,'M',0));
 assert.throws(()=>addCartItem(st,1,'M',1.5));
});
test('envío y moneda se resuelven según la tienda',()=>{
 let st=createStores(data).NI;st=addCartItem(st,1,'M',1);
 assert.equal(cartTotals(st,data.markets.NI).total,1740);
 assert.match(formatMoney(1590,data.markets.NI),/^C\$/);
 st=addCartItem(st,1,'L',1);assert.equal(cartTotals(st,data.markets.NI).shipping,0);
});
test('pedido simulado identifica país, moneda y talla; descuenta stock',()=>{
 let st=createStores(data).SV;const previousStock=st.products[0].stock;st=addCartItem(st,1,'S',1);
 const result=placeDemoOrder(st,data.markets.SV,'SV','Ana','Demo');
 assert.equal(result.order.country,'SV');assert.equal(result.order.currency,'USD');
 assert.match(result.order.items,/\(S\)/);assert.equal(result.order.total,46);
 assert.equal(result.store.cart.length,0);assert.equal(result.store.products[0].stock,previousStock-1);
 assert.equal(result.store.orders[0].id,'SV-2049');
 assert.throws(()=>placeDemoOrder(result.store,data.markets.SV,'SV','Ana','Demo'));
});
