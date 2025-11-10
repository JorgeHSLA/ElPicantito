package com.picantito.picantito.entities;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pedido_producto_adicional")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
