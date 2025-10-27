# Pruebas de Repositorio - ProductRepository

## 📋 Descripción

Este proyecto incluye pruebas unitarias completas para el repositorio `ProductRepository` utilizando Spring Boot Test y una base de datos H2 en memoria, siguiendo las mejores prácticas de testing.

## 🎯 Configuración

### Base de Datos de Pruebas

Las pruebas utilizan **H2 Database** en memoria, completamente separada de la base de datos PostgreSQL de producción. Esto garantiza:

- ✅ **Aislamiento**: Los tests no afectan los datos de producción
- ✅ **Velocidad**: Base de datos en memoria es más rápida
- ✅ **Limpieza**: Cada test inicia con una base de datos limpia
- ✅ **Portabilidad**: No requiere configuración externa

### Archivos Creados

1. **`src/test/resources/application-test.properties`**
   - Configuración de H2 para pruebas
   - Modo memoria temporal (desaparece al terminar los tests)
   - Hibernate crea/elimina las tablas automáticamente

2. **`src/test/java/com/picantito/picantito/repository/ProductRepositoryTest.java`**
   - Suite completa de pruebas para ProductRepository
   - 15 tests que cubren todas las operaciones CRUD y consultas personalizadas

3. **`pom.xml` (modificado)**
   - Agregada dependencia de H2 con scope `test`

## 🧪 Tests Implementados

### Tests Básicos CRUD

1. **`testSaveProducto`** - Guardar un nuevo producto
2. **`testFindById`** - Buscar producto por ID
3. **`testFindAll`** - Obtener todos los productos
4. **`testUpdateProducto`** - Actualizar un producto existente
5. **`testDeleteProducto`** - Eliminar un producto
6. **`testDeleteAll`** - Eliminar todos los productos

### Tests de Consultas Personalizadas

7. **`testFindByDisponibleTrue`** - Buscar productos disponibles
8. **`testFindByNombreContainingIgnoreCase`** - Buscar por nombre (case-insensitive)
9. **`testFindByNombreContainingIgnoreCaseWithUpperCase`** - Buscar con mayúsculas
10. **`testFindByActivoTrue`** - Buscar productos activos
11. **`testFindByNombre`** - Buscar por nombre exacto
12. **`testFindByNombreNotFound`** - Verificar búsqueda sin resultados

### Tests de Utilidad

13. **`testCountProductos`** - Contar total de productos
14. **`testExistsById`** - Verificar existencia de producto
15. **`testFindProductosDisponiblesYActivos`** - Combinación de filtros

## 🚀 Ejecutar las Pruebas

### Ejecutar todos los tests del repositorio

```powershell
.\mvnw.cmd test -Dtest=ProductRepositoryTest
```

### Ejecutar un test específico

```powershell
.\mvnw.cmd test -Dtest=ProductRepositoryTest#testSaveProducto
```

### Ejecutar todos los tests del proyecto

```powershell
.\mvnw.cmd test
```

## 📊 Resultados

```
Tests run: 15
Failures: 0
Errors: 0
Skipped: 0
Success Rate: 100%
```

## 🔧 Estructura de los Tests

### Patrón AAA (Arrange-Act-Assert)

Todos los tests siguen el patrón AAA:

```java
@Test
@DisplayName("Test: Descripción clara del test")
void testNombreDescriptivo() {
    // Arrange (Preparar) - Configurar datos de prueba
    Producto producto = new Producto();
    producto.setNombre("Taco al Pastor");
    // ... más configuración
    
    // Act (Actuar) - Ejecutar la operación a probar
    Producto savedProducto = productRepository.save(producto);
    
    // Assert (Verificar) - Comprobar los resultados
    assertThat(savedProducto).isNotNull();
    assertThat(savedProducto.getId()).isNotNull();
}
```

### Anotaciones Utilizadas

- `@DataJpaTest` - Configura el contexto de JPA para pruebas
- `@ActiveProfiles("test")` - Usa el perfil de configuración de test
- `@BeforeEach` - Inicializa datos antes de cada test
- `@Test` - Marca un método como test
- `@DisplayName` - Proporciona nombres descriptivos para los tests

### Datos de Prueba

Los tests utilizan 4 productos de ejemplo:

1. **Taco al Pastor** - Disponible y activo
2. **Taco de Suadero** - Disponible y activo
3. **Quesadilla** - NO disponible, pero activo
4. **Producto Inactivo** - Disponible pero NO activo

## 🎨 Ventajas de esta Implementación

### 1. Independencia
- Cada test es independiente y puede ejecutarse en cualquier orden
- No dependen de datos preexistentes
- Limpieza automática después de cada test

### 2. Cobertura Completa
- Tests para todas las operaciones CRUD
- Tests para todas las consultas personalizadas del repositorio
- Tests de casos límite (búsquedas sin resultados, etc.)

### 3. Mantenibilidad
- Código limpio y bien documentado
- Nombres descriptivos de tests
- Patrón consistente en todos los tests

### 4. Velocidad
- Tests se ejecutan en ~16 segundos
- Base de datos en memoria es muy rápida
- No requiere levantar PostgreSQL

## 🔍 Verificación de Aislamiento

Para verificar que los tests no afectan la base de datos de producción:

1. Los tests usan H2 (in-memory) mientras producción usa PostgreSQL
2. Perfil `test` con configuración completamente separada
3. `spring.jpa.hibernate.ddl-auto=create-drop` recrea las tablas en cada ejecución

## 📚 Mejores Prácticas Implementadas

✅ Base de datos separada para tests (H2)  
✅ Uso de `@DataJpaTest` para tests de repositorio  
✅ Perfil de configuración específico para tests  
✅ Limpieza de datos entre tests (`@BeforeEach`)  
✅ Nombres descriptivos con `@DisplayName`  
✅ Uso de AssertJ para assertions legibles  
✅ Tests independientes y repetibles  
✅ Cobertura completa de todas las operaciones  

## 🎯 Próximos Pasos

Si deseas extender las pruebas, puedes:

1. **Agregar tests para otros repositorios**: AdicionalRepository, PedidoRepository, etc.
2. **Tests de Service Layer**: Probar la lógica de negocio
3. **Tests de Controller**: Probar los endpoints REST con `@WebMvcTest`
4. **Tests de integración**: Probar el flujo completo de la aplicación
5. **Análisis de cobertura**: Usar JaCoCo para medir la cobertura de código

## 📝 Notas Adicionales

- Los tests usan **Lombok** (`@Data`, `@NoArgsConstructor`) igual que las entidades de producción
- Se usa **AssertJ** para assertions más legibles y expresivas
- H2 es compatible con PostgreSQL en sintaxis SQL básica
- Los logs SQL están habilitados para debugging (puedes verlos en la salida de los tests)

## 🤝 Contribuir

Para agregar nuevos tests:

1. Sigue el patrón AAA (Arrange-Act-Assert)
2. Usa nombres descriptivos con `@DisplayName`
3. Asegúrate de limpiar datos en `@BeforeEach` si es necesario
4. Verifica que los tests sean independientes
5. Ejecuta todos los tests antes de hacer commit

---

**Autor**: Generado para el proyecto El Picantito  
**Fecha**: Octubre 2025  
**Framework**: Spring Boot 3.3.13 con Java 21
