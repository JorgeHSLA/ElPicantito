package com.picantito.picantito.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.PedidoProducto;
import com.picantito.picantito.entities.PedidoProductoAdicional;
import com.picantito.picantito.entities.PedidoProductoAdicionalId;



@Repository
public interface PedidoProductoAdicionalRepository extends JpaRepository<PedidoProductoAdicional, PedidoProductoAdicionalId> {
    
    List<PedidoProductoAdicional> findByPedidoProducto(PedidoProducto pedidoProducto);
    
    List<PedidoProductoAdicional> findByAdicional(Adicional adicional);
    
    List<PedidoProductoAdicional> findByPedidoProductoAndAdicional(PedidoProducto pedidoProducto, Adicional adicional);
}

