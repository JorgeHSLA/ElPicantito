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
    @Query("""
        SELECT a 
        FROM Adicional a 
        JOIN a.productoAdicionales pa 
        JOIN pa.producto p 
        WHERE p.id = :productoId AND a.disponible = true
    """)
    List<Adicional> findByProductoIdAndDisponibleTrue(@Param("productoId") Integer productoId);

    // Encontrar adicionales que NO están asociados a ningún producto
    @Query("""
        SELECT a 
        FROM Adicional a 
        WHERE a.disponible = true 
        AND a.productoAdicionales IS EMPTY
    """)
    List<Adicional> findByDisponibleTrueAndProductosIsEmpty();

    // Encontrar adicionales disponibles que NO están asociados a un producto específico
    @Query("""
        SELECT a 
        FROM Adicional a 
        WHERE a.disponible = true 
        AND a.id NOT IN (
            SELECT a2.id 
            FROM Adicional a2 
            JOIN a2.productoAdicionales pa 
            JOIN pa.producto p 
            WHERE p.id = :productoId
        )
    """)
    List<Adicional> findAvailableForProduct(@Param("productoId") Integer productoId);
}
