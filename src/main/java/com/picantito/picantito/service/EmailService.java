package com.picantito.picantito.service;

import com.picantito.picantito.entities.VerificationCode;
import com.picantito.picantito.repository.VerificationCodeRepository;
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
     * Envía un código de recuperación de contraseña
     */
    @Transactional
    public String sendPasswordResetCode(String email) {
        try {
            // Limpiar código anterior si existe
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
            
            log.info("Código de recuperación generado y guardado para {}: {}", email, code);
            
            // Enviar correo de forma asíncrona
            try {
                sendPasswordResetEmailAsync(email, code);
            } catch (Exception e) {
                log.error("Error al enviar email de recuperación a {}, pero el código fue guardado: {}", email, code, e);
            }
            
            return "Código de recuperación enviado exitosamente";
            
        } catch (Exception e) {
            log.error("Error al generar código de recuperación para {}", email, e);
            throw new RuntimeException("Error al enviar el código de recuperación: " + e.getMessage());
        }
    }
    
    /**
     * Envía el email de recuperación de contraseña de forma asíncrona
     */
    @Async
    public void sendPasswordResetEmailAsync(String to, String code) {
        try {
            log.info("Intentando enviar email de recuperación a {} con código {}", to, code);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("elpicantitotacosautenticos@gmail.com");
            helper.setTo(to);
            helper.setSubject("🔐 Recuperación de Contraseña - El Picantito");
            
            String htmlContent = buildPasswordResetEmailTemplate(code);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("✅ Email de recuperación enviado exitosamente a {}", to);
            
        } catch (Exception e) {
            log.error("❌ Error al enviar email de recuperación a {}: {}", to, e.getMessage(), e);
        }
    }
    
    /**
     * Template HTML para el correo de recuperación de contraseña
     */
    private String buildPasswordResetEmailTemplate(String code) {
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
                    <div style="background-color: #212529; padding: 30px; text-align: center; border-bottom: 4px solid #ffc107;">
                        <h1 style="margin: 0; font-size: 28px; color: #ffffff;">🔐 Recuperación de Contraseña</h1>
                        <p style="margin: 10px 0 0 0; font-size: 14px; color: #ffffff;">El Picantito - Tacos Auténticos</p>
                    </div>
                    <div style="padding: 40px 30px; text-align: center;">
                        <h2 style="color: #212529; margin: 0 0 20px 0; font-size: 24px;">¡Hola!</h2>
                        <p style="color: #6c757d; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                            Recibimos una solicitud para restablecer tu contraseña.<br>
                            Utiliza el siguiente código para continuar:
                        </p>
                        <div style="background-color: #fff9e6; border: 3px solid #ffc107; border-radius: 12px; padding: 30px; margin: 30px 0;">
                            <div style="font-size: 42px; font-weight: 800; color: #212529; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 0;">""" + code + """
                            </div>
                        </div>
                        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; text-align: left; border-radius: 8px;">
                            <p style="margin: 5px 0; color: #856404; font-size: 14px;"><strong>⏱️ Este código expira en 5 minutos</strong></p>
                            <p style="margin: 5px 0; color: #856404; font-size: 14px;">⚠️ Si no solicitaste este cambio, ignora este correo</p>
                            <p style="margin: 5px 0; color: #856404; font-size: 14px;">🔒 Nunca compartas este código con nadie</p>
                        </div>
                        <p style="color: #6c757d; line-height: 1.6; margin: 30px 0 0 0; font-size: 16px;">
                            Ingresa este código en la página de recuperación para crear una nueva contraseña.
                        </p>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0; color: #6c757d; font-size: 13px;">
                            Este es un correo automático, por favor no respondas.<br>
                            © 2025 El Picantito - Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """;
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
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
                    <div style="background-color: #212529; padding: 30px; text-align: center; border-bottom: 4px solid #ffc107;">
                        <h1 style="margin: 0; font-size: 28px; color: #ffffff;">🌮 El Picantito</h1>
                        <p style="margin: 10px 0 0 0; font-size: 14px; color: #ffffff;">Tacos Auténticos</p>
                    </div>
                    <div style="padding: 40px 30px; text-align: center;">
                        <h2 style="color: #212529; margin: 0 0 20px 0; font-size: 24px;">Verificación de Correo Electrónico</h2>
                        <p style="color: #6c757d; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                            Hemos recibido una solicitud para verificar tu correo electrónico.
                            Usa el siguiente código para completar tu registro:
                        </p>
                        <div style="background-color: #fff9e6; border: 3px solid #ffc107; border-radius: 12px; padding: 30px; margin: 30px 0;">
                            <p style="font-size: 42px; font-weight: 800; color: #212529; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 0;">""" + code + """
                            </p>
                        </div>
                        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; text-align: left; border-radius: 8px;">
                            <p style="margin: 0; color: #856404; font-size: 14px;">
                                <strong>⚠️ Importante:</strong><br>
                                • Este código es válido por 5 minutos<br>
                                • No compartas este código con nadie<br>
                                • Si no solicitaste este código, ignora este mensaje
                            </p>
                        </div>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #dee2e6;">
                        <p style="margin: 0; color: #6c757d; font-size: 12px;">
                            Este es un correo automático, por favor no respondas.<br>
                            © 2025 El Picantito - Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """;
    }

    /**
     * Envía un correo de notificación de cambio de estado de pedido
     */
    @Async
    public void enviarNotificacionCambioEstado(String destinatario, String nombreCliente, 
                                                 Long pedidoId, String nuevoEstado) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("noreply@elpicantito.com");
            helper.setTo(destinatario);
            helper.setSubject("🌮 El Picantito - Actualización de tu Pedido #" + pedidoId);
            
            String contenido = construirHtmlCambioEstado(nombreCliente, pedidoId, nuevoEstado);
            helper.setText(contenido, true);
            
            mailSender.send(message);
            log.info("Email de notificación enviado exitosamente a: {}", destinatario);
            
        } catch (Exception e) {
            log.error("Error al enviar email de notificación a {}: {}", destinatario, e.getMessage());
        }
    }

    /**
     * Envía un correo de confirmación cuando se crea un nuevo pedido
     */
    @Async
    public void enviarConfirmacionPedidoCreado(String destinatario, String nombreCliente, 
                                                Integer pedidoId, Double total, String direccion) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("noreply@elpicantito.com");
            helper.setTo(destinatario);
            helper.setSubject("🌮 ¡Pedido Confirmado! - El Picantito #" + pedidoId);
            
            String contenido = construirHtmlPedidoCreado(nombreCliente, pedidoId, total, direccion);
            helper.setText(contenido, true);
            
            mailSender.send(message);
            log.info("Email de confirmación de pedido enviado exitosamente a: {}", destinatario);
            
        } catch (Exception e) {
            log.error("Error al enviar email de confirmación a {}: {}", destinatario, e.getMessage());
        }
    }

    /**
     * Construye el HTML del mensaje de confirmación de pedido creado
     */
    private String construirHtmlPedidoCreado(String nombreCliente, Integer pedidoId, Double total, String direccion) {
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                <div style="max-width:600px; margin:40px auto; background:#fff; border-radius:15px; overflow:hidden; box-shadow:0 0 20px rgba(0,0,0,0.1);">
                    <div style="background:#212529; padding:30px; text-align:center;">
                        <h1 style="margin:0; font-size:28px; color:#fff;">🌮 El Picantito</h1>
                        <p style="margin:10px 0 0 0; color:#fff;">¡Gracias por tu pedido!</p>
                    </div>
                    <div style="padding:40px 30px;">
                        <p style="font-size:16px; color:#1a1a1a; margin-bottom:20px;">Hola <strong style="color:#000;">%s</strong>,</p>
                        <div style="background-color:#F75226; padding:25px; border-radius:12px; text-align:center; margin:30px 0; box-shadow:0 4px 8px rgba(0,0,0,0.15);">
                            <div style="font-size:48px; margin-bottom:10px;">✅</div>
                            <h2 style="margin:0; font-size:24px; color:#fff; text-shadow:1px 1px 2px rgba(0,0,0,0.3);">¡PEDIDO CONFIRMADO!</h2>
                            <p style="margin:10px 0 0 0; font-size:14px; color:#fff; opacity:0.95;">Pedido #%d</p>
                        </div>
                        <div style="background-color:#f8f9fa; padding:20px; border-radius:10px; margin:25px 0; border-left:4px solid #28a745;">
                            <h3 style="margin:0 0 10px 0; color:#1a1a1a; font-size:16px;">💰 Total del Pedido</h3>
                            <p style="margin:0; color:#1a1a1a; font-size:24px; font-weight:bold;">$%,.2f</p>
                        </div>
                        <div style="background-color:#f8f9fa; padding:20px; border-radius:10px; margin:25px 0; border-left:4px solid #ffc107;">
                            <h3 style="margin:0 0 10px 0; color:#1a1a1a; font-size:16px;">📍 Dirección de Entrega</h3>
                            <p style="margin:0; color:#1a1a1a; font-size:15px; line-height:1.5;">%s</p>
                        </div>
                        <p style="font-size:16px; color:#1a1a1a; line-height:1.7; text-align:center;">
                            Hemos recibido tu pedido exitosamente. Nuestro restaurante está procesando tu orden y pronto comenzaremos a preparar tus deliciosos tacos con los mejores ingredientes frescos.
                        </p>
                        <div style="background-color:#fff3cd; border-left:4px solid #ffc107; padding:15px; margin:25px 0; border-radius:5px;">
                            <p style="margin:0; color:#856404; font-size:14px;">
                                <strong>💡 ¿Sabías que?</strong> Puedes seguir el estado de tu pedido en tiempo real y ver la ruta de entrega en el mapa desde tu perfil.
                            </p>
                        </div>
                        <div style="text-align:center; margin:30px 0;">
                            <a href="http://localhost:4200/cliente/pedidos" style="display:inline-block; background-color:#ffc107; color:#000; padding:15px 30px; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px; box-shadow:0 4px 6px rgba(0,0,0,0.2);">Ver Seguimiento en Tiempo Real</a>
                        </div>
                        <div style="background-color:#e3f2fd; padding:20px; border-radius:10px; margin:25px 0; border-left:4px solid #2196f3;">
                            <p style="margin:0 0 10px 0; font-size:15px; color:#01579b; font-weight:bold;">Estados de tu pedido:</p>
                            <p style="margin:0; font-size:14px; color:#1a1a1a;">✅ Recibido → 👨‍🍳 En Preparación → 🚚 En Camino → 🎉 Entregado</p>
                        </div>
                        <p style="font-size:14px; color:#1a1a1a; margin-top:30px; padding-top:20px; border-top:1px solid #ddd;">
                            <strong style="color:#000;">Nota:</strong> Te mantendremos informado por correo sobre cada cambio en el estado de tu pedido.
                        </p>
                    </div>
                    <div style="background-color:#1a1a1a; padding:20px; text-align:center; border-top:4px solid #ffc107;">
                        <p style="margin:0; font-size:12px; color:#ccc;">Este es un correo automático, por favor no respondas.<br>© 2025 El Picantito - Todos los derechos reservados</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(nombreCliente, pedidoId, total, direccion);
    }

    /**
     * Construye el HTML del mensaje de notificación según el estado
     */
    private String construirHtmlCambioEstado(String nombreCliente, Long pedidoId, String estado) {
        String estadoTitulo;
        String estadoIcono;
        String estadoColor;
        String estadoDescripcion;
        
        switch (estado.toUpperCase()) {
            case "RECIBIDO":
                estadoTitulo = "PEDIDO RECIBIDO";
                estadoIcono = "✅";
                estadoColor = "#17a2b8";
                estadoDescripcion = "Hemos recibido tu pedido y lo estamos procesando. Pronto comenzaremos a prepararlo con los mejores ingredientes.";
                break;
                
            case "COCINANDO":
                estadoTitulo = "EN PREPARACIÓN";
                estadoIcono = "👨‍🍳";
                estadoColor = "#ffc107";
                estadoDescripcion = "¡Tu pedido está siendo preparado con mucho cuidado! Nuestros chefs están trabajando en tu orden.";
                break;
                
            case "ENVIADO":
                estadoTitulo = "EN CAMINO";
                estadoIcono = "🚚";
                estadoColor = "#007bff";
                estadoDescripcion = "¡Tu pedido está en camino! Nuestro repartidor lo está llevando a tu ubicación. Puedes seguir su ruta en tiempo real desde tu perfil.";
                break;
                
            case "ENTREGADO":
                estadoTitulo = "ENTREGADO";
                estadoIcono = "🎉";
                estadoColor = "#28a745";
                estadoDescripcion = "¡Tu pedido ha sido entregado exitosamente! Esperamos que disfrutes de tu comida. ¡Gracias por confiar en El Picantito! 🌮";
                break;
                
            case "CANCELADO":
                estadoTitulo = "CANCELADO";
                estadoIcono = "❌";
                estadoColor = "#dc3545";
                estadoDescripcion = "Tu pedido ha sido cancelado. Si tienes alguna duda, contáctanos.";
                break;
                
            default:
                estadoTitulo = "ACTUALIZACIÓN DE ESTADO";
                estadoIcono = "📦";
                estadoColor = "#6c757d";
                estadoDescripcion = "Tu pedido ha sido actualizado a: " + estado;
                break;
        }
        
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 15px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                    <div style="background-color: #212529; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; color: #ffffff;">🌮 El Picantito</h1>
                        <p style="margin: 10px 0 0 0; color: #ffffff;">Actualización de tu Pedido</p>
                    </div>
                    <div style="padding: 40px 30px;">
                        <p style="font-size: 16px; color: #1a1a1a; margin-bottom: 20px;">
                            Hola <strong style="color: #000;">%s</strong>,
                        </p>
                        <div style="background-color: %s; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.15);">
                            <div style="font-size: 48px; margin-bottom: 10px;">%s</div>
                            <h2 style="margin: 0; font-size: 24px; color: #ffffff; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">%s</h2>
                            <p style="margin: 10px 0 0 0; font-size: 14px; color: #ffffff; opacity: 0.95;">Pedido #%d</p>
                        </div>
                        <p style="font-size: 16px; color: #1a1a1a; line-height: 1.7; text-align: center;">
                            %s
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://localhost:4200/cliente/pedidos" 
                               style="display: inline-block; background-color: #ffc107; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
                                Ver Seguimiento en Tiempo Real
                            </a>
                        </div>
                        <p style="font-size: 14px; color: #1a1a1a; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <strong style="color: #000;">Nota:</strong> Puedes seguir el estado de tu pedido en tiempo real desde tu perfil en nuestra aplicación.
                        </p>
                    </div>
                    <div style="background-color: #1a1a1a; padding: 20px; text-align: center; border-top: 4px solid #ffc107;">
                        <p style="margin: 0; font-size: 12px; color: #cccccc;">
                            Este es un correo automático, por favor no respondas.<br>
                            © 2025 El Picantito - Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(nombreCliente, estadoColor, estadoIcono, estadoTitulo, pedidoId, estadoDescripcion);
    }
}
