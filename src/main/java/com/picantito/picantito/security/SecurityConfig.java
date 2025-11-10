package com.picantito.picantito.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuración de seguridad con Spring Security y JWT
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF para APIs REST
                .cors(cors -> {}) // Habilitar CORS (usa la configuración de WebConfig)
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos
                        .requestMatchers(
                                "/api/usuarios/login",
                                "/api/usuarios/registro",
                                "/api/usuarios",
                                "/api/productos",
                                "/api/productos/**",
                                "/api/adicional",
                                "/api/adicional/**",
                                "/api/utils/**",
                                "/error",
                                "/actuator/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        
                        // Endpoints solo para ADMIN
                        .requestMatchers(
                                "/api/usuarios/tipo/admin/**",
                                "/api/estadisticas/**"
                        ).hasRole("ADMIN")
                        
                        // Endpoints para ADMIN y OPERADOR
                        .requestMatchers(
                                "/api/productos/crear",
                                "/api/productos/*/actualizar",
                                "/api/productos/*/eliminar",
                                "/api/adicional/crear",
                                "/api/adicional/*/actualizar",
                                "/api/adicional/*/eliminar"
                        ).hasAnyRole("ADMIN", "OPERADOR")
                        
                        // Endpoints para usuarios autenticados (CLIENTE)
                        .requestMatchers(
                                "/api/pedidos",
                                "/api/pedidos/cliente/**"
                        ).hasAnyRole("CLIENTE", "ADMIN")
                        
                        // Endpoints para REPARTIDOR
                        .requestMatchers(
                                "/api/pedidos/repartidor/**",
                                "/api/pedidos/*/estado"
                        ).hasAnyRole("REPARTIDOR", "ADMIN")
                        
                        // Cualquier otro endpoint requiere autenticación
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Sin sesiones
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
