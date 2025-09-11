package com.picantito.picantito.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/*
@Entity
@Table(name = "pedido_producto")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PedidoProducto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;
    
    @Column(nullable = false)
    private Integer cantidadProducto;
    
    public PedidoProducto(Pedido pedido, Producto producto, Integer cantidadProducto) {
        this.pedido = pedido;
        this.producto = producto;
        this.cantidadProducto = cantidadProducto;
    }
}
*/
