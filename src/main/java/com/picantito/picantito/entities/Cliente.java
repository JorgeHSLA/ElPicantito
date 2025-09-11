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
@Table(name = "clientes")
@Data
@NoArgsConstructor
public class Cliente {
    
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
    
    // Nuevos campos según diagrama ER
    // private Integer idCarrito;
    
    @Column(nullable = false)
    private String direccion;
    
    private String preferenciasEntrega;
}
