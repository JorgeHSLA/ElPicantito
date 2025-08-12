package com.picantito.picantito.service;

import java.util.Collection;

import com.picantito.picantito.entities.User;

public interface AutentificacionService {

    public User findById(Integer id) ;

    public Collection<User> findAll(Integer id) ;

    public void save(User user) ;

    public Boolean exists(Integer telefono);
    
}
