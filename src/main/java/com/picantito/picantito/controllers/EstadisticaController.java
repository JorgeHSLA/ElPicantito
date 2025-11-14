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
@CrossOrigin(originPatterns = "*", allowCredentials = "false") 
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

    // Obtener todas las estadísticas: http://localhost:9998/api/estadisticas/todas
    @GetMapping("/todas")
    public ResponseEntity<EstadisticaDTO> getTodasLasEstadisticas() {
        System.out.println("========== CONTROLLER: /todas endpoint CALLED ==========");
        try {
            EstadisticaDTO dto = new EstadisticaDTO();
            
            System.out.println(">>> Calling ventasPorDia()");
            dto.setVentasPorDia(estadisticaService.ventasPorDia());
            
            System.out.println(">>> Calling mejoresClientes()");
            dto.setMejoresClientes(estadisticaService.mejoresClientes());
            
            System.out.println(">>> Calling productosMenosVendidos()");
            dto.setProductosMenosVendidos(estadisticaService.productosMenosVendidos());
            
            System.out.println(">>> Calling productosMasVendidos()");
            dto.setProductosMasVendidos(estadisticaService.productosMasVendidos());
            
            System.out.println(">>> Calling AdicionalesMasConsumidos()");
            dto.setAdicionalesMasConsumidos(estadisticaService.AdicionalesMasConsumidos());
            
            System.out.println(">>> Calling AdicionalesMenosConsumidos()");
            dto.setAdicionalesMenosConsumidos(estadisticaService.AdicionalesMenosConsumidos());
            
            System.out.println(">>> Calling productosNoRecomendados()");
            dto.setProductosNoRecomendados(estadisticaService.productosNoRecomendados());
            
            System.out.println(">>> Calling productosRecomendados()");
            dto.setProductosRecomendados(estadisticaService.productosRecomendados());
            
            System.out.println(">>> Calling ingresosTotales()");
            dto.setIngresosTotales(estadisticaService.ingresosTotales());
            
            System.out.println(">>> Calling ingresosNetos()");
            dto.setIngresosNetos(estadisticaService.ingresosNetos());
            
            System.out.println(">>> Calling totalPedidos()");
            dto.setTotalPedidos(estadisticaService.totalPedidos());
            
            System.out.println("========== CONTROLLER: Returning DTO ==========");
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            System.err.println("========== ERROR IN CONTROLLER ==========");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
