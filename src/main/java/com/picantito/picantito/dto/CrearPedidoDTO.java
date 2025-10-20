package com.picantito.picantito.dto;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import lombok.Data;

@Data
public class CrearPedidoDTO {
    private Float precioDeVenta;
    private Float precioDeAdquisicion;
    private String fechaEntrega; // Cambiado a String para recibir desde frontend
    private String estado;
    private String direccion;
    private Integer clienteId;
    private Integer repartidorId;
    private List<PedidoProductoDTO> productos;
    
    /**
     * Convierte la fecha de entrega String a Timestamp
     * Soporta múltiples formatos: ISO 8601 y SQL Timestamp
     */
    public Timestamp getFechaEntregaAsTimestamp() {
        if (fechaEntrega == null || fechaEntrega.trim().isEmpty()) {
            return null;
        }
        
        try {
            // Intentar parsear como SQL Timestamp (yyyy-MM-dd HH:mm:ss)
            SimpleDateFormat sqlFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            return new Timestamp(sqlFormat.parse(fechaEntrega.trim()).getTime());
        } catch (ParseException e) {
            try {
                // Intentar parsear como ISO 8601 (yyyy-MM-dd'T'HH:mm:ss.SSS'Z')
                SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                return new Timestamp(isoFormat.parse(fechaEntrega.substring(0, 19)).getTime());
            } catch (Exception ex) {
                System.err.println("Error al parsear fecha de entrega: " + fechaEntrega);
                return null;
            }
        }
    }
}
