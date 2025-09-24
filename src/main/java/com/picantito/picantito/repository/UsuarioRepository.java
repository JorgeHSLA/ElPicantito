package com.picantito.picantito.repository;

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
}




