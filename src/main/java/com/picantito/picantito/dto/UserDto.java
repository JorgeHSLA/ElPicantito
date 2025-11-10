package com.picantito.picantito.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * DTO para User - No expone información sensible como contraseña
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Integer id;
    private String nombreCompleto;
    private String nombreUsuario;
    private String telefono;
    private String correo;
    private String rol;
    private String estado;
    private Boolean activo;
    // NO incluye contraseña por seguridad
}