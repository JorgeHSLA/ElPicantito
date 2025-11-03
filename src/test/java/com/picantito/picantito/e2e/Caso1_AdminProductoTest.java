package com.picantito.picantito.e2e;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Caso 1: Prueba E2E - Administrador registra un nuevo producto
 * 
 * Flujo:
 * 1. Admin accede al landing page
 * 2. Navega a login
 * 3. Intenta ingresar con credenciales incorrectas (verificar error)
 * 4. Ingresa correctamente
 * 5. Va a sección de productos
 * 6. Crea producto con 2 adicionales
 * 7. Verifica en menú (otra pestaña) que aparezca con los adicionales
 * 8. Agrega un tercer adicional al producto
 * 9. Verifica en menú que tenga los 3 adicionales
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("Caso 1: E2E - Admin registra producto con adicionales")
public class Caso1_AdminProductoTest {

    private static WebDriver driver;
    private static WebDriverWait wait;
    
    private static final String BASE_URL = "http://localhost:4200";
    
    // Credenciales incorrectas y correctas del admin
    private static final String ADMIN_USERNAME_INCORRECTO = "admin_incorrecto";
    private static final String ADMIN_PASSWORD_INCORRECTO = "password_incorrecto";
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";
    
    // Datos del producto a crear
    private static String nombreProducto;
    private static String descripcionProducto;
    private static String precioProducto;
    
    @BeforeAll
    static void setupClass() {
        // Configurar WebDriverManager para ChromeDriver
        WebDriverManager.chromedriver().setup();
        
        // Configurar opciones de Chrome
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        // Descomentar para modo headless (sin interfaz gráfica)
        // options.addArguments("--headless");
        
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        
        // Generar nombre único para el producto
        long timestamp = System.currentTimeMillis();
        nombreProducto = "Taco Test " + timestamp;
        descripcionProducto = "Taco de prueba E2E creado automáticamente";
        precioProducto = "45.50";
    }
    
    @AfterAll
    static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
    
    @Test
    @Order(1)
    @DisplayName("1. Navegar al landing page")
    void test01_NavigateToLandingPage() {
        driver.get(BASE_URL + "/home");
        
        // Esperar a que cargue la página
        wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
        
        // Verificar que estamos en el home
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/home"), 
            "Debería estar en la página home, pero está en: " + currentUrl);
    }
    
    @Test
    @Order(2)
    @DisplayName("2. Navegar a la página de login")
    void test02_NavigateToLogin() {
        // Intentar diferentes estrategias para llegar a login
        try {
            // Estrategia 1: Buscar botón de cuenta y desplegar menú
            try {
                WebElement accountButton = wait.until(ExpectedConditions.elementToBeClickable(
                    By.cssSelector("button, .account-button, [class*='account'], [class*='user-menu']")));
                
                // Verificar si es un botón con ícono de cuenta
                String buttonHtml = accountButton.getAttribute("outerHTML").toLowerCase();
                if (buttonHtml.contains("account") || buttonHtml.contains("user") || 
                    buttonHtml.contains("person") || accountButton.getText().contains("Cuenta")) {
                    accountButton.click();
                    
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            } catch (Exception e) {
                System.out.println("No se encontró botón de cuenta específico, intentando acceso directo...");
            }
            
            // Estrategia 2: Buscar link/botón de login directamente (puede estar en menú o visible)
            WebElement loginLink = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//*[contains(text(), 'Iniciar') or contains(text(), 'Login') or " +
                        "contains(text(), 'Ingresar') or @href='/login' or @routerLink='/login']")));
            loginLink.click();
            
        } catch (Exception e) {
            // Estrategia 3: Navegar directamente a la URL de login
            System.out.println("No se pudo hacer clic en login, navegando directamente a URL");
            driver.get(BASE_URL + "/login");
        }
        
        // Verificar que estamos en login
        wait.until(ExpectedConditions.urlContains("/login"));
        assertTrue(driver.getCurrentUrl().contains("/login"), 
            "Debería estar en la página de login");
    }
    
    @Test
    @Order(3)
    @DisplayName("3. Intentar login con credenciales incorrectas y verificar error")
    void test03_LoginWithIncorrectCredentials() {
        // Esperar a que carguen los campos del formulario por ID
        WebElement usernameInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector("input#nombreUsuario")));
        WebElement passwordInput = driver.findElement(
            By.cssSelector("input#password"));
        
        // Ingresar credenciales incorrectas
        usernameInput.clear();
        usernameInput.sendKeys(ADMIN_USERNAME_INCORRECTO);
        passwordInput.clear();
        passwordInput.sendKeys(ADMIN_PASSWORD_INCORRECTO);
        
        // Hacer clic en el botón de login
        WebElement loginButton = driver.findElement(
            By.cssSelector("button[type='submit']"));
        loginButton.click();
        
        // Esperar y verificar mensaje de error
        WebElement errorMessage = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector(".alert-danger, .error-message, [class*='error']")));
        
        assertNotNull(errorMessage, "Debería mostrar un mensaje de error");
        assertTrue(errorMessage.isDisplayed(), "El mensaje de error debería estar visible");
        
        String errorText = errorMessage.getText().toLowerCase();
        assertTrue(errorText.contains("error") || errorText.contains("incorrecto") || 
                   errorText.contains("inválido") || errorText.contains("credencial"),
            "El mensaje de error debería indicar credenciales incorrectas. Texto actual: " + errorText);
    }
    
    @Test
    @Order(4)
    @DisplayName("4. Login exitoso con credenciales correctas")
    void test04_LoginWithCorrectCredentials() {
        // Pequeña pausa después del error para asegurar que el formulario está listo
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Esperar a que los campos estén disponibles por ID (según el HTML usa id="nombreUsuario" y id="password")
        WebElement usernameInput = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("input#nombreUsuario")));
        WebElement passwordInput = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("input#password")));
        
        // Hacer clic en los campos para enfocarlos
        usernameInput.click();
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Limpiar completamente los campos
        usernameInput.clear();
        usernameInput.sendKeys(Keys.CONTROL + "a");
        usernameInput.sendKeys(Keys.DELETE);
        
        // Ingresar el username caracter por caracter para simular escritura real
        for (char c : ADMIN_USERNAME.toCharArray()) {
            usernameInput.sendKeys(String.valueOf(c));
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        // Verificar que se ingresó correctamente
        String usernameValue = usernameInput.getAttribute("value");
        System.out.println("Username ingresado: '" + usernameValue + "' (esperado: '" + ADMIN_USERNAME + "')");
        
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Hacer clic en el campo de password
        passwordInput.click();
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Limpiar el campo de password
        passwordInput.clear();
        passwordInput.sendKeys(Keys.CONTROL + "a");
        passwordInput.sendKeys(Keys.DELETE);
        
        // Ingresar el password caracter por caracter
        for (char c : ADMIN_PASSWORD.toCharArray()) {
            passwordInput.sendKeys(String.valueOf(c));
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        // Verificar que se ingresó correctamente
        String passwordValue = passwordInput.getAttribute("value");
        System.out.println("Password ingresado: " + passwordValue.length() + " caracteres (esperado: " + ADMIN_PASSWORD.length() + ")");
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Buscar el botón de submit
        WebElement loginButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("button[type='submit']")));
        
        System.out.println("Haciendo clic en botón de login...");
        loginButton.click();
        
        // Esperar un momento para que se procese el login
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verificar si hay un mensaje de error (no debería haberlo)
        List<WebElement> errors = driver.findElements(
            By.cssSelector(".alert-danger, .error-message"));
        
        if (!errors.isEmpty() && errors.get(0).isDisplayed()) {
            String errorText = errors.get(0).getText();
            System.err.println("❌ ERROR DETECTADO: " + errorText);
            fail("Se mostró un error después del login: " + errorText);
        }
        
        // Esperar redirección al dashboard de admin (puede tardar)
        try {
            wait.until(ExpectedConditions.or(
                ExpectedConditions.urlContains("/admin/dashboard"),
                ExpectedConditions.urlContains("/admin")
            ));
        } catch (Exception e) {
            String currentUrl = driver.getCurrentUrl();
            System.err.println("❌ No se redirigió al admin. URL actual: " + currentUrl);
            
            // Tomar screenshot del estado actual para debug
            System.err.println("HTML del body:");
            String bodyHtml = driver.findElement(By.tagName("body")).getText();
            System.err.println(bodyHtml.substring(0, Math.min(500, bodyHtml.length())));
            
            fail("No se redirigió al panel de admin después del login. URL actual: " + currentUrl);
        }
        
        String currentUrl = driver.getCurrentUrl();
        System.out.println("✓ Login exitoso. URL actual: " + currentUrl);
        
        assertTrue(currentUrl.contains("/admin"), 
            "Después del login exitoso debería redirigir al panel de admin. URL actual: " + currentUrl);
    }
    
    @Test
    @Order(5)
    @DisplayName("5. Navegar a la sección de productos")
    void test05_NavigateToProductsSection() {
        // Buscar el enlace/botón de productos en el menú de admin
        WebElement productosLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("a[href='/admin/productos'], a[routerLink='/admin/productos'], " +
                          "[href*='productos'], button[routerLink*='productos']")));
        productosLink.click();
        
        // Verificar que estamos en la página de productos
        wait.until(ExpectedConditions.urlContains("/admin/productos"));
        assertTrue(driver.getCurrentUrl().contains("/admin/productos"), 
            "Debería estar en la página de productos del admin");
    }
    
    @Test
    @Order(6)
    @DisplayName("6. Crear nuevo producto con 2 adicionales")
    void test06_CreateProductWith2Adicionales() {
        // ===== PARTE 1: CREAR EL PRODUCTO =====
        WebElement createButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[contains(text(), 'Nuevo Producto')]")));
        createButton.click();
        
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.cssSelector("#nuevoProductoModal")));
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Llenar el formulario del producto
        WebElement nombreInput = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("#nombre")));
        nombreInput.clear();
        nombreInput.sendKeys(nombreProducto);
        
        WebElement descripcionInput = driver.findElement(By.cssSelector("#descripcion"));
        descripcionInput.clear();
        descripcionInput.sendKeys(descripcionProducto);
        
        WebElement precioInput = driver.findElement(By.cssSelector("#precioDeVenta"));
        precioInput.clear();
        precioInput.sendKeys(precioProducto);
        
        WebElement disponibleCheckbox = driver.findElement(By.cssSelector("#disponible"));
        if (!disponibleCheckbox.isSelected()) {
            disponibleCheckbox.click();
        }
        
        WebElement saveButton = driver.findElement(
            By.cssSelector("#nuevoProductoModal button[type='submit']"));
        saveButton.click();
        
        wait.until(ExpectedConditions.invisibilityOfElementLocated(
            By.cssSelector("#nuevoProductoModal.show")));
        
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        WebElement productoEnTabla = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//td[contains(text(), '" + nombreProducto + "')]")));
        assertNotNull(productoEnTabla, "El producto creado debería aparecer en la tabla");
        
        System.out.println("✓ Producto creado: " + nombreProducto);
        
        // ===== PARTE 2: IR A ADICIONALES Y ASOCIAR 2 ADICIONALES AL PRODUCTO =====
        System.out.println("📝 Navegando a Adicionales para asociar adicionales al producto...");
        
        // Navegar a la página de adicionales
        WebElement adicionalesLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("a[href='/admin/adicionales'], a[routerLink='/admin/adicionales']")));
        adicionalesLink.click();
        
        wait.until(ExpectedConditions.urlContains("/admin/adicionales"));
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Buscar todos los botones de editar adicionales (ícono lápiz)
        List<WebElement> editButtons = driver.findElements(
            By.cssSelector("a.btn-outline-primary[href*='/admin/adicionales/edit/']"));
        
        assertTrue(editButtons.size() >= 2, 
            "Deberían existir al menos 2 adicionales en la BD para asociar");
        
        // ASOCIAR PRIMER ADICIONAL
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", editButtons.get(0));
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        editButtons.get(0).click();
        
        wait.until(ExpectedConditions.urlContains("/admin/adicionales/edit/"));
        
        try {
            Thread.sleep(1500); // Dar tiempo para que carguen los productos
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Buscar el producto recién creado en la lista de productos disponibles y asociarlo
        WebElement productoAAsociar = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//span[contains(text(), '" + nombreProducto + "')]")));
        
        // Buscar el botón + (asociar) que está al lado del producto
        WebElement asociarBtn = productoAAsociar.findElement(
            By.xpath(".//ancestor::div[contains(@class, 'producto-item')]//button[contains(@class, 'btn-outline-success')]"));
        
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", asociarBtn);
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        asociarBtn.click();
        
        System.out.println("✓ Primer adicional asociado al producto");
        
        try {
            Thread.sleep(1000); // Esperar que se procese la asociación
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Volver a la lista de adicionales
        driver.get(BASE_URL + "/admin/adicionales");
        wait.until(ExpectedConditions.urlMatches(".*/admin/adicionales$"));
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // ASOCIAR SEGUNDO ADICIONAL
        editButtons = driver.findElements(
            By.cssSelector("a.btn-outline-primary[href*='/admin/adicionales/edit/']"));
        
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", editButtons.get(1));
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        editButtons.get(1).click();
        
        wait.until(ExpectedConditions.urlContains("/admin/adicionales/edit/"));
        
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        productoAAsociar = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//span[contains(text(), '" + nombreProducto + "')]")));
        
        asociarBtn = productoAAsociar.findElement(
            By.xpath(".//ancestor::div[contains(@class, 'producto-item')]//button[contains(@class, 'btn-outline-success')]"));
        
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", asociarBtn);
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        asociarBtn.click();
        
        System.out.println("✓ Segundo adicional asociado al producto");
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("✓ Producto creado y 2 adicionales asociados exitosamente");
    }
    
    @Test
    @Order(7)
    @DisplayName("7. Verificar producto en el menú (nueva pestaña) con 2 adicionales")
    void test07_VerifyProductInMenuWith2Adicionales() {
        // Guardar la ventana original
        String originalWindow = driver.getWindowHandle();
        
        // Abrir nueva pestaña y navegar al menú
        ((JavascriptExecutor) driver).executeScript("window.open('" + BASE_URL + "/tienda', '_blank');");
        
        // Cambiar a la nueva pestaña
        wait.until(ExpectedConditions.numberOfWindowsToBe(2));
        for (String windowHandle : driver.getWindowHandles()) {
            if (!windowHandle.equals(originalWindow)) {
                driver.switchTo().window(windowHandle);
                break;
            }
        }
        
        // Esperar a que cargue la tienda
        wait.until(ExpectedConditions.urlContains("/tienda"));
        
        try {
            Thread.sleep(1000); // Dar tiempo para que carguen todos los productos
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Buscar el producto creado en la lista
        WebElement productoCreado = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//*[contains(text(), '" + nombreProducto + "')]")));
        
        assertNotNull(productoCreado, "El producto creado debería aparecer en el menú");
        
        // Hacer scroll al producto antes de hacer clic (puede estar muy abajo)
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", productoCreado);
        
        try {
            Thread.sleep(500); // Esperar a que termine el scroll
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verificar que el producto esté visible después del scroll
        wait.until(ExpectedConditions.elementToBeClickable(productoCreado));
        assertTrue(productoCreado.isDisplayed(), "El producto debería estar visible en el menú");
        
        // Hacer clic en el producto para ver detalles
        try {
            productoCreado.click();
        } catch (Exception e) {
            // Si falla el clic normal, usar JavaScript
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", productoCreado);
        }
        
        // Esperar a que carguen los detalles del producto
        wait.until(ExpectedConditions.or(
            ExpectedConditions.urlContains("/producto/"),
            ExpectedConditions.urlContains("/tienda/producto/"),
            ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".producto-detalle, .adicionales-list, [class*='adicional']"))
        ));
        
        try {
            Thread.sleep(1000); // Dar tiempo para que carguen los adicionales
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verificar que aparezcan adicionales (al menos 2)
        List<WebElement> adicionalesVisibles = driver.findElements(
            By.cssSelector(".adicional-item, .adicional, [class*='adicional-'], input[type='checkbox']"));
        
        assertTrue(adicionalesVisibles.size() >= 2, 
            "Deberían mostrarse al menos 2 adicionales. Encontrados: " + adicionalesVisibles.size());
        
        System.out.println("✓ Producto verificado en tienda con " + adicionalesVisibles.size() + " adicionales");
        
        // Cerrar la pestaña del menú y volver a la ventana del admin
        driver.close();
        driver.switchTo().window(originalWindow);
    }
    
    @Test
    @Order(8)
    @DisplayName("8. Agregar un tercer adicional al producto")
    void test08_AddThirdAdicional() {
        // Asegurarse de estar en la página de adicionales
        driver.get(BASE_URL + "/admin/adicionales");
        wait.until(ExpectedConditions.urlMatches(".*/admin/adicionales$"));
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Buscar todos los botones de editar adicionales
        List<WebElement> editButtons = driver.findElements(
            By.cssSelector("a.btn-outline-primary[href*='/admin/adicionales/edit/']"));
        
        assertTrue(editButtons.size() >= 3, 
            "Deberían existir al menos 3 adicionales en la BD para asociar el tercero");
        
        // ASOCIAR TERCER ADICIONAL
        System.out.println("📝 Asociando tercer adicional al producto...");
        
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", editButtons.get(2));
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        editButtons.get(2).click();
        
        wait.until(ExpectedConditions.urlContains("/admin/adicionales/edit/"));
        
        try {
            Thread.sleep(1500); // Dar tiempo para que carguen los productos
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Buscar el producto en la lista de productos disponibles y asociarlo
        WebElement productoAAsociar = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//span[contains(text(), '" + nombreProducto + "')]")));
        
        // Buscar el botón + (asociar) que está al lado del producto
        WebElement asociarBtn = productoAAsociar.findElement(
            By.xpath(".//ancestor::div[contains(@class, 'producto-item')]//button[contains(@class, 'btn-outline-success')]"));
        
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", asociarBtn);
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        asociarBtn.click();
        
        System.out.println("✓ Tercer adicional asociado al producto");
        
        try {
            Thread.sleep(1000); // Esperar que se procese la asociación
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("✓ Total: 3 adicionales asociados al producto");
    }
    
    @Test
    @Order(9)
    @DisplayName("9. Verificar producto en el menú con 3 adicionales")
    void test09_VerifyProductInMenuWith3Adicionales() {
        // Guardar la ventana original (debería haber solo 1 ventana abierta)
        String originalWindow = driver.getWindowHandle();
        
        // Abrir nueva pestaña y navegar al menú
        ((JavascriptExecutor) driver).executeScript("window.open('" + BASE_URL + "/tienda', '_blank');");
        
        // Cambiar a la nueva pestaña
        wait.until(ExpectedConditions.numberOfWindowsToBe(2));
        for (String windowHandle : driver.getWindowHandles()) {
            if (!windowHandle.equals(originalWindow)) {
                driver.switchTo().window(windowHandle);
                break;
            }
        }
        
        // Esperar a que cargue la tienda
        wait.until(ExpectedConditions.urlContains("/tienda"));
        
        try {
            Thread.sleep(1000); // Dar tiempo para que carguen todos los productos
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Buscar el producto actualizado
        WebElement productoActualizado = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//*[contains(text(), '" + nombreProducto + "')]")));
        
        assertNotNull(productoActualizado, "El producto actualizado debería aparecer en el menú");
        
        // Hacer scroll al producto antes de hacer clic
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", productoActualizado);
        
        try {
            Thread.sleep(500); // Esperar a que termine el scroll
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verificar que el producto esté clickeable
        wait.until(ExpectedConditions.elementToBeClickable(productoActualizado));
        
        // Hacer clic en el producto para ver detalles
        try {
            productoActualizado.click();
        } catch (Exception e) {
            // Si falla el clic normal, usar JavaScript
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", productoActualizado);
        }
        
        // Esperar a que carguen los detalles
        wait.until(ExpectedConditions.or(
            ExpectedConditions.urlContains("/producto/"),
            ExpectedConditions.urlContains("/tienda/producto/"),
            ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".producto-detalle, .adicionales-list"))
        ));
        
        try {
            Thread.sleep(1000); // Dar tiempo para que carguen los adicionales
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verificar que aparezcan 3 adicionales
        List<WebElement> adicionalesFinales = driver.findElements(
            By.cssSelector(".adicional-item, .adicional, [class*='adicional-'], input[type='checkbox']"));
        
        assertTrue(adicionalesFinales.size() >= 3, 
            "Deberían mostrarse al menos 3 adicionales después de la actualización. " +
            "Encontrados: " + adicionalesFinales.size());
        
        System.out.println("✓ Producto verificado en tienda con " + adicionalesFinales.size() + " adicionales");
        
        // Cerrar la pestaña del menú
        driver.close();
        driver.switchTo().window(originalWindow);
        
        System.out.println("✓ Caso 1 completado exitosamente");
        System.out.println("✓ Producto '" + nombreProducto + "' creado y verificado con 3 adicionales");
    }
}
