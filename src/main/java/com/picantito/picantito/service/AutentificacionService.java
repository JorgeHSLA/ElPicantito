package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import com.picantito.picantito.entities.User;

public interface AutentificacionService {
    String eliminarUsuario(Integer id);
    // CRUD Usuarios
    List<User> findAll();
    Optional<User> findById(Integer id);
    User save(User user);
    
    // Autenticacion
    Optional<User> findByNombreUsuario(String nombreUsuario);
    Optional<User> findByCorreo(String correo);
    boolean existsByNombreUsuario(String nombreUsuario);
    boolean existsByCorreo(String correo);
    boolean authenticate(String nombreUsuario, String password);
    
    // Métodos de negocio con validaciones completas
    String registrarUsuario(User user, String password2);
    String crearUsuario(User user);
    String actualizarUsuario(User user);
    String edicionPerfil(User loggedUser, User usuario);
    boolean ultimoAdmin(User loggedUser);
    List<User> findByRol(String rol);
    List<User> findByRolAndEstado(String rol, String estado);
}
