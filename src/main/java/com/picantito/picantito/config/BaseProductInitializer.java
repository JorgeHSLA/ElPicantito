package com.picantito.picantito.config;

/**
 * ESTA CLASE YA NO SE UTILIZA
 * 
 * Los datos del producto "Taco Personalizado" y sus adicionales
 * ahora se cargan directamente desde el archivo datos_picantito.sql
 * en la base de datos.
 * 
 * Anteriormente este CommandLineRunner creaba automáticamente:
 * - El producto base "Taco Personalizado" (ID=1)
 * - Adicionales categorizados (Tortillas, Proteínas, Salsas, Extras)
 * - Relaciones entre el producto y sus adicionales
 * 
 * Ahora todo está en el SQL para mejor control y consistencia.
 * 
 * NOTA: @Configuration eliminada para que Spring no intente procesar esta clase.
 *       El archivo se mantiene solo como referencia histórica.
 */
public class BaseProductInitializer {
    // Clase deshabilitada - Los datos vienen del SQL
}
