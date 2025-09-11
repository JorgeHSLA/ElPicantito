package com.picantito.picantito.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByNombreUsuario(String nombreUsuario);
    boolean existsByNombreUsuario(String nombreUsuario);
    boolean existsByCorreo(String correo);
    Optional<Cliente> findByCorreo(String correo);
    List<Cliente> findByDireccionContaining(String direccion);
    
    @Query("SELECT c FROM Cliente c WHERE c.telefono = :telefono")
    Optional<Cliente> findByTelefono(@Param("telefono") String telefono);
}
