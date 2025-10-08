package com.picantito.picantito.service;

import java.util.List;

import com.picantito.picantito.dto.CrearPedidoDTO;
import com.picantito.picantito.entities.Pedido;

public interface PedidoService {

    List<Pedido> getPedidosByCliente(Integer clienteId) ;

    public List<Pedido> getPedidosByRepartidor( Integer repartidorId);
    
    public Pedido crearPedido(CrearPedidoDTO pedidoDTO);
}