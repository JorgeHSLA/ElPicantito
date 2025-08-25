package com.picantito.picantito.repository;

import com.picantito.picantito.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository 
public interface UsuarioRepository extends JpaRepository<User, Integer> {
    
    Optional<User> findByNumero(Integer numero);
    
    boolean existsByNumero(Integer numero);
}




