package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import com.picantito.picantito.entities.User;

public interface AutentificacionService {

    // CRUD Usuarios
    List<User> findAll();
    Optional<User> findById(Integer id);
    User save(User user);
    void deleteById(Integer id);
    
    // Autenticacion
    Optional<User> findByNombreUsuario(String nombreUsuario);
    Optional<User> findByCorreo(String correo);
    boolean existsByNombreUsuario(String nombreUsuario);
    boolean existsByCorreo(String correo);
    boolean authenticate(String nombreUsuario, String password);
    boolean verificacion(User user);
    public String edicionPerfil(User loggedUser, User usuario);
}
