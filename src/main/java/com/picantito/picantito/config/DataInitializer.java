package com.picantito.picantito.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.User;
import com.picantito.picantito.service.AutentificacionService;
import com.picantito.picantito.service.TiendaService;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private TiendaService tiendaService;
    
    @Autowired
    private AutentificacionService autentificacionService;

    @Override
    public void run(String... args) throws Exception {
        // Solo inicializar si no hay datos
        if (tiendaService.getAllProductos().isEmpty()) {
            System.out.println("🍴 Inicializando productos...");
            initializeProductos();
        } else {
            System.out.println("ℹ️ Productos ya existen en la BD");
        }
        
        if (autentificacionService.findAll().isEmpty()) {
            System.out.println("👥 Inicializando usuarios...");
            initializeUsers();
        } else {
            System.out.println("ℹ️ Usuarios ya existen en la BD");
        }
    }

    private void initializeProductos() {
        // Tacos
        Producto tacoAlPastor = tiendaService.saveProducto(new Producto("Taco al Pastor", 
            "Deliciosa carne marinada con especias tradicionales, piña fresca y cebolla, servido en tortilla de maíz artesanal", 
            3.50, "https://lastaquerias.com/wp-content/uploads/2022/11/tacos-pastor-gaacc26fa8_1920.jpg", true, 5));
            
        Producto tacoAsada = tiendaService.saveProducto(new Producto("Taco de Asada", 
            "Jugosa carne de res a la parrilla, marinada perfectamente y servida con cilantro fresco y cebolla", 
            4.00, "https://www.goya.com/wp-content/uploads/2023/10/carne-asada-tacos1.jpg", true, 4));
            
        // Adicionales para Taco al Pastor
        tiendaService.saveAdicional(new Adicional("Extra Piña", "Piña fresca adicional", 0.50, true, tacoAlPastor));
        tiendaService.saveAdicional(new Adicional("Salsa Verde Picante", "Salsa verde casera extra picante", 0.25, true, tacoAlPastor));
        tiendaService.saveAdicional(new Adicional("Guacamole Extra", "Porción adicional de guacamole", 1.00, true, tacoAlPastor));
        
        // Adicionales para Taco de Asada
        tiendaService.saveAdicional(new Adicional("Extra Carne", "Porción adicional de carne asada", 1.50, true, tacoAsada));
        tiendaService.saveAdicional(new Adicional("Pico de Gallo", "Mezcla fresca de tomate, cebolla y cilantro", 0.75, true, tacoAsada));
        
        // Más productos
        tiendaService.saveProducto(new Producto("Taco de Carnitas", 
            "Carne de cerdo cocinada lentamente con especias tradicionales", 
            3.75, "https://okdiario.com/img/2022/04/30/tacos.jpg", true, 4));
            
        tiendaService.saveProducto(new Producto("Agua de Horchata", 
            "Bebida tradicional de arroz con canela y azúcar", 
            2.50, "https://images.aws.nestle.recipes/original/8eaf50148ed521383df5d9793cba995f_whatsapp_image_2022-04-28_at_1.00.26_pm_(2).jpeg", true, 5));
    }
    
    private void initializeUsers() {
        try {
            // Verificar si el admin ya existe
            if (!autentificacionService.existsByNombreUsuario("admin")) {
                User admin = new User("Administrador Principal", "admin", "3001234567", "admin@elpicantito.com", "admin123", "ADMIN");
                autentificacionService.save(admin);
                System.out.println("✅ Usuario admin creado exitosamente");
            } else {
                System.out.println("ℹ️ Usuario admin ya existe");
            }
            
            // Usuarios de prueba
            if (!autentificacionService.existsByNombreUsuario("carlos.lopez")) {
                User testUser = new User("Carlos López García", "carlos.lopez", "3009876543", "carlos@email.com", "password123");
                autentificacionService.save(testUser);
                System.out.println("✅ Usuario de prueba Carlos creado");
            }
            
            if (!autentificacionService.existsByNombreUsuario("maria.garcia")) {
                User testUser2 = new User("María García Rodríguez", "maria.garcia", "3001357924", "maria@email.com", "password456");
                autentificacionService.save(testUser2);
                System.out.println("✅ Usuario de prueba María creado");
            }
        } catch (Exception e) {
            System.out.println("❌ Error al inicializar usuarios: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
