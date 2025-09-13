package com.picantito.picantito.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String nombreCompleto;
    
    @Column(unique = true, nullable = false)
    private String nombreUsuario;
    
    @Column(nullable = false)
    private String telefono;
    
    @Column(unique = true, nullable = false)
    private String correo;
    
    @Column(nullable = false)
    private String contrasenia;
    
    @Column(nullable = true)
    private String estado;
    
    @Column(nullable = false)
    private String rol = "USER"; // USER, REPARTIDOR, ADMIN
    
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pedido> pedidosCliente = new ArrayList<>();
    
    @OneToMany(mappedBy = "repartidor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pedido> pedidosRepartidor = new ArrayList<>();

    public User(String nombreCompleto, String nombreUsuario, String telefono, String correo, String contrasenia, String estado, String rol) {
        this.nombreCompleto = nombreCompleto;
        this.nombreUsuario = nombreUsuario;
        this.telefono = telefono;
        this.correo = correo;
        this.contrasenia = contrasenia;
        this.estado = estado;
        this.rol = rol;
    }
    public boolean isAdmin() {
    return "ADMIN".equalsIgnoreCase(this.rol);
    }

}
