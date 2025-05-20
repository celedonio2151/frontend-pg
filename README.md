# frontend-pg

Aplicación web frontend construida con **React**, **MUI** y **TypeScript**. Este proyecto fue desarrollado como parte de mi proyecto de grado para la carrera de Ingeniería en Ciencias de la Computación.

## Tecnologías principales

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Material UI (MUI)](https://mui.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Requisitos previos

- Node.js >= 18
- npm >= 9

## Instalación

Clona el repositorio y navega a la carpeta del proyecto:

```sh
git clone <url-del-repositorio>
cd frontend-pg
```

Instala las dependencias:

```sh
npm install
```

## Scripts disponibles

- `npm run dev` – Inicia el servidor de desarrollo en modo HMR.
- `npm run build` – Genera la build de producción.
- `npm run preview` – Previsualiza la build de producción localmente.
- `npm run lint` – Ejecuta ESLint para analizar el código.

## Estructura del proyecto

```
frontend-pg/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── README.md
```

## Desarrollo

Para iniciar el entorno de desarrollo ejecuta:

```sh
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Construcción para producción

```sh
npm run build
```

Los archivos generados estarán en la carpeta `dist/`.

## Licencia

Este proyecto se desarrolla con fines académicos.
