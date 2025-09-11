package com.picantito.picantito.config;

import java.util.List;

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
        // Inicializa si no hay datos en la bd
        if (tiendaService.getAllProductos().isEmpty()) {
            initializeProductos();
        }
        if (autentificacionService.findAll().isEmpty()) {
            initializeUsers();
        }
    }

    private void initializeProductos() {
        // === TACOS PRINCIPALES ===
        Producto tacoAlPastor = tiendaService.saveProducto(new Producto("Taco al Pastor", 
            "Deliciosa carne marinada con especias tradicionales, piña fresca y cebolla, servido en tortilla de maíz artesanal", 
            3.50, 2.00, "https://lastaquerias.com/wp-content/uploads/2022/11/tacos-pastor-gaacc26fa8_1920.jpg", true, 5));
            
        Producto tacoAsada = tiendaService.saveProducto(new Producto("Taco de Asada", 
            "Jugosa carne de res a la parrilla, marinada perfectamente y servida con cilantro fresco y cebolla", 
            4.00, 2.50, "https://www.goya.com/wp-content/uploads/2023/10/carne-asada-tacos1.jpg", true, 4));
            
        Producto tacoCarnitas = tiendaService.saveProducto(new Producto("Taco de Carnitas", 
            "Carne de cerdo cocinada lentamente con especias tradicionales hasta alcanzar la textura perfecta", 
            3.75, 2.25, "https://okdiario.com/img/2022/04/30/tacos.jpg", true, 4));
            
        Producto tacoPollo = tiendaService.saveProducto(new Producto("Taco de Pollo", 
            "Pechuga de pollo marinada y asada, con especias mexicanas auténticas", 
            3.25, 1.80, "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b", true, 4));
            
        Producto tacoChorizo = tiendaService.saveProducto(new Producto("Taco de Chorizo", 
            "Chorizo mexicano artesanal con papas doradas y especias caseras", 
            3.00, 1.75, "https://images.unsplash.com/photo-1599974579688-8dbdd42c4e31", true, 4));
            
        Producto tacoVegetariano = tiendaService.saveProducto(new Producto("Taco Vegetariano", 
            "Mezcla de verduras asadas, frijoles negros, queso y aguacate fresco", 
            2.75, 1.50, "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b", true, 4));

        // === QUESADILLAS ===
        Producto quesadillaQueso = tiendaService.saveProducto(new Producto("Quesadilla de Queso", 
            "Tortilla de harina rellena de queso Oaxaca derretido, servida con crema y salsa", 
            4.50, 2.80, "https://images.unsplash.com/photo-1618040996337-56904b7850b9", true, 5));
            
        Producto quesadillaPollo = tiendaService.saveProducto(new Producto("Quesadilla de Pollo", 
            "Quesadilla rellena de pollo desmenuzado y queso, con especias mexicanas", 
            5.50, 3.20, "https://images.unsplash.com/photo-1565299507177-b0ac66763828", true, 5));
            
        Producto quesadillaCarnitas = tiendaService.saveProducto(new Producto("Quesadilla de Carnitas", 
            "Deliciosa quesadilla con carnitas de cerdo y queso derretido", 
            6.00, 3.50, "https://images.unsplash.com/photo-1599974579688-8dbdd42c4e31", true, 4));

        // === TORTAS ===
        Producto tortaAhogada = tiendaService.saveProducto(new Producto("Torta Ahogada", 
            "Tradicional torta tapatía con carnitas, bañada en salsa de chile de árbol", 
            7.50, 4.50, "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b", true, 5));
            
        Producto tortaCubana = tiendaService.saveProducto(new Producto("Torta Cubana", 
            "Torta completa con jamón, milanesa, huevo, aguacate, frijoles y queso", 
            8.50, 5.20, "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b", true, 4));

        // === BEBIDAS ===
        Producto aguaHorchata = tiendaService.saveProducto(new Producto("Agua de Horchata", 
            "Bebida tradicional de arroz con canela y azúcar, refrescante y cremosa", 
            2.50, 1.20, "https://images.aws.nestle.recipes/original/8eaf50148ed521383df5d9793cba995f_whatsapp_image_2022-04-28_at_1.00.26_pm_(2).jpeg", true, 5));
            
        Producto aguaJamaica = tiendaService.saveProducto(new Producto("Agua de Jamaica", 
            "Refrescante bebida de flor de jamaica con un toque de limón", 
            2.25, 1.00, "https://images.unsplash.com/photo-1571091718767-18b5b1457add", true, 4));
            
        Producto aguaTamarindo = tiendaService.saveProducto(new Producto("Agua de Tamarindo", 
            "Bebida dulce y ácida hecha con tamarindo natural", 
            2.25, 1.00, "https://images.unsplash.com/photo-1571091718767-18b5b1457add", true, 4));
            
        Producto cocaCola = tiendaService.saveProducto(new Producto("Coca-Cola", 
            "Refresco clásico en lata de 355ml", 
            1.50, 0.80, "https://images.unsplash.com/photo-1554866585-cd94860890b7", true, 5));

        // === POSTRES ===
        Producto flan = tiendaService.saveProducto(new Producto("Flan Napolitano", 
            "Postre tradicional mexicano con caramelo casero", 
            3.50, 2.00, "https://images.unsplash.com/photo-1551024506-0bccd828d307", true, 5));
            
        Producto churros = tiendaService.saveProducto(new Producto("Churros", 
            "Churros dorados espolvoreados con azúcar y canela, servidos con cajeta", 
            4.00, 2.20, "https://images.unsplash.com/photo-1541781408260-3c61143b63d5", true, 4));

        // === ADICIONALES VARIADOS ===
        
        // Adicionales para carnes
        Adicional extraPina = tiendaService.saveAdicional(new Adicional("Extra Piña", "Piña fresca adicional", 0.50, 0.30, 25, true));
        Adicional extraCarne = tiendaService.saveAdicional(new Adicional("Extra Carne", "Porción adicional de carne", 1.50, 1.00, 20, true));
        Adicional extraPollo = tiendaService.saveAdicional(new Adicional("Extra Pollo", "Porción adicional de pollo", 1.25, 0.85, 18, true));
        Adicional extraChorizo = tiendaService.saveAdicional(new Adicional("Extra Chorizo", "Porción adicional de chorizo", 1.00, 0.70, 15, true));
        
        // Quesos y lácteos
        Adicional extraQueso = tiendaService.saveAdicional(new Adicional("Extra Queso", "Queso Oaxaca derretido adicional", 0.75, 0.45, 30, true));
        Adicional quesoPanela = tiendaService.saveAdicional(new Adicional("Queso Panela", "Queso panela fresco en cubos", 0.85, 0.50, 20, true));
        Adicional crema = tiendaService.saveAdicional(new Adicional("Crema", "Crema mexicana casera", 0.50, 0.25, 25, true));
        
        // Salsas
        Adicional salsaVerde = tiendaService.saveAdicional(new Adicional("Salsa Verde", "Salsa verde casera picante", 0.25, 0.10, 50, true));
        Adicional salsaRoja = tiendaService.saveAdicional(new Adicional("Salsa Roja", "Salsa roja de chile guajillo", 0.25, 0.10, 50, true));
        Adicional salsaHabanero = tiendaService.saveAdicional(new Adicional("Salsa Habanero", "Salsa extra picante de habanero", 0.35, 0.15, 30, true));
        Adicional salsaChipotle = tiendaService.saveAdicional(new Adicional("Salsa Chipotle", "Salsa ahumada de chipotle", 0.30, 0.12, 35, true));
        
        // Vegetales
        Adicional guacamole = tiendaService.saveAdicional(new Adicional("Guacamole", "Guacamole fresco preparado diariamente", 1.00, 0.60, 20, true));
        Adicional picoGallo = tiendaService.saveAdicional(new Adicional("Pico de Gallo", "Mezcla fresca de tomate, cebolla y cilantro", 0.75, 0.40, 25, true));
        Adicional cebollaMorada = tiendaService.saveAdicional(new Adicional("Cebolla Morada", "Cebolla morada encurtida", 0.40, 0.20, 30, true));
        Adicional aguacate = tiendaService.saveAdicional(new Adicional("Aguacate", "Rebanadas de aguacate fresco", 0.80, 0.50, 15, true));
        Adicional lechuga = tiendaService.saveAdicional(new Adicional("Lechuga", "Lechuga fresca picada", 0.30, 0.15, 40, true));
        Adicional tomate = tiendaService.saveAdicional(new Adicional("Tomate", "Tomate fresco en cubos", 0.35, 0.18, 35, true));
        
        // Frijoles y complementos
        Adicional frijoles = tiendaService.saveAdicional(new Adicional("Frijoles", "Frijoles refritos caseros", 0.60, 0.35, 30, true));
        Adicional arroz = tiendaService.saveAdicional(new Adicional("Arroz", "Arroz mexicano con verduras", 0.65, 0.40, 25, true));
        Adicional papas = tiendaService.saveAdicional(new Adicional("Papas", "Papas doradas en cubos", 0.70, 0.45, 20, true));
        
        // Chiles y especias
        Adicional chilesToreados = tiendaService.saveAdicional(new Adicional("Chiles Toreados", "Chiles jalapeños asados", 0.45, 0.25, 30, true));
        Adicional chilesEnVinagre = tiendaService.saveAdicional(new Adicional("Chiles en Vinagre", "Chiles jalapeños en vinagre", 0.40, 0.20, 35, true));
        Adicional limon = tiendaService.saveAdicional(new Adicional("Limón", "Limones frescos partidos", 0.20, 0.10, 50, true));

        // === ASOCIACIONES DE ADICIONALES ===
        
        // Tacos al Pastor
        tiendaService.asociarAdicionalAProductos(extraPina.getId(), List.of(tacoAlPastor.getId()));
        tiendaService.asociarAdicionalAProductos(salsaVerde.getId(), List.of(tacoAlPastor.getId()));
        tiendaService.asociarAdicionalAProductos(salsaRoja.getId(), List.of(tacoAlPastor.getId()));
        tiendaService.asociarAdicionalAProductos(guacamole.getId(), List.of(tacoAlPastor.getId()));
        tiendaService.asociarAdicionalAProductos(cebollaMorada.getId(), List.of(tacoAlPastor.getId()));
        tiendaService.asociarAdicionalAProductos(limon.getId(), List.of(tacoAlPastor.getId()));

        // Tacos de Asada
        tiendaService.asociarAdicionalAProductos(extraCarne.getId(), List.of(tacoAsada.getId()));
        tiendaService.asociarAdicionalAProductos(picoGallo.getId(), List.of(tacoAsada.getId()));
        tiendaService.asociarAdicionalAProductos(guacamole.getId(), List.of(tacoAsada.getId()));
        tiendaService.asociarAdicionalAProductos(salsaVerde.getId(), List.of(tacoAsada.getId()));
        tiendaService.asociarAdicionalAProductos(salsaHabanero.getId(), List.of(tacoAsada.getId()));
        tiendaService.asociarAdicionalAProductos(limon.getId(), List.of(tacoAsada.getId()));

        // Tacos de Carnitas
        tiendaService.asociarAdicionalAProductos(extraCarne.getId(), List.of(tacoCarnitas.getId()));
        tiendaService.asociarAdicionalAProductos(cebollaMorada.getId(), List.of(tacoCarnitas.getId()));
        tiendaService.asociarAdicionalAProductos(salsaVerde.getId(), List.of(tacoCarnitas.getId()));
        tiendaService.asociarAdicionalAProductos(limon.getId(), List.of(tacoCarnitas.getId()));

        // Tacos de Pollo
        tiendaService.asociarAdicionalAProductos(extraPollo.getId(), List.of(tacoPollo.getId()));
        tiendaService.asociarAdicionalAProductos(guacamole.getId(), List.of(tacoPollo.getId()));
        tiendaService.asociarAdicionalAProductos(salsaChipotle.getId(), List.of(tacoPollo.getId()));
        tiendaService.asociarAdicionalAProductos(lechuga.getId(), List.of(tacoPollo.getId()));
        tiendaService.asociarAdicionalAProductos(tomate.getId(), List.of(tacoPollo.getId()));

        // Tacos de Chorizo
        tiendaService.asociarAdicionalAProductos(extraChorizo.getId(), List.of(tacoChorizo.getId()));
        tiendaService.asociarAdicionalAProductos(papas.getId(), List.of(tacoChorizo.getId()));
        tiendaService.asociarAdicionalAProductos(salsaRoja.getId(), List.of(tacoChorizo.getId()));
        tiendaService.asociarAdicionalAProductos(limon.getId(), List.of(tacoChorizo.getId()));

        // Tacos Vegetarianos
        tiendaService.asociarAdicionalAProductos(frijoles.getId(), List.of(tacoVegetariano.getId()));
        tiendaService.asociarAdicionalAProductos(aguacate.getId(), List.of(tacoVegetariano.getId()));
        tiendaService.asociarAdicionalAProductos(extraQueso.getId(), List.of(tacoVegetariano.getId()));
        tiendaService.asociarAdicionalAProductos(lechuga.getId(), List.of(tacoVegetariano.getId()));
        tiendaService.asociarAdicionalAProductos(tomate.getId(), List.of(tacoVegetariano.getId()));

        // Quesadillas
        tiendaService.asociarAdicionalAProductos(extraQueso.getId(), List.of(quesadillaQueso.getId(), quesadillaPollo.getId(), quesadillaCarnitas.getId()));
        tiendaService.asociarAdicionalAProductos(crema.getId(), List.of(quesadillaQueso.getId(), quesadillaPollo.getId(), quesadillaCarnitas.getId()));
        tiendaService.asociarAdicionalAProductos(guacamole.getId(), List.of(quesadillaQueso.getId(), quesadillaPollo.getId(), quesadillaCarnitas.getId()));
        tiendaService.asociarAdicionalAProductos(salsaVerde.getId(), List.of(quesadillaQueso.getId(), quesadillaPollo.getId(), quesadillaCarnitas.getId()));

        // Tortas
        tiendaService.asociarAdicionalAProductos(aguacate.getId(), List.of(tortaAhogada.getId(), tortaCubana.getId()));
        tiendaService.asociarAdicionalAProductos(frijoles.getId(), List.of(tortaAhogada.getId(), tortaCubana.getId()));
        tiendaService.asociarAdicionalAProductos(lechuga.getId(), List.of(tortaAhogada.getId(), tortaCubana.getId()));
        tiendaService.asociarAdicionalAProductos(tomate.getId(), List.of(tortaAhogada.getId(), tortaCubana.getId()));
        tiendaService.asociarAdicionalAProductos(chilesToreados.getId(), List.of(tortaAhogada.getId(), tortaCubana.getId()));
    }
    
    private void initializeUsers() {
        try {
            // === ADMINISTRADORES ===
            if (!autentificacionService.existsByNombreUsuario("admin")) {
                User admin = new User("Administrador Principal", "admin", "3001234567", "admin@elpicantito.com", "admin123", "ADMIN");
                autentificacionService.save(admin);
            }
            
            // Operador Admin adicional
            if (!autentificacionService.existsByNombreUsuario("operador")) {
                User operador = new User("Operador Administrativo", "operador", "3001111111", "operador@elpicantito.com", "admin123", "ADMIN");
                autentificacionService.save(operador);
            }
            
            // === USUARIOS REGULARES ===
            
            // Usuario 1
            if (!autentificacionService.existsByNombreUsuario("carlos.lopez")) {
                User carlosUser = new User("Carlos López García", "carlos.lopez", "3009876543", "carlos@email.com", "password123");
                autentificacionService.save(carlosUser);
            }
            
            // Usuario 2
            if (!autentificacionService.existsByNombreUsuario("maria.garcia")) {
                User mariaUser = new User("María García Rodríguez", "maria.garcia", "3001357924", "maria@email.com", "password456");
                autentificacionService.save(mariaUser);
            }
            
            // Usuario 3
            if (!autentificacionService.existsByNombreUsuario("juan.martinez")) {
                User juanUser = new User("Juan Martínez Pérez", "juan.martinez", "3012345678", "juan.martinez@email.com", "juan123");
                autentificacionService.save(juanUser);
            }
            
            // Usuario 4
            if (!autentificacionService.existsByNombreUsuario("ana.rodriguez")) {
                User anaUser = new User("Ana Rodríguez López", "ana.rodriguez", "3023456789", "ana.rodriguez@email.com", "ana123");
                autentificacionService.save(anaUser);
            }
            
            // Usuario 5
            if (!autentificacionService.existsByNombreUsuario("luis.hernandez")) {
                User luisUser = new User("Luis Hernández Silva", "luis.hernandez", "3034567890", "luis.hernandez@email.com", "luis123");
                autentificacionService.save(luisUser);
            }
            
            // Usuario 6
            if (!autentificacionService.existsByNombreUsuario("sofia.ramirez")) {
                User sofiaUser = new User("Sofía Ramírez Torres", "sofia.ramirez", "3045678901", "sofia.ramirez@email.com", "sofia123");
                autentificacionService.save(sofiaUser);
            }
            
            // Usuario 7
            if (!autentificacionService.existsByNombreUsuario("diego.gonzalez")) {
                User diegoUser = new User("Diego González Mendoza", "diego.gonzalez", "3056789012", "diego.gonzalez@email.com", "diego123");
                autentificacionService.save(diegoUser);
            }
            
            // Usuario 8
            if (!autentificacionService.existsByNombreUsuario("laura.perez")) {
                User lauraUser = new User("Laura Pérez Castillo", "laura.perez", "3067890123", "laura.perez@email.com", "laura123");
                autentificacionService.save(lauraUser);
            }
            
            // Usuario 9
            if (!autentificacionService.existsByNombreUsuario("pedro.sanchez")) {
                User pedroUser = new User("Pedro Sánchez Moreno", "pedro.sanchez", "3078901234", "pedro.sanchez@email.com", "pedro123");
                autentificacionService.save(pedroUser);
            }
            
            // Usuario 10
            if (!autentificacionService.existsByNombreUsuario("carmen.torres")) {
                User carmenUser = new User("Carmen Torres Jiménez", "carmen.torres", "3089012345", "carmen.torres@email.com", "carmen123");
                autentificacionService.save(carmenUser);
            }
            
            // Usuario 11
            if (!autentificacionService.existsByNombreUsuario("ricardo.jimenez")) {
                User ricardoUser = new User("Ricardo Jiménez Vega", "ricardo.jimenez", "3090123456", "ricardo.jimenez@email.com", "ricardo123");
                autentificacionService.save(ricardoUser);
            }
            
            // Usuario 12
            if (!autentificacionService.existsByNombreUsuario("valentina.mendez")) {
                User valentinaUser = new User("Valentina Méndez Ruiz", "valentina.mendez", "3101234567", "valentina.mendez@email.com", "valentina123");
                autentificacionService.save(valentinaUser);
            }
            
            // Usuario 13
            if (!autentificacionService.existsByNombreUsuario("alejandro.vargas")) {
                User alejandroUser = new User("Alejandro Vargas Cruz", "alejandro.vargas", "3112345678", "alejandro.vargas@email.com", "alejandro123");
                autentificacionService.save(alejandroUser);
            }
            
            // Usuario 14
            if (!autentificacionService.existsByNombreUsuario("isabela.cruz")) {
                User isabelaUser = new User("Isabela Cruz Morales", "isabela.cruz", "3123456789", "isabela.cruz@email.com", "isabela123");
                autentificacionService.save(isabelaUser);
            }
            
            // Usuario 15
            if (!autentificacionService.existsByNombreUsuario("fernando.morales")) {
                User fernandoUser = new User("Fernando Morales Ortiz", "fernando.morales", "3134567890", "fernando.morales@email.com", "fernando123");
                autentificacionService.save(fernandoUser);
            }
            
            // Usuario 16
            if (!autentificacionService.existsByNombreUsuario("gabriela.ortiz")) {
                User gabrielaUser = new User("Gabriela Ortiz Díaz", "gabriela.ortiz", "3145678901", "gabriela.ortiz@email.com", "gabriela123");
                autentificacionService.save(gabrielaUser);
            }
            
            // Usuario 17
            if (!autentificacionService.existsByNombreUsuario("daniel.ruiz")) {
                User danielUser = new User("Daniel Ruiz Aguilar", "daniel.ruiz", "3156789012", "daniel.ruiz@email.com", "daniel123");
                autentificacionService.save(danielUser);
            }
            
            // Usuario 18
            if (!autentificacionService.existsByNombreUsuario("natalia.diaz")) {
                User nataliaUser = new User("Natalia Díaz Herrera", "natalia.diaz", "3167890123", "natalia.diaz@email.com", "natalia123");
                autentificacionService.save(nataliaUser);
            }
            
            // Usuario 19
            if (!autentificacionService.existsByNombreUsuario("miguel.castro")) {
                User miguelUser = new User("Miguel Castro Romero", "miguel.castro", "3178901234", "miguel.castro@email.com", "miguel123");
                autentificacionService.save(miguelUser);
            }
            
            // Usuario 20
            if (!autentificacionService.existsByNombreUsuario("camila.flores")) {
                User camilaUser = new User("Camila Flores Guerrero", "camila.flores", "3189012345", "camila.flores@email.com", "camila123");
                autentificacionService.save(camilaUser);
            }
            
        } catch (Exception e) {
            System.out.println("Error al inicializar usuarios: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
