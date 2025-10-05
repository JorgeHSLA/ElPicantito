package com.picantito.picantito.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private Integer id;
    private String nombreCompleto;
    private String nombreUsuario;
    private String telefono;
    private String correo;
    private String rol;
    private String estado;
    private Boolean activo;

    // Constructor vacío
    public LoginResponseDTO() {}

    // Constructor con User
    public LoginResponseDTO(com.picantito.picantito.entities.User user) {
        this.id = user.getId();
        this.nombreCompleto = user.getNombreCompleto();
        this.nombreUsuario = user.getNombreUsuario();
        this.telefono = user.getTelefono();
        this.correo = user.getCorreo();
        this.rol = user.getRol();
        this.estado = user.getEstado();
        this.activo = user.getActivo();
    }
}