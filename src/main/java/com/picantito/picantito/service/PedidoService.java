package com.picantito.picantito.service;

import java.util.List;

import com.picantito.picantito.dto.CrearPedidoDTO;
import com.picantito.picantito.entities.Pedido;

public interface PedidoService {

    List<Pedido> getPedidosByCliente(Integer clienteId) ;

    public List<Pedido> getPedidosByRepartidor( Integer repartidorId);
    
    public Pedido crearPedido(CrearPedidoDTO pedidoDTO);
    
    public List<Pedido> getAllPedidos();
    
    /**
     * Obtiene un pedido por su ID
     * @param id ID del pedido a buscar
     * @return El pedido si existe, o null si no se encuentra
     */
    public Pedido getPedidoById(Integer id);
}
