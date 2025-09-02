package com.picantito.picantito.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
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
            List<Adicional> adicionales = tiendaService.getAdicionalesDisponibles();
            model.addAttribute("producto", producto.get());
            model.addAttribute("adicionales", adicionales);
            return "html/productos/detalle";
        } else {
            return "redirect:/tienda";
        }
    }
    
    @PostMapping("/asignar-adicionales")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> asignarAdicionales(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Integer productoId = (Integer) request.get("productoId");
            @SuppressWarnings("unchecked")
            List<Integer> adicionalesIds = (List<Integer>) request.get("adicionalesIds");
            
            Optional<Producto> producto = tiendaService.getProductoById(productoId);
            
            if (producto.isPresent()) {
                for (Integer adicionalId : adicionalesIds) {
                    Optional<Adicional> adicional = tiendaService.getAdicionalById(adicionalId);
                    if (adicional.isPresent() && adicional.get().getProducto() == null) {
                        adicional.get().setProducto(producto.get());
                        tiendaService.saveAdicional(adicional.get());
                    }
                }
                
                response.put("success", true);
                response.put("message", "Adicionales asignados correctamente");
            } else {
                response.put("success", false);
                response.put("message", "Producto no encontrado");
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error interno del servidor");
        }
        
        return ResponseEntity.ok(response);
    }
}
