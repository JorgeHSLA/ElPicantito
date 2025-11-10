package com.picantito.picantito.mapper;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

import org.springframework.stereotype.Component;

import com.picantito.picantito.dto.UserDto;
import com.picantito.picantito.entities.User;

/**
 * Mapper manual para convertir entre User entity y UserDto
 */
@Component
public class UserDtoMapper {
    
    /**
     * Convierte una entidad User a UserDto
     * NO incluye la contraseña por seguridad
     */
    public UserDto toDto(User user) {
        if (user == null) return null;
        
        return UserDto.builder()
                .id(user.getId())
                .nombreCompleto(user.getNombreCompleto())
                .nombreUsuario(user.getNombreUsuario())
                .telefono(user.getTelefono())
                .correo(user.getCorreo())
                .rol(user.getRol())
                .estado(user.getEstado())
                .activo(user.getActivo())
                .build();
    }
    
    /**
     * Convierte una lista de entidades User a una lista de UserDto
     */
    public List<UserDto> toListDto(List<User> users) {
        if (users == null) return new ArrayList<>();
        
        return users.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}