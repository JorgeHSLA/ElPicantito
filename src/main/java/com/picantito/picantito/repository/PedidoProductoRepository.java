package com.picantito.picantito.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.entities.PedidoProducto;
import com.picantito.picantito.entities.Producto;


@Repository
public interface PedidoProductoRepository extends JpaRepository<PedidoProducto, Integer> {
    
    List<PedidoProducto> findByPedido(Pedido pedido);
    
    List<PedidoProducto> findByProducto(Producto producto);
    
    List<PedidoProducto> findByPedidoAndProducto(Pedido pedido, Producto producto);
}

