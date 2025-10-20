package com.picantito.picantito.service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.picantito.picantito.dto.AsignarRepartidorDTO;
import com.picantito.picantito.dto.CrearPedidoDTO;
import com.picantito.picantito.dto.PedidoProductoDTO;
import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.entities.PedidoProducto;
import com.picantito.picantito.entities.PedidoProductoAdicional;
import com.picantito.picantito.entities.PedidoProductoAdicionalId;
import com.picantito.picantito.repository.AdicionalRepository;
import com.picantito.picantito.repository.PedidoProductoAdicionalRepository;
import com.picantito.picantito.repository.PedidoProductoRepository;
import com.picantito.picantito.repository.PedidoRepository;
import com.picantito.picantito.repository.ProductRepository;
import com.picantito.picantito.repository.UsuarioRepository;

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
    
    @Override
    public Pedido getPedidoById(Integer id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    @Override
    public List<Pedido> getPedidosByCliente(Integer clienteId) {
        List<Pedido> pedidos = pedidoRepository.findByClienteId(clienteId);
        return(pedidos);
    }

    @Override
    public List<Pedido> getPedidosByRepartidor( Integer repartidorId) {
        List<Pedido> pedidos = pedidoRepository.findByRepartidorId(repartidorId);
        return (pedidos);
    }
    
    @Override
    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }
    
    @Override
    @Transactional //  operaciones se realizan en una sola transacción de base de datos, lo que significa:
    public Pedido crearPedido(CrearPedidoDTO pedidoDTO) {
        // Crear el pedido principal
        Pedido pedido = new Pedido();
        pedido.setPrecioDeVenta(pedidoDTO.getPrecioDeVenta());
        pedido.setPrecioDeAdquisicion(pedidoDTO.getPrecioDeAdquisicion());
        pedido.setFechaEntrega(pedidoDTO.getFechaEntrega());
        pedido.setFechaSolicitud(new Timestamp(System.currentTimeMillis()));
        pedido.setEstado(pedidoDTO.getEstado() != null ? pedidoDTO.getEstado() : "RECIBIDO");
        pedido.setDireccion(pedidoDTO.getDireccion());
        
        // Validar y asignar cliente
        var clienteOpt = usuarioRepository.findById(pedidoDTO.getClienteId());
        if (!clienteOpt.isPresent()) {
            throw new RuntimeException("Cliente no encontrado con ID: " + pedidoDTO.getClienteId());
        }
        var cliente = clienteOpt.get();
        if (!"CLIENTE".equals(cliente.getRol()) && !"ADMIN".equals(cliente.getRol()) && !"USER".equals(cliente.getRol())) {
            throw new RuntimeException("El usuario con ID " + pedidoDTO.getClienteId() + 
                                      " no tiene un rol válido para crear pedidos (CLIENTE, ADMIN o USER)");
        }
        pedido.setCliente(cliente);
        
        // Validar y asignar repartidor si existe
        if (pedidoDTO.getRepartidorId() != null) {
            var repartidorOpt = usuarioRepository.findById(pedidoDTO.getRepartidorId());
            if (!repartidorOpt.isPresent()) {
                throw new RuntimeException("Repartidor no encontrado con ID: " + pedidoDTO.getRepartidorId());
            }
            var repartidor = repartidorOpt.get();
            if (!"REPARTIDOR".equals(repartidor.getRol())) {
                throw new RuntimeException("El usuario con ID " + pedidoDTO.getRepartidorId() + 
                                          " no tiene el rol de REPARTIDOR");
            }
            pedido.setRepartidor(repartidor);
        }
        
        // Guardar pedido
        pedido = pedidoRepository.save(pedido);
        
        // Crear productos del pedido
        if (pedidoDTO.getProductos() != null && !pedidoDTO.getProductos().isEmpty()) {
            for (PedidoProductoDTO productoDTO : pedidoDTO.getProductos()) {
                // Validar que el producto existe
                var productoOpt = productoRepository.findById(productoDTO.getProductoId());
                if (!productoOpt.isPresent()) {
                    throw new RuntimeException("Producto no encontrado con ID: " + productoDTO.getProductoId());
                }
                
                // Validar cantidad
                if (productoDTO.getCantidadProducto() == null || productoDTO.getCantidadProducto() <= 0) {
                    throw new RuntimeException("La cantidad del producto debe ser mayor a cero");
                }
                
                PedidoProducto pedidoProducto = new PedidoProducto();
                pedidoProducto.setPedido(pedido);
                pedidoProducto.setProducto(productoOpt.get());
                pedidoProducto.setCantidadProducto(productoDTO.getCantidadProducto());
                
                // Guardar pedido producto
                pedidoProducto = pedidoProductoRepository.save(pedidoProducto);
                
                // Crear adicionales si existen
                if (productoDTO.getAdicionales() != null && !productoDTO.getAdicionales().isEmpty()) {
                    for (var adicionalDTO : productoDTO.getAdicionales()) {
                        // Validar que el adicional existe
                        var adicionalOpt = adicionalRepository.findById(adicionalDTO.getAdicionalId());
                        if (!adicionalOpt.isPresent()) {
                            throw new RuntimeException("Adicional no encontrado con ID: " + adicionalDTO.getAdicionalId());
                        }
                        
                        var adicional = adicionalOpt.get(); // Obtener el objeto adicional
                        
                        // Validar cantidad
                        if (adicionalDTO.getCantidadAdicional() == null || adicionalDTO.getCantidadAdicional() <= 0) {
                            throw new RuntimeException("La cantidad del adicional debe ser mayor a cero");
                        }
                        
                        PedidoProductoAdicional pedidoProductoAdicional = new PedidoProductoAdicional();
                        
                        // Crear el ID compuesto
                        PedidoProductoAdicionalId id = new PedidoProductoAdicionalId();
                        id.setPedidoProductoId(pedidoProducto.getId());
                        id.setAdicionalId(adicionalDTO.getAdicionalId());
                        
                        pedidoProductoAdicional.setId(id);
                        pedidoProductoAdicional.setPedidoProducto(pedidoProducto);
                        pedidoProductoAdicional.setAdicional(adicional); // Establecer la referencia al objeto Adicional
                        pedidoProductoAdicional.setCantidadAdicional(adicionalDTO.getCantidadAdicional());
                        
                        // Guardar el adicional del producto
                        pedidoProductoAdicionalRepository.save(pedidoProductoAdicional);
                    }
                }
            }
        }
        
        // Recargar el pedido completo para asegurar que todos los datos estén actualizados
        return pedidoRepository.findById(pedido.getId()).orElse(pedido);
    }


    @Override
    @Transactional
    public Pedido asignarRepartidor(AsignarRepartidorDTO asignacionDTO){

        // Validar que el pedido existe
        var pedidoOpt = pedidoRepository.findById(asignacionDTO.getPedidoId());
        if (!pedidoOpt.isPresent()) {
            throw new RuntimeException("Pedido no encontrado con ID: " + asignacionDTO.getPedidoId());
        }

        // Validar que el repartidor existe
        var repartidorOpt = usuarioRepository.findById(asignacionDTO.getRepartidorId());
        if (!repartidorOpt.isPresent()) {
            throw new RuntimeException("Repartidor no encontrado con ID: " + asignacionDTO.getRepartidorId());
        }
        
        var repartidor = repartidorOpt.get();
        
        // Verificar que tenga el rol de REPARTIDOR
        if (!"REPARTIDOR".equals(repartidor.getRol())) {
            throw new RuntimeException("El usuario con ID " + asignacionDTO.getRepartidorId() + 
                                      " no tiene el rol de REPARTIDOR");
        }
        
        // Verificar que el repartidor esté DISPONIBLE
        if (!"DISPONIBLE".equals(repartidor.getEstado())) {
            throw new RuntimeException("El repartidor no está disponible. Estado actual: " + repartidor.getEstado());
        }

        // Asignar repartidor al pedido
        Pedido pedido = pedidoOpt.get();
        pedido.setRepartidor(repartidor);

        // Guardar cambios
        return pedidoRepository.save(pedido);
    }

    @Override
    @Transactional
    public Pedido actualizarEstado(Integer id, String estado) {
        // Validar que el pedido existe
        var pedidoOpt = pedidoRepository.findById(id);
        if (!pedidoOpt.isPresent()) {
            return null;
        }

        // Obtener el pedido y su estado anterior
        Pedido pedido = pedidoOpt.get();
        String estadoAnterior = pedido.getEstado();
        String nuevoEstado = estado.toUpperCase();

        // Actualizar estado del pedido
        pedido.setEstado(nuevoEstado);

        // Gestión automática del estado del repartidor
        if (pedido.getRepartidor() != null) {
            var repartidor = pedido.getRepartidor();
            
            // Cuando el pedido cambia a ENVIADO, el repartidor pasa a OCUPADO
            if ("ENVIADO".equals(nuevoEstado) && !"ENVIADO".equals(estadoAnterior)) {
                repartidor.setEstado("OCUPADO");
                usuarioRepository.save(repartidor);
                System.out.println("Repartidor " + repartidor.getId() + " cambió a OCUPADO (pedido enviado)");
            }
            
            // Cuando el pedido cambia a ENTREGADO, el repartidor vuelve a DISPONIBLE
            if ("ENTREGADO".equals(nuevoEstado) && !"ENTREGADO".equals(estadoAnterior)) {
                // También actualizar la fecha de entrega
                pedido.setFechaEntrega(new Timestamp(System.currentTimeMillis()));
                repartidor.setEstado("DISPONIBLE");
                usuarioRepository.save(repartidor);
                System.out.println("Repartidor " + repartidor.getId() + " cambió a DISPONIBLE (pedido entregado)");
            }
        }

        // Guardar cambios del pedido
        return pedidoRepository.save(pedido);
    }

    @Override
    public Pedido asignarRepartidorVerificado(AsignarRepartidorDTO asignacionDTO) {
        // Validar que el pedido existe
        var pedidoOpt = pedidoRepository.findById(asignacionDTO.getPedidoId());
        if (!pedidoOpt.isPresent()) {
            throw new RuntimeException("Pedido no encontrado con ID: " + asignacionDTO.getPedidoId());
        }

        Pedido pedido = pedidoOpt.get();

        // Verificar que el pedido no tenga un repartidor ya asignado
        if (pedido.getRepartidor() != null) {
            throw new RuntimeException("El pedido ya tiene un repartidor asignado");
        }

        // Validar que el repartidor existe
        var repartidorOpt = usuarioRepository.findById(asignacionDTO.getRepartidorId());
        if (!repartidorOpt.isPresent()) {
            throw new RuntimeException("Repartidor no encontrado con ID: " + asignacionDTO.getRepartidorId());
        }

        var repartidor = repartidorOpt.get();

        // Verificar que tenga el rol de REPARTIDOR
        if (!"REPARTIDOR".equals(repartidor.getRol())) {
            throw new RuntimeException("El usuario con ID " + asignacionDTO.getRepartidorId() + 
                                      " no tiene el rol de REPARTIDOR");
        }

        // Verificar que el repartidor esté "DISPONIBLE"
        if (!"DISPONIBLE".equals(repartidor.getEstado())) {
            throw new RuntimeException("El repartidor no está disponible. Estado actual: " + repartidor.getEstado());
        }

        // Asignar repartidor al pedido
        pedido.setRepartidor(repartidor);

        // Guardar cambios
        return pedidoRepository.save(pedido);
    }

}
