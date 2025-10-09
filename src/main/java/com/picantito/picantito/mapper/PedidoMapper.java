package com.picantito.picantito.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.picantito.picantito.dto.response.PedidoProductoAdicionalResponseDTO;
import com.picantito.picantito.dto.response.PedidoProductoResponseDTO;
import com.picantito.picantito.dto.response.PedidoResponseDTO;
import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.entities.PedidoProducto;
import com.picantito.picantito.entities.PedidoProductoAdicional;

@Component
public class PedidoMapper {
    
    /**
     * Convierte una entidad Pedido a un DTO de respuesta
     * @param pedido La entidad Pedido a convertir
     * @return Un DTO con los datos del pedido formateados para la respuesta
     */
    public PedidoResponseDTO toDTO(Pedido pedido) {
        if (pedido == null) {
            return null;
        }
        
        PedidoResponseDTO dto = new PedidoResponseDTO();
        
        dto.setId(pedido.getId());
        dto.setPrecioDeVenta(pedido.getPrecioDeVenta());
        dto.setPrecioDeAdquisicion(pedido.getPrecioDeAdquisicion());
        dto.setFechaEntrega(pedido.getFechaEntrega());
        dto.setFechaSolicitud(pedido.getFechaSolicitud());
        dto.setEstado(pedido.getEstado());
        dto.setDireccion(pedido.getDireccion());
        
        // Cliente info
        if (pedido.getCliente() != null) {
            dto.setClienteId(pedido.getCliente().getId());
            dto.setClienteNombre(pedido.getCliente().getNombreCompleto());
        }
        
        // Repartidor info
        if (pedido.getRepartidor() != null) {
            dto.setRepartidorId(pedido.getRepartidor().getId());
            dto.setRepartidorNombre(pedido.getRepartidor().getNombreCompleto());
        }
        
        // Productos
        if (pedido.getPedidoProductos() != null) {
            List<PedidoProductoResponseDTO> productosDTO = pedido.getPedidoProductos().stream()
                .map(this::toPedidoProductoDTO)
                .collect(Collectors.toList());
            
            dto.setProductos(productosDTO);
        } else {
            dto.setProductos(new ArrayList<>());
        }
        
        return dto;
    }
    
    /**
     * Convierte una entidad PedidoProducto a un DTO de respuesta
     * @param pedidoProducto La entidad PedidoProducto a convertir
     * @return Un DTO con los datos del producto del pedido
     */
    private PedidoProductoResponseDTO toPedidoProductoDTO(PedidoProducto pedidoProducto) {
        if (pedidoProducto == null) {
            return null;
        }
        
        PedidoProductoResponseDTO dto = new PedidoProductoResponseDTO();
        
        dto.setId(pedidoProducto.getId());
        
        if (pedidoProducto.getProducto() != null) {
            dto.setProductoId(pedidoProducto.getProducto().getId());
            dto.setNombreProducto(pedidoProducto.getProducto().getNombre());
        }
        
        dto.setCantidadProducto(pedidoProducto.getCantidadProducto());
        
        // Adicionales
        List<PedidoProductoAdicionalResponseDTO> adicionalesDTO = new ArrayList<>();
        if (pedidoProducto.getPedidoProductoAdicionales() != null) {
            for (PedidoProductoAdicional adicional : pedidoProducto.getPedidoProductoAdicionales()) {
                PedidoProductoAdicionalResponseDTO adicionalDTO = new PedidoProductoAdicionalResponseDTO();
                
                if (adicional.getAdicional() != null) {
                    adicionalDTO.setAdicionalId(adicional.getAdicional().getId());
                    adicionalDTO.setNombreAdicional(adicional.getAdicional().getNombre());
                }
                
                adicionalDTO.setCantidadAdicional(adicional.getCantidadAdicional());
                
                adicionalesDTO.add(adicionalDTO);
            }
        }
        
        dto.setAdicionales(adicionalesDTO);
        return dto;
    }
    
    /**
     * Convierte una lista de entidades Pedido a una lista de DTOs
     * @param pedidos Lista de entidades Pedido a convertir
     * @return Lista de DTOs de pedidos
     */
    public List<PedidoResponseDTO> toListDTO(List<Pedido> pedidos) {
        if (pedidos == null) {
            return new ArrayList<>();
        }
        
        return pedidos.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}