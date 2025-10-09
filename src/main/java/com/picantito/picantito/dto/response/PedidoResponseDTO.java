package com.picantito.picantito.dto.response;

import java.sql.Timestamp;
import java.util.List;

import lombok.Data;

@Data
public class PedidoResponseDTO {
    private Integer id;
    private Float precioDeVenta;
    private Float precioDeAdquisicion;
    private Timestamp fechaEntrega;
    private Timestamp fechaSolicitud;
    private String estado;
    private String direccion;
    private Integer clienteId;
    private String clienteNombre;
    private Integer repartidorId;
    private String repartidorNombre;
    private List<PedidoProductoResponseDTO> productos;
}