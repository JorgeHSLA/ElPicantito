package com.picantito.picantito.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.ProductoAdicional;
import com.picantito.picantito.entities.ProductoAdicionalId;
import com.picantito.picantito.repository.AdicionalRepository;
import com.picantito.picantito.repository.ProductRepository;
import com.picantito.picantito.repository.ProductoAdicionalRepository;

@Configuration
public class BaseProductInitializer {

    @Bean
    public CommandLineRunner ensureTacoBaseProduct(
            ProductRepository productRepository,
            AdicionalRepository adicionalRepository,
            ProductoAdicionalRepository productoAdicionalRepository) {
        return args -> {
            try {
                final String BASE_NAME = "Taco Personalizado";
                
                // 1. Crear o recuperar producto base
                Producto base;
                var existing = productRepository.findByNombre(BASE_NAME);
                if (existing.isEmpty()) {
                    base = Producto.builder()
                            .nombre(BASE_NAME)
                            .descripcion("Base para construir tacos personalizados (precio base 0)")
                            .precioDeVenta(0f)
                            .precioDeAdquisicion(0f)
                            .imagen("https://i.imgur.com/nDSixlG.png")
                            .disponible(true)
                            .calificacion(5)
                            .activo(true)
                            .build();
                    base = productRepository.save(base);
                    System.out.println("[Init] Producto base creado: '" + BASE_NAME + "' con ID=" + base.getId());
                } else {
                    base = existing.get();
                    System.out.println("[Init] Producto base ya existe: '" + BASE_NAME + "' con ID=" + base.getId());
                }

                // 2. Inicializar adicionales para el constructor de tacos
                initializeTacoAdicionales(adicionalRepository, productoAdicionalRepository, base);

            } catch (Exception e) {
                System.err.println("[Init] Error asegurando producto base Taco Personalizado: " + e.getMessage());
            }
        };
    }

    private void initializeTacoAdicionales(
            AdicionalRepository adicionalRepository,
            ProductoAdicionalRepository productoAdicionalRepository,
            Producto tacoBase) {
        
        int adicionalesCreados = 0;

        // TORTILLAS
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Tortilla de Maíz", "Tortilla tradicional de maíz", 500f, 300f);
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Tortilla de Harina", "Tortilla suave de harina de trigo", 600f, 350f);
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Tortilla Integral", "Tortilla integral nutritiva", 700f, 400f);

        // PROTEÍNAS
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Carne Asada", "Tiras de res a la parrilla sazonadas", 2500f, 1500f);
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Pollo", "Pollo marinado y asado jugoso", 2000f, 1200f);
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Pastor", "Cerdo adobado estilo pastor", 2200f, 1300f);
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Carnitas", "Cerdo cocinado lentamente", 2300f, 1400f);
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Chorizo", "Chorizo ligeramente picante", 2100f, 1250f);

        // SALSAS
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Salsa Verde", "Salsa verde picante", 300f, 150f);
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Salsa Roja", "Salsa roja tradicional", 300f, 150f);
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Salsa Habanera", "Salsa habanera muy picante", 400f, 200f);
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Salsa Chipotle", "Salsa chipotle ahumada", 400f, 200f);
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Pico de Gallo", "Pico de gallo fresco", 500f, 250f);

        // EXTRAS (Quesos y vegetales)
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Queso Oaxaca", "Queso Oaxaca derretido", 800f, 500f);
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Queso Cotija", "Queso Cotija rallado", 700f, 450f);
        adicionalesCreados += crearAdicionalSiNoExiste(adicionalRepository, productoAdicionalRepository, tacoBase,
                "Lechuga", "Lechuga fresca picada", 200f, 100f);

        System.out.println("[Init] Adicionales para Taco Personalizado inicializados: " + adicionalesCreados + " creados/verificados");
    }

    private int crearAdicionalSiNoExiste(
            AdicionalRepository adicionalRepository,
            ProductoAdicionalRepository productoAdicionalRepository,
            Producto tacoBase,
            String nombre,
            String descripcion,
            Float precioVenta,
            Float precioAdquisicion) {
        
        try {
            // Buscar si ya existe el adicional por nombre
            var existingList = adicionalRepository.findAll().stream()
                    .filter(a -> a.getNombre().equalsIgnoreCase(nombre))
                    .findFirst();

            Adicional adicional;
            if (existingList.isEmpty()) {
                adicional = new Adicional();
                adicional.setNombre(nombre);
                adicional.setDescripcion(descripcion);
                adicional.setPrecioDeVenta(precioVenta);
                adicional.setPrecioDeAdquisicion(precioAdquisicion);
                adicional.setCantidad(100);
                adicional.setDisponible(true);
                adicional.setActivo(true);
                adicional = adicionalRepository.save(adicional);
                System.out.println("[Init] Adicional creado: " + nombre + " (ID=" + adicional.getId() + ")");
            } else {
                adicional = existingList.get();
            }

            // Crear relación con Taco Personalizado si no existe
            var relacionExiste = productoAdicionalRepository.findByProductoIdAndAdicionalId(
                    tacoBase.getId(), adicional.getId());

            if (relacionExiste.isEmpty()) {
                ProductoAdicionalId paId = new ProductoAdicionalId(tacoBase.getId(), adicional.getId());
                ProductoAdicional pa = new ProductoAdicional();
                pa.setId(paId);
                pa.setProducto(tacoBase);
                pa.setAdicional(adicional);
                pa.setCantidadProducto(1);
                productoAdicionalRepository.save(pa);
                System.out.println("[Init] Relación creada: Taco Personalizado <-> " + nombre);
            }

            return 1;
        } catch (Exception e) {
            System.err.println("[Init] Error con adicional '" + nombre + "': " + e.getMessage());
            return 0;
        }
    }
}
