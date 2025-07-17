<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 🍽️ Sistema de Gestión de Catering - Backend

API REST desarrollada con NestJS para la gestión integral de servicios de catering, incluyendo clientes, menús, pedidos, entregas y pagos.

## 👥 Equipo de Desarrollo

- **Byron Serrano** - Desarrollador Backend
- **Luis Velazco** - Desarrollador Backend
- **Stiven Guanoquiza** - Desarrollador Backend  
- **Xavier Navia** - Desarrollador Backend

---

## 📋 Descripción del Proyecto

Sistema completo para la administración de servicios de catering que permite:

- ✅ Gestión de clientes y sus datos
- 🍽️ Administración de menús y platos
- 📝 Control de pedidos y entregas
- 💰 Gestión de pagos
- 🥗 Inventario de insumos

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** (v18 o superior)
- **Docker** y **Docker Compose**
- **Git**

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd backend-hackaton-pucem
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Base de datos PostgreSQL
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=hackaton_db

# Configuración de desarrollo
DEVELOPMENT=true
NODE_ENV=development
```

### 3. Inicializar con Docker

```bash
# Construir e iniciar los contenedores
docker-compose up --build

# O en modo detached (segundo plano)
docker-compose up -d --build
```

### 4. Instalación manual (alternativa)

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run start:dev

# Iniciar en modo producción
npm run start:prod
```

## 📚 Documentación API

Una vez iniciado el proyecto, accede a la documentación interactiva en:

🔗 **http://localhost:3000/api**

La documentación incluye todos los endpoints disponibles con ejemplos de uso.

## 🏗️ Estructura del Proyecto

```
src/
├── 📁 config/                    # Configuraciones
│   ├── database.config.ts        # Configuración de base de datos
│   └── logger.config.ts          # Configuración de logging
├── 📁 filters/                   # Filtros globales
│   └── http-exception.filter.ts  # Manejo de excepciones
├── 📁 clientes/                  # Módulo de clientes
│   ├── clientes.controller.ts
│   ├── clientes.service.ts
│   ├── clientes.module.ts
│   ├── 📁 dto/                   # Data Transfer Objects
│   └── 📁 entities/              # Entidades de base de datos
├── 📁 menus/                     # Módulo de menús
│   ├── menus.controller.ts
│   ├── menus.service.ts
│   ├── menus.module.ts
│   ├── 📁 dto/
│   └── 📁 entities/
├── 📁 platos/                    # Módulo de platos e insumos
│   ├── platos.controller.ts
│   ├── platos.service.ts
│   ├── platos.module.ts
│   ├── 📁 dto/
│   └── 📁 entities/
├── 📁 pedidos/                   # Módulo de pedidos
│   ├── pedidos.controller.ts
│   ├── pedidos.service.ts
│   ├── pedidos.module.ts
│   ├── 📁 dto/
│   └── 📁 entities/
├── 📁 entregas/                  # Módulo de entregas
│   ├── entrega.controller.ts
│   ├── entrega.service.ts
│   ├── entrega.module.ts
│   ├── 📁 dto/
│   └── 📁 entities/
├── 📁 pagos/                     # Módulo de pagos
│   ├── pagos.controller.ts
│   ├── pagos.service.ts
│   ├── pagos.module.ts
│   ├── 📁 dto/
│   └── 📁 entities/
├── app.module.ts                 # Módulo principal
├── app.controller.ts
├── app.service.ts
└── main.ts                       # Punto de entrada
```

## 🛠️ Tecnologías Utilizadas

- **[NestJS](https://nestjs.com/)** - Framework de Node.js
- **[TypeORM](https://typeorm.io/)** - ORM para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Base de datos
- **[Swagger](https://swagger.io/)** - Documentación de API
- **[Docker](https://www.docker.com/)** - Containerización
- **[Winston](https://github.com/winstonjs/winston)** - Sistema de logging
- **[Class Validator](https://github.com/typestack/class-validator)** - Validación de datos

## 🗄️ Base de Datos

El sistema utiliza PostgreSQL con las siguientes entidades principales:

- **Clientes** - Información de clientes
- **Menús** - Catálogo de menús disponibles
- **Categorías de Menú** - Clasificación de menús
- **Platos** - Platos individuales
- **Insumos** - Ingredientes y materiales
- **Pedidos** - Órdenes de clientes
- **Entregas** - Gestión de entregas
- **Pagos** - Control financiero

## 📊 Endpoints Principales

| Módulo | Endpoint Base | Descripción |
|--------|---------------|-------------|
| 👥 Clientes | `/clientes` | Gestión de clientes |
| 🍽️ Menús | `/menus` | Administración de menús |
| 🥗 Platos | `/platos` | Gestión de platos e insumos |
| 📝 Pedidos | `/pedidos` | Control de pedidos |
| 🚚 Entregas | `/entregas` | Gestión de entregas |
| 💰 Pagos | `/pagos` | Control de pagos |

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Modo desarrollo con recarga automática
npm run start:debug        # Modo debug

# Producción
npm run build              # Compilar proyecto
npm run start:prod         # Iniciar en producción

# Testing
npm run test               # Pruebas unitarias
npm run test:e2e           # Pruebas end-to-end
npm run test:cov           # Cobertura de pruebas

# Docker
docker-compose up --build  # Iniciar con Docker
docker-compose down        # Detener contenedores
docker-compose logs        # Ver logs
```

## 🌟 Características

- 🔐 **Validación de datos** con class-validator
- 📖 **Documentación automática** con Swagger
- 🗄️ **Base de datos** PostgreSQL con TypeORM
- 🐳 **Containerización** con Docker
- 📝 **Sistema de logging** con Winston
- 🛡️ **Manejo de errores** centralizado
- 🔄 **Hot reload** en desarrollo

## 🚦 Estado del Proyecto

✅ **Funcionalidades Implementadas:**
- Gestión completa de clientes
- Sistema de menús y categorías
- Administración de platos e insumos
- Control de entregas
- Documentación API completa

🔄 **En Desarrollo:**
- Sistema de pedidos
- Módulo de pagos
- Autenticación y autorización

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:

1. Revisa la documentación en `/api`
2. Verifica los logs de la aplicación
3. Contacta al equipo de desarrollo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ por el equipo de Backend - Hackathon PUCEM 2025**