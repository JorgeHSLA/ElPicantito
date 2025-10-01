package com.picantito.picantito.entities;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class PedidoProductoAdicionalId implements Serializable {
    @Column(name = "pedido_producto_id")
    private Integer pedidoProductoId;
    
    @Column(name = "adicional_id")  
    private Integer adicionalId;
}
