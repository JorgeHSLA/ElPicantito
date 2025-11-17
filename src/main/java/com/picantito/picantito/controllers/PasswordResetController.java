package com.picantito.picantito.controllers;

import com.picantito.picantito.dto.LoginResponse;
import com.picantito.picantito.dto.ResetPasswordRequest;
import com.picantito.picantito.dto.SendCodeRequest;
import com.picantito.picantito.dto.VerifyCodeRequest;
import com.picantito.picantito.entities.User;
import com.picantito.picantito.repository.UsuarioRepository;
import com.picantito.picantito.security.JwtService;
import com.picantito.picantito.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/password-reset")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
public class PasswordResetController {

    private final EmailService emailService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    /**
     * Endpoint para enviar código de recuperación de contraseña
     */
    @PostMapping("/send-code")
    public ResponseEntity<Map<String, Object>> sendPasswordResetCode(@Valid @RequestBody SendCodeRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Verificar que el email existe en la base de datos
            Optional<User> userOpt = usuarioRepository.findByCorreo(request.getEmail());
            
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "No existe una cuenta asociada a este correo");
                
                log.warn("Intento de recuperación para email no registrado: {}", request.getEmail());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            String message = emailService.sendPasswordResetCode(request.getEmail());
            
            response.put("success", true);
            response.put("message", message);
            response.put("email", request.getEmail());
            
            log.info("Código de recuperación enviado a: {}", request.getEmail());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error al enviar código de recuperación", e);
            
            response.put("success", false);
            response.put("message", "Error al enviar el código de recuperación");
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint para verificar código de recuperación
     */
    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, Object>> verifyResetCode(@Valid @RequestBody VerifyCodeRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean isValid = emailService.verifyCode(request.getEmail(), request.getCode().toUpperCase());
            
            if (isValid) {
                // Buscar el usuario por email
                Optional<User> userOpt = usuarioRepository.findByCorreo(request.getEmail());
                
                if (userOpt.isEmpty()) {
                    response.put("success", false);
                    response.put("verified", false);
                    response.put("message", "Usuario no encontrado");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }
                
                User user = userOpt.get();
                
                // Generar token JWT para login automático
                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getNombreUsuario());
                String jwt = jwtService.generateToken(userDetails);
                
                // Extraer roles sin el prefijo "ROLE_"
                var roles = userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .map(role -> role.replace("ROLE_", ""))
                        .collect(Collectors.toSet());
                
                // Construir respuesta con datos de login
                LoginResponse loginResponse = LoginResponse.builder()
                        .token(jwt)
                        .type("Bearer")
                        .id(user.getId())
                        .nombreUsuario(user.getNombreUsuario())
                        .nombreCompleto(user.getNombreCompleto())
                        .correo(user.getCorreo())
                        .telefono(user.getTelefono())
                        .roles(roles)
                        .build();
                
                response.put("success", true);
                response.put("message", "Código verificado exitosamente");
                response.put("verified", true);
                response.put("loginData", loginResponse);
                
                log.info("Código de recuperación verificado exitosamente para: {}", request.getEmail());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Código inválido o expirado");
                response.put("verified", false);
                
                log.warn("Intento de verificación de recuperación fallido para: {}", request.getEmail());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
        } catch (Exception e) {
            log.error("Error al verificar código de recuperación", e);
            
            response.put("success", false);
            response.put("message", "Error al verificar el código");
            response.put("error", e.getMessage());
            response.put("verified", false);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint para restablecer la contraseña
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Verificar el código primero
            boolean isValid = emailService.verifyCode(request.getEmail(), request.getCode().toUpperCase());
            
            if (!isValid) {
                response.put("success", false);
                response.put("message", "Código inválido o expirado");
                
                log.warn("Intento de reseteo con código inválido para: {}", request.getEmail());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            // Buscar el usuario
            Optional<User> userOpt = usuarioRepository.findByCorreo(request.getEmail());
            
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                
                log.warn("Usuario no encontrado para reseteo: {}", request.getEmail());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            // Actualizar la contraseña
            User user = userOpt.get();
            user.setContrasenia(passwordEncoder.encode(request.getNewPassword()));
            usuarioRepository.save(user);
            
            response.put("success", true);
            response.put("message", "Contraseña actualizada exitosamente");
            
            log.info("Contraseña actualizada exitosamente para: {}", request.getEmail());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error al restablecer contraseña", e);
            
            response.put("success", false);
            response.put("message", "Error al restablecer la contraseña");
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
