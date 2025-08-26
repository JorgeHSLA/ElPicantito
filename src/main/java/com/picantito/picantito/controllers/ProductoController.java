package com.picantito.picantito.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

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
            List<Adicional> adicionales = tiendaService.getAdicionalesByProductoId(id);
            model.addAttribute("producto", producto.get());
            model.addAttribute("adicionales", adicionales);
            return "html/productos/detalle";
        } else {

            return "redirect:/tienda";
        }
    }
}
