package com.picantito.picantito.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pedido_producto")
@Data
@NoArgsConstructor
public class PedidoProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer cantidadProducto;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @OneToMany(mappedBy = "pedidoProducto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PedidoProductoAdicional> pedidoProductoAdicionales = new ArrayList<>();
}
