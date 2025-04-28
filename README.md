# Popular Prueba Técnica — Arquitectura de Microservicios

Este es un proyecto con fines meramente evaluativos el cual implementa una arquitectura de microservicios en Node.js, Express y TypeScript, siguiendo buenas prácticas reales de industria:

- **Management Service** (gestión de perfiles)
- **Retriever Service** (autenticación de usuarios)
- **API Gateway** (proxy inverso seguro)
- **RabbitMQ** (comunicación asíncrona basada en eventos)
- **MongoDB** (persistencia)

---

# Tecnologías

- Node.js
- Express
- TypeScript
- MongoDB
- RabbitMQ
- Docker + Docker Compose
- Kubernetes
- TLS 1.2 en las APIs
- JWT (RS256) para firma de eventos y tokens
- Zod para validaciones de datos

---

# Estructura de Proyecto

```
/API-gateway
/certs
/k8s
/management-service
/retriever-service
docker-compose.yml
README.md
```

---

# Requisitos Previos

- Docker Desktop instalado
- Kubernetes habilitado en Docker Desktop
- Node.js + npm instalados si desean ejecutarlo de manera local (opcional, esta preparado Docker Compose y Kubernetes)

---

# Variables de Entorno Importantes

Cada servicio tiene su propio `.env`, **provistos en el proyecto** para facilitar la prueba.

**Nota**: Se perfectamente que los .env estan terminantemente prohibidos subirlos al codigo fuente pero, debido a la naturaleza del proyecto y para dejar lo mas preparado posible el ambiente
Para los evaluadores, decidí subirlo en esta ocasión.

---

# TLS - Certificados

Todos los servicios usan TLS 1.2.  
Los certificados se encuentran en la carpeta `/certs`.

> Se utilizan certificados autofirmados para fines de prueba.

---

# Cómo levantar todo el proyecto

### 1. Usando Docker Compose

```bash
docker-compose up --build
```

### 2. Usando Kubernetes

```bash
# Crear secretos TLS en Kubernetes
kubectl create secret generic ssl-certs --from-file=certs/cert.pem --from-file=certs/key.pem

# Aplicar los YAML de Kubernetes
kubectl apply -f k8s/
```

> No es necesario hacer docker build porque ya se usan imágenes públicas subidas a mi repositorio de Docker Hub.

# Endpoints para probar

**Nota**: Para levantamiento local o con Docker Compose, el puerto es 8080, para Kubernetes es 30080, esto debido a que kubernetes lo configure para habilitar un NodePort con el cual se le pueden hacer peticiones desde fuera del cluster y evitando asi tener que configurar algun DNS y certificados validos (caso de si hubiera implementado un Ingress), entonces por eso el puerto alto, cabe mencionar que NodePort es recomdando solo para fines de prueba, en situaciones reales si se debe usar un Ingress y configurar todo lo necesario.

```
GET https://localhost:8080/healthcheck
```

> Cada microservicio tiene expuesto su propio healthcheck, por lo cual si se desea ver por separado es posible accediendo a:
>
> - 3001 o 30081: management
> - 3002 o 30082: retreiver

## Management Service

### Crear un perfil

```
POST https://localhost:8080/management/profile
Content-Type: application/json

{
  "name": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}
```

> Devuelve Token Bearer para ser utilizado en los otros endpoints a excepción del Login

### Actualizar un perfil

```
PUT https://localhost:8080/management/profile/{id}
Content-Type: application/json

{
  "name": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com"
}
```

### Eliminar un perfil

```
DELETE https://localhost:8080/management/profile/{id}
```

## Retriever Service

### Obtener perfil por ID

```
GET https://localhost:8080/retriever/profile/{id}
```

### Autenticar usuario

```
POST https://localhost:8080/retriever/auth/login
Content-Type: application/json

{
  "username": "john.doe@example.com",
  "password": "test"
}
```

> Dummy Login, no importa lo que se le envie como valores, este endpoint esta hecho solo justificar una interacción entre microservicios

# Posibles Mejoras Basicas

- Logger para registrar sucesos del proyecto.

- Swagger para documentar la API.

- EventStore para trazabilidad de eventos.
