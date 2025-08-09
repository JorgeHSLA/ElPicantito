package com.picantito.picantito.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class TiendaController {


    
    @GetMapping("/tienda")
    public String tienda() {
        return "tienda";
    }
}
