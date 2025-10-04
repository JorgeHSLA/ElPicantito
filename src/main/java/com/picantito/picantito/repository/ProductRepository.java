package com.picantito.picantito.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Producto;

@Repository
public interface ProductRepository extends JpaRepository<Producto, Integer> {
    
    List<Producto> findByDisponibleTrue();
    
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    List<Producto> findByActivoTrue();

}
