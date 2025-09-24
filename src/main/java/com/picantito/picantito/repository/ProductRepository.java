package com.picantito.picantito.repository;

import com.picantito.picantito.entities.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Producto, Integer> {
    
    List<Producto> findByDisponibleTrue();
    
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

}
