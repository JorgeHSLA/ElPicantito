package com.picantito.picantito.dto.response;

import lombok.Data;

@Data
public class PedidoProductoAdicionalResponseDTO {
    private Integer adicionalId;
    private String nombreAdicional;
    private Integer cantidadAdicional;
}