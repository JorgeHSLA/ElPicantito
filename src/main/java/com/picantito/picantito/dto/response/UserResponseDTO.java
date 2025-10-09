package com.picantito.picantito.dto.response;

import java.util.List;

import lombok.Data;

@Data
public class UserResponseDTO {
    private Integer id;
    private String nombreCompleto;
    private String nombreUsuario;
    private String telefono;
    private String correo;
    private String rol;
    private String estado;
    private Boolean activo;
    private List<Integer> pedidosClienteIds;
    private List<Integer> pedidosRepartidorIds;
    // No incluimos la contraseña ni las colecciones completas de pedidos para evitar recursión infinita
}