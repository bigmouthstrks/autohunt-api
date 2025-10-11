# Comandos cURL para AutoHunt API

## 🏥 Health Check

### Health Check Principal

```bash
curl -X GET http://localhost:3000/api/health
```

### Readiness Check

```bash
curl -X GET http://localhost:3000/api/health/ready
```

### Liveness Check

```bash
curl -X GET http://localhost:3000/api/health/live
```

---

## 👤 Users

### Obtener todos los usuarios

```bash
curl -X GET http://localhost:3000/api/users
```

### Obtener un usuario por ID

```bash
curl -X GET http://localhost:3000/api/users/1
```

### Crear un usuario

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "password": "password123",
    "contributions": 0
  }'
```

### Actualizar un usuario

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez Actualizado",
    "email": "juan.perez.updated@example.com",
    "contributions": 5
  }'
```

### Eliminar un usuario

```bash
curl -X DELETE http://localhost:3000/api/users/1
```

---

## 🏷️ Brands (Marcas)

### Obtener todas las marcas

```bash
curl -X GET http://localhost:3000/api/brands
```

### Obtener una marca por ID

```bash
curl -X GET http://localhost:3000/api/brands/1
```

### Crear una marca

```bash
curl -X POST http://localhost:3000/api/brands \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Toyota",
    "country": "Japón",
    "logo": "https://example.com/toyota-logo.png"
  }'
```

### Actualizar una marca

```bash
curl -X PUT http://localhost:3000/api/brands/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Toyota Motors",
    "country": "Japón",
    "logo": "https://example.com/toyota-updated-logo.png"
  }'
```

### Eliminar una marca

```bash
curl -X DELETE http://localhost:3000/api/brands/1
```

---

## 📋 Models (Modelos de vehículos)

### Obtener todos los modelos

```bash
curl -X GET http://localhost:3000/api/models
```

### Obtener un modelo por ID

```bash
curl -X GET http://localhost:3000/api/models/1
```

### Crear un modelo

```bash
curl -X POST http://localhost:3000/api/models \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Corolla",
    "year": 2024,
    "cylinderCapacity": 1800,
    "transmission": "Automática",
    "horsePower": 140,
    "fuelType": "GASOLINE",
    "weight": 1300
  }'
```

### Actualizar un modelo

```bash
curl -X PUT http://localhost:3000/api/models/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Corolla Hybrid",
    "year": 2024,
    "cylinderCapacity": 1800,
    "transmission": "CVT",
    "horsePower": 140,
    "fuelType": "HYBRID",
    "weight": 1350
  }'
```

### Eliminar un modelo

```bash
curl -X DELETE http://localhost:3000/api/models/1
```

---

## 🚗 Cars (Autos)

### Obtener todos los autos

```bash
curl -X GET http://localhost:3000/api/cars
```

### Obtener un auto por ID

```bash
curl -X GET http://localhost:3000/api/cars/1
```

### Crear un auto

```bash
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": 1,
    "modelId": 1,
    "year": 2024,
    "price": 25000
  }'
```

### Actualizar un auto

```bash
curl -X PUT http://localhost:3000/api/cars/1 \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": 1,
    "modelId": 1,
    "year": 2024,
    "price": 26000
  }'
```

### Eliminar un auto

```bash
curl -X DELETE http://localhost:3000/api/cars/1
```

---

## 📝 Notas Importantes

### Orden de creación recomendado:

1. **Primero**: Crear Brands (marcas)
2. **Segundo**: Crear Models (modelos)
3. **Tercero**: Crear Cars (autos que referencian brandId y modelId)
4. **Users**: Pueden crearse en cualquier momento (independientes)

### Tipos de combustible válidos (fuelType):

- `GASOLINE`
- `DIESEL`
- `ELECTRIC`
- `HYBRID`
- `OTHER`

### Formato de respuestas exitosas:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### Formato de respuestas con error:

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalle técnico del error"
}
```

