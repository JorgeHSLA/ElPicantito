# El Picantito - Frontend Angular 🌮

Frontend del sistema de gestión de pedidos para El Picantito, desarrollado con Angular 18+.

## 🚀 Configuración del proyecto

### Instalación de dependencias
```bash
npm install
```

### Servidor de desarrollo

Para iniciar el servidor de desarrollo (sin backend):
```bash
ng serve
```

Para iniciar con proxy al backend (recomendado):
```bash
npm start
```

El servidor estará disponible en `http://localhost:4200/`. La aplicación se recarga automáticamente cuando modificas archivos.

### Conexión con Backend

El proyecto está configurado para conectarse automáticamente con el backend Spring Boot que corre en `http://localhost:8080`. 

Para usar con backend:
1. Inicia el backend Spring Boot en el puerto 8080
2. Ejecuta `npm start` en el frontend
3. El proxy redirigirá las llamadas `/api/*` al backend

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── admin/          # Componentes de administración
│   │   ├── shared/         # Componentes compartidos
│   │   └── user/           # Componentes de usuario
│   ├── guards/             # Guards de autenticación
│   ├── models/             # Modelos de datos
│   └── services/           # Servicios HTTP
└── public/
    └── images/             # Imágenes estáticas
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
