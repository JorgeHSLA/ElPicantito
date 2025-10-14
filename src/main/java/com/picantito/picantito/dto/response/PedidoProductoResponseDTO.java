package com.picantito.picantito.dto.response;

import java.util.List;

import lombok.Data;

@Data
public class PedidoProductoResponseDTO {
    private Integer id;
    private Integer productoId;
    private String nombreProducto;
    private Integer cantidadProducto;
    private Double precioProducto;
    private List<PedidoProductoAdicionalResponseDTO> adicionales;
}