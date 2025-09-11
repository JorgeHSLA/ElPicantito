package com.picantito.picantito.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/*
@Entity
@Table(name = "pedido_producto_adicional")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PedidoProductoAdicional {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adicional_id", nullable = false)
    private Adicional adicional;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_producto_id", nullable = false)
    private PedidoProducto pedidoProducto;
    
    @Column(nullable = false)
    private Integer cantidadAdicional;
    
    public PedidoProductoAdicional(Adicional adicional, PedidoProducto pedidoProducto, Integer cantidadAdicional) {
        this.adicional = adicional;
        this.pedidoProducto = pedidoProducto;
        this.cantidadAdicional = cantidadAdicional;
    }
}
*/
