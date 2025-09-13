package com.picantito.picantito.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "productos_adicionales")
@Data
@NoArgsConstructor
public class ProductoAdicional {
    @EmbeddedId
    private ProductoAdicionalId id;

    private Integer cantidadProducto;

    @ManyToOne
    @MapsId("adicionalId")
    @JoinColumn(name = "adicional_id")
    private Adicional adicional;

    @ManyToOne
    @MapsId("productoId")
    @JoinColumn(name = "producto_id")
    private Producto producto;
}
