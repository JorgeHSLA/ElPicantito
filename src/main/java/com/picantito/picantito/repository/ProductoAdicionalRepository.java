package com.picantito.picantito.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.ProductoAdicional;
import com.picantito.picantito.entities.ProductoAdicionalId;



@Repository
public interface ProductoAdicionalRepository extends JpaRepository<ProductoAdicional, ProductoAdicionalId> {
    
    List<ProductoAdicional> findByProducto(Producto producto);
    
    List<ProductoAdicional> findByAdicional(Adicional adicional);
    
    List<ProductoAdicional> findByProductoAndAdicional(Producto producto, Adicional adicional);
}

