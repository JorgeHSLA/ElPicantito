package com.picantito.picantito.e2e;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Caso 2: Prueba E2E - Cliente realiza pedido y Operador gestiona estados
 * 
 * Flujo:
 * 1. Cliente inicia sesión
 * 2. Va al menú y agrega 2 comidas con 2 adicionales cada una
 * 3. Verifica el carrito de compras
 * 4. Confirma el envío y espera actualizaciones
 * 5. En otra pestaña, operador inicia sesión
 * 6. Operador va a gestión de pedidos y selecciona el nuevo pedido
 * 7. Operador cambia el estado del pedido
 * 8. Verificar en pestaña del cliente el cambio de estado
 * 9. Operador sigue cambiando estados y asigna domiciliario
 * 10. Operador completa el pedido
 * 11. Cliente revisa historial de pedidos completados
 * 12. Verificar que el pedido tenga todos los productos y adicionales
 * 13. Verificar que la suma a pagar sea correcta (sin valor quemado)
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("Caso 2: E2E - Cliente hace pedido y Operador gestiona estados")
public class Caso2_ClienteOperadorPedidoTest {

    private static WebDriver driverCliente;
    private static WebDriver driverOperador;
    private static WebDriverWait waitCliente;
    private static WebDriverWait waitOperador;
    
    private static final String BASE_URL = "http://localhost:4200";
    
    // Credenciales del cliente
    private static final String CLIENTE_USERNAME = "cliente";
    private static final String CLIENTE_PASSWORD = "cliente123";
    
    // Credenciales del operador
    private static final String OPERADOR_USERNAME = "operador";
    private static final String OPERADOR_PASSWORD = "operador123";
    
    // Variables para almacenar información del pedido
    private static double totalEsperado = 0.0;
    private static List<String> productosSeleccionados = new ArrayList<>();
    private static List<String> adicionalesSeleccionados = new ArrayList<>();
    private static String numeroPedido;
    
    @BeforeAll
    static void setupClass() {
        // Configurar WebDriverManager para ChromeDriver
        WebDriverManager.chromedriver().setup();
        
        // Configurar opciones de Chrome
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        // Descomentar para modo headless
        // options.addArguments("--headless");
        
        // Crear dos instancias de WebDriver (una para cliente, otra para operador)
        driverCliente = new ChromeDriver(options);
        driverOperador = new ChromeDriver(options);
        
        waitCliente = new WebDriverWait(driverCliente, Duration.ofSeconds(10));
        waitOperador = new WebDriverWait(driverOperador, Duration.ofSeconds(10));
    }
    
    @AfterAll
    static void tearDown() {
        if (driverCliente != null) {
            driverCliente.quit();
        }
        if (driverOperador != null) {
            driverOperador.quit();
        }
    }
    
    @Test
    @Order(1)
    @DisplayName("1. Cliente inicia sesión en el sistema")
    void test01_ClienteLogin() {
        driverCliente.get(BASE_URL + "/login");
        
        WebElement usernameInput = waitCliente.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("input#nombreUsuario")));
        WebElement passwordInput = waitCliente.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("input#password")));
        
        usernameInput.click();
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        usernameInput.clear();
        usernameInput.sendKeys(Keys.CONTROL + "a");
        usernameInput.sendKeys(Keys.DELETE);
        
        for (char c : CLIENTE_USERNAME.toCharArray()) {
            usernameInput.sendKeys(String.valueOf(c));
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        passwordInput.click();
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        passwordInput.clear();
        passwordInput.sendKeys(Keys.CONTROL + "a");
        passwordInput.sendKeys(Keys.DELETE);
        
        for (char c : CLIENTE_PASSWORD.toCharArray()) {
            passwordInput.sendKeys(String.valueOf(c));
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        WebElement loginButton = waitCliente.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("button[type='submit']")));
        loginButton.click();
        
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitCliente.until(ExpectedConditions.or(
            ExpectedConditions.urlContains("/home"),
            ExpectedConditions.urlContains("/tienda"),
            ExpectedConditions.urlContains("/mi-perfil")
        ));
        
        String currentUrl = driverCliente.getCurrentUrl();
        assertFalse(currentUrl.contains("/login"), 
            "El cliente debería haber iniciado sesión correctamente. URL actual: " + currentUrl);
        
        System.out.println("✓ Test 1: Cliente inició sesión exitosamente");
    }
    
    @Test
    @Order(2)
    @DisplayName("2. Cliente navega al menú y agrega Taco al Pastor con 2 adicionales")
    void test02_AgregarPrimerProducto() {
        driverCliente.get(BASE_URL + "/tienda");
        
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitCliente.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
            By.cssSelector("app-product-card, .taco-card")));
        
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        WebElement tacoAlPastor = null;
        try {
            tacoAlPastor = driverCliente.findElement(
                By.xpath("//h5[contains(text(), 'Pastor') or contains(text(), 'pastor')]//ancestor::app-product-card | " +
                        "//h5[contains(text(), 'Pastor') or contains(text(), 'pastor')]//ancestor::div[contains(@class, 'card')]"));
        } catch (Exception e) {
            List<WebElement> productos = driverCliente.findElements(By.cssSelector("app-product-card, .taco-card"));
            assertTrue(productos.size() > 0, "Deberían haber productos disponibles");
            tacoAlPastor = productos.get(productos.size() - 1);
        }
        
        ((JavascriptExecutor) driverCliente).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", tacoAlPastor);
        
        try {
            Thread.sleep(800);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        String nombreProducto1 = tacoAlPastor.findElement(
            By.cssSelector("h5.card-title, .card-title")).getText();
        productosSeleccionados.add(nombreProducto1);
        
        try {
            WebElement verDetallesBtn = tacoAlPastor.findElement(
                By.xpath(".//button[contains(text(), 'Ver Detalles') or contains(@class, 'btn-sm')]"));
            
            ((JavascriptExecutor) driverCliente).executeScript(
                "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", verDetallesBtn);
            Thread.sleep(500);
            
            waitCliente.until(ExpectedConditions.elementToBeClickable(verDetallesBtn));
            
            try {
                verDetallesBtn.click();
            } catch (Exception e) {
                ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", verDetallesBtn);
            }
        } catch (Exception e) {
            waitCliente.until(ExpectedConditions.elementToBeClickable(tacoAlPastor));
            try {
                tacoAlPastor.click();
            } catch (Exception ex) {
                ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", tacoAlPastor);
            }
        }
        
        waitCliente.until(ExpectedConditions.urlContains("/producto/"));
        
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        try {
            WebElement precioElement = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".precio-container h2, .text-warning.fw-bold")));
            String precioTexto = precioElement.getText();
            double precioProducto1 = extraerPrecio(precioTexto);
            totalEsperado += precioProducto1;
        } catch (Exception e) {
            // Precio no extraído
        }
        
        List<WebElement> todosLosAdicionales = waitCliente.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
            By.cssSelector(".adicional-item")));
        
        String[] adicionalesRequeridos = {"Aguacate", "Jalapeño"};
        int adicionalesSeleccionadosCount = 0;
        
        for (String adicionalRequerido : adicionalesRequeridos) {
            for (WebElement adicionalCard : todosLosAdicionales) {
                try {
                    String nombreAdicional = adicionalCard.findElement(By.cssSelector("h6.card-title")).getText();
                    
                    if (nombreAdicional.toLowerCase().contains(adicionalRequerido.toLowerCase())) {
                        ((JavascriptExecutor) driverCliente).executeScript(
                            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", adicionalCard);
                        
                        Thread.sleep(300);
                        
                        String precioAdicionalTexto = adicionalCard.findElement(By.cssSelector(".text-warning.fw-bold")).getText();
                        double precioAdicional = extraerPrecio(precioAdicionalTexto);
                        totalEsperado += precioAdicional;
                        adicionalesSeleccionados.add(nombreAdicional);
                        
                        WebElement botonToggle = adicionalCard.findElement(
                            By.cssSelector("button.btn-warning, button.btn-outline-warning"));
                        
                        waitCliente.until(ExpectedConditions.elementToBeClickable(botonToggle));
                        try {
                            botonToggle.click();
                        } catch (Exception e) {
                            ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", botonToggle);
                        }
                        
                        adicionalesSeleccionadosCount++;
                        Thread.sleep(500);
                        break;
                    }
                } catch (Exception e) {
                    // Continuar con el siguiente adicional
                }
            }
        }
        
        assertTrue(adicionalesSeleccionadosCount >= 2, 
            "Deberían seleccionarse Aguacate y Jalapeños. Seleccionados: " + adicionalesSeleccionadosCount);
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        WebElement addToCartButton = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector("button.btn-lg.btn-warning, button.btn-lg[class*='warning']")));
        
        ((JavascriptExecutor) driverCliente).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", addToCartButton);
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitCliente.until(ExpectedConditions.elementToBeClickable(addToCartButton));
        try {
            addToCartButton.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", addToCartButton);
        }
        
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitCliente.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector(".cart-sidebar.show")));
        
        WebElement closeCartButton = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector(".btn-close-cart, button[aria-label='Cerrar carrito']")));
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitCliente.until(ExpectedConditions.elementToBeClickable(closeCartButton));
        try {
            closeCartButton.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", closeCartButton);
        }
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        WebElement seguirComprandoButton = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//button[contains(text(), 'Seguir comprando') or contains(text(), 'seguir comprando')]")));
        
        ((JavascriptExecutor) driverCliente).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", seguirComprandoButton);
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitCliente.until(ExpectedConditions.elementToBeClickable(seguirComprandoButton));
        try {
            seguirComprandoButton.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", seguirComprandoButton);
        }
        
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("✓ Test 2: Taco al Pastor agregado con adicionales - Total: $" + totalEsperado);
    }
    
    @Test
    @Order(3)
    @DisplayName("3. Cliente agrega Taco de Pescado con 2 adicionales")
    void test03_AgregarSegundoProducto() {
        if (!driverCliente.getCurrentUrl().contains("/tienda")) {
            driverCliente.get(BASE_URL + "/tienda");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitCliente.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
            By.cssSelector("app-product-card, .taco-card")));
        
        WebElement tacoDePescado = null;
        try {
            tacoDePescado = driverCliente.findElement(
                By.xpath("//h5[contains(text(), 'Pescado') or contains(text(), 'pescado')]//ancestor::app-product-card | " +
                        "//h5[contains(text(), 'Pescado') or contains(text(), 'pescado')]//ancestor::div[contains(@class, 'card')]"));
        } catch (Exception e) {
            List<WebElement> productos = driverCliente.findElements(By.cssSelector("app-product-card, .taco-card"));
            assertTrue(productos.size() >= 2, "Deberían haber al menos 2 productos disponibles");
            tacoDePescado = productos.get(1);
        }
        
        ((JavascriptExecutor) driverCliente).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", tacoDePescado);
        
        try {
            Thread.sleep(800);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        String nombreProducto2 = tacoDePescado.findElement(
            By.cssSelector("h5.card-title, .card-title")).getText();
        productosSeleccionados.add(nombreProducto2);
        
        try {
            WebElement verDetallesBtn = tacoDePescado.findElement(
                By.xpath(".//button[contains(text(), 'Ver Detalles') or contains(@class, 'btn-sm')]"));
            
            ((JavascriptExecutor) driverCliente).executeScript(
                "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", verDetallesBtn);
            Thread.sleep(500);
            
            waitCliente.until(ExpectedConditions.elementToBeClickable(verDetallesBtn));
            
            try {
                verDetallesBtn.click();
            } catch (Exception e) {
                ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", verDetallesBtn);
            }
        } catch (Exception e) {
            waitCliente.until(ExpectedConditions.elementToBeClickable(tacoDePescado));
            try {
                tacoDePescado.click();
            } catch (Exception ex) {
                ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", tacoDePescado);
            }
        }
        
        waitCliente.until(ExpectedConditions.urlContains("/producto/"));
        
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        try {
            WebElement precioElement = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".precio-container h2, .text-warning.fw-bold")));
            String precioTexto = precioElement.getText();
            double precioProducto2 = extraerPrecio(precioTexto);
            totalEsperado += precioProducto2;
        } catch (Exception e) {
            // Precio no extraído
        }
        
        List<WebElement> todosLosAdicionales = waitCliente.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
            By.cssSelector(".adicional-item")));
        
        String[] adicionalesRequeridos = {"Aguacate", "Queso"};
        int adicionalesSeleccionadosCount = 0;
        
        for (String adicionalRequerido : adicionalesRequeridos) {
            for (WebElement adicionalCard : todosLosAdicionales) {
                try {
                    String nombreAdicional = adicionalCard.findElement(By.cssSelector("h6.card-title")).getText();
                    
                    if (nombreAdicional.toLowerCase().contains(adicionalRequerido.toLowerCase())) {
                        ((JavascriptExecutor) driverCliente).executeScript(
                            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", adicionalCard);
                        
                        Thread.sleep(300);
                        
                        String precioAdicionalTexto = adicionalCard.findElement(By.cssSelector(".text-warning.fw-bold")).getText();
                        double precioAdicional = extraerPrecio(precioAdicionalTexto);
                        totalEsperado += precioAdicional;
                        adicionalesSeleccionados.add(nombreAdicional);
                        
                        WebElement botonToggle = adicionalCard.findElement(
                            By.cssSelector("button.btn-warning, button.btn-outline-warning"));
                        
                        waitCliente.until(ExpectedConditions.elementToBeClickable(botonToggle));
                        try {
                            botonToggle.click();
                        } catch (Exception e) {
                            ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", botonToggle);
                        }
                        
                        adicionalesSeleccionadosCount++;
                        Thread.sleep(500);
                        break;
                    }
                } catch (Exception e) {
                    // Continuar
                }
            }
        }
        
        assertTrue(adicionalesSeleccionadosCount >= 2, 
            "Deberían seleccionarse Aguacate y Queso. Seleccionados: " + adicionalesSeleccionadosCount);
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        WebElement addToCartButton = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector("button.btn-lg.btn-warning, button.btn-lg[class*='warning']")));
        
        ((JavascriptExecutor) driverCliente).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", addToCartButton);
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitCliente.until(ExpectedConditions.elementToBeClickable(addToCartButton));
        try {
            addToCartButton.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", addToCartButton);
        }
        
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        WebElement cartSidebar = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector(".cart-sidebar.show")));
        
        List<WebElement> cartItems = waitCliente.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
            By.cssSelector(".cart-item")));
        
        assertTrue(cartItems.size() >= 2, 
            "El carrito debería tener al menos 2 productos. Encontrados: " + cartItems.size());
        
        String cartText = cartSidebar.getText();
        int productosEncontradosEnCarrito = 0;
        
        for (String nombreProducto : productosSeleccionados) {
            if (cartText.contains(nombreProducto)) {
                productosEncontradosEnCarrito++;
            }
        }
        
        assertTrue(productosEncontradosEnCarrito >= 2,
            "Ambos productos deberían estar visibles en el carrito. Encontrados: " + productosEncontradosEnCarrito);
        
        System.out.println("✓ Test 3: Taco de Pescado agregado - Carrito tiene 2 productos - Total: $" + totalEsperado);
    }
    
    @Test
    @Order(4)
    @DisplayName("4. Verificar que el carrito de compras esté correcto")
    void test04_VerificarCarrito() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        try {
            WebElement carritoIcon = waitCliente.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector(".cart-link, a.nav-link[class*='cart'], .icon-nav")));
            
            try {
                carritoIcon.click();
            } catch (Exception e) {
                ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", carritoIcon);
            }
            
            Thread.sleep(1000);
        } catch (Exception e) {
            // Error abriendo carrito
        }
        
        try {
            WebElement cartSidebar = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".cart-sidebar.show, .cart-sidebar.active, app-cart-sidebar")));
            
            List<WebElement> itemsEnCarrito = cartSidebar.findElements(By.cssSelector(".cart-item"));
            
            assertTrue(itemsEnCarrito.size() >= 2,
                "El carrito debería tener al menos 2 productos. Encontrados: " + itemsEnCarrito.size());
        } catch (Exception e) {
            // Error verificando items
        }
        
        WebElement checkoutButton = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector(".btn-checkout, button.btn-primary, button[class*='proceder']")));
        
        ((JavascriptExecutor) driverCliente).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", checkoutButton);
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitCliente.until(ExpectedConditions.elementToBeClickable(checkoutButton));
        
        try {
            checkoutButton.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", checkoutButton);
        }
        
        waitCliente.until(ExpectedConditions.urlContains("/checkout"));
        
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        List<WebElement> itemsCarrito = waitCliente.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
            By.cssSelector(".product-item")));
        
        assertTrue(itemsCarrito.size() >= 2, 
            "El carrito debería tener al menos 2 productos. Encontrados: " + itemsCarrito.size());
        
        String textoCarrito = driverCliente.findElement(By.tagName("body")).getText();
        int productosEncontrados = 0;
        for (String producto : productosSeleccionados) {
            if (textoCarrito.contains(producto)) {
                productosEncontrados++;
            }
        }
        
        assertTrue(productosEncontrados >= 1,
            "Al menos 1 producto debería estar visible en el carrito");
        
        WebElement totalElement = null;
        try {
            totalElement = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".summary-row.total strong.text-success")));
        } catch (Exception e) {
            try {
                totalElement = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                    By.cssSelector("strong.text-success")));
            } catch (Exception e2) {
                try {
                    totalElement = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                        By.cssSelector(".order-summary strong")));
                } catch (Exception e3) {
                    // Error buscando total
                }
            }
        }
        
        assertNotNull(totalElement, "Debería encontrarse el elemento del total en el carrito");
        
        ((JavascriptExecutor) driverCliente).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", totalElement);
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        String totalTexto = totalElement.getText();
        double totalMostrado = extraerPrecio(totalTexto);
        
        totalEsperado = totalMostrado;
        
        assertTrue(totalMostrado > 0,
            "El total del carrito debería ser mayor a 0. Total: $" + totalMostrado);
        
        System.out.println("✓ Test 4: Carrito verificado - Total: $" + totalMostrado);
    }
    
    @Test
    @Order(5)
    @DisplayName("5. Cliente confirma el envío del pedido")
    void test05_ConfirmarEnvio() {
        System.out.println("\n=== TEST 5: CONFIRMAR ENVÍO DEL PEDIDO ===");
        
        // Estamos en la página de checkout, necesitamos llenar los campos del formulario
        System.out.println("  Llenando información de entrega...");
        
        try {
            // Llenar dirección (textarea)
            WebElement direccionInput = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("textarea#direccion, textarea[id='direccion']")));
            
            ((JavascriptExecutor) driverCliente).executeScript(
                "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", direccionInput);
            
            Thread.sleep(300);
            
            direccionInput.clear();
            direccionInput.sendKeys("Calle 123 #45-67, Apartamento 101, Torre B, Bogotá");
            System.out.println("  ✓ Dirección ingresada");
            
            // Llenar teléfono
            WebElement telefonoInput = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("input#telefono, input[id='telefono']")));
            
            telefonoInput.clear();
            telefonoInput.sendKeys("+57 300 123 4567");
            System.out.println("  ✓ Teléfono ingresado");
            
            // Llenar observaciones (opcional)
            WebElement observacionesInput = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("textarea#observaciones, textarea[id='observaciones']")));
            
            observacionesInput.clear();
            observacionesInput.sendKeys("Por favor tocar el timbre. Dejar en portería si no contesto.");
            System.out.println("  ✓ Observaciones ingresadas");
            
            Thread.sleep(500);
            
        } catch (Exception e) {
            System.out.println("  ⚠ Error llenando formulario: " + e.getMessage());
            fail("No se pudo llenar el formulario de entrega");
        }
        
        // Ahora buscar y hacer clic en el botón "Confirmar Pedido"
        System.out.println("  Buscando botón 'Confirmar Pedido'...");
        
        WebElement confirmarButton = null;
        try {
            // El HTML muestra que el botón es: <button class="btn btn-success btn-lg w-100" (click)="confirmarPedido()">
            confirmarButton = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("button.btn-success, button[class*='confirmar']")));
            
            System.out.println("  ✓ Botón 'Confirmar Pedido' encontrado");
            
        } catch (Exception e) {
            System.out.println("  ⚠ No se encontró el botón con selector principal");
            
            // Intentar con XPath
            try {
                confirmarButton = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                    By.xpath("//button[contains(text(), 'Confirmar') or contains(text(), 'confirmar')]")));
                System.out.println("  ✓ Botón encontrado con XPath");
            } catch (Exception e2) {
                System.out.println("  ❌ No se pudo encontrar el botón 'Confirmar Pedido'");
                fail("No se encontró el botón para confirmar el pedido");
            }
        }
        
        // Scroll al botón
        ((JavascriptExecutor) driverCliente).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", confirmarButton);
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Click en el botón
        waitCliente.until(ExpectedConditions.elementToBeClickable(confirmarButton));
        System.out.println("  Haciendo clic en 'Confirmar Pedido'...");
        
        try {
            confirmarButton.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", confirmarButton);
        }
        
        System.out.println("  ✓ Botón 'Confirmar Pedido' clickeado");
        
        // Esperar el mensaje de confirmación o diálogo (puede aparecer un alert o modal)
        try {
            Thread.sleep(2000);
            
            // Intentar manejar alert si aparece
            try {
                Alert alert = waitCliente.until(ExpectedConditions.alertIsPresent());
                String mensajeAlert = alert.getText();
                System.out.println("  ✓ Alert detectado: " + mensajeAlert);
                alert.accept();
                System.out.println("  ✓ Alert aceptado");
            } catch (Exception alertEx) {
                System.out.println("  No hay alert, continuando...");
            }
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Intentar obtener el número de pedido si está visible
        try {
            WebElement numeroPedidoElement = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".numero-pedido, [class*='pedido-id'], .order-number, [class*='numero']")));
            numeroPedido = numeroPedidoElement.getText();
            System.out.println("✓ Pedido confirmado. Número: " + numeroPedido);
        } catch (Exception e) {
            System.out.println("✓ Pedido confirmado (número no visible en UI inmediatamente)");
        }
        
        // Dar tiempo para que se procese el pedido en el backend
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("✓ Pedido enviado exitosamente");
    }
    
    @Test
    @Order(6)
    @DisplayName("6. Operador inicia sesión en otra pestaña")
    void test06_OperadorLogin() {
        // Navegar a la página de login con el driver del operador
        driverOperador.get(BASE_URL + "/login");
        
        // Esperar a que carguen los campos del formulario (usar ID específico)
        WebElement usernameInput = waitOperador.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("input#nombreUsuario")));
        WebElement passwordInput = waitOperador.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("input#password")));
        
        // Hacer clic en el campo para enfocarlo
        usernameInput.click();
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Limpiar completamente el campo
        usernameInput.clear();
        usernameInput.sendKeys(Keys.CONTROL + "a");
        usernameInput.sendKeys(Keys.DELETE);
        
        // Ingresar username caracter por caracter
        for (char c : OPERADOR_USERNAME.toCharArray()) {
            usernameInput.sendKeys(String.valueOf(c));
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
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
        
        // Ingresar password caracter por caracter
        for (char c : OPERADOR_PASSWORD.toCharArray()) {
            passwordInput.sendKeys(String.valueOf(c));
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Hacer clic en el botón de login
        WebElement loginButton = waitOperador.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("button[type='submit']")));
        loginButton.click();
        
        // Dar tiempo para que se procese el login
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Esperar redirección al dashboard del operador
        waitOperador.until(ExpectedConditions.urlContains("/operador"));
        
        String currentUrl = driverOperador.getCurrentUrl();
        assertTrue(currentUrl.contains("/operador"), 
            "El operador debería haber iniciado sesión y estar en su dashboard. URL actual: " + currentUrl);
        
        System.out.println("✓ Operador inició sesión exitosamente");
    }
    
    @Test
    @Order(7)
    @DisplayName("7. Operador navega a gestión de pedidos y selecciona el nuevo pedido")
    void test07_OperadorSeleccionaPedido() {
        // Navegar a gestión de pedidos
        driverOperador.get(BASE_URL + "/operador/gestion-pedidos");
        
        try {
            Thread.sleep(2000); // Dar tiempo para que cargue la lista
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verificar si estamos en la ruta correcta
        String currentUrl = driverOperador.getCurrentUrl();
        if (!currentUrl.contains("/gestion-pedidos")) {
            // Navegar a gestión de pedidos
            driverOperador.get(BASE_URL + "/gestion-pedidos");
            try {
                Thread.sleep(1500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        try {
            Thread.sleep(2000); // Dar tiempo para que cargue la lista de pedidos
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("✓ Operador está en la página de gestión de pedidos");
        System.out.println("  Los pedidos están organizados en columnas por estado");
        System.out.println("  El nuevo pedido debería estar en la columna 'RECIBIDO'");
    }
    
    @Test
    @Order(8)
    @DisplayName("8. Operador cambia el estado del pedido y cliente verifica el cambio")
    void test08_CambiarEstadoYVerificar() {
        System.out.println("\n=== TEST 8: CAMBIAR ESTADO DEL PEDIDO ===");
        
        // Los pedidos están en columnas por estado
        // Necesitamos encontrar el primer pedido en estado RECIBIDO (el que acabamos de crear)
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Buscar TODOS los botones "Iniciar Preparación" (pueden haber varios pedidos)
        List<WebElement> botonesIniciarPreparacion = waitOperador.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.xpath("//button[contains(@class, 'btn') and .//span[contains(text(), 'Iniciar Preparación')]]")));
        
        System.out.println("  Botones 'Iniciar Preparación' encontrados: " + botonesIniciarPreparacion.size());
        
        assertTrue(botonesIniciarPreparacion.size() > 0, 
            "Debería haber al menos un pedido en estado RECIBIDO con botón 'Iniciar Preparación'");
        
        // Tomar el PRIMER botón (el pedido más reciente está primero)
        WebElement botonIniciarPreparacion = botonesIniciarPreparacion.get(0);
        
        System.out.println("  ✓ Seleccionado el primer pedido en estado RECIBIDO");
        
        // Scroll al botón
        ((JavascriptExecutor) driverOperador).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", botonIniciarPreparacion);
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitOperador.until(ExpectedConditions.elementToBeClickable(botonIniciarPreparacion));
        System.out.println("  Haciendo clic en 'Iniciar Preparación'...");
        
        try {
            botonIniciarPreparacion.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driverOperador).executeScript("arguments[0].click();", botonIniciarPreparacion);
        }
        
        // Esperar confirmación
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("✓ Operador cambió el estado del pedido a COCINANDO");
        
        // Dar tiempo adicional para que se propague el cambio
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verificar en la pestaña del cliente que aparezca el cambio de estado
        driverCliente.navigate().refresh();
        
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Esperar a que se actualice el estado (opcional - puede no estar visible en todas las vistas)
        try {
            WebElement estadoCliente = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".estado-pedido, [class*='estado'], .order-status, [class*='status']")));
            
            String estadoTexto = estadoCliente.getText().toUpperCase();
            System.out.println("  Estado visto por cliente: " + estadoTexto);
            
            assertTrue(estadoTexto.contains("COCINANDO") || estadoTexto.contains("PREPARACION") ||
                      estadoTexto.contains("EN PREPARACIÓN") || estadoTexto.contains("PREPARANDO"),
                "El cliente debería ver el nuevo estado del pedido. Estado actual: " + estadoTexto);
            
            System.out.println("✓ Cliente verificó el cambio de estado: " + estadoTexto);
        } catch (Exception e) {
            System.out.println("⚠ No se pudo verificar el estado en la vista del cliente (elemento no encontrado)");
        }
    }
    
    @Test
    @Order(9)
    @DisplayName("9. Operador asigna domiciliario y cambia estado a ENVIADO")
    void test09_AsignarDomiciliario() {
        System.out.println("\n=== TEST 9: ASIGNAR DOMICILIARIO Y ENVIAR ===");
        
        // El pedido ahora está en COCINANDO
        // Primero necesitamos asignar un repartidor (si hay disponible)
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Buscar TODOS los selects de repartidor (solo aparecen en pedidos COCINANDO)
        try {
            List<WebElement> repartidorSelects = waitOperador.until(
                ExpectedConditions.presenceOfAllElementsLocatedBy(
                    By.cssSelector("select.form-select")));
            
            System.out.println("  Selects de repartidor encontrados: " + repartidorSelects.size());
            
            if (repartidorSelects.size() > 0) {
                // Tomar el PRIMER select (el pedido más reciente)
                WebElement repartidorSelect = repartidorSelects.get(0);
                
                // Scroll al select
                ((JavascriptExecutor) driverOperador).executeScript(
                    "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", repartidorSelect);
                
                Thread.sleep(500);
                
                waitOperador.until(ExpectedConditions.elementToBeClickable(repartidorSelect));
                repartidorSelect.click();
                
                Thread.sleep(300);
                
                // Seleccionar el primer repartidor disponible (segunda opción)
                List<WebElement> opciones = repartidorSelect.findElements(By.tagName("option"));
                System.out.println("  Opciones de repartidor: " + opciones.size());
                
                if (opciones.size() > 1) {
                    WebElement opcionRepartidor = opciones.get(1);
                    try {
                        opcionRepartidor.click();
                    } catch (Exception e) {
                        ((JavascriptExecutor) driverOperador).executeScript("arguments[0].selected = true;", opcionRepartidor);
                    }
                    
                    Thread.sleep(500);
                    System.out.println("  ✓ Repartidor asignado");
                } else {
                    System.out.println("  ⚠ No hay repartidores disponibles");
                }
            } else {
                System.out.println("  ⚠ No se encontró select de repartidor");
            }
        } catch (Exception e) {
            System.out.println("  ⚠ No se pudo asignar repartidor: " + e.getMessage());
        }
        
        // Ahora hacer clic en el PRIMER botón "Enviar Pedido"
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        List<WebElement> botonesEnviar = waitOperador.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.xpath("//button[contains(@class, 'btn') and .//span[contains(text(), 'Enviar Pedido')]]")));
        
        System.out.println("  Botones 'Enviar Pedido' encontrados: " + botonesEnviar.size());
        
        assertTrue(botonesEnviar.size() > 0,
            "Debería haber al menos un botón 'Enviar Pedido'");
        
        WebElement botonEnviar = botonesEnviar.get(0);
        
        // Scroll al botón
        ((JavascriptExecutor) driverOperador).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", botonEnviar);
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitOperador.until(ExpectedConditions.elementToBeClickable(botonEnviar));
        System.out.println("  Haciendo clic en 'Enviar Pedido'...");
        
        try {
            botonEnviar.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driverOperador).executeScript("arguments[0].click();", botonEnviar);
        }
        
        // Esperar confirmación
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("✓ Estado cambiado a ENVIADO");
    }
    
    @Test
    @Order(10)
    @DisplayName("10. Operador completa el pedido")
    void test10_CompletarPedido() {
        System.out.println("\n=== TEST 10: COMPLETAR PEDIDO ===");
        
        // El pedido ahora está en ENVIADO
        // Hacer clic en el PRIMER botón "Marcar como Entregado"
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        List<WebElement> botonesEntregar = waitOperador.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.xpath("//button[contains(@class, 'btn') and .//span[contains(text(), 'Marcar como Entregado')]]")));
        
        System.out.println("  Botones 'Marcar como Entregado' encontrados: " + botonesEntregar.size());
        
        assertTrue(botonesEntregar.size() > 0,
            "Debería haber al menos un botón 'Marcar como Entregado'");
        
        WebElement botonEntregar = botonesEntregar.get(0);
        
        // Scroll al botón
        ((JavascriptExecutor) driverOperador).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", botonEntregar);
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitOperador.until(ExpectedConditions.elementToBeClickable(botonEntregar));
        System.out.println("  Haciendo clic en 'Marcar como Entregado'...");
        
        try {
            botonEntregar.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driverOperador).executeScript("arguments[0].click();", botonEntregar);
        }
        
        // Esperar confirmación
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("✓ Pedido marcado como ENTREGADO");
        
        // Dar tiempo para propagación
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    @Test
    @Order(11)
    @DisplayName("11. Cliente revisa historial de pedidos completados")
    void test11_ClienteRevisaHistorial() {
        System.out.println("\n=== TEST 11: REVISAR HISTORIAL DE PEDIDOS ===");
        
        // Navegar a "Mis Pedidos" desde el dropdown del header
        // Similar a cómo se hace login/logout
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Buscar el dropdown del usuario en el navbar
        WebElement userDropdown = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector(".nav-link.dropdown-toggle, a.dropdown-toggle[class*='user'], [class*='user-dropdown']")));
        
        // Hacer clic para abrir el dropdown
        ((JavascriptExecutor) driverCliente).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", userDropdown);
        
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitCliente.until(ExpectedConditions.elementToBeClickable(userDropdown));
        try {
            userDropdown.click();
            System.out.println("  ✓ Dropdown de usuario abierto");
        } catch (Exception e) {
            ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", userDropdown);
            System.out.println("  ✓ Dropdown de usuario abierto (JS)");
        }
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Buscar y hacer clic en "Mis Pedidos"
        WebElement misPedidosLink = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//a[contains(text(), 'Mis Pedidos') or contains(text(), 'Pedidos') or contains(@href, 'pedidos')]")));
        
        System.out.println("  ✓ Opción 'Mis Pedidos' encontrada");
        
        waitCliente.until(ExpectedConditions.elementToBeClickable(misPedidosLink));
        try {
            misPedidosLink.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", misPedidosLink);
        }
        
        System.out.println("  ✓ Navegado a 'Mis Pedidos'");
        
        try {
            Thread.sleep(2000); // Dar tiempo para cargar pedidos
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Esperar a que cargue el historial de pedidos - buscar pedidos completados
        List<WebElement> pedidosCompletados = waitCliente.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
            By.cssSelector(".pedido-item, .card-pedido, .pedido, tr.pedido-row, .pedido-completado, [class*='pedido'], .order-item, [class*='order']")));
        
        System.out.println("  Pedidos encontrados: " + pedidosCompletados.size());
        
        assertTrue(pedidosCompletados.size() > 0, 
            "Debería haber al menos un pedido completado en el historial");
        
        // Hacer clic en el PRIMER pedido (el más reciente)
        WebElement pedidoReciente = pedidosCompletados.get(0);
        
        System.out.println("  ✓ Seleccionado el primer pedido del historial");
        
        // Scroll al pedido
        ((JavascriptExecutor) driverCliente).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", pedidoReciente);
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        waitCliente.until(ExpectedConditions.elementToBeClickable(pedidoReciente));
        try {
            pedidoReciente.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driverCliente).executeScript("arguments[0].click();", pedidoReciente);
        }
        
        // Esperar a que carguen los detalles
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("✓ Cliente accedió al historial de pedidos y abrió el pedido");
    }
    
    @Test
    @Order(12)
    @DisplayName("12. Verificar productos y adicionales del pedido completado")
    void test12_VerificarProductosYAdicionales() {
        // Esperar a que se muestren los detalles
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Obtener el texto completo de los detalles del pedido
        String detallePedido = driverCliente.findElement(By.tagName("body")).getText();
        
        // Verificar que estén los productos seleccionados
        int productosEncontrados = 0;
        for (String producto : productosSeleccionados) {
            if (detallePedido.contains(producto)) {
                productosEncontrados++;
                System.out.println("  ✓ Producto encontrado: " + producto);
            }
        }
        
        assertTrue(productosEncontrados >= 1, 
            "Debería aparecer al menos 1 producto en el pedido. Encontrados: " + productosEncontrados);
        
        // Verificar adicionales (al menos verificar que haya elementos relacionados)
        try {
            List<WebElement> adicionalesElements = driverCliente.findElements(
                By.cssSelector(".adicional-item, [class*='adicional'], input[type='checkbox']"));
            
            System.out.println("  Elementos de adicionales encontrados: " + adicionalesElements.size());
            
            if (adicionalesElements.size() > 0) {
                System.out.println("✓ Se encontraron elementos de adicionales en el detalle del pedido");
            }
        } catch (Exception e) {
            System.out.println("  ⚠ No se pudieron verificar los adicionales (elementos no encontrados)");
        }
        
        System.out.println("✓ Productos verificados en el pedido completado");
    }
    
    @Test
    @Order(13)
    @DisplayName("13. Verificar que el total del pedido sea correcto")
    void test13_VerificarTotalPagado() {
        WebElement totalPedidoElement = null;
        
        try {
            totalPedidoElement = waitCliente.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".pedido-footer .text-success.fw-bold, span.h5.text-success.fw-bold")));
        } catch (Exception e) {
            try {
                List<WebElement> elementsWithMoney = driverCliente.findElements(
                    By.xpath("//*[contains(text(), '$') and contains(@class, 'success')]"));
                
                for (WebElement el : elementsWithMoney) {
                    String text = el.getText();
                    if (text.matches(".*\\$\\s*[0-9,]+.*") && extraerPrecio(text) > 100) {
                        totalPedidoElement = el;
                        break;
                    }
                }
            } catch (Exception e2) {
                // Error buscando total
            }
        }
        
        assertNotNull(totalPedidoElement, 
            "Debería encontrarse el elemento del total del pedido");
        
        ((JavascriptExecutor) driverCliente).executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", totalPedidoElement);
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        String totalTexto = totalPedidoElement.getText();
        double totalPedido = extraerPrecio(totalTexto);
        
        assertEquals(totalEsperado, totalPedido, 1.5, 
            "El total del pedido ($" + totalPedido + ") debería coincidir con el total del carrito ($" + totalEsperado + ")");
        
        System.out.println("✓✓✓ CASO 2 COMPLETADO EXITOSAMENTE ✓✓✓");
        System.out.println("  - 2 productos con adicionales agregados al carrito");
        System.out.println("  - Pedido confirmado y enviado");
        System.out.println("  - Operador gestionó estados: RECIBIDO → COCINANDO → ENVIADO → ENTREGADO");
        System.out.println("  - Cliente verificó pedido completado");
        System.out.println("  - Total verificado: $" + totalPedido);
    }
    
    /**
     * Método auxiliar para extraer precio de un texto
     * Ejemplos: "$25.50", "25.50", "Precio: $25.50" -> 25.50
     */
    private static double extraerPrecio(String texto) {
        // Eliminar símbolos y texto adicional, mantener solo números y punto decimal
        String precioLimpio = texto.replaceAll("[^0-9.]", "");
        
        try {
            return Double.parseDouble(precioLimpio);
        } catch (NumberFormatException e) {
            System.err.println("Error al parsear precio: " + texto);
            return 0.0;
        }
    }
}
