package com.picantito.picantito.controllers;

import com.picantito.picantito.dto.SendCodeRequest;
import com.picantito.picantito.dto.VerifyCodeRequest;
import com.picantito.picantito.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
public class VerificationController {

    private final EmailService emailService;

    /**
     * Endpoint para enviar código de verificación
     */
    @PostMapping("/send-code")
    public ResponseEntity<Map<String, Object>> sendVerificationCode(@Valid @RequestBody SendCodeRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String message = emailService.sendVerificationCode(request.getEmail());
            
            response.put("success", true);
            response.put("message", message);
            response.put("email", request.getEmail());
            
            log.info("Código de verificación enviado a: {}", request.getEmail());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error al enviar código de verificación", e);
            
            response.put("success", false);
            response.put("message", "Error al enviar el código de verificación");
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint para verificar código
     */
    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, Object>> verifyCode(@Valid @RequestBody VerifyCodeRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean isValid = emailService.verifyCode(request.getEmail(), request.getCode().toUpperCase());
            
            if (isValid) {
                response.put("success", true);
                response.put("message", "Código verificado exitosamente");
                response.put("verified", true);
                
                log.info("Código verificado exitosamente para: {}", request.getEmail());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Código inválido o expirado");
                response.put("verified", false);
                
                log.warn("Intento de verificación fallido para: {}", request.getEmail());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
        } catch (Exception e) {
            log.error("Error al verificar código", e);
            
            response.put("success", false);
            response.put("message", "Error al verificar el código");
            response.put("error", e.getMessage());
            response.put("verified", false);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint para verificar si un email ya está verificado
     */
    @GetMapping("/check-email/{email}")
    public ResponseEntity<Map<String, Object>> checkEmailVerification(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean isVerified = emailService.isEmailVerified(email);
            
            response.put("success", true);
            response.put("email", email);
            response.put("verified", isVerified);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error al verificar estado del email", e);
            
            response.put("success", false);
            response.put("message", "Error al verificar el email");
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
