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
        System.out.println("Creando pedido - DTO recibido: " + pedidoDTO);
        
        // Crear el pedido principal
        Pedido pedido = new Pedido();
        
        // Inicializar precios (se calcularán después con los productos)
        Float precioDeVenta = 0.0f;
        Float precioDeAdquisicion = 0.0f;
        
        // Fecha de solicitud es siempre ahora
        pedido.setFechaSolicitud(new Timestamp(System.currentTimeMillis()));
        
        // Fecha de entrega: convertir desde String si viene
        Timestamp fechaEntrega = pedidoDTO.getFechaEntregaAsTimestamp();
        if (fechaEntrega != null) {
            pedido.setFechaEntrega(fechaEntrega);
        } else {
            // Por defecto: 1 hora después de la solicitud
            Timestamp fechaEntregaPorDefecto = new Timestamp(System.currentTimeMillis() + (60 * 60 * 1000));
            pedido.setFechaEntrega(fechaEntregaPorDefecto);
        }
        
        System.out.println("Fecha solicitud: " + pedido.getFechaSolicitud());
        System.out.println("Fecha entrega: " + pedido.getFechaEntrega());
        
        pedido.setEstado(pedidoDTO.getEstado() != null ? pedidoDTO.getEstado().toUpperCase() : "RECIBIDO");
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
        
        // Guardar pedido primero para obtener su ID
        pedido = pedidoRepository.save(pedido);
        System.out.println("💾 Pedido guardado con ID: " + pedido.getId());
        
        // Crear productos del pedido y calcular precios
        if (pedidoDTO.getProductos() != null && !pedidoDTO.getProductos().isEmpty()) {
            System.out.println("🛒 Procesando " + pedidoDTO.getProductos().size() + " productos...");
            
            for (PedidoProductoDTO productoDTO : pedidoDTO.getProductos()) {
                // Validar que el producto existe
                var productoOpt = productoRepository.findById(productoDTO.getProductoId());
                if (!productoOpt.isPresent()) {
                    throw new RuntimeException("Producto no encontrado con ID: " + productoDTO.getProductoId());
                }
                
                var producto = productoOpt.get();
                
                // Validar cantidad
                if (productoDTO.getCantidadProducto() == null || productoDTO.getCantidadProducto() <= 0) {
                    throw new RuntimeException("La cantidad del producto debe ser mayor a cero");
                }
                
                // Calcular precio de este producto
                if (producto.getPrecioDeVenta() != null) {
                    float subtotal = producto.getPrecioDeVenta() * productoDTO.getCantidadProducto();
                    precioDeVenta += subtotal;
                    System.out.println("Producto: " + producto.getNombre() + 
                                     " - Precio: " + producto.getPrecioDeVenta() + 
                                     " x " + productoDTO.getCantidadProducto() + 
                                     " = " + subtotal);
                }
                
                if (producto.getPrecioDeAdquisicion() != null) {
                    precioDeAdquisicion += producto.getPrecioDeAdquisicion() * productoDTO.getCantidadProducto();
                }
                
                PedidoProducto pedidoProducto = new PedidoProducto();
                pedidoProducto.setPedido(pedido);
                pedidoProducto.setProducto(producto);
                pedidoProducto.setCantidadProducto(productoDTO.getCantidadProducto());
                
                // Guardar pedido producto
                pedidoProducto = pedidoProductoRepository.save(pedidoProducto);
                
                // Crear adicionales si existen y calcular sus precios
                if (productoDTO.getAdicionales() != null && !productoDTO.getAdicionales().isEmpty()) {
                    System.out.println("Procesando " + productoDTO.getAdicionales().size() + " adicionales...");
                    
                    for (var adicionalDTO : productoDTO.getAdicionales()) {
                        // Validar que el adicional existe
                        var adicionalOpt = adicionalRepository.findById(adicionalDTO.getAdicionalId());
                        if (!adicionalOpt.isPresent()) {
                            throw new RuntimeException("Adicional no encontrado con ID: " + adicionalDTO.getAdicionalId());
                        }
                        
                        var adicional = adicionalOpt.get();
                        
                        // Validar cantidad
                        if (adicionalDTO.getCantidadAdicional() == null || adicionalDTO.getCantidadAdicional() <= 0) {
                            throw new RuntimeException("La cantidad del adicional debe ser mayor a cero");
                        }
                        
                        // Calcular precio del adicional
                        if (adicional.getPrecioDeVenta() != null) {
                            float subtotal = adicional.getPrecioDeVenta() * adicionalDTO.getCantidadAdicional();
                            precioDeVenta += subtotal;
                            System.out.println("Adicional: " + adicional.getNombre() + 
                                             " - Precio: " + adicional.getPrecioDeVenta() + 
                                             " x " + adicionalDTO.getCantidadAdicional() + 
                                             " = " + subtotal);
                        }
                        
                        if (adicional.getPrecioDeAdquisicion() != null) {
                            precioDeAdquisicion += adicional.getPrecioDeAdquisicion() * adicionalDTO.getCantidadAdicional();
                        }
                        
                        PedidoProductoAdicional pedidoProductoAdicional = new PedidoProductoAdicional();
                        
                        // Crear el ID compuesto
                        PedidoProductoAdicionalId id = new PedidoProductoAdicionalId();
                        id.setPedidoProductoId(pedidoProducto.getId());
                        id.setAdicionalId(adicionalDTO.getAdicionalId());
                        
                        pedidoProductoAdicional.setId(id);
                        pedidoProductoAdicional.setPedidoProducto(pedidoProducto);
                        pedidoProductoAdicional.setAdicional(adicional);
                        pedidoProductoAdicional.setCantidadAdicional(adicionalDTO.getCantidadAdicional());
                        
                        // Guardar el adicional del producto
                        pedidoProductoAdicionalRepository.save(pedidoProductoAdicional);
                    }
                }
            }
        }
        
        // Actualizar los precios calculados en el pedido
        pedido.setPrecioDeVenta(precioDeVenta);
        pedido.setPrecioDeAdquisicion(precioDeAdquisicion);
        
        // Guardar el pedido con los precios actualizados
        pedido = pedidoRepository.save(pedido);
        
        System.out.println("Pedido creado exitosamente:");
        System.out.println("ID: " + pedido.getId());
        System.out.println("Precio Venta: $" + precioDeVenta);
        System.out.println("Precio Adquisición: $" + precioDeAdquisicion);
        System.out.println("Fecha Solicitud: " + pedido.getFechaSolicitud());
        System.out.println("Fecha Entrega: " + pedido.getFechaEntrega());

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

    @Override
    @Transactional
    public void eliminarPedido(Integer id) {
        // Simplemente eliminar el pedido, la cascada se encarga del resto
        if (!pedidoRepository.existsById(id)) {
            throw new RuntimeException("Pedido no encontrado con ID: " + id);
        }
        pedidoRepository.deleteById(id);
    }

}
