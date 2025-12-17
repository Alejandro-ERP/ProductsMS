##Microservice Porducts

#Start proyect with npm run start:dev
# ERPApp - Microservicio de Productos

Este repositorio contiene un microservicio responsable de la gestión de productos (CRUD) usando NestJS y Prisma. El servicio está diseñado como microservicio basado en mensajes (NestJS Microservices) y expone comandos para crear, leer, actualizar y eliminar productos.

**Tecnologías principales**
- Node.js / TypeScript
- NestJS (Microservices)
- Prisma (cliente generado) con SQLite por defecto
- class-validator / class-transformer

## Estado
Servicio básico para CRUD de productos implementado. Incluye migraciones de Prisma y cliente generado en `generated/prisma`.

## Requisitos
- Node 18+ (o versión compatible con dependencias)
- npm o pnpm
- (Opcional) SQLite instalado, aunque Prisma maneja el archivo local

## Instalación
1. Instalar dependencias:

```bash
npm install
```

2. Generar cliente de Prisma (necesario si cambias el esquema):

```bash
npx prisma generate
```

3. Aplicar migraciones (modo desarrollo):

```bash
npx prisma migrate dev --name init
```

Para entornos de despliegue usar `npx prisma migrate deploy`.

> Nota: el esquema Prisma usa SQLite por defecto (ver `prisma/schema.prisma`). Para usar otra base de datos actualiza el `datasource` y la variable de entorno correspondiente.

## Variables de entorno
Este proyecto no requiere variables especiales fuera de las que uses para configurar Prisma cuando cambias el `datasource`. Para bases de datos remotas, configura `DATABASE_URL` en un archivo `.env` en la raíz.

## Scripts útiles
- `npm run start:dev` — Ejecuta la aplicación en modo desarrollo (watch).
- `npm run build` — Compila el proyecto.
- `npm run start:prod` — Ejecuta la app compilada.

## Cómo funciona el microservicio
El microservicio no expone rutas HTTP públicas en el controlador `ProductsController`: en lugar de esto, utiliza patrones de mensajes de NestJS (`@MessagePattern`) para comunicarse a través del transport que configures (TCP, Redis, NATS, etc.).

Comandos disponibles (Message Patterns):

- `create_product` — Crea un producto.
	- Payload: `CreateProductDto` { name: string, price: number }
- `get_all_products` — Obtiene lista paginada de productos.
	- Payload: `PaginationDto` { limit?: number, offset?: number }
- `get_product` — Obtiene un producto por id.
	- Payload: id (number)
- `update_product` — Actualiza un producto.
	- Payload: `UpdateProductDto` { id: number, name?: string, price?: number }
- `delete_product` — Elimina un producto por id.
	- Payload: id (number)

Ejemplo de envío de mensaje (cliente NestJS):

```ts
// pseudocódigo
const client = this.clientProxy; // cliente configurado
client.send({ cmd: 'create_product' }, { name: 'Café', price: 1.5 });
```

## DTOs
- `CreateProductDto`:
	- `name: string` (requerido)
	- `price: number` (requerido, >= 0)
- `UpdateProductDto`:
	- `id: number` (requerido)
	- `name?: string`
	- `price?: number`

## Modelo de datos (Prisma)
El modelo `Product` en `prisma/schema.prisma` contiene los siguientes campos:

- `id: Int` (PK, autoincrement)
- `name: String`
- `price: Float`
- `available: Boolean` (default true)
- `createdAt: DateTime` (default now)
- `updatedAt: DateTime` (@updatedAt)

## Estructura del proyecto (resumen)
- `src/main.ts` — punto de entrada
- `src/app.module.ts` — módulo raíz
- `src/prisma.service.ts` — servicio para acceso a Prisma
- `src/products/*` — módulo/controller/service/dto de productos
- `prisma/` — esquema y migraciones de Prisma
- `generated/prisma` — cliente Prisma generado

## Despliegue y recomendaciones
- Para producción, considera cambiar `datasource` de Prisma a PostgreSQL o MySQL y usar `npx prisma migrate deploy` durante el despliegue.
- Configura el transport de microservicios en `main.ts` para que el servicio acepte mensajes (TCP, Redis, NATS, etc.).

## Contribuir
1. Haz fork y crea una rama feature/bugfix.
2. Añade tests si modificas lógica importante.
3. Abre un PR describiendo los cambios.

## Licencia
Proyecto privado — ajustar licencia según convenga.

---

Si quieres, puedo:
- Añadir ejemplos de `main.ts` para configurar el transport (TCP/Redis/NATS).
- Crear un `Dockerfile` y `docker-compose.yml` para levantar un entorno con base de datos.

Archivo creado/actualizado: `README.md`.
