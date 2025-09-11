package com.picantito.picantito.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.ProductosAdicionales;
import com.picantito.picantito.service.TiendaService;

@Controller
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private TiendaService tiendaService;

    // Mostrar información de una producto específica: http://localhost:9998/productos/{id}
    @GetMapping("/{id}")
    public String mostrarProducto(@PathVariable Integer id, Model model) {
        Optional<Producto> producto = tiendaService.getProductoById(id);
        if (producto.isPresent()) {
            // Obtener adicionales asociados al producto a través de la tabla intermedia
            List<ProductosAdicionales> productosAdicionales = tiendaService.getProductosAdicionalesByProducto(id);
            List<Adicional> adicionales = productosAdicionales.stream()
                .map(pa -> pa.getAdicional())
                .toList();
            model.addAttribute("producto", producto.get());
            model.addAttribute("adicionales", adicionales);
            model.addAttribute("productosAdicionales", productosAdicionales);
            return "html/productos/detalle";
        } else {
            return "redirect:/tienda";
        }
    }
    
    @PostMapping("/asignar-adicionales")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> asignarAdicionales(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        Integer productoId = (Integer) request.get("productoId");
        Integer adicionalId = (Integer) request.get("adicionalId");
        Integer cantidad = (Integer) request.get("cantidad");
        
        String result = tiendaService.asociarAdicionalAProducto(productoId, adicionalId, cantidad);
        
        response.put("success", result.equals("SUCCESS"));
        response.put("message", result);

        return ResponseEntity.ok(response);
    }
}
