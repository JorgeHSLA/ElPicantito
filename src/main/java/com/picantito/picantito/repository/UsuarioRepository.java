package com.picantito.picantito.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.User;

@Repository
public interface UsuarioRepository extends JpaRepository<User, Integer> {
    Optional<User> findByNombreUsuario(String nombreUsuario);
    boolean existsByNombreUsuario(String nombreUsuario);
    boolean existsByCorreo(String correo);
    Optional<User> findByCorreo(String correo);
    List<User> findByActivoTrue(); // Para obtener solo usuarios activos
    List<User> findByRol(String rol); // Para obtener usuarios por rol
    List<User> findByRolAndEstado(String rol, String estado); // Para obtener usuarios
}




