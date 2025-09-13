package com.picantito.picantito.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Pedido;

@Repository 
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    
    // Pedidos hechos por un cliente
    List<Pedido> findByClienteId(Integer clienteId);

    // Pedidos asignados a un repartidor
    List<Pedido> findByRepartidorId(Integer repartidorId);
}
