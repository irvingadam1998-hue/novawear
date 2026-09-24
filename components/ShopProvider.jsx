'use client';
import {createContext, useContext, useEffect, useRef, useState} from 'react';
import data from '@/lib/catalog-data.json';
import {addCartItem, cartTotals, createStores, formatMoney, placeDemoOrder} from '@/lib/shop.mjs';
const ShopContext=createContext(null);
export const categories=['Camisas','Camisetas','Pantalones','Punto','Conjuntos'];
export function ShopProvider({children}) {
  const [country,setCountry]=useState('PA');
  const [stores,setStores]=useState(()=>createStores(data));
  const [message,setMessage]=useState('');
  const timer=useRef(null);
  useEffect(()=>{try {const code=localStorage.getItem('nova-wear-country');if(data.markets[code])setCountry(code)} catch {} return ()=>clearTimeout(timer.current)},[]);
  const market=data.markets[country],store=stores[country];
  function toast(text){setMessage(text);clearTimeout(timer.current);timer.current=setTimeout(()=>setMessage(''),3000)}
  function updateStore(fn){setStores(all=>({...all,[country]:fn(all[country])}))}
  function changeCountry(code){if(!data.markets[code])return;setCountry(code);try{localStorage.setItem('nova-wear-country',code)}catch{}toast('Ahora estás en NOVA WEAR '+data.markets[code].name)}
  function add(id,size,qty=1){try {const next=addCartItem(store,id,size,qty);setStores(all=>({...all,[country]:next}));toast('Prenda añadida al carrito');return true} catch(e){toast(e.message);return false}}
  function quantity(key,delta){const item=store.cart.find(i=>i.key===key);if(!item)return;if(delta>0){add(item.id,item.size,1);return}updateStore(st=>({...st,cart:st.cart.map(i=>i.key===key?{...i,qty:Math.max(1,i.qty-1)}:i)}))}
  function remove(key){updateStore(st=>({...st,cart:st.cart.filter(i=>i.key!==key)}))}
  function favorite(id){updateStore(st=>({...st,favorites:st.favorites.includes(id)?st.favorites.filter(x=>x!==id):[...st.favorites,id]}))}
  function checkout(first,last){try{const result=placeDemoOrder(store,market,country,first,last);setStores(all=>({...all,[country]:result.store}));return result.order.id}catch(e){toast(e.message);return null}}
  function saveProduct(product){updateStore(st=>({...st,products:st.products.some(p=>p.id===product.id)?st.products.map(p=>p.id===product.id?{...p,...product}:p):[...st.products,product]}));toast('Producto guardado durante esta sesión')}
  function changeOrder(id,status){updateStore(st=>({...st,orders:st.orders.map(o=>o.id===id?{...o,status}:o)}));toast('Estado actualizado')}
  const value={...store,stores,market,country,markets:data.markets,money:n=>formatMoney(n,market),totals:cartTotals(store,market),changeCountry,add,quantity,remove,favorite,checkout,saveProduct,changeOrder,toast};
  return <ShopContext.Provider value={value}>{children}<div id="toast" className={message?'show':''} role="status">{message}</div></ShopContext.Provider>;
}
export function useShop(){const ctx=useContext(ShopContext);if(!ctx)throw Error('useShop necesita ShopProvider');return ctx}
