import './globals.css';
import {ShopProvider} from '@/components/ShopProvider';
export const metadata={title:{default:'NOVA WEAR — Viste a tu manera.',template:'%s · NOVA WEAR'},description:'Prototipo de tienda de ropa con catálogos de Panamá, Nicaragua y El Salvador.',icons:{icon:'/icon.svg'}};
export default function RootLayout({children}) {return <html lang="es"><body><ShopProvider>{children}</ShopProvider></body></html>}
