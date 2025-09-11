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
    
    // Encontrar adicionales que estan asociados a un producto especifico
    @Query("SELECT DISTINCT pa.adicional FROM ProductosAdicionales pa WHERE pa.producto.id = :productoId AND pa.adicional.disponible = true")
    List<Adicional> findByProductoIdAndDisponibleTrue(@Param("productoId") Integer productoId);
    
    // Encontrar adicionales que NO estan asociados a ningun producto
    @Query("SELECT a FROM Adicional a WHERE a.disponible = true AND a.id NOT IN " +
           "(SELECT DISTINCT pa.adicional.id FROM ProductosAdicionales pa)")
    List<Adicional> findByDisponibleTrueAndProductosIsEmpty();
    
    // Encontrar adicionales que NO estan asociados a un producto especifico
    @Query("SELECT a FROM Adicional a WHERE a.disponible = true AND a.id NOT IN " +
           "(SELECT DISTINCT pa.adicional.id FROM ProductosAdicionales pa WHERE pa.producto.id = :productoId)")
    List<Adicional> findAvailableForProduct(@Param("productoId") Integer productoId);
}