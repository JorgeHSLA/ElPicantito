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
    
    // Autenticación
    Optional<User> findByNumero(Integer numero);
    boolean existsByNumero(Integer numero);
    boolean authenticate(Integer numero, String password);
}
