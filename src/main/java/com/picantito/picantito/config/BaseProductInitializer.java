package com.picantito.picantito.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.repository.ProductRepository;

@Configuration
public class BaseProductInitializer {

    @Bean
    public CommandLineRunner ensureTacoBaseProduct(ProductRepository productRepository) {
        return args -> {
            try {
                final String BASE_NAME = "Taco Personalizado";
                var existing = productRepository.findByNombre(BASE_NAME);
                if (existing.isEmpty()) {
                    Producto base = Producto.builder()
                            .nombre(BASE_NAME)
                            .descripcion("Base para construir tacos personalizados (precio base 0)")
                            .precioDeVenta(0f)
                            .precioDeAdquisicion(0f)
                            .imagen("https://i.imgur.com/0V0Taco.png")
                            .disponible(true)
                            .calificacion(5)
                            .activo(true)
                            .build();
                    base = productRepository.save(base);
                    System.out.println("[Init] Producto base creado: '" + BASE_NAME + "' con ID=" + base.getId());
                } else {
                    System.out.println("[Init] Producto base ya existe: '" + BASE_NAME + "' con ID=" + existing.get().getId());
                }
            } catch (Exception e) {
                System.err.println("[Init] Error asegurando producto base Taco Personalizado: " + e.getMessage());
            }
        };
    }
}
