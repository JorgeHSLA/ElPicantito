package com.picantito.picantito.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pedido_producto_adicional")
@Data
@NoArgsConstructor
public class PedidoProductoAdicional {
    @EmbeddedId
    private PedidoProductoAdicionalId id;

    private Integer cantidadAdicional;

    @ManyToOne
    @MapsId("pedidoProductoId")
    @JoinColumn(name = "pedido_producto_id")
    private PedidoProducto pedidoProducto;

    @ManyToOne
    @MapsId("adicionalId")
    @JoinColumn(name = "adicional_id")
    private Adicional adicional;
}
