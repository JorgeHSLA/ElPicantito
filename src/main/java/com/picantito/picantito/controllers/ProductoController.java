package com.picantito.picantito.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.service.TiendaService;


@Controller
@RestController
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private TiendaService tiendaService;

    // Mostrar información de una producto específica: http://localhost:9998/productos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductoDetalle(@PathVariable Integer id) {
        Optional<Producto> producto = tiendaService.getProductoById(id);

        if (producto.isPresent()) {
            List<Adicional> adicionales = tiendaService.getAdicionalesByProductoId(id);

            // DTO para devolver todo junto
            Map<String, Object> response = new HashMap<>();
            response.put("producto", producto.get());
            response.put("adicionales", adicionales);

            return ResponseEntity.ok(response);
        } else {
            // en vez de "redirect", devolvemos 404
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body("Producto no encontrado");
        }
    }
    
    @PostMapping("/asignar-adicionales")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> asignarAdicionales(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        Integer productoId = (Integer) request.get("productoId");
        @SuppressWarnings("unchecked")
        List<Integer> adicionalesIds = (List<Integer>) request.get("adicionalesIds");
        List<String> responseList = tiendaService.asignarAdicionales(productoId, adicionalesIds);
        
        response.put("success", responseList.get(0).equals("1"));
        response.put("message", responseList.get(1));

        return ResponseEntity.ok(response);
    }


    @GetMapping
    public List<Producto> getAllProductos() {
        return tiendaService.getAllProductos();
    }
    
}
