# Sistema de Objetos Perdidos - Docker

Este documento explica cómo ejecutar el sistema completo usando Docker y Docker Compose.

## 🐳 Prerrequisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- Al menos 4GB de RAM disponible

## 🚀 Ejecución con Docker Compose

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd Proyecto
```

### 2. Configurar variables de entorno (opcional)
El `docker-compose.yml` ya incluye variables de entorno predeterminadas, pero puedes personalizarlas:

```yaml
# En docker-compose.yml, sección backend > environment:
RECAPTCHA_SECRET_KEY: tu_clave_secreta_recaptcha
JWT_SECRET: tu_clave_jwt_personalizada
```

### 3. Ejecutar el sistema completo
```bash
docker-compose up -d
```

### 4. Verificar que los contenedores estén ejecutándose
```bash
docker-compose ps
```

## 🌐 Acceso a los servicios

Una vez ejecutándose, puedes acceder a:

- **Frontend (React):** http://localhost:5173
- **Backend API:** http://localhost:3000
- **phpMyAdmin:** http://localhost:8080
  - Usuario: `root`
  - Contraseña: `root123`

## 📊 Estructura de contenedores

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `frontend` | 5173 | Aplicación React con Nginx |
| `backend` | 3000 | API Node.js/TypeScript |
| `mysql` | 3306 | Base de datos MySQL 8.0 |
| `phpmyadmin` | 8080 | Administrador de base de datos |

## 🔧 Comandos útiles

### Ver logs de los contenedores
```bash
# Todos los servicios
docker-compose logs -f

# Solo un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Detener los servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ elimina la base de datos)
```bash
docker-compose down -v
```

### Reconstruir imágenes
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Acceder al contenedor del backend
```bash
docker-compose exec backend sh
```

### Acceder al contenedor de MySQL
```bash
docker-compose exec mysql mysql -u root -p
# Contraseña: root123
```

## 🗄️ Base de datos

### Inicialización automática
- La base de datos se inicializa automáticamente con el script `database/init.sql`
- Se crean todas las tablas necesarias y datos de prueba
- **Esquema actualizado incluye:**
  - **Users:** Sistema completo de usuarios con roles y verificación
  - **Reports:** Reportes con fechas específicas y métodos de contacto
  - **Categories:** 11 categorías detalladas de objetos
  - **Locations:** 80+ ubicaciones específicas del campus universitario
  - **Images:** Sistema de imágenes asociadas a reportes

### Estructura de tablas principal
- **Users:** `user_id`, `email`, `password_hash`, `name`, `phone_number`, `is_confirmed`, `is_active`, `role`
- **Reports:** `report_id`, `user_id`, `category_id`, `location_id`, `title`, `description`, `status`, `date_lost_or_found`, `contact_method`
- **Categories:** Incluye "Electrónica", "Accesorios personales", "Documentos", etc.
- **Locations:** Ubicaciones reales del campus como "404 - Matemáticas y Física", "102 - Biblioteca Central", etc.

### Credenciales de base de datos
- **Host:** mysql (dentro de Docker network)
- **Usuario:** app_user
- **Contraseña:** app_password123
- **Base de datos:** objetos_perdidos

### Datos persistentes
Los datos de MySQL se almacenan en un volumen Docker llamado `mysql_data`, por lo que persisten entre reinicios.

## 🔐 Configuración de reCAPTCHA

Para que funcione correctamente:

1. **Frontend:** Configurar `VITE_RECAPTCHA_SITE_KEY` en docker-compose.yml
2. **Backend:** Configurar `RECAPTCHA_SECRET_KEY` en docker-compose.yml
3. Las claves deben ser válidas de Google reCAPTCHA v2

## 🔍 Solución de problemas

### El frontend no puede conectarse al backend
```bash
# Verificar que ambos contenedores estén en la misma red
docker network ls
docker network inspect proyecto_objetos_perdidos_network
```

### Error de conexión a MySQL
```bash
# Verificar que MySQL esté listo
docker-compose logs mysql

# Reiniciar solo MySQL
docker-compose restart mysql
```

### Problemas de permisos con uploads
```bash
# Asegurar permisos en el directorio de uploads
docker-compose exec backend chown -R node:node /app/src/uploads
```

### Reconstruir desde cero
```bash
# Detener todo
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Limpiar sistema Docker
docker system prune -a

# Reconstruir todo
docker-compose up --build -d
```

## 📱 Desarrollo con Docker

### Desarrollo con hot reload

Para desarrollo, puedes usar bind mounts:

```yaml
# Añadir a docker-compose.yml en servicio backend:
volumes:
  - ./backend/src:/app/src
  - ./backend/src/uploads:/app/src/uploads
```

```yaml
# Añadir a docker-compose.yml en servicio frontend:
volumes:
  - ./frontend/src:/app/src
```

### Variables de entorno para desarrollo
Crear archivos `.env.docker` específicos para Docker:

```bash
# backend/.env.docker
NODE_ENV=development
DB_HOST=mysql
# ... otras variables
```

## 🚀 Despliegue en producción

### Configuraciones recomendadas para producción:

1. **Cambiar credenciales por defecto**
2. **Usar secretos de Docker para datos sensibles**
3. **Configurar reverse proxy (nginx)**
4. **Habilitar SSL/TLS**
5. **Configurar backup automático de MySQL**

### Ejemplo con secretos:
```yaml
secrets:
  mysql_root_password:
    file: ./secrets/mysql_root_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

## 📋 Lista de verificación de despliegue

- [ ] Cambiar todas las contraseñas por defecto
- [ ] Configurar claves reCAPTCHA válidas
- [ ] Verificar variables de entorno de producción
- [ ] Configurar backup de base de datos
- [ ] Probar todos los endpoints de la API
- [ ] Verificar funcionalidad de upload de imágenes
- [ ] Probar autenticación y reCAPTCHA
- [ ] Configurar monitoreo y logs

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica el estado: `docker-compose ps`
3. Consulta la documentación del proyecto
4. Crea un issue en el repositorio
