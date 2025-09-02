package com.picantito.picantito.repository;

import com.picantito.picantito.entities.Adicional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdicionalRepository extends JpaRepository<Adicional, Integer> {
    
    List<Adicional> findByProductoId(Integer productoId);
    
    List<Adicional> findByDisponibleTrue();
    
    List<Adicional> findByProductoIdAndDisponibleTrue(Integer productoId);

    List<Adicional> findByDisponibleTrueAndProductoIsNull();
}