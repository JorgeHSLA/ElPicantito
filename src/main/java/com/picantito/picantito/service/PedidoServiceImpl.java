package com.picantito.picantito.service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.picantito.picantito.dto.CrearPedidoDTO;
import com.picantito.picantito.dto.PedidoProductoDTO;
import com.picantito.picantito.entities.*;
import com.picantito.picantito.repository.*;

@Service
public class PedidoServiceImpl implements PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ProductRepository productoRepository;
    
    @Autowired
    private AdicionalRepository adicionalRepository;
    
    @Autowired
    private PedidoProductoRepository pedidoProductoRepository;
    
    @Autowired
    private PedidoProductoAdicionalRepository pedidoProductoAdicionalRepository;


    public List<Pedido> getPedidosByCliente(Integer clienteId) {
        List<Pedido> pedidos = pedidoRepository.findByClienteId(clienteId);
        return(pedidos);
    }

    public List<Pedido> getPedidosByRepartidor( Integer repartidorId) {
        List<Pedido> pedidos = pedidoRepository.findByRepartidorId(repartidorId);
        return (pedidos);
    }
    
    @Transactional
    public Pedido crearPedido(CrearPedidoDTO pedidoDTO) {
        // Crear el pedido principal
        Pedido pedido = new Pedido();
        pedido.setPrecioDeVenta(pedidoDTO.getPrecioDeVenta());
        pedido.setPrecioDeAdquisicion(pedidoDTO.getPrecioDeAdquisicion());
        pedido.setFechaEntrega(pedidoDTO.getFechaEntrega());
        pedido.setFechaSolicitud(new Timestamp(System.currentTimeMillis()));
        pedido.setEstado(pedidoDTO.getEstado());
        pedido.setDireccion(pedidoDTO.getDireccion());
        
        // Asignar cliente y repartidor
        pedido.setCliente(usuarioRepository.findById(pedidoDTO.getClienteId()).orElseThrow());
        if (pedidoDTO.getRepartidorId() != null) {
            pedido.setRepartidor(usuarioRepository.findById(pedidoDTO.getRepartidorId()).orElseThrow());
        }
        
        // Guardar pedido
        pedido = pedidoRepository.save(pedido);
        
        // Crear productos del pedido
        if (pedidoDTO.getProductos() != null) {
            for (PedidoProductoDTO productoDTO : pedidoDTO.getProductos()) {
                PedidoProducto pedidoProducto = new PedidoProducto();
                pedidoProducto.setPedido(pedido);
                pedidoProducto.setProducto(productoRepository.findById(productoDTO.getProductoId()).orElseThrow());
                pedidoProducto.setCantidadProducto(productoDTO.getCantidadProducto());
                
                // Guardar pedido producto
                pedidoProducto = pedidoProductoRepository.save(pedidoProducto);
                
                // Crear adicionales si existen
                if (productoDTO.getAdicionales() != null) {
                    for (var adicionalDTO : productoDTO.getAdicionales()) {
                        PedidoProductoAdicional pedidoProductoAdicional = new PedidoProductoAdicional();
                        
                        // Crear el ID compuesto
                        PedidoProductoAdicionalId id = new PedidoProductoAdicionalId();
                        id.setPedidoProductoId(pedidoProducto.getId());
                        id.setAdicionalId(adicionalDTO.getAdicionalId());
                        
                        pedidoProductoAdicional.setId(id);
                        pedidoProductoAdicional.setPedidoProducto(pedidoProducto);
                        pedidoProductoAdicional.setCantidadAdicional(adicionalDTO.getCantidadAdicional());
                        
                        pedidoProductoAdicionalRepository.save(pedidoProductoAdicional);
                    }
                }
            }
        }
        
        return pedidoRepository.findById(pedido.getId()).orElse(pedido);
    }
}
