import Catalog from '@/components/Catalog';
export const metadata={title:'Colección'};
export default async function Page({searchParams}){const q=await searchParams;const category=typeof q.categoria==='string'?q.categoria:'Todos',query=typeof q.q==='string'?q.q:'';return <Catalog key={`${category}:${query}`} initialCategory={category} initialQuery={query}/>}
