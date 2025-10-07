package com.picantito.picantito.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.repository.PedidoRepository;

@Service
public class PedidoServiceImpl implements PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;


    public List<Pedido> getPedidosByCliente(Integer clienteId) {
        List<Pedido> pedidos = pedidoRepository.findByClienteId(clienteId);
        return(pedidos);
    }

    public List<Pedido> getPedidosByRepartidor( Integer repartidorId) {
        List<Pedido> pedidos = pedidoRepository.findByRepartidorId(repartidorId);
        return (pedidos);
    }
    
}
