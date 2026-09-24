import Info from '@/components/Info';
export default async function Page({params}){const {tipo}=await params;return <Info type={tipo}/>}
