package com.picantito.picantito.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "nombrecompleto", nullable = false)
    private String nombreCompleto;

    @Column(name = "nombreusuario", unique = true, nullable = false)
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

    @Column(nullable = false)
    private Boolean activo = true;

    @JsonIgnore
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pedido> pedidosCliente = new ArrayList<>();
    
    @JsonIgnore
    @OneToMany(mappedBy = "repartidor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pedido> pedidosRepartidor = new ArrayList<>();

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(this.rol);
    }

}
