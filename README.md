# 🏠 LuxuryHome

> **E-commerce de muebles de lujo con visualización 3D interactiva.**  
> Plataforma full-stack que permite explorar, filtrar y comprar muebles con visor 3D en tiempo real, carrito de compras y gestión de pedidos.

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías y Frameworks](#tecnologías-y-frameworks)
- [Variables de Entorno](#variables-de-entorno)
- [🗄️ Base de Datos y Auto-Seeding](#️-base-de-datos-y-auto-seeding)
- [🪟 Instalación en Windows (CMD, PowerShell, Git Bash)](#instalación-en-windows)
- [🐧 Instalación en Linux / macOS](#instalación-en-linux--macos)
- [🚀 Uso](#uso)
- [📡 Endpoints de la API](#endpoints-de-la-api)
- [🗺️ Estado del Proyecto / Roadmap](#estado-del-proyecto--roadmap)
- [🤝 Contribuciones](#contribuciones)
- [📜 Licencia](#licencia)

---

## 📖 Descripción

**LuxuryHome** es una aplicación web full-stack de e-commerce especializada en muebles de diseño. Su característica diferenciadora es la visualización de productos en **3D interactivo** directamente en el navegador mediante Three.js y React Three Fiber.

### Funcionalidades implementadas

- 🛋️ **Catálogo de muebles** con categorías jerárquicas y archivos estáticos asociados.
- 🔍 **Filtrado y búsqueda** de productos.
- 🎯 **Visor 3D interactivo** por producto (modelos `.glb` / `.gltf` con controles orbitales).
- 🛒 **Carrito de compras** persistente por usuario.
- 📦 **Gestión de pedidos** con tracking de estados.
- 🔐 **Autenticación JWT** (registro, login, token refresh).
- ⚡ **Auto-seeding de base de datos** (categorías y muebles se cargan automáticamente al migrar).
- 📱 **Diseño responsive** (Bootstrap 5 + CSS personalizado).
- 📄 **Documentación Swagger / OpenAPI** de la API backend.

---

## 🏛️ Arquitectura

```
LuxuryHome/
├── back/       ← API REST (Django + Django REST Framework)
└── front/      ← SPA (React + Vite + Three.js)
```

El frontend React se ejecuta en el puerto **5173** y utiliza el servidor proxy de Vite para redirigir `/api/*` y `/static/*` al backend Django en el puerto **8000**, evitando bloqueos de CORS durante el desarrollo.

```
Navegador (React :5173)
       │
       ├── /api/* ──────► Django REST API (:8000)
       │                        │
       └── /static/* ────►  WhiteNoise / Static Files
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
│   ├── .env.example               # Variables de entorno de muestra
│   ├── db.sqlite3                 # Base de datos SQLite (desarrollo)
│   │
│   ├── fixtures/                  # Fixtures iniciales para auto-seeding
│   │   └── initial_data.json      # Catálogo (24 categorías, 4 muebles)
│   │
│   ├── back/                      # Configuración principal de Django
│   │   ├── settings.py
│   │   ├── urls.py                # Rutas principales + Swagger UI
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── users/                     # App: Autenticación y usuarios
│   │   ├── models.py
│   │   ├── views.py               # RegisterView + SimpleJWT
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── store/                     # App: Catálogo de muebles
│   │   ├── models.py              # Category, Furniture (con soporte 3D)
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── fixtures/              # Fixture local de la app store
│   │   ├── management/            # Comando seed_furniture
│   │   └── migrations/            # Incluye 0008_seed_initial_data.py
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
│       ├── furniture_images/      # Imágenes de los muebles (.png, .jpg)
│       └── furniture_models/      # Modelos 3D (.glb)
│
└── front/                         # Frontend React
    ├── index.html
    ├── vite.config.js             # Configuración del proxy hacia :8000
    ├── package.json
    │
    └── src/
        ├── App.jsx                # Componente raíz y modales globales
        ├── main.jsx
        │
        ├── api/                   # Configuración de Axios
        ├── assets/                # Imágenes y assets locales
        ├── components/            # Componentes reutilizables (Auth, Cart, Navbar, etc.)
        ├── context/               # AuthContext.jsx
        ├── pages/                 # Páginas (Home, Products, Details, About)
        ├── routes/                # AppRoutes.jsx
        ├── services/              # Integración con API backend
        └── styles/                # Estilos globales CSS
```

---

## 🛠️ Tecnologías y Frameworks

### Backend

| Tecnología | Versión | Rol |
| :--- | :--- | :--- |
| **Python** | 3.10+ | Lenguaje base |
| **Django** | 6.0.1 | Framework web principal |
| **Django REST Framework** | 3.16.1 | Creación de API RESTful |
| **djangorestframework-simplejwt** | 5.5.1 | Autenticación basada en JWT |
| **django-cors-headers** | 4.9.0 | Manejo de CORS |
| **django-filter** | 25.2 | Filtrado de consultas en la API |
| **drf-yasg** | 1.21.12 | Documentación interactiva Swagger / OpenAPI |
| **WhiteNoise** | 6.11.0 | Servidor de archivos estáticos |
| **Pillow** | 12.1.0 | Procesamiento de imágenes |
| **python-dotenv** | 1.2.1 | Carga de variables de entorno `.env` |
| **dj-database-url** | 3.1.0 | Configuración flexible de base de datos |
| **psycopg2-binary** | 2.9.11 | Conector para PostgreSQL (producción) |
| **SQLite** | Incluido | Base de datos por defecto en desarrollo |

### Frontend

| Tecnología | Versión | Rol |
| :--- | :--- | :--- |
| **React** | 19.1.0 | Librería de interfaz de usuario |
| **Vite** | 7.0.4 | Compilador y servidor dev ultrarrápido |
| **React Router DOM** | 7.7.1 | Enrutamiento en el cliente |
| **@react-three/fiber** | 9.5.0 | Integración de Three.js en React |
| **@react-three/drei** | 10.7.7 | Componentes y utilidades 3D |
| **Three.js** | 0.182.0 | Renderizador de gráficos 3D |
| **Axios** | 1.13.2 | Cliente HTTP con peticiones a la API |
| **Bootstrap** | 5.3.7 | Estilos responsive y UI base |
| **SweetAlert2** | 11.26.20 | Modales y notificaciones |

---

## 🔑 Variables de Entorno

En la carpeta `back/`, copia el archivo `.env.example` para crear tu `.env`:

```bash
# Copiar plantilla en la carpeta back/
cp .env.example .env
```

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `SECRET_KEY` | Clave secreta para firmado de sesiones/tokens | `django-insecure-default-key-for-local-dev-only` |
| `DEBUG` | Activar modo de depuración (`True` / `False`) | `True` |
| `ALLOWED_HOSTS` | Hosts permitidos separados por coma | `localhost,127.0.0.1` |
| `DB_NAME` | Nombre de la base de datos PostgreSQL | `LuxuryHomeBD` (opcional en dev) |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `tu_password` |
| `DB_HOST` | Host de la BD | `localhost` |
| `DB_PORT` | Puerto de la BD | `5432` |

> **Nota:** Para desarrollo local rápido, no necesitas instalar PostgreSQL. Django usará automáticamente **SQLite** (`db.sqlite3`).

---

## 🗄️ Base de Datos y Auto-Seeding

El proyecto incluye un mecanismo de **semillero de datos (auto-seeding)** automático.

Al ejecutar las migraciones en una base de datos nueva o limpia:
```bash
python manage.py migrate
```
Se cargarán automáticamente:
- **24 Categorías jerárquicas** de muebles (Sillas, Oficina, Comedores, Gamer, etc.).
- **4 Productos/Muebles iniciales** vinculados a imágenes y modelos 3D (`.glb`).
- **0 Usuarios admin**: No se crea ningún usuario por defecto para mantener la seguridad.

Para crear tu propio usuario administrador, ejecuta:
```bash
python manage.py createsuperuser
```

---

## 🪟 Instalación en Windows

### Requisitos Previos en Windows
- **Python 3.10+**: [Descargar Python](https://www.python.org/downloads/).  
  ⚠️ **MUY IMPORTANTE**: Al instalar Python, marca la casilla **"Add Python to PATH"**.
- **Node.js 18+**: [Descargar Node.js](https://nodejs.org/).
- **Git**: [Descargar Git](https://git-scm.com/download/win).

---

### 1. Clonar el repositorio

Abre tu terminal favorita (CMD, PowerShell o Git Bash) y ejecuta:

```cmd
git clone https://github.com/tu-usuario/LuxuryHome.git
cd LuxuryHome
```

---

### 2. Configurar el Backend (Django)

Selecciona las instrucciones según la terminal que estés usando:

#### 💻 Opción A: Símbolo del Sistema (CMD)

```cmd
:: 1. Entrar a la carpeta del backend
cd back

:: 2. Crear el entorno virtual llamado 'venv'
python -m venv venv

:: 3. Activar el entorno virtual en CMD
venv\Scripts\activate.bat

:: (Notarás que aparece el prefijo (venv) en la línea de comandos)

:: 4. Actualizar pip e instalar dependencias
python -m pip install --upgrade pip
pip install -r requirements.txt

:: 5. Crear el archivo .env desde el ejemplo
copy .env.example .env

:: 6. Ejecutar migraciones (cargará las 24 categorías y 4 productos automáticamente)
python manage.py migrate

:: 7. Crear el usuario administrador
python manage.py createsuperuser

:: 8. Colectar archivos estáticos para dev
python manage.py collectstatic --noinput

:: 9. Iniciar el servidor de desarrollo
python manage.py runserver
```

---

#### ⚡ Opción B: Windows PowerShell

```powershell
# 1. Entrar a la carpeta del backend
cd back

# 2. Crear el entorno virtual
python -m venv venv

# 3. Activar el entorno virtual en PowerShell
.\venv\Scripts\Activate.ps1

# ⚠️ SI SALE UN ERROR sobre política de ejecución (ExecutionPolicy), ejecuta este comando primero y presiona 'S':
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Crear el archivo .env
copy .env.example .env

# 6. Ejecutar migraciones (cargará datos de catálogo automáticamente)
python manage.py migrate

# 7. Crear usuario superadministrador
python manage.py createsuperuser

# 8. Iniciar el servidor
python manage.py runserver
```

---

#### 🔶 Opción C: Git Bash (Windows)

```bash
# 1. Entrar a la carpeta del backend
cd back

# 2. Crear el entorno virtual
python -m venv venv

# 3. Activar el entorno virtual en Git Bash
source venv/Scripts/activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Crear archivo .env
cp .env.example .env

# 6. Aplicar migraciones
python manage.py migrate

# 7. Crear usuario administrador
python manage.py createsuperuser

# 8. Iniciar servidor de desarrollo
python manage.py runserver
```

---

### 3. Configurar el Frontend (React + Vite)

Abre **otra ventana o pestaña** de terminal (CMD, PowerShell o Git Bash):

```cmd
:: Desde la raíz del proyecto LuxuryHome
cd front

:: Instalar dependencias de Node.js
npm install

:: Iniciar servidor de desarrollo de Vite
npm run dev
```

#### Acceso a las aplicaciones:
- **Frontend (React)**: [http://localhost:5173](http://localhost:5173)
- **Backend (API REST)**: [http://localhost:8000](http://localhost:8000)
- **Panel de Admin Django**: [http://localhost:8000/admin/](http://localhost:8000/admin/)
- **Documentación Swagger**: [http://localhost:8000/swagger/](http://localhost:8000/swagger/)

---

## 🐧 Instalación en Linux / macOS

### Requisitos Previos

```bash
# Debian / Ubuntu
sudo apt update
sudo apt install -y python3 python3-pip python3-venv git curl

# Instalar Node.js 18+ con NVM (Recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
```

### 1. Clonar e Instalar Backend

```bash
git clone https://github.com/tu-usuario/LuxuryHome.git
cd LuxuryHome/back

# Crear y activar entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env

# Migraciones y Auto-seeding
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

### 2. Instalar Frontend

En una nueva terminal:

```bash
cd LuxuryHome/front
npm install
npm run dev
```

---

## 🚀 Uso

1. Abre **http://localhost:5173** en el navegador.
2. Ingresa a la sección `/products` para explorar los muebles cargados.
3. Selecciona un producto para manipular su **modelo 3D interactivo** en tiempo real (rotar, hacer zoom, desplazar).
4. Crea una cuenta desde la interfaz para probar la autenticación JWT.
5. Inicia sesión para agregar muebles al carrito de compras.
6. Entra a **http://localhost:8000/admin/** con las credenciales creadas mediante `createsuperuser` para agregar más categorías, productos o imágenes.

---

## 📡 Endpoints de la API

| Método | Endpoint | Descripción | Requiere Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/users/register/` | Registro de nuevo usuario | ❌ |
| `POST` | `/api/users/login/` | Autenticación y obtención de JWT Tokens | ❌ |
| `POST` | `/api/users/refresh/` | Renovación del Token de Acceso | ❌ |
| `GET` | `/api/store/` | Obtener catálogo de muebles (admite filtros) | ❌ |
| `GET` | `/api/store/:id/` | Obtener detalle de un mueble específico | ❌ |
| `GET` / `POST` | `/api/cart/` | Ver elementos del carrito / Agregar ítem | ✅ |
| `DELETE` | `/api/cart/:id/` | Remover un ítem del carrito | ✅ |
| `GET` / `POST` | `/api/orders/` | Listar pedidos del usuario / Crear pedido | ✅ |
| `GET` | `/swagger/` | Documentación interactiva Swagger UI | ❌ |

> **Nota para peticiones protegidas (✅):** Incluir el header HTTP `Authorization: Bearer <tu_access_token>`.

---

## 🗺️ Estado del Proyecto / Roadmap

### 🟢 Implementado recientemente
- [x] **Auto-seeding de datos**: Carga automática de 24 categorías y 4 muebles con soporte 3D durante `migrate`.
- [x] **Documentación enriquecida**: Soporte detallado para activación de entornos virtuales en **CMD**, **PowerShell** y **Git Bash**.
- [x] **Proxy Vite**: Comunicación sin problemas de CORS en entorno local.

### 🟡 En progreso / Por conectar en UI
- [ ] **Página dedicada de Carrito**: Crear la vista completa `/cart` previa al checkout.
- [ ] **Flujo de Checkout**: Conectar los endpoints de `orders` con la interfaz del frontend.
- [ ] **Vista Mis Pedidos**: Historial y tracking de compras para el cliente.
- [ ] **Protección de rutas**: Utilizar `ProtectedRoute.jsx` en rutas privadas dentro de `AppRoutes.jsx`.

### 🔵 Próximas Mejoras
- [ ] Integración de pasarela de pago (Stripe / MercadoPago).
- [ ] Búsqueda y filtros avanzados por precio/categoría en la UI de productos.
- [ ] Modo oscuro / claro.
- [ ] Docker Compose para empaquetar backend y frontend fácilmente.

---

## 🤝 Contribuciones

1. Haz un Fork del proyecto.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-caracteristica`).
3. Confirma tus cambios (`git commit -m 'Add: Nueva característica'`).
4. Haz Push a la rama (`git push origin feature/nueva-caracteristica`).
5. Abre un Pull Request.

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para obtener más información.
