package com.picantito.picantito.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picantito.picantito.entities.User;
import com.picantito.picantito.service.AutentificacionService;

/**
 * Controlador de utilidades para administración
 * NOTA: Este endpoint debería estar protegido o eliminado en producción
 */
@RestController
@RequestMapping("/api/utils")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class UtilsController {

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AutentificacionService autentificacionService;

    /**
     * Endpoint temporal para encriptar contraseñas
     * Útil para migrar contraseñas existentes de texto plano a BCrypt
     * 
     * POST http://localhost:9998/api/utils/encriptar-password
     * Body: { "password": "miPassword123" }
     * 
     * NOTA: Eliminar o proteger este endpoint en producción
     */
    @PostMapping("/encriptar-password")
    public ResponseEntity<?> encriptarPassword(@RequestBody Map<String, String> request) {
        try {
            String plainPassword = request.get("password");
            if (plainPassword == null || plainPassword.isEmpty()) {
                return ResponseEntity.badRequest().body("Se requiere el campo 'password'");
            }

            String encryptedPassword = passwordEncoder.encode(plainPassword);
            
            return ResponseEntity.ok(Map.of(
                "passwordOriginal", plainPassword,
                "passwordEncriptada", encryptedPassword,
                "mensaje", "Usa esta contraseña encriptada para actualizar en la base de datos"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al encriptar: " + e.getMessage());
        }
    }
    
    /**
     * Endpoint para encriptar todas las contraseñas en texto plano de la base de datos
     * IMPORTANTE: Ejecutar una sola vez después de implementar JWT
     * http://localhost:9998/api/utils/encriptar-passwords-db
     * 
     * NOTA: Eliminar o proteger este endpoint en producción
     */
    @PostMapping("/encriptar-passwords-db")
    public ResponseEntity<?> encriptarPasswordsExistentes() {
        try {
            List<User> todosLosUsuarios = autentificacionService.findAll();
            int encriptados = 0;
            int yaEncriptados = 0;
            
            for (User user : todosLosUsuarios) {
                String password = user.getContrasenia();
                
                // Verificar si la contraseña ya está encriptada (BCrypt empieza con $2a$ o $2b$)
                if (password != null && !password.startsWith("$2a$") && !password.startsWith("$2b$")) {
                    // Encriptar la contraseña
                    String passwordEncriptada = passwordEncoder.encode(password);
                    user.setContrasenia(passwordEncriptada);
                    autentificacionService.save(user);
                    encriptados++;
                } else {
                    yaEncriptados++;
                }
            }
            
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("mensaje", "Proceso completado");
            resultado.put("totalUsuarios", todosLosUsuarios.size());
            resultado.put("passwordsEncriptadas", encriptados);
            resultado.put("yaEstabanEncriptadas", yaEncriptados);
            
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al encriptar contraseñas: " + e.getMessage());
        }
    }
}
