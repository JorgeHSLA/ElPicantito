package com.picantito.picantito.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private String password;
    
    @Column(nullable = false)
    private String role = "USER"; // USER o ADMIN
    
    public User(String nombreCompleto, String nombreUsuario, String telefono, String correo, String password) {
        this.nombreCompleto = nombreCompleto;
        this.nombreUsuario = nombreUsuario;
        this.telefono = telefono;
        this.correo = correo;
        this.password = password;
        this.role = "USER";
    }
    
    public User(String nombreCompleto, String nombreUsuario, String telefono, String correo, String password, String role) {
        this.nombreCompleto = nombreCompleto;
        this.nombreUsuario = nombreUsuario;
        this.telefono = telefono;
        this.correo = correo;
        this.password = password;
        this.role = role;
    }
    
    public boolean isAdmin() {
        return "ADMIN".equals(this.role);
    }
    
    // (usar nombreCompleto como name)
    public String getName() {
        return this.nombreCompleto;
    }
    
    public void setName(String name) {
        this.nombreCompleto = name;
    }
}
