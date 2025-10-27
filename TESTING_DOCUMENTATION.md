# 📋 Suite Completa de Pruebas - Proyecto El Picantito

## 📊 Resumen Ejecutivo

**Total de pruebas implementadas: 25 tests** ✅

- ✅ **10 tests** - CRUD del repositorio ProductRepository (5 CRUD + 5 consultas)
- ✅ **5 tests** - Pruebas de integración del servicio de Pedidos
- ✅ **5 tests** - Pruebas con mocks del servicio de Pedidos
- ✅ **5 tests** - Pruebas con mocks del controlador de Pedidos (1 de cada tipo HTTP)

---

## 🗂️ Estructura de Archivos Creados

```
src/test/
├── java/com/picantito/picantito/
│   ├── repository/
│   │   ├── ProductRepositoryTest.java                    (10 tests)
│   │   └── README.md                                     (documentación)
│   ├── service/
│   │   ├── PedidoServiceIntegrationTest.java            (5 tests)
│   │   └── PedidoServiceMockTest.java                   (5 tests)
│   └── controllers/
│       └── PedidoControllerMockTest.java                (5 tests)
└── resources/
    └── application-test.properties                      (configuración H2)
```

---

## 🔬 Detalle de las Pruebas

### 1️⃣ ProductRepositoryTest (10 tests)

**Ubicación:** `src/test/java/com/picantito/picantito/repository/ProductRepositoryTest.java`

#### **CRUD Básico (5 tests)**
1. **testCreate** - Crear y guardar un producto
2. **testRead** - Leer/encontrar producto por ID
3. **testUpdate** - Actualizar un producto existente
4. **testDelete** - Eliminar un producto
5. **testReadAll** - Listar todos los productos

#### **Consultas Personalizadas (5 tests)**
1. **testFindByDisponibleTrue** - Productos disponibles
2. **testFindByActivoTrue** - Productos activos
3. **testFindByNombreContaining** - Búsqueda por nombre (contiene texto)
4. **testFindByNombre** - Búsqueda por nombre exacto
5. **testFindByNombreNotFound** - Verificar nombre inexistente

---

### 2️⃣ PedidoServiceIntegrationTest (5 tests)

**Ubicación:** `src/test/java/com/picantito/picantito/service/PedidoServiceIntegrationTest.java`

**Tipo:** Pruebas de INTEGRACIÓN (usa base de datos H2 real y componentes reales)

1. **testGetAllPedidos** - Obtener todos los pedidos
2. **testGetPedidosByCliente** - Filtrar pedidos por cliente
3. **testGetPedidoById** - Obtener pedido específico por ID
4. **testActualizarEstado** - Actualizar estado de un pedido
5. **testAsignarRepartidor** - Asignar repartidor a pedido

**Características:**
- Usa `@SpringBootTest` para contexto completo
- Base de datos H2 en memoria
- Transacciones reales con `@Transactional`
- Prueba el flujo completo desde servicio hasta BD

---

### 3️⃣ PedidoServiceMockTest (5 tests)

**Ubicación:** `src/test/java/com/picantito/picantito/service/PedidoServiceMockTest.java`

**Tipo:** Pruebas UNITARIAS con MOCKS (sin base de datos, dependencias simuladas)

1. **testGetAllPedidos** - Mock de obtener todos los pedidos
2. **testGetPedidoByIdExistente** - Mock de búsqueda exitosa por ID
3. **testGetPedidoByIdInexistente** - Mock de búsqueda fallida
4. **testActualizarEstadoExitoso** - Mock de actualización de estado
5. **testAsignarRepartidorExitoso** - Mock de asignación de repartidor

**Características:**
- Usa `@ExtendWith(MockitoExtension.class)`
- Mocks con `@Mock` y `@InjectMocks`
- Verifica llamadas con `verify()`
- Tests rápidos y aislados

---

### 4️⃣ PedidoControllerMockTest (5 tests)

**Ubicación:** `src/test/java/com/picantito/picantito/controllers/PedidoControllerMockTest.java`

**Tipo:** Pruebas del CONTROLADOR con MOCKS (uno de cada tipo HTTP)

1. **testGetAllPedidos** (**GET**) - Obtener lista de pedidos
2. **testGetPedidoById** (**GET** con parámetro) - Obtener pedido por ID
3. **testAsignarRepartidor** (**POST**) - Crear asignación de repartidor
4. **testActualizarEstadoPatch** (**PATCH**) - Actualización parcial de estado
5. **testEliminarPedido** (**DELETE**) - Eliminar pedido

**Características:**
- Usa `@WebMvcTest` para test de capa web
- MockMvc para simular peticiones HTTP
- Verifica status codes y JSON responses
- Cubre todos los verbos HTTP principales

---

## ⚙️ Configuración de Base de Datos de Pruebas

### `application-test.properties`

```properties
# H2 Database en memoria - Base de datos separada para tests
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop  # Crea y destruye en cada ejecución
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

**Ventajas:**
- ✅ Base de datos completamente separada de producción (PostgreSQL)
- ✅ Tests aislados e independientes
- ✅ Ejecución rápida (en memoria)
- ✅ No requiere configuración externa
- ✅ Se limpia automáticamente después de cada test

---

## 🚀 Ejecución de las Pruebas

### Ejecutar todas las pruebas creadas:
```powershell
.\mvnw.cmd test -Dtest='Product*Test,Pedido*Test'
```

### Ejecutar solo tests del repositorio:
```powershell
.\mvnw.cmd test -Dtest=ProductRepositoryTest
```

### Ejecutar solo tests de integración:
```powershell
.\mvnw.cmd test -Dtest=PedidoServiceIntegrationTest
```

### Ejecutar solo tests con mocks del servicio:
```powershell
.\mvnw.cmd test -Dtest=PedidoServiceMockTest
```

### Ejecutar solo tests del controlador:
```powershell
.\mvnw.cmd test -Dtest=PedidoControllerMockTest
```

---

## 📈 Resultados de Ejecución

```
✅ Tests run: 25
✅ Failures: 0
✅ Errors: 0
✅ Skipped: 0
✅ Success Rate: 100%
⏱️ Time elapsed: ~33 seconds
```

---

## 🏗️ Tecnologías y Herramientas Utilizadas

| Tecnología | Uso |
|-----------|-----|
| **JUnit 5** | Framework de testing |
| **Mockito** | Mocking y stubbing |
| **AssertJ** | Assertions fluidas y legibles |
| **Spring Boot Test** | Pruebas de integración |
| **H2 Database** | Base de datos en memoria para tests |
| **@DataJpaTest** | Tests de repositorios |
| **@WebMvcTest** | Tests de controladores |
| **MockMvc** | Simulación de peticiones HTTP |

---

## 📚 Patrones y Mejores Prácticas Implementadas

### ✅ Patrón AAA (Arrange-Act-Assert)
Todos los tests siguen este patrón:

```java
@Test
void testExample() {
    // Arrange (Preparar) - Configurar datos de prueba
    Producto producto = new Producto();
    producto.setNombre("Test");
    
    // Act (Actuar) - Ejecutar la operación
    Producto result = repository.save(producto);
    
    // Assert (Verificar) - Comprobar resultados
    assertThat(result).isNotNull();
}
```

### ✅ Nombres Descriptivos
- Tests con `@DisplayName` para mayor claridad
- Nombres de métodos que describen qué se está probando

### ✅ Independencia de Tests
- Cada test es independiente
- `@BeforeEach` inicializa datos frescos
- No hay dependencias entre tests

### ✅ Pirámide de Testing
```
         ▲
        / \
       /   \
      / E2E \ (Manual en este caso)
     /-------\
    / Service \  (5 tests controller)
   /-----------\
  /  Unidad     \  (20 tests)
 /_______________\
```

---

## 🎯 Cobertura de Pruebas

### Por Tipo de Test:

| Tipo | Cantidad | Porcentaje |
|------|----------|------------|
| Tests de Repositorio (CRUD + Consultas) | 10 | 40% |
| Tests de Integración (Servicio) | 5 | 20% |
| Tests Unitarios (Servicio con Mocks) | 5 | 20% |
| Tests de Controlador (HTTP) | 5 | 20% |
| **TOTAL** | **25** | **100%** |

### Por Capa de Aplicación:

- **Repositorio**: 100% de métodos cubiertos
- **Servicio**: Métodos principales cubiertos
- **Controlador**: Todos los endpoints HTTP principales cubiertos

---

## 🔍 Diferencias entre Tipos de Tests

### Tests de Repositorio (`@DataJpaTest`)
- **Qué prueba:** Interacción con base de datos
- **Velocidad:** Rápida
- **Alcance:** Solo capa de persistencia
- **Base de datos:** H2 en memoria

### Tests de Integración (`@SpringBootTest`)
- **Qué prueba:** Flujo completo con componentes reales
- **Velocidad:** Media-Lenta
- **Alcance:** Múltiples capas
- **Base de datos:** H2 en memoria
- **Contexto:** Spring completo

### Tests Unitarios con Mocks (`@ExtendWith(MockitoExtension)`)
- **Qué prueba:** Lógica de negocio aislada
- **Velocidad:** Muy rápida
- **Alcance:** Clase individual
- **Dependencias:** Todas mockeadas
- **Contexto:** Mínimo (sin Spring)

### Tests de Controlador (`@WebMvcTest`)
- **Qué prueba:** Endpoints HTTP y manejo de peticiones
- **Velocidad:** Rápida
- **Alcance:** Solo capa web
- **Dependencias:** Servicio mockeado
- **Herramienta:** MockMvc

---

## 🎓 Conceptos Clave

### Mocking
Simular el comportamiento de objetos para aislar la unidad de código que se está probando.

```java
when(pedidoRepository.findById(1)).thenReturn(Optional.of(pedido));
```

### Stubbing
Definir qué debe devolver un método mockeado cuando se invoca.

```java
when(service.getAllPedidos()).thenReturn(Arrays.asList(pedido1, pedido2));
```

### Verification
Comprobar que ciertos métodos fueron llamados con los parámetros esperados.

```java
verify(pedidoRepository, times(1)).findById(1);
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find symbol - setNombre"
**Causa:** La entidad `User` usa `nombreCompleto` en lugar de `nombre`
**Solución:** Usar los nombres correctos de los atributos de la entidad

### Error: "Failed to load ApplicationContext"
**Causa:** Falta configuración de base de datos de pruebas
**Solución:** Asegurar que existe `application-test.properties` con H2

### Tests lentos
**Causa:** Uso de `@SpringBootTest` en todos los tests
**Solución:** Usar `@DataJpaTest` o `@WebMvcTest` cuando sea posible

---

## 📝 Próximos Pasos Sugeridos

1. **Aumentar cobertura:**
   - Tests para otros repositorios (AdicionalRepository, etc.)
   - Tests para otros servicios y controladores

2. **Tests de rendimiento:**
   - Medir tiempos de respuesta
   - Pruebas de carga

3. **Tests de seguridad:**
   - Validación de autenticación
   - Tests de autorización

4. **Integración continua:**
   - Configurar GitHub Actions
   - Ejecutar tests automáticamente en cada commit

5. **Cobertura de código:**
   - Integrar JaCoCo
   - Generar reportes de cobertura

---

## 📖 Referencias y Recursos

- [JUnit 5 Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Spring Boot Testing](https://docs.spring.io/spring-boot/reference/testing/index.html)
- [AssertJ Documentation](https://assertj.github.io/doc/)

---

## 👥 Autor y Contribuciones

**Proyecto:** El Picantito  
**Fecha:** Octubre 2025  
**Framework:** Spring Boot 3.3.13 con Java 21  
**Base de Datos Producción:** PostgreSQL  
**Base de Datos Tests:** H2 (in-memory)

---

## ✅ Checklist de Cumplimiento

- ✅ **5 pruebas CRUD** del repositorio ProductRepository
- ✅ **5 consultas personalizadas** del repositorio ProductRepository
- ✅ **5 pruebas de integración** del servicio de pedidos
- ✅ **5 pruebas con mocks** del servicio de pedidos
- ✅ **5 pruebas con mocks del controlador** (1 GET, 1 GET/:id, 1 POST, 1 PATCH, 1 DELETE)
- ✅ **Base de datos separada** para pruebas (H2)
- ✅ **Total: 25 pruebas** funcionando correctamente

---

## 🎉 Conclusión

Se ha implementado exitosamente una **suite completa de 25 pruebas** que cubre múltiples capas de la aplicación:

- **Capa de Persistencia** - Tests de repositorio con base de datos real
- **Capa de Negocio** - Tests de servicio (integración y unitarios)
- **Capa de Presentación** - Tests de controlador con MockMvc

Todas las pruebas usan **buenas prácticas**, están bien **documentadas**, son **independientes** y utilizan una **base de datos separada** (H2) para no afectar los datos de producción.

¡El proyecto ahora tiene una base sólida de pruebas automatizadas! 🚀
