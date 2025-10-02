package com.picantito.picantito.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.ProductoAdicional;
import com.picantito.picantito.entities.ProductoAdicionalId;



@Repository
public interface ProductoAdicionalRepository extends JpaRepository<ProductoAdicional, ProductoAdicionalId> {
    
        
    // Métodos originales
    List<ProductoAdicional> findByProducto(Producto producto);
    List<ProductoAdicional> findByAdicional(Adicional adicional);
    
    // Retornar Optional<ProductoAdicional> en lugar de List
    Optional<ProductoAdicional> findByProductoAndAdicional(Producto producto, Adicional adicional);
    
    // Métodos nuevos que usan IDs directamente
    @Query("SELECT pa FROM ProductoAdicional pa WHERE pa.id.productoId = :productoId")
    List<ProductoAdicional> findByProductoId(@Param("productoId") Integer productoId);
    
    @Query("SELECT pa FROM ProductoAdicional pa WHERE pa.id.adicionalId = :adicionalId")
    List<ProductoAdicional> findByAdicionalId(@Param("adicionalId") Integer adicionalId);
    
    // Este método usa IDs y retorna un Optional
    @Query("SELECT pa FROM ProductoAdicional pa WHERE pa.id.productoId = :productoId AND pa.id.adicionalId = :adicionalId")
    Optional<ProductoAdicional> findByProductoIdAndAdicionalId(@Param("productoId") Integer productoId, @Param("adicionalId") Integer adicionalId);
    
    // Alternativa sin JPQL

}

