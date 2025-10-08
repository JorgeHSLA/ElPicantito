package com.picantito.picantito.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Usar allowedOriginPatterns en lugar de allowedOrigin para permitir "*"
        configuration.addAllowedOriginPattern("*");
        
        // O específicos:
        // configuration.addAllowedOrigin("http://localhost:4200");
        // configuration.addAllowedOrigin("http://localhost:3000");
        
        configuration.addAllowedMethod("*"); // GET, POST, PUT, DELETE, etc.
        configuration.addAllowedHeader("*"); // Todos los headers
        configuration.setAllowCredentials(false); // Desactivar credentials para poder usar "*"
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
