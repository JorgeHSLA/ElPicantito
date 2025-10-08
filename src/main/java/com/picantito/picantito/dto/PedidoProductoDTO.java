package com.picantito.picantito.dto;

import java.util.List;
import lombok.Data;

@Data
public class PedidoProductoDTO {
    private Integer productoId;
    private Integer cantidadProducto;
    private List<PedidoProductoAdicionalDTO> adicionales;
}
