package com.picantito.picantito.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.service.ComidaService;

@Controller
@RequestMapping("/comidas")
public class ComidaController {

    @Autowired
    private ComidaService comidaService;

    // Mostrar todas las comidas en formato tabla: http://localhost:9998/comidas/tabla
    @GetMapping("/tabla")
    public String mostrarComidasTabla(Model model) {
        List<Producto> comidas = comidaService.getAllComidas();
        model.addAttribute("comidas", comidas);
        return "html/comidas/tabla";
    }

    // Mostrar todas las comidas en formato tarjetas: http://localhost:9998/comidas/tarjetas
    @GetMapping("/tarjetas")
    public String mostrarComidasTarjetas(Model model) {
        List<Producto> comidas = comidaService.getAllComidas();
        model.addAttribute("comidas", comidas);
        return "html/comidas/tarjetas";
    }

    // Mostrar información de una comida específica: http://localhost:9998/comidas/#id
    @GetMapping("/{id}")
    public String mostrarComida(@PathVariable Integer id, Model model) {
        Optional<Producto> comida = comidaService.getComidaById(id);
        if (comida.isPresent()) {
            model.addAttribute("comida", comida.get());
            return "html/comidas/detalle";
        } else {
            return "redirect:/comidas/tarjetas";
        }
    }
}
