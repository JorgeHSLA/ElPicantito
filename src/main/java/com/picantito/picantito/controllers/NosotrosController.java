package com.picantito.picantito.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class NosotrosController {

    @GetMapping("/sobre-nosotros")
    public String sobreNosotros() {
        return "html/sobre-nosotros";
    }
    
}
