package com.picantito.picantito.mapper;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

import org.springframework.stereotype.Component;

import com.picantito.picantito.dto.response.UserResponseDTO;
import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.entities.User;

@Component
public class UserMapper {
    
    public UserResponseDTO toDTO(User user) {
        if (user == null) return null;
        
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setNombreCompleto(user.getNombreCompleto());
        dto.setNombreUsuario(user.getNombreUsuario());
        dto.setTelefono(user.getTelefono());
        dto.setCorreo(user.getCorreo());
        dto.setRol(user.getRol());
        dto.setEstado(user.getEstado());
        dto.setActivo(user.getActivo());
        
        // Extraer sólo los IDs de los pedidos como cliente
        if (user.getPedidosCliente() != null) {
            dto.setPedidosClienteIds(user.getPedidosCliente().stream()
                .map(Pedido::getId)
                .collect(Collectors.toList()));
        } else {
            dto.setPedidosClienteIds(new ArrayList<>());
        }
        
        // Extraer sólo los IDs de los pedidos como repartidor
        if (user.getPedidosRepartidor() != null) {
            dto.setPedidosRepartidorIds(user.getPedidosRepartidor().stream()
                .map(Pedido::getId)
                .collect(Collectors.toList()));
        } else {
            dto.setPedidosRepartidorIds(new ArrayList<>());
        }
        
        return dto;
    }
    
    public List<UserResponseDTO> toListDTO(List<User> users) {
        if (users == null) return null;
        return users.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}