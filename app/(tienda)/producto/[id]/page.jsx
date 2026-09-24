import ProductView from '@/components/ProductView';
import data from '@/lib/catalog-data.json';
export async function generateMetadata({params}){const {id}=await params;return {title:data.baseProducts.find(p=>p.id===Number(id))?.name||'Prenda'}}
export default async function Page({params}){const {id}=await params;return <ProductView key={id} id={Number(id)}/>}
