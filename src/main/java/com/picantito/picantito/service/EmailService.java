package com.picantito.picantito.service;

import com.picantito.picantito.entities.VerificationCode;
import com.picantito.picantito.repository.VerificationCodeRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final VerificationCodeRepository verificationCodeRepository;
    
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;
    private static final int CODE_EXPIRATION_MINUTES = 5;
    
    /**
     * Genera un código alfanumérico de 6 dígitos
     */
    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        
        return code.toString();
    }
    
    /**
     * Envía un código de verificación al correo especificado
     */
    @Transactional
    public String sendVerificationCode(String email) {
        try {
            // Limpiar transacción anterior si existe
            try {
                verificationCodeRepository.deleteByEmail(email);
            } catch (Exception e) {
                log.warn("No se pudieron eliminar códigos anteriores para {}: {}", email, e.getMessage());
            }
            
            // Generar nuevo código
            String code = generateVerificationCode();
            
            // Guardar en la base de datos
            VerificationCode verificationCode = new VerificationCode();
            verificationCode.setEmail(email);
            verificationCode.setCode(code);
            verificationCode.setExpirationTime(LocalDateTime.now().plusMinutes(CODE_EXPIRATION_MINUTES));
            verificationCode.setVerified(false);
            verificationCode.setCreatedAt(LocalDateTime.now());
            
            verificationCodeRepository.save(verificationCode);
            
            log.info("Código de verificación generado y guardado para {}: {}", email, code);
            
            // Enviar correo de forma asíncrona (no bloquear si falla)
            try {
                sendEmailAsync(email, code);
            } catch (Exception e) {
                log.error("Error al enviar email a {}, pero el código fue guardado: {}", email, code, e);
            }
            
            return "Código enviado exitosamente";
            
        } catch (Exception e) {
            log.error("Error al generar código de verificación para {}", email, e);
            throw new RuntimeException("Error al enviar el código de verificación: " + e.getMessage());
        }
    }
    
    /**
     * Envía el email de forma asíncrona
     */
    @Async
    public void sendEmailAsync(String to, String code) {
        try {
            log.info("Intentando enviar email a {} con código {}", to, code);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("elpicantitotacosautenticos@gmail.com");
            helper.setTo(to);
            helper.setSubject("🌮 Código de Verificación - El Picantito");
            
            String htmlContent = buildEmailTemplate(code);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("✅ Email enviado exitosamente a {}", to);
            
        } catch (Exception e) {
            log.error("❌ Error al enviar email a {}: {}", to, e.getMessage(), e);
        }
    }
    
    /**
     * Verifica si un código es válido
     */
    @Transactional
    public boolean verifyCode(String email, String code) {
        Optional<VerificationCode> verificationCodeOpt = verificationCodeRepository.findByEmailAndCode(email, code);
        
        if (verificationCodeOpt.isEmpty()) {
            log.warn("Código no encontrado para email: {}", email);
            return false;
        }
        
        VerificationCode verificationCode = verificationCodeOpt.get();
        
        // Verificar si el código ha expirado
        if (LocalDateTime.now().isAfter(verificationCode.getExpirationTime())) {
            log.warn("Código expirado para email: {}", email);
            verificationCodeRepository.delete(verificationCode);
            return false;
        }
        
        // Marcar como verificado
        verificationCode.setVerified(true);
        verificationCodeRepository.save(verificationCode);
        
        log.info("Código verificado exitosamente para email: {}", email);
        return true;
    }
    
    /**
     * Verifica si un email ya fue verificado
     */
    public boolean isEmailVerified(String email) {
        Optional<VerificationCode> verificationCodeOpt = verificationCodeRepository.findByEmail(email);
        return verificationCodeOpt.isPresent() && verificationCodeOpt.get().isVerified();
    }
    
    /**
     * Limpia códigos expirados
     */
    @Transactional
    public void cleanExpiredCodes() {
        verificationCodeRepository.deleteByExpirationTimeBefore(LocalDateTime.now());
        log.info("Códigos expirados eliminados");
    }
    
    /**
     * Template HTML para el correo
     */
    private String buildEmailTemplate(String code) {
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background: white;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #212529 0%, #343a40 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        border-bottom: 4px solid #ffc107;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                    }
                    .header p {
                        margin: 10px 0 0 0;
                        font-size: 14px;
                        opacity: 0.9;
                    }
                    .content {
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .content h2 {
                        color: #212529;
                        margin: 0 0 20px 0;
                        font-size: 24px;
                    }
                    .content p {
                        color: #6c757d;
                        line-height: 1.6;
                        margin: 0 0 30px 0;
                        font-size: 16px;
                    }
                    .code-box {
                        background: linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%);
                        border: 3px solid #ffc107;
                        border-radius: 12px;
                        padding: 30px;
                        margin: 30px 0;
                    }
                    .code {
                        font-size: 42px;
                        font-weight: 800;
                        color: #212529;
                        letter-spacing: 8px;
                        font-family: 'Courier New', monospace;
                        margin: 0;
                    }
                    .warning {
                        background: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 15px;
                        margin: 30px 0;
                        text-align: left;
                        border-radius: 8px;
                    }
                    .warning p {
                        margin: 0;
                        color: #856404;
                        font-size: 14px;
                    }
                    .footer {
                        background: #f8f9fa;
                        padding: 20px 30px;
                        text-align: center;
                        color: #6c757d;
                        font-size: 12px;
                        border-top: 1px solid #dee2e6;
                    }
                    .footer a {
                        color: #ffc107;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🌮 El Picantito</h1>
                        <p>Tacos Auténticos</p>
                    </div>
                    <div class="content">
                        <h2>Verificación de Correo Electrónico</h2>
                        <p>
                            Hemos recibido una solicitud para verificar tu correo electrónico.
                            Usa el siguiente código para completar tu registro:
                        </p>
                        <div class="code-box">
                            <p class="code">""" + code + """
                            </p>
                        </div>
                        <div class="warning">
                            <p>
                                <strong>⚠️ Importante:</strong><br>
                                • Este código es válido por 5 minutos<br>
                                • No compartas este código con nadie<br>
                                • Si no solicitaste este código, ignora este mensaje
                            </p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>
                            Este es un correo automático, por favor no respondas.<br>
                            © 2025 El Picantito - Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """;
    }
}
