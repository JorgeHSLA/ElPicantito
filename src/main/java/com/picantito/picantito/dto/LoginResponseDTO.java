package com.picantito.picantito.dto;

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

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}