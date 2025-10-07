package com.picantito.picantito.service;

import java.util.List;

import com.picantito.picantito.entities.Pedido;
public interface PedidoService {

    List<Pedido> getPedidosByCliente(Integer clienteId) ;
    List<Pedido> getPedidosByRepartidor( Integer repartidorId) ;

}

