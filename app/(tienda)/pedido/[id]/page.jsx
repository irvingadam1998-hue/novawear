import {OrderSuccess} from '@/components/Checkout';
export const metadata={title:'Pedido de prueba'};
export default async function Page({params}){const {id}=await params;return <OrderSuccess id={id}/>}
