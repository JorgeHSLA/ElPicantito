package com.picantito.picantito.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Repartidor;

@Repository
public interface RepartidorRepository extends JpaRepository<Repartidor, Integer> {
    Optional<Repartidor> findByNombreUsuario(String nombreUsuario);
    boolean existsByNombreUsuario(String nombreUsuario);
    boolean existsByCorreo(String correo);
    Optional<Repartidor> findByCorreo(String correo);
    List<Repartidor> findByDisponible(boolean disponible);
    Optional<Repartidor> findByLicencia(String licencia);
    List<Repartidor> findByVehiculo(String vehiculo);
}
