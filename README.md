# TWL Networks — Backend API

API REST desarrollada con Node.js + Express + MySQL2 para la plataforma TWL Networks.

---

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales reales

# 3. Iniciar en desarrollo
npm run dev

# 4. Iniciar en producción
npm start
```

---

## Estructura del proyecto

```
src/
├── index.js                  # Punto de entrada
├── config/
│   └── db.js                 # Conexión MySQL (pool)
├── middlewares/
│   └── auth.middleware.js    # verifyToken, verifyAdmin
├── services/
│   ├── mail.service.js       # Envío de correos (nodemailer)
│   └── streaming.service.js  # Detección de live en Twitch/YouTube/Kick/TikTok
├── controllers/
│   ├── auth.controller.js
│   ├── programs.controller.js
│   ├── chickboxing.controller.js
│   ├── desempacados.controller.js
│   ├── band.controller.js
│   ├── sponsors.controller.js
│   ├── social.controller.js
│   ├── streaming.controller.js
│   └── admin.controller.js
└── routes/
    ├── auth.routes.js
    ├── programs.routes.js
    ├── chickboxing.routes.js
    ├── desempacados.routes.js
    ├── band.routes.js
    ├── sponsors.routes.js
    ├── social.routes.js
    ├── streaming.routes.js
    └── admin.routes.js
```

---

## Endpoints

### Auth
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Registro de usuario |
| POST | /api/auth/login | No | Login, devuelve JWT |
| GET | /api/auth/profile | Token | Perfil del usuario actual |

### Programas
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/programs | No | Lista todos los programas |
| GET | /api/programs/:id | No | Detalle de un programa |
| GET | /api/programs/:id/content | No | Episodios/clips del programa |

### Chickboxing
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/chickboxing/champions | No | Lista campeones con stats |
| GET | /api/chickboxing/champions/:id | No | Detalle de un campeón |
| POST | /api/chickboxing/apply | Token | Postular un pollo |

### Desempacados
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/desempacados/apply | Token | Postular a entrevista |

### Banda y Productora
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/band/kanat | No | Info de Kanat + integrantes |
| GET | /api/band/label | No | Info de Golden Feather Studios |

### Patrocinadores
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/sponsors | No | Patrocinadores globales (homepage) |
| GET | /api/sponsors/program/:programId | No | Sponsors de un programa |

### Redes Sociales
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/social?entity_type=network | No | Links de TWL Networks |
| GET | /api/social?entity_type=band&entity_id=1 | No | Links de Kanat |

### Streaming
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/streaming/status | No | Estado en vivo en todas las plataformas |

### Admin (requieren token + rol admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/admin/champions | Crear campeón |
| PUT | /api/admin/champions/:id | Editar campeón |
| PUT | /api/admin/champions/:id/stats | Actualizar estadísticas |
| DELETE | /api/admin/champions/:id | Eliminar campeón |
| POST | /api/admin/sponsors | Crear patrocinador |
| PUT | /api/admin/sponsors/:id | Editar patrocinador |
| DELETE | /api/admin/sponsors/:id | Eliminar patrocinador |
| POST | /api/admin/social | Agregar red social |
| PUT | /api/admin/social/:id | Editar red social |
| DELETE | /api/admin/social/:id | Eliminar red social |
| POST | /api/admin/content | Crear episodio/clip |
| PUT | /api/admin/content/:id | Editar contenido |
| DELETE | /api/admin/content/:id | Eliminar contenido |
| GET | /api/admin/applications | Ver postulaciones |
| PUT | /api/admin/band/members/:id | Editar integrante de banda |

---

## Autenticación

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

El token se obtiene al hacer login en `/api/auth/login`.
