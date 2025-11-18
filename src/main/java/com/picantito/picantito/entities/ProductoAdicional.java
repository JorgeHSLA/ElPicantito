package com.picantito.picantito.entities;

import jakarta.persistence.Column;
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
@Table(name = "productos_adicionales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoAdicional {
    @EmbeddedId
    private ProductoAdicionalId id;

    @Column(name = "cantidadproducto")
    private Integer cantidadProducto;

        @ManyToOne
        @MapsId("adicionalId")
        @JoinColumn(name = "adicional_id")
        private Adicional adicional;

        @ManyToOne
        @MapsId("productoId")
        @JoinColumn(name = "producto_id")
        private Producto producto;

    public Integer getProductoId() {
        return this.id != null ? this.id.getProductoId() : null;
    }

    public Integer getAdicionalId() {
        return this.id != null ? this.id.getAdicionalId() : null;
    }
}
