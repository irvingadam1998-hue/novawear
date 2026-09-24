# NOVA WEAR — Next.js

Conversión de la tienda de ropa NOVA WEAR a **Next.js 16.3.6 + React 19.3.0**, con App Router, componentes React y CSS. Incluye las fotografías locales y un catálogo de demostración para Panamá, Nicaragua y El Salvador.

## Ejecutar

Requisitos: Node.js 20.9 o superior (recomendado Node.js 24 LTS) y npm.

```bash
cd nova-wear-nextjs
npm ci
npm run dev
```

Abre http://localhost:3000.

No necesitas variables de entorno, cuentas externas ni una base de datos para probarlo. El ZIP no contiene `node_modules` ni `.next`; `npm ci` instala las versiones del lockfile.

## Producción

```bash
npm run build
npm start
```

Puedes subir este directorio a un repositorio e importarlo en Vercel como un proyecto Next.js. La conversión entregada no reemplaza el prototipo publicado en ChatGPT Sites.

## Qué incluye

- Portada, categorías, búsqueda, orden por precio y filtros de colección y talla.
- Fichas de prendas, selección de talla, favoritos y carrito.
- Checkout y pedidos simulados; no solicita tarjetas ni realiza cobros.
- Tiendas independientes: Panamá (USD), Nicaragua (NIO) y El Salvador (USD).
- Precios locales de demostración, inventarios, carritos y pedidos por país. No son conversiones de divisas.
- Administrador con resumen, catálogo editable, creación de productos, gestión del estado de pedidos y exportación CSV.
- Estado compartido con React Context; navegación real con `next/link`.
- Imágenes locales con `next/image`, estilos adaptables y metadatos básicos.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/` | Inicio |
| `/productos` | Catálogo; acepta `?categoria=Camisas&q=Weekend` |
| `/producto/1` | Ficha de una prenda |
| `/ofertas` | Prendas rebajadas |
| `/favoritos` | Favoritos de la tienda seleccionada |
| `/carrito` | Carrito |
| `/checkout` | Compra simulada |
| `/pedido/PA-2049` | Confirmación del pedido de la sesión |
| `/admin` | Resumen administrativo |
| `/admin/productos` | Edición del catálogo |
| `/admin/pedidos` | Pedidos y estados |
| `/informacion/envios` | Envíos y devoluciones de referencia |
| `/informacion/ayuda` | Ayuda |
| `/informacion/nosotros` | Sobre la propuesta |
| `/informacion/imagenes` | Créditos de las imágenes |

## Estructura

- `app/`: rutas App Router, layouts, metadatos y `globals.css`.
- `components/`: componentes React de tienda y administración.
- `components/ShopProvider.jsx`: estado y acciones por país; es el punto de conexión para una futura API.
- `lib/catalog-data.json`: catálogo base, mercados y precios iniciales.
- `lib/shop.mjs`: reglas puras de carrito, inventario, totales y pedidos.
- `lib/download.js`: exportación CSV.
- `public/assets/`: fotografías y fuentes.
- `tests/shop.test.mjs`: pruebas de aislamiento por país, tallas, inventario, envío y pedidos.

## Cambiar el catálogo

En `lib/catalog-data.json`:

1. `baseProducts` contiene nombre, categoría, colección, tallas, color, imagen y descripción de cada prenda.
2. `assortments` define las prendas disponibles por país. Cada fila es `[id, precio, inventario, precioAnteriorOpcional]`.
3. `markets` define moneda, envío, regiones y producto destacado por tienda.

Para una nueva foto, guárdala como `public/assets/mi-prenda.jpg` y escribe `"image": "mi-prenda"` en la prenda. Ajusta también las opciones de categoría en `components/ShopProvider.jsx` si introduces categorías nuevas.

## Alcance del prototipo

**El administrador no tiene autenticación y no está preparado para gestionar datos reales.** Las pantallas y el estado funcionan en el navegador. Productos editados, favoritos, carritos y pedidos se conservan al navegar, pero se reinician al recargar. Solo la preferencia de país se recuerda mediante `localStorage`.

Los pedidos son simulados. El nombre ficticio se guarda en memoria; correo y dirección del formulario no se envían a ningún servidor. Las gráficas y reseñas están marcadas como ilustrativas.

Antes de lanzar una tienda real hacen falta autenticación y autorización del admin, base de datos, validación de precios e inventario en servidor, pagos y una integración de envíos. Las rutas privadas deben protegerse en servidor, no solo ocultarse en el menú.

## Imágenes y tipografía

Las fotos son referencias de Honest Basics y Louisa Models; no implican relación comercial con esas marcas. Los precios y nombres NOVA son ejemplos. Las URLs originales están en `public/assets/wear-sources.json`. Sustituye el material por imágenes propias o con licencia antes de un uso comercial.

DM Sans y Manrope se cargan mediante Google Fonts en `app/globals.css`. Si no hay conexión, se usa la fuente alternativa del sistema. El build no descarga fuentes. Puedes alojarlas localmente más adelante.

## Verificación

```bash
npm test
npm run build
```

Se incluyen pruebas de las reglas de negocio del prototipo. No equivalen a una auditoría de seguridad ni a pruebas completas de pagos, ya que estos no están implementados.
