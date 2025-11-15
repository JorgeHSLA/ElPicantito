package com.picantito.picantito.service;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.entities.PedidoProducto;
import com.picantito.picantito.entities.PedidoProductoAdicional;
import com.picantito.picantito.repository.PedidoProductoAdicionalRepository;
import com.picantito.picantito.repository.PedidoProductoRepository;
import com.picantito.picantito.repository.PedidoRepository;

@Service
public class EstadisticaServiceimpl implements EstadisticaService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private PedidoProductoRepository pedidoProductoRepository;

    @Autowired
    private PedidoProductoAdicionalRepository pedidoProductoAdicionalRepository;

    @Override
    public Map<String, Float> ventasPorDia() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        Map<String, Float> ventasPorDia = new LinkedHashMap<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        System.out.println("=== DEBUG ventasPorDia ===");
        System.out.println("Total pedidos: " + pedidos.size());
        
        for (Pedido pedido : pedidos) {
            System.out.println("Pedido ID: " + pedido.getId() + 
                             ", fechaSolicitud: " + pedido.getFechaSolicitud() + 
                             ", precioDeVenta: " + pedido.getPrecioDeVenta());
            
            if (pedido.getFechaSolicitud() != null && pedido.getPrecioDeVenta() != null) {
                String fecha = dateFormat.format(pedido.getFechaSolicitud());
                ventasPorDia.merge(fecha, pedido.getPrecioDeVenta(), Float::sum);
            } else {
                System.out.println("  -> SKIPPED (null fecha o precio)");
            }
        }
        
        System.out.println("Total días con ventas: " + ventasPorDia.size());

        return ventasPorDia.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new));
    }

    @Override
    public List<Integer> mejoresClientes() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        Map<Integer, Float> gastosPorCliente = new HashMap<>();

        System.out.println("=== DEBUG mejoresClientes ===");
        System.out.println("Total pedidos: " + pedidos.size());
        
        for (Pedido pedido : pedidos) {
            System.out.println("Pedido ID: " + pedido.getId() + 
                             ", cliente: " + (pedido.getCliente() != null ? pedido.getCliente().getId() : "NULL") + 
                             ", precioDeVenta: " + pedido.getPrecioDeVenta());
            
            if (pedido.getCliente() != null && pedido.getPrecioDeVenta() != null) {
                Integer clienteId = pedido.getCliente().getId();
                gastosPorCliente.merge(clienteId, pedido.getPrecioDeVenta(), Float::sum);
            } else {
                System.out.println("  -> SKIPPED (null cliente o precio)");
            }
        }
        
        System.out.println("Total clientes con gastos: " + gastosPorCliente.size());

        return gastosPorCliente.entrySet().stream()
                .sorted(Map.Entry.<Integer, Float>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    public List<Integer> productosMenosVendidos() {
        List<PedidoProducto> pedidoProductos = pedidoProductoRepository.findAll();
        Map<Integer, Integer> ventasPorProducto = new HashMap<>();

        System.out.println("=== DEBUG productosMenosVendidos ===");
        for (PedidoProducto pp : pedidoProductos) {
            if (pp.getProducto() != null) {
                Integer productoId = pp.getProducto().getId();
                Integer cantidad = pp.getCantidadProducto() != null ? pp.getCantidadProducto() : 0;
                ventasPorProducto.merge(productoId, cantidad, Integer::sum);
            }
        }

        System.out.println("Productos MENOS vendidos (ordenados ASC):");
        ventasPorProducto.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .limit(10)
                .forEach(e -> System.out.println("  Producto ID: " + e.getKey() + ", Cantidad: " + e.getValue()));

        return ventasPorProducto.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    public List<Integer> productosMasVendidos() {
        List<PedidoProducto> pedidoProductos = pedidoProductoRepository.findAll();
        Map<Integer, Integer> ventasPorProducto = new HashMap<>();

        System.out.println("=== DEBUG productosMasVendidos ===");
        for (PedidoProducto pp : pedidoProductos) {
            if (pp.getProducto() != null) {
                Integer productoId = pp.getProducto().getId();
                Integer cantidad = pp.getCantidadProducto() != null ? pp.getCantidadProducto() : 0;
                ventasPorProducto.merge(productoId, cantidad, Integer::sum);
            }
        }

        System.out.println("Productos MAS vendidos (ordenados DESC):");
        ventasPorProducto.entrySet().stream()
                .sorted(Map.Entry.<Integer, Integer>comparingByValue().reversed())
                .limit(10)
                .forEach(e -> System.out.println("  Producto ID: " + e.getKey() + ", Cantidad: " + e.getValue()));

        return ventasPorProducto.entrySet().stream()
                .sorted(Map.Entry.<Integer, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    public List<Integer> AdicionalesMasConsumidos() {
        List<PedidoProductoAdicional> pedidoAdicionales = pedidoProductoAdicionalRepository.findAll();
        Map<Integer, Integer> consumoPorAdicional = new HashMap<>();

        System.out.println("=== DEBUG AdicionalesMasConsumidos ===");
        for (PedidoProductoAdicional ppa : pedidoAdicionales) {
            if (ppa.getAdicional() != null) {
                Integer adicionalId = ppa.getAdicional().getId();
                Integer cantidad = ppa.getCantidadAdicional() != null ? ppa.getCantidadAdicional() : 0;
                consumoPorAdicional.merge(adicionalId, cantidad, Integer::sum);
            }
        }

        System.out.println("Adicionales MAS consumidos (ordenados DESC):");
        consumoPorAdicional.entrySet().stream()
                .sorted(Map.Entry.<Integer, Integer>comparingByValue().reversed())
                .limit(10)
                .forEach(e -> System.out.println("  Adicional ID: " + e.getKey() + ", Cantidad: " + e.getValue()));

        return consumoPorAdicional.entrySet().stream()
                .sorted(Map.Entry.<Integer, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    public List<Integer> AdicionalesMenosConsumidos() {
        List<PedidoProductoAdicional> pedidoAdicionales = pedidoProductoAdicionalRepository.findAll();
        Map<Integer, Integer> consumoPorAdicional = new HashMap<>();

        System.out.println("=== DEBUG AdicionalesMenosConsumidos ===");
        for (PedidoProductoAdicional ppa : pedidoAdicionales) {
            if (ppa.getAdicional() != null) {
                Integer adicionalId = ppa.getAdicional().getId();
                Integer cantidad = ppa.getCantidadAdicional() != null ? ppa.getCantidadAdicional() : 0;
                consumoPorAdicional.merge(adicionalId, cantidad, Integer::sum);
            }
        }

        System.out.println("Adicionales MENOS consumidos (ordenados ASC):");
        consumoPorAdicional.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .limit(10)
                .forEach(e -> System.out.println("  Adicional ID: " + e.getKey() + ", Cantidad: " + e.getValue()));

        return consumoPorAdicional.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    public List<Integer> productosNoRecomendados() {
        List<PedidoProducto> pedidoProductos = pedidoProductoRepository.findAll();
        Map<Integer, Float> gananciasPorProducto = new HashMap<>();

        System.out.println("=== DEBUG productosNoRecomendados ===");
        System.out.println("Total pedidoProductos: " + pedidoProductos.size());
        
        for (PedidoProducto pp : pedidoProductos) {
            if (pp.getProducto() != null && pp.getPedido() != null) {
                Integer productoId = pp.getProducto().getId();
                Float precioVenta = pp.getPedido().getPrecioDeVenta();
                Float precioAdquisicion = pp.getPedido().getPrecioDeAdquisicion();
                Integer cantidad = pp.getCantidadProducto() != null ? pp.getCantidadProducto() : 0;

                System.out.println("Producto ID: " + productoId + 
                                 ", precioVenta: " + precioVenta + 
                                 ", precioAdquisicion: " + precioAdquisicion +
                                 ", cantidad: " + cantidad);

                if (precioVenta != null && precioAdquisicion != null) {
                    Float ganancia = (precioVenta - precioAdquisicion) * cantidad;
                    gananciasPorProducto.merge(productoId, ganancia, Float::sum);
                } else {
                    System.out.println("  -> SKIPPED (null precios)");
                }
            } else {
                System.out.println("  -> SKIPPED (null producto o pedido)");
            }
        }
        
        System.out.println("Total productos con ganancias: " + gananciasPorProducto.size());
        System.out.println("Productos NO recomendados (ordenados ASC por ganancia):");
        gananciasPorProducto.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .limit(10)
                .forEach(e -> System.out.println("  Producto ID: " + e.getKey() + ", Ganancia: " + e.getValue()));

        return gananciasPorProducto.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    public List<Integer> productosRecomendados() {
        List<PedidoProducto> pedidoProductos = pedidoProductoRepository.findAll();
        Map<Integer, Float> gananciasPorProducto = new HashMap<>();

        System.out.println("=== DEBUG productosRecomendados ===");
        
        for (PedidoProducto pp : pedidoProductos) {
            if (pp.getProducto() != null && pp.getPedido() != null) {
                Integer productoId = pp.getProducto().getId();
                Float precioVenta = pp.getPedido().getPrecioDeVenta();
                Float precioAdquisicion = pp.getPedido().getPrecioDeAdquisicion();
                Integer cantidad = pp.getCantidadProducto() != null ? pp.getCantidadProducto() : 0;

                if (precioVenta != null && precioAdquisicion != null) {
                    Float ganancia = (precioVenta - precioAdquisicion) * cantidad;
                    gananciasPorProducto.merge(productoId, ganancia, Float::sum);
                } else {
                    System.out.println("Producto ID: " + productoId + " -> SKIPPED (null precios)");
                }
            }
        }
        
        System.out.println("Total productos recomendados: " + gananciasPorProducto.size());
        System.out.println("Productos recomendados (ordenados DESC por ganancia):");
        gananciasPorProducto.entrySet().stream()
                .sorted(Map.Entry.<Integer, Float>comparingByValue().reversed())
                .limit(10)
                .forEach(e -> System.out.println("  Producto ID: " + e.getKey() + ", Ganancia: " + e.getValue()));

        return gananciasPorProducto.entrySet().stream()
                .sorted(Map.Entry.<Integer, Float>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    public Float ingresosTotales() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        return pedidos.stream()
                .filter(p -> p.getPrecioDeVenta() != null)
                .map(Pedido::getPrecioDeVenta)
                .reduce(0f, Float::sum);
    }

    @Override
    public Float ingresosNetos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        return pedidos.stream()
                .filter(p -> p.getPrecioDeVenta() != null && p.getPrecioDeAdquisicion() != null)
                .map(p -> p.getPrecioDeVenta() - p.getPrecioDeAdquisicion())
                .reduce(0f, Float::sum);
    }

    @Override
    public Integer totalPedidos() {
        return Math.toIntExact(pedidoRepository.count());
    }
}
