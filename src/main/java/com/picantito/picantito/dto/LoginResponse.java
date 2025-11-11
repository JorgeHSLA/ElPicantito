package com.picantito.picantito.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Integer id;
    private String nombreUsuario;
    private String nombreCompleto;
    private String correo;
    private Set<String> roles;
}
