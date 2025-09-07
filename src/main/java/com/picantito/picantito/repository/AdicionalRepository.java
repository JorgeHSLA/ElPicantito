package com.picantito.picantito.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Adicional;

@Repository
public interface AdicionalRepository extends JpaRepository<Adicional, Integer> {
    
    // Encontrar adicionales disponibles
    List<Adicional> findByDisponibleTrue();
    
    // Encontrar adicionales que están asociados a un producto específico
    @Query("SELECT a FROM Adicional a JOIN a.productos p WHERE p.id = :productoId AND a.disponible = true")
    List<Adicional> findByProductoIdAndDisponibleTrue(@Param("productoId") Integer productoId);
    
    // Encontrar adicionales que NO están asociados a ningún producto
    @Query("SELECT a FROM Adicional a WHERE a.productos IS EMPTY AND a.disponible = true")
    List<Adicional> findByDisponibleTrueAndProductosIsEmpty();
    
    // Encontrar adicionales que NO están asociados a un producto específico
    @Query("SELECT a FROM Adicional a WHERE a.disponible = true AND a.id NOT IN " +
           "(SELECT aa.id FROM Adicional aa JOIN aa.productos p WHERE p.id = :productoId)")
    List<Adicional> findAvailableForProduct(@Param("productoId") Integer productoId);
}