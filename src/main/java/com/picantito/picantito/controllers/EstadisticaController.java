package com.picantito.picantito.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picantito.picantito.models.EstadisticaDTO;
import com.picantito.picantito.service.EstadisticaService;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*")
public class EstadisticaController {

    @Autowired
    private EstadisticaService estadisticaService;

    // Obtener ventas por día: http://localhost:9998/api/estadisticas/ventas-por-dia
    @GetMapping("/ventas-por-dia")
    public ResponseEntity<Map<String, Float>> getVentasPorDia() {
        try {
            Map<String, Float> ventas = estadisticaService.ventasPorDia();
            return ResponseEntity.ok(ventas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener mejores clientes: http://localhost:9998/api/estadisticas/mejores-clientes
    @GetMapping("/mejores-clientes")
    public ResponseEntity<List<Integer>> getMejoresClientes() {
        try {
            List<Integer> clientes = estadisticaService.mejoresClientes();
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener productos menos vendidos: http://localhost:9998/api/estadisticas/productos-menos-vendidos
    @GetMapping("/productos-menos-vendidos")
    public ResponseEntity<List<Integer>> getProductosMenosVendidos() {
        try {
            List<Integer> productos = estadisticaService.productosMenosVendidos();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener productos más vendidos: http://localhost:9998/api/estadisticas/productos-mas-vendidos
    @GetMapping("/productos-mas-vendidos")
    public ResponseEntity<List<Integer>> getProductosMasVendidos() {
        try {
            List<Integer> productos = estadisticaService.productosMasVendidos();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener adicionales más consumidos: http://localhost:9998/api/estadisticas/adicionales-mas-consumidos
    @GetMapping("/adicionales-mas-consumidos")
    public ResponseEntity<List<Integer>> getAdicionalesMasConsumidos() {
        try {
            List<Integer> adicionales = estadisticaService.AdicionalesMasConsumidos();
            return ResponseEntity.ok(adicionales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener adicionales menos consumidos: http://localhost:9998/api/estadisticas/adicionales-menos-consumidos
    @GetMapping("/adicionales-menos-consumidos")
    public ResponseEntity<List<Integer>> getAdicionalesMenosConsumidos() {
        try {
            List<Integer> adicionales = estadisticaService.AdicionalesMenosConsumidos();
            return ResponseEntity.ok(adicionales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener productos no recomendados: http://localhost:9998/api/estadisticas/productos-no-recomendados
    @GetMapping("/productos-no-recomendados")
    public ResponseEntity<List<Integer>> getProductosNoRecomendados() {
        try {
            List<Integer> productos = estadisticaService.productosNoRecomendados();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener productos recomendados: http://localhost:9998/api/estadisticas/productos-recomendados
    @GetMapping("/productos-recomendados")
    public ResponseEntity<List<Integer>> getProductosRecomendados() {
        try {
            List<Integer> productos = estadisticaService.productosRecomendados();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener ingresos totales: http://localhost:9998/api/estadisticas/ingresos-totales
    @GetMapping("/ingresos-totales")
    public ResponseEntity<Float> getIngresosTotales() {
        try {
            Float ingresos = estadisticaService.ingresosTotales();
            return ResponseEntity.ok(ingresos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener ingresos netos: http://localhost:9998/api/estadisticas/ingresos-netos
    @GetMapping("/ingresos-netos")
    public ResponseEntity<Float> getIngresosNetos() {
        try {
            Float ingresos = estadisticaService.ingresosNetos();
            return ResponseEntity.ok(ingresos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener total de pedidos: http://localhost:9998/api/estadisticas/total-pedidos
    @GetMapping("/total-pedidos")
    public ResponseEntity<Integer> getTotalPedidos() {
        try {
            Integer total = estadisticaService.totalPedidos();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener todas las estadísticas: http://localhost:9998/api/estadisticas/todas-las-estadisticas
    @GetMapping("/todas")
    public ResponseEntity<EstadisticaDTO> getTodasLasEstadisticas() {
        try {
            EstadisticaDTO dto = new EstadisticaDTO();
            dto.setVentasPorDia(estadisticaService.ventasPorDia());
            dto.setMejoresClientes(estadisticaService.mejoresClientes());
            dto.setProductosMenosVendidos(estadisticaService.productosMenosVendidos());
            dto.setProductosMasVendidos(estadisticaService.productosMasVendidos());
            dto.setAdicionalesMasConsumidos(estadisticaService.AdicionalesMasConsumidos());
            dto.setAdicionalesMenosConsumidos(estadisticaService.AdicionalesMenosConsumidos());
            dto.setProductosNoRecomendados(estadisticaService.productosNoRecomendados());
            dto.setProductosRecomendados(estadisticaService.productosRecomendados());
            dto.setIngresosTotales(estadisticaService.ingresosTotales());
            dto.setIngresosNetos(estadisticaService.ingresosNetos());
            dto.setTotalPedidos(estadisticaService.totalPedidos());
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
