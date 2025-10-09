package com.picantito.picantito.dto;

import java.sql.Timestamp;
import java.util.List;
import lombok.Data;

@Data
public class CrearPedidoDTO {
    private Float precioDeVenta;
    private Float precioDeAdquisicion;
    private Timestamp fechaEntrega;
    private String estado;
    private String direccion;
    private Integer clienteId;
    private Integer repartidorId;
    private List<PedidoProductoDTO> productos;
}
