package com.picantito.picantito.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.User;

@Repository
public interface UsuarioRepository extends JpaRepository<User, Integer> {
    Optional<User> findByNombreUsuario(String nombreUsuario);
    boolean existsByNombreUsuario(String nombreUsuario);
    boolean existsByCorreo(String correo);
    Optional<User> findByCorreo(String correo);
    List<User> findByActivoTrue(); // Para obtener solo usuarios activos
    
    // Buscar usuarios por rol usando la tabla intermedia
    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE r.nombre = :rolNombre")
    List<User> findByRol(@Param("rolNombre") String rolNombre);
    
    // Buscar usuarios por rol y estado usando la tabla intermedia
    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE r.nombre = :rolNombre AND u.estado = :estado")
    List<User> findByRolAndEstado(@Param("rolNombre") String rolNombre, @Param("estado") String estado);
}




