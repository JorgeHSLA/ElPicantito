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

import com.picantito.picantito.service.EstadisticaService;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*")
public class EstadisticaController {

    @Autowired
    private EstadisticaService estadisticaService;

    /**
     * Endpoint: GET /api/estadisticas/ventas-por-dia
     * Obtiene el total de ventas agrupadas por día
     * @return Map con fechas (String) y montos de venta (Float)
     */
    @GetMapping("/ventas-por-dia")
    public ResponseEntity<Map<String, Float>> getVentasPorDia() {
        try {
            Map<String, Float> ventas = estadisticaService.ventasPorDia();
            return ResponseEntity.ok(ventas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint: GET /api/estadisticas/mejores-clientes
     * Obtiene los mejores clientes (los que más han comprado)
     * @return Lista de IDs de clientes
     */
    @GetMapping("/mejores-clientes")
    public ResponseEntity<List<Integer>> getMejoresClientes() {
        try {
            List<Integer> clientes = estadisticaService.mejoresClientes();
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint: GET /api/estadisticas/productos-menos-vendidos
     * Obtiene los productos menos vendidos
     * @return Lista de IDs de productos
     */
    @GetMapping("/productos-menos-vendidos")
    public ResponseEntity<List<Integer>> getProductosMenosVendidos() {
        try {
            List<Integer> productos = estadisticaService.productosMenosVendidos();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint: GET /api/estadisticas/productos-mas-vendidos
     * Obtiene los productos más vendidos
     * @return Lista de IDs de productos
     */
    @GetMapping("/productos-mas-vendidos")
    public ResponseEntity<List<Integer>> getProductosMasVendidos() {
        try {
            List<Integer> productos = estadisticaService.productosMasVendidos();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint: GET /api/estadisticas/adicionales-mas-consumidos
     * Obtiene los adicionales más consumidos
     * @return Lista de IDs de adicionales
     */
    @GetMapping("/adicionales-mas-consumidos")
    public ResponseEntity<List<Integer>> getAdicionalesMasConsumidos() {
        try {
            List<Integer> adicionales = estadisticaService.AdicionalesMasConsumidos();
            return ResponseEntity.ok(adicionales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint: GET /api/estadisticas/adicionales-menos-consumidos
     * Obtiene los adicionales menos consumidos
     * @return Lista de IDs de adicionales
     */
    @GetMapping("/adicionales-menos-consumidos")
    public ResponseEntity<List<Integer>> getAdicionalesMenosConsumidos() {
        try {
            List<Integer> adicionales = estadisticaService.AdicionalesMenosConsumidos();
            return ResponseEntity.ok(adicionales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint: GET /api/estadisticas/productos-no-recomendados
     * Obtiene productos que generan menos ganancias
     * @return Lista de IDs de productos
     */
    @GetMapping("/productos-no-recomendados")
    public ResponseEntity<List<Integer>> getProductosNoRecomendados() {
        try {
            List<Integer> productos = estadisticaService.productosNoRecomendados();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint: GET /api/estadisticas/productos-recomendados
     * Obtiene productos que generan más ganancias
     * @return Lista de IDs de productos
     */
    @GetMapping("/productos-recomendados")
    public ResponseEntity<List<Integer>> getProductosRecomendados() {
        try {
            List<Integer> productos = estadisticaService.productosRecomendados();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint: GET /api/estadisticas/ingresos-totales
     * Obtiene los ingresos totales acumulados
     * @return Monto total de ingresos (Float)
     */
    @GetMapping("/ingresos-totales")
    public ResponseEntity<Float> getIngresosTotales() {
        try {
            Float ingresos = estadisticaService.ingresosTotales();
            return ResponseEntity.ok(ingresos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint: GET /api/estadisticas/ingresos-netos
     * Obtiene los ingresos netos (después de costos)
     * @return Monto neto de ingresos (Float)
     */
    @GetMapping("/ingresos-netos")
    public ResponseEntity<Float> getIngresosNetos() {
        try {
            Float ingresos = estadisticaService.ingresosNetos();
            return ResponseEntity.ok(ingresos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint: GET /api/estadisticas/total-pedidos
     * Obtiene el número total de pedidos realizados
     * @return Número total de pedidos (Integer)
     */
    @GetMapping("/total-pedidos")
    public ResponseEntity<Integer> getTotalPedidos() {
        try {
            Integer total = estadisticaService.totalPedidos();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint: GET /api/estadisticas/resumen
     * Obtiene un resumen completo de todas las estadísticas
     * @return Objeto con todas las estadísticas
     */
    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Object>> getResumen() {
        try {
            Map<String, Object> resumen = new java.util.HashMap<>();
            resumen.put("ventasPorDia", estadisticaService.ventasPorDia());
            resumen.put("mejoresClientes", estadisticaService.mejoresClientes());
            resumen.put("productosMasVendidos", estadisticaService.productosMasVendidos());
            resumen.put("productosMenosVendidos", estadisticaService.productosMenosVendidos());
            resumen.put("adicionalesMasConsumidos", estadisticaService.AdicionalesMasConsumidos());
            resumen.put("adicionalesMenosConsumidos", estadisticaService.AdicionalesMenosConsumidos());
            resumen.put("productosRecomendados", estadisticaService.productosRecomendados());
            resumen.put("productosNoRecomendados", estadisticaService.productosNoRecomendados());
            resumen.put("ingresosTotales", estadisticaService.ingresosTotales());
            resumen.put("ingresosNetos", estadisticaService.ingresosNetos());
            resumen.put("totalPedidos", estadisticaService.totalPedidos());
            return ResponseEntity.ok(resumen);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
