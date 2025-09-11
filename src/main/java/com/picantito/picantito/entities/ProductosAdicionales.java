package com.picantito.picantito.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/*
@Entity
@Table(name = "productos_adicionales")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductosAdicionales {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adicional_id", nullable = false)
    private Adicional adicional;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;
    
    @Column(nullable = false)
    private Integer cantidadProducto;
    
    public ProductosAdicionales(Adicional adicional, Producto producto, Integer cantidadProducto) {
        this.adicional = adicional;
        this.producto = producto;
        this.cantidadProducto = cantidadProducto;
    }
}
*/
