package com.picantito.picantito.repository;

import com.picantito.picantito.entities.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository 
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    
    List<Pedido> findByUserId(Integer userId);
}
