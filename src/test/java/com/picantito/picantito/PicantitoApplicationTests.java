package com.picantito.picantito;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Prueba de Contexto de la Aplicación
 * Verifica que el contexto de Spring Boot se cargue correctamente
 */
@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Prueba de Carga del Contexto de la Aplicación")
class PicantitoApplicationTests {

	@Test
	@DisplayName("Debería cargar el contexto de la aplicación correctamente")
	void contextLoads() {
		// Arrange & Act - Spring Boot carga el contexto automáticamente
		
		// Assert - Si el contexto se carga sin errores, el test pasa
	}

}
