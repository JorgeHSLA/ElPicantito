package com.picantito.picantito.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Operador;

@Repository
public interface OperadorRepository extends JpaRepository<Operador, Integer> {
    Optional<Operador> findByNombreUsuario(String nombreUsuario);
    boolean existsByNombreUsuario(String nombreUsuario);
    boolean existsByCorreo(String correo);
    Optional<Operador> findByCorreo(String correo);
    List<Operador> findByActivo(boolean activo);
    List<Operador> findByTurno(String turno);
}
