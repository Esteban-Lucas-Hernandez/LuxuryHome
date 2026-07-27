# 🏠 LuxuryHome

> **E-commerce de muebles de lujo con visualización 3D interactiva.**
> Plataforma full-stack que permite explorar, filtrar y comprar muebles con visor 3D en tiempo real, carrito de compras y gestión de pedidos.

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías y Frameworks](#tecnologías-y-frameworks)
- [Variables de Entorno](#variables-de-entorno)
- [Instalación en Windows](#instalación-en-windows)
- [Instalación en Linux](#instalación-en-linux)
- [Uso](#uso)
- [Endpoints de la API](#endpoints-de-la-api)
- [Lo que Falta / Roadmap](#lo-que-falta--roadmap)

---

## 📖 Descripción

**LuxuryHome** es una aplicación web full-stack de e-commerce especializada en muebles de diseño. Su característica diferenciadora es la visualización de productos en **3D interactivo** directamente en el navegador mediante Three.js / React Three Fiber.

### Funcionalidades implementadas

- 🛋️ Catálogo de muebles con categorías jerárquicas
- 🔍 Filtrado y búsqueda de productos
- 🎯 Visor 3D interactivo por producto (modelos `.glb` / `.gltf`)
- 🛒 Carrito de compras por usuario
- 📦 Gestión de pedidos con tracking de estados
- 🔐 Autenticación JWT (registro, login, refresh token)
- 📱 Diseño responsive (Bootstrap 5)
- 📄 Documentación Swagger de la API

---

## 🏛️ Arquitectura

```
LuxuryHome/
├── back/       ← API REST (Django + DRF)
└── front/      ← SPA (React + Vite)
```

El frontend React corre en el puerto **5173** y utiliza un proxy Vite para redirigir `/api/*` y `/static/*` al backend Django corriendo en el puerto **8000**, evitando problemas de CORS en desarrollo.

```
Navegador (React :5173)
       │
       ├──/api/* ──────► Django REST API (:8000)
       │                        │
       └──/static/* ────►  WhiteNoise / Static Files
                                │
                           SQLite (dev) / PostgreSQL (prod)
```

---

## 📁 Estructura del Proyecto

```
LuxuryHome/
│
├── README.md
│
├── back/                          # Backend Django
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example               # Variables de entorno de ejemplo
│   ├── db.sqlite3                 # Base de datos SQLite (desarrollo)
│   │
│   ├── back/                      # Configuración del proyecto Django
│   │   ├── settings.py
│   │   ├── urls.py                # Rutas principales + Swagger
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── users/                     # App: Autenticación y usuarios
│   │   ├── models.py
│   │   ├── views.py               # RegisterView + JWT
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── store/                     # App: Catálogo de muebles
│   │   ├── models.py              # Category, Furniture (con soporte 3D)
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── cart/                      # App: Carrito de compras
│   │   ├── models.py              # Cart, CartItem
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── orders/                    # App: Pedidos y tracking
│   │   ├── models.py              # Order, OrderItem, OrderTracking
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   └── static/                    # Archivos estáticos servidos por WhiteNoise
│       ├── furniture_images/      # Imágenes de productos
│       └── furniture_models/      # Modelos 3D (.glb / .gltf)
│
└── front/                         # Frontend React
    ├── index.html
    ├── vite.config.js             # Proxy a :8000 + configuración Vite
    ├── package.json
    │
    └── src/
        ├── App.jsx                # Raíz de la app, modales globales
        ├── main.jsx
        │
        ├── api/                   # Configuración de Axios
        ├── assets/                # Recursos estáticos locales
        ├── components/            # Componentes reutilizables
        │   ├── Auth/              # Login / Registro (modales)
        │   ├── Cart/              # Componente carrito
        │   ├── ErrorBoundary/     # Captura de errores React
        │   ├── Footer/
        │   ├── Modal/
        │   ├── Navbar/
        │   └── ProtectedRoute.jsx
        │
        ├── context/
        │   └── AuthContext.jsx    # Estado global de autenticación
        │
        ├── pages/                 # Páginas de la aplicación
        │   ├── Home/              # Página principal
        │   ├── Products/          # Catálogo con filtros
        │   ├── Details/           # Detalle + visor 3D del producto
        │   └── About/             # Página "Sobre Nosotros"
        │
        ├── routes/
        │   └── AppRoutes.jsx      # Definición de rutas React Router
        │
        ├── services/              # Lógica de llamadas a la API
        └── styles/                # Archivos CSS globales
```

---

## 🛠️ Tecnologías y Frameworks

### Backend

| Tecnología                             | Versión | Rol                                |
| --------------------------------------- | -------- | ---------------------------------- |
| **Python**                        | 3.10+    | Lenguaje base                      |
| **Django**                        | 6.0.1    | Framework web principal            |
| **Django REST Framework**         | 3.16.1   | Construcción de la API REST       |
| **djangorestframework-simplejwt** | 5.5.1    | Autenticación con JWT             |
| **django-cors-headers**           | 4.9.0    | Gestión de CORS                   |
| **django-filter**                 | 25.2     | Filtrado de querysets en la API    |
| **drf-yasg**                      | 1.21.12  | Documentación Swagger automática |
| **WhiteNoise**                    | 6.11.0   | Servicio de archivos estáticos    |
| **Pillow**                        | 12.1.0   | Procesamiento de imágenes         |
| **python-dotenv**                 | 1.2.1    | Variables de entorno desde`.env` |
| **dj-database-url**               | 3.1.0    | Configuración de BD por URL       |
| **psycopg2-binary**               | 2.9.11   | Driver PostgreSQL (producción)    |
| **Gunicorn**                      | latest   | Servidor WSGI para producción     |
| **SQLite**                        | built-in | Base de datos de desarrollo        |

### Frontend

| Tecnología                  | Versión | Rol                              |
| ---------------------------- | -------- | -------------------------------- |
| **React**              | 19.1.0   | Librería UI principal           |
| **Vite**               | 7.0.4    | Bundler y servidor de desarrollo |
| **React Router DOM**   | 7.7.1    | Enrutamiento del SPA             |
| **@react-three/fiber** | 9.5.0    | Renderer Three.js para React     |
| **@react-three/drei**  | 10.7.7   | Helpers y controles 3D           |
| **Three.js**           | 0.182.0  | Motor de renderizado 3D          |
| **Axios**              | 1.13.2   | Cliente HTTP para la API         |
| **Bootstrap**          | 5.3.7    | Framework CSS y componentes UI   |
| **SweetAlert2**        | 11.26.20 | Alertas y modales bonitos        |

### DevOps / Herramientas

| Herramienta          | Uso                                                  |
| -------------------- | ---------------------------------------------------- |
| **Git**        | Control de versiones                                 |
| **ESLint**     | Linting de JavaScript/JSX                            |
| **Swagger UI** | Documentación interactiva de la API (`/swagger/`) |

---

## 🔑 Variables de Entorno

Copia el archivo de ejemplo y completa los valores:

```bash
# Desde la carpeta back/
cp .env.example .env
```

| Variable          | Descripción                 | Ejemplo                 |
| ----------------- | ---------------------------- | ----------------------- |
| `SECRET_KEY`    | Clave secreta de Django      | `django-insecure-...` |
| `DEBUG`         | Modo debug                   | `True`                |
| `ALLOWED_HOSTS` | Hosts permitidos             | `127.0.0.1,localhost` |
| `DB_NAME`       | Nombre de la BD (PostgreSQL) | `LuxuryHomeBD`        |
| `DB_USER`       | Usuario de PostgreSQL        | `postgres`            |
| `DB_PASSWORD`   | Contraseña de PostgreSQL    | `tu_password`         |
| `DB_HOST`       | Host de la BD                | `localhost`           |
| `DB_PORT`       | Puerto de la BD              | `5432`                |

> **Nota:** En desarrollo, la app usa SQLite por defecto (sin configurar las variables `DB_*`).

---

## 🪟 Instalación en Windows

### Requisitos previos

- [Python 3.10+](https://www.python.org/downloads/) — marcar **"Add Python to PATH"** durante la instalación
- [Node.js 18+](https://nodejs.org/es/download) (incluye npm)
- [Git](https://git-scm.com/download/win)

### 1. Clonar el repositorio

```powershell
git clone https://github.com/tu-usuario/LuxuryHome.git
cd LuxuryHome
```

### 2. Configurar el Backend (Django)

```powershell
# Entrar a la carpeta del backend
cd back

# Crear entorno virtual
python -m venv venv

# Activar el entorno virtual (PowerShell)
.\venv\Scripts\Activate.ps1

# Si hay error de política de ejecución, ejecutar esto primero:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
copy .env.example .env
# Editar .env con tus valores (puedes usar el Bloc de notas)
notepad .env

# Aplicar migraciones
python manage.py migrate

# (Opcional) Cargar datos de ejemplo si existe fixture
# python manage.py loaddata fixtures/initial_data.json

# Crear superusuario para el panel admin
python manage.py createsuperuser

# Colectar archivos estáticos
python manage.py collectstatic --noinput

# Iniciar el servidor de desarrollo
python manage.py runserver
```

El backend estará disponible en: **http://localhost:8000**
Panel de administración: **http://localhost:8000/admin/**
Documentación Swagger: **http://localhost:8000/swagger/**

### 3. Configurar el Frontend (React + Vite)

Abrir una **nueva terminal** de PowerShell:

```powershell
# Desde la raíz del proyecto
cd front

# Instalar dependencias de Node.js
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

## 🐧 Instalación en Linux

### Requisitos previos

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install -y python3 python3-pip python3-venv git curl

# Instalar Node.js 18+ mediante nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/LuxuryHome.git
cd LuxuryHome
```

### 2. Configurar el Backend (Django)

```bash
cd back

# Crear entorno virtual
python3 -m venv venv

# Activar el entorno virtual
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
nano .env   # o usa tu editor favorito: vim .env / code .env

# Aplicar migraciones
python manage.py migrate

# (Opcional) Cargar datos de ejemplo si existe fixture
# python manage.py loaddata fixtures/initial_data.json

# Crear superusuario
python manage.py createsuperuser

# Colectar archivos estáticos
python manage.py collectstatic --noinput

# Iniciar el servidor de desarrollo
python manage.py runserver
```

El backend estará disponible en: **http://localhost:8000**

### 3. Configurar el Frontend (React + Vite)

Abrir una **nueva terminal**:

```bash
cd front

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

## 🚀 Uso

1. Abre **http://localhost:5173** en tu navegador
2. Navega por el catálogo de muebles en `/products`
3. Haz clic en un producto para ver su detalle y visor 3D interactivo
4. Regístrate o inicia sesión para agregar productos al carrito
5. Gestiona tu carrito y realiza pedidos
6. Revisa el panel admin en **http://localhost:8000/admin/** para gestionar productos

---

## 📡 Endpoints de la API

| Método      | Endpoint                 | Descripción                 | Auth |
| ------------ | ------------------------ | ---------------------------- | ---- |
| `POST`     | `/api/users/register/` | Registro de usuario          | No   |
| `POST`     | `/api/users/login/`    | Login → devuelve JWT        | No   |
| `POST`     | `/api/users/refresh/`  | Renovar token JWT            | No   |
| `GET`      | `/api/store/`          | Listar muebles (con filtros) | No   |
| `GET`      | `/api/store/:id/`      | Detalle de un mueble         | No   |
| `GET/POST` | `/api/cart/`           | Ver / agregar al carrito     | ✅   |
| `DELETE`   | `/api/cart/:id/`       | Eliminar ítem del carrito   | ✅   |
| `GET/POST` | `/api/orders/`         | Ver pedidos / crear pedido   | ✅   |
| `GET`      | `/swagger/`            | Documentación interactiva   | No   |

> Para los endpoints protegidos (✅), incluir el header: `Authorization: Bearer <access_token>`

---

## 🗺️ Lo que Falta / Roadmap

### 🔴 Crítico (bugs / incompleto)

- [ ] **Página de Carrito** — No existe una página `/cart` dedicada; el carrito sólo es un componente lateral. Falta vista completa de resumen antes del checkout
- [ ] **Proceso de Checkout** — No hay flujo de confirmación de pedido en el frontend (los endpoints existen en el backend pero no están conectados al UI)
- [ ] **Página de Mis Pedidos** — No existe vista para que el usuario vea el historial y tracking de sus órdenes
- [ ] **`ProtectedRoute.jsx`** — El componente existe pero **no se usa en ninguna ruta** (`AppRoutes.jsx` no protege ninguna vista)
- [ ] **`CORS_ALLOW_ALL_ORIGINS = True`** en `settings.py` — Debe limitarse a orígenes específicos antes de producción

### 🟡 Importante (funcionalidades faltantes)

- [ ] **Página de Perfil de Usuario** — No hay vista `/profile` para editar datos personales
- [ ] **Búsqueda y Filtros en el frontend** — El backend tiene `django-filter` configurado pero falta implementar la UI de filtros por categoría/precio en `Products`
- [ ] **Paginación** — El backend debería paginar los resultados; el frontend tampoco lo gestiona
- [ ] **Manejo de errores global en el frontend** — `ErrorBoundary` existe pero las llamadas Axios no tienen un interceptor centralizado de errores
- [ ] **Panel de Administración de Productos** — No hay panel de administración de productos en el frontend (sólo en Django Admin)
- [ ] **Datos de ejemplo (fixtures)** — No existe un fixture para poblar la base de datos en una instalación nueva
- [ ] **Tests** — Todos los `tests.py` están vacíos

### 🟢 Mejoras / Nice to Have

- [ ] **Modo oscuro**
- [ ] **Wishlist / Favoritos**
- [ ] **Sistema de reseñas y calificaciones**
- [ ] **Pasarela de pago** (Stripe / MercadoPago)
- [ ] **Notificaciones en tiempo real** (WebSockets / Django Channels) para tracking de pedidos
- [ ] **PWA** — Convertir en Progressive Web App
- [ ] **Docker Compose** — Contenedorizar backend + frontend para fácil despliegue
- [ ] **CI/CD** — Pipeline de GitHub Actions para tests y deploy automático
- [ ] **i18n** — Internacionalización (español / inglés)
- [ ] **SEO** — Meta tags dinámicos por producto
- [ ] **Lazy loading** de modelos 3D para mejorar rendimiento

---

## 🤝 Contribuciones

1. Haz un fork del repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nombre-feature`
3. Haz commit de tus cambios: `git commit -m "feat: descripción del cambio"`
4. Push a tu rama: `git push origin feature/nombre-feature`
5. Abre un Pull Request

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
