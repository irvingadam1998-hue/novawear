/** Pure domain helpers. All values are demo prices per market, not exchange rates. */
export function createStores(data) {
  return Object.fromEntries(Object.entries(data.assortments).map(([code, rows]) => {
    const products = rows.map(([id, price, stock, old]) => ({
      ...structuredClone(data.baseProducts.find(p => p.id === id)), price, stock, old,
      tag: old ? 'OFERTA' : 'NUEVA COLECCIÓN',
    }));
    const names = ['María González', 'Carlos Rivera', 'Ana Morales', 'Sofía Castillo', 'Luis Pérez'];
    const orders = products.slice(0, code === 'PA' ? 5 : code === 'NI' ? 3 : 4).map((p, i) => ({
      id: `${code}-${2048-i}`, name: names[i], date: '23 sep, 10:15', total: p.price,
      status: ['Entregado', 'En camino', 'Preparando'][i%3], items: p.name,
      country: code, currency: data.markets[code].currency,
    }));
    return [code, { products, orders, cart: [], favorites: [], nextOrder: 2049 }];
  }));
}
export function formatMoney(amount, market) {
  return market.symbol + new Intl.NumberFormat(market.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}
export function cartTotals(store, market) {
  const subtotal = Math.round(store.cart.reduce((sum, item) => {
    const product = store.products.find(p => p.id === item.id);
    return sum + (product?.price ?? 0) * item.qty;
  }, 0) * 100) / 100;
  const shipping = subtotal === 0 || subtotal >= market.freeShipping ? 0 : market.shipping;
  return { subtotal, shipping, total: Math.round((subtotal+shipping)*100)/100 };
}
export function addCartItem(store, id, size, quantity=1) {
  const product = store.products.find(p => p.id === id);
  if (!product || !product.sizes.includes(size)) throw new Error('Selecciona una prenda y talla disponibles.');
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Cantidad no válida.');
  const stockLimit = Math.min(product.stock, 20);
  const existing = store.cart.find(i => i.id === id && i.size === size);
  const totalForProduct = store.cart.filter(i=>i.id===id).reduce((sum,i)=>sum+i.qty,0);
  if (totalForProduct+quantity > stockLimit) throw new Error('No hay suficiente inventario para esa cantidad.');
  const cart = existing
    ? store.cart.map(i => i===existing ? {...i, qty:i.qty+quantity} : i)
    : [...store.cart, {key:`${id}-${size}`, id, size, color:product.colorLabel, qty:quantity}];
  return {...store, cart};
}
export function placeDemoOrder(store, market, code, first, last) {
  if (!store.cart.length) throw new Error('El carrito está vacío.');
  for (const p of store.products) {
    if (store.cart.filter(i=>i.id===p.id).reduce((n,i)=>n+i.qty,0) > p.stock) throw new Error(`Inventario insuficiente: ${p.name}`);
  }
  const id = `${code}-${store.nextOrder}`;
  const order = {id, name:`${first.trim()} ${last.trim()}`, date:'Hoy · hace un momento',
    total:cartTotals(store, market).total, status:'Preparando', country:code, currency:market.currency,
    items:store.cart.map(i=>`${store.products.find(p=>p.id===i.id).name} (${i.size}) × ${i.qty}`).join(', ')};
  return {order, store:{...store, cart:[], orders:[order,...store.orders], nextOrder:store.nextOrder+1,
    products:store.products.map(p=>({...p,stock:p.stock-store.cart.filter(i=>i.id===p.id).reduce((n,i)=>n+i.qty,0)}))}};
}
