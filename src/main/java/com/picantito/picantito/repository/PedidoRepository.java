package com.picantito.picantito.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Cliente;
import com.picantito.picantito.entities.Pedido;

@Repository 
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    
    List<Pedido> findByCliente(Cliente cliente);
    
    List<Pedido> findByEstado(String estado);
    
    List<Pedido> findByNombreRepartidor(String nombreRepartidor);
}
