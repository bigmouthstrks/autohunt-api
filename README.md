# AutoHunt API

API REST construida con Node.js, Express, TypeScript, Prisma y PostgreSQL (Neon).

## 🚀 Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos (Neon Console)

## 📦 Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
```

3. Configurar tu `DATABASE_URL` en el archivo `.env` con tu conexión de Neon:

```
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

4. Generar el cliente de Prisma:

```bash
npm run prisma:generate
```

5. Ejecutar migraciones:

```bash
npm run prisma:migrate
```

## 🏃‍♂️ Ejecución

### Modo desarrollo

```bash
npm run dev
```

### Modo producción

```bash
npm run build
npm start
```

## 📊 Prisma Studio

Para explorar y manipular tu base de datos visualmente:

```bash
npm run prisma:studio
```

## 📁 Estructura del Proyecto

```
autohunt/
├── prisma/
│   └── schema.prisma        # Schema de la base de datos
├── src/
│   ├── config/              # Configuraciones
│   │   └── database.ts      # Conexión a base de datos
│   ├── interfaces/          # Interfaces de TypeScript
│   │   ├── User.ts
│   │   ├── Car.ts
│   │   ├── Model.ts
│   │   ├── Brand.ts
│   │   └── index.ts
│   ├── app.ts               # Configuración de Express
│   └── index.ts             # Punto de entrada
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔑 Entidades

- **User** - Usuarios del sistema
- **Car** - Vehículos
- **Model** - Modelos de vehículos
- **Brand** - Marcas de vehículos

## 📝 Notas

1. Define tus interfaces en los archivos correspondientes en `src/interfaces/`
2. Actualiza el schema de Prisma en `prisma/schema.prisma`
3. Crea tus controladores y rutas según necesites

## 🔗 Recursos

- [Neon Console](https://neon.tech/) - Base de datos PostgreSQL serverless
- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
