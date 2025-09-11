package com.picantito.picantito.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor 
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String nombre;
    
    // Nuevos campos según diagrama ER
    // private String nombreRepartidor;
    
    @Column(nullable = false)
    private Double precio;
    
    // Nuevo campo según diagrama ER
    // private Double precioDeAdquisicion;
    
    // Campo deprecado - usar relación many-to-many en su lugar
    // private Integer producto_ID;
    
    // Nuevo campo según diagrama ER
    // private String estado;
    
    @ManyToMany
    @JoinTable(
        name = "pedido_productos",
        joinColumns = @JoinColumn(name = "pedido_id"),
        inverseJoinColumns = @JoinColumn(name = "producto_id")
    )
    private List<Producto> productos = new ArrayList<>();
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaEntrega;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaSolicitud;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    // Nueva relación según diagrama ER
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "clientes_id")
    // private Cliente cliente;
}
