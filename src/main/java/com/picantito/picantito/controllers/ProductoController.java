package com.picantito.picantito.controllers;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.service.TiendaService;

@Controller
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private TiendaService tiendaService;

    // Mostrar todas las productos en formato tabla: http://localhost:9998/productos/tabla
    @GetMapping("/tabla")
    public String mostrarProductosTabla(Model model) {
        List<Producto> productos = tiendaService.getAllProductos();
        model.addAttribute("productos", productos);
        return "html/productos/tabla";
    }

    // Mostrar todas las productos en formato tarjetas: http://localhost:9998/productos/tarjetas
    @GetMapping("/tarjetas")
    public String mostrarProductosTarjetas(Model model) {
        List<Producto> productos = tiendaService.getAllProductos();
        model.addAttribute("productos", productos);
        return "html/productos/tarjetas";
    }

    // Mostrar información de una producto específica: http://localhost:9998/productos/{id}
    @GetMapping("/{id}")
    public String mostrarProducto(@PathVariable Integer id, Model model) {
        Logger.getLogger(ProductoController.class.getName()).info("Mostrando producto con ID: " + id);

        Optional<Producto> producto = tiendaService.getProductoById(id);
        if (producto.isPresent()) {
            model.addAttribute("producto", producto.get());
            return "html/productos/detalle";
        } else {
            // Redirigir al menú principal en lugar de tarjetas
            return "redirect:/tienda";
        }
    }
}
