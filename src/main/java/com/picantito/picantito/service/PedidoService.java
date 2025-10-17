package com.picantito.picantito.service;

import java.util.List;

import com.picantito.picantito.dto.AsignarRepartidorDTO;
import com.picantito.picantito.dto.CrearPedidoDTO;
import com.picantito.picantito.entities.Pedido;

public interface PedidoService {

    List<Pedido> getPedidosByCliente(Integer clienteId) ;

    public List<Pedido> getPedidosByRepartidor( Integer repartidorId);
    
    public Pedido crearPedido(CrearPedidoDTO pedidoDTO);
    
    public List<Pedido> getAllPedidos();

    public Pedido asignarRepartidor(AsignarRepartidorDTO asignacionDTO);

    /**
     * Obtiene un pedido por su ID
     * @param id ID del pedido a buscar
     * @return El pedido si existe, o null si no se encuentra
     */
    public Pedido getPedidoById(Integer id);

    /**
     * Actualiza el estado de un pedido
     * @param id ID del pedido
     * @param estado Nuevo estado del pedido
     * @return El pedido actualizado, o null si no se encuentra
     */
    public Pedido actualizarEstado(Integer id, String estado);

    /**
     * Asigna un repartidor a un pedido con verificaciones adicionales
     * @param asignacionDTO DTO con IDs de pedido y repartidor
     * @return El pedido modificado
     */
    public Pedido asignarRepartidorVerificado(AsignarRepartidorDTO asignacionDTO);
}
