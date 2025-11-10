# Migración de Roles - De Columna Simple a Relación ManyToMany

## Cambios Realizados

### 1. Nueva Entidad: `Role`
- Ubicación: `src/main/java/com/picantito/picantito/entities/Role.java`
- Campos: `id`, `nombre`
- Anotaciones: `@Entity`, `@Table(name = "roles")`
- Usa Lombok para getters/setters

### 2. Actualización de Entidad: `User`
- Eliminada columna: `rol` (String)
- Agregada relación: `roles` (Set<Role>)
- Tipo de relación: `@ManyToMany(fetch = FetchType.EAGER)`
- Tabla intermedia: `user_roles`
- Método de compatibilidad: `getRol()` - devuelve el nombre del primer rol (mantiene compatibilidad con DTOs)
- Método helper: `addRoleByName(String)` - facilita asignación de roles en tests

### 3. Nuevo Repositorio: `RoleRepository`
- Ubicación: `src/main/java/com/picantito/picantito/repository/RoleRepository.java`
- Método: `findByNombre(String nombre)` - buscar rol por nombre

### 4. Actualización de Repositorio: `UsuarioRepository`
- Métodos actualizados para usar queries JPQL:
  - `findByRol(String rolNombre)` - busca usuarios con un rol específico
  - `findByRolAndEstado(String rolNombre, String estado)` - busca por rol y estado

### 5. Actualización de Servicio: `AutenticacionServiceImpl`
- Agregada dependencia: `RoleRepository`
- Método `registrarUsuario()`: ahora crea/busca el rol "USER" y lo asigna al usuario
- Método `edicionPerfil()`: mantiene los roles del usuario (no permite cambio en edición de perfil)

### 6. Actualización de Base de Datos

#### Schema (`sql/create_schema.sql`):
```sql
-- Nueva tabla Roles
CREATE TABLE Roles (
    ID SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Nueva tabla User_Roles (tabla intermedia)
CREATE TABLE User_Roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Usuarios(ID) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(ID) ON DELETE CASCADE
);

-- Tabla Usuarios - columna 'rol' eliminada
```

#### Datos de prueba (`sql/datos_picantito.sql`):
```sql
-- Insertar roles
INSERT INTO public.roles (id, nombre) VALUES (1, 'ADMIN');
INSERT INTO public.roles (id, nombre) VALUES (2, 'USER');
INSERT INTO public.roles (id, nombre) VALUES (3, 'CLIENTE');
INSERT INTO public.roles (id, nombre) VALUES (4, 'OPERADOR');
INSERT INTO public.roles (id, nombre) VALUES (5, 'REPARTIDOR');

-- Usuarios sin columna 'rol'
INSERT INTO public.usuarios (...) VALUES (...); -- sin campo rol

-- Asignar roles a usuarios
INSERT INTO public.user_roles (user_id, role_id) VALUES (1, 1); -- admin -> ADMIN
INSERT INTO public.user_roles (user_id, role_id) VALUES (2, 3); -- cliente1 -> CLIENTE
-- etc.
```

#### Script de migración (`sql/migration_rol_to_manytomany.sql`):
- Convierte datos existentes sin pérdida de información
- Crea tablas `roles` y `user_roles`
- Migra datos de columna `rol` a la tabla intermedia
- Elimina la columna `rol` antigua

### 7. Actualización de Tests
Todos los tests fueron actualizados para usar `addRoleByName()` en lugar de `setRol()`:
- `PedidoServiceMockTest.java`
- `PedidoServiceIntegrationTest.java`
- `UsuarioRepositoryTest.java`
- `PedidoControllerMockTest.java`

## Compatibilidad con Endpoints Existentes

✅ **Los endpoints devuelven exactamente la misma información** gracias al método `getRol()` en la entidad `User`:
- DTOs existentes siguen funcionando sin cambios
- Respuestas JSON mantienen el campo `rol` con el mismo formato
- Controllers no requieren modificaciones

## Pasos para Aplicar en Producción

### Opción 1: Base de datos nueva
1. Ejecutar `sql/create_schema.sql`
2. Ejecutar `sql/datos_picantito.sql`

### Opción 2: Migrar base de datos existente
1. Hacer backup de la base de datos
2. Ejecutar `sql/migration_rol_to_manytomany.sql`
3. Verificar que los roles se migraron correctamente
4. Reiniciar la aplicación Spring Boot

## Verificación Post-Migración

```sql
-- Verificar roles creados
SELECT * FROM roles;

-- Verificar asignación de roles a usuarios
SELECT u.nombreusuario, r.nombre as rol
FROM usuarios u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id;
```

## Beneficios de Este Cambio

1. ✅ **Flexibilidad**: Un usuario puede tener múltiples roles
2. ✅ **Normalización**: Los roles están en una tabla separada
3. ✅ **Mantenibilidad**: Fácil agregar/modificar roles
4. ✅ **Integridad**: Relaciones con foreign keys
5. ✅ **Compatibilidad**: API externa se mantiene igual
6. ✅ **Escalabilidad**: Preparado para gestión de permisos futura
