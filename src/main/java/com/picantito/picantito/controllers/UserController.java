package com.picantito.picantito.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.picantito.picantito.entities.User;

// todas las seciones que no necesitan login

@Controller
public class UserController {

    @GetMapping("/tienda")
    public String tienda() {
        return "html/user/tienda";
    }

    @GetMapping("/registry")
    public String autentificacion() {
        User user = new User();
        user.setId(null);
        // pasar al frontend
        return "html/user/registry";
    }

    
    @PostMapping("/registry")
    public String postAutentificacion(@ModelAttribute("User") User user ) {
        
        
        return "html/user/tienda";
    }

    @GetMapping("/login")
    public String logIn() {
        return "html/user/login";
    }
    @PostMapping("/login")
    public String postLogin(@ModelAttribute("User") User user ) {
        //TODO: process POST request
        
        return "html/user/tienda";
    }


    //http://localhost:9998/home
    @GetMapping("/home")
    public String menu() {

        return "html/user/home";

    }

    @GetMapping("/sobre-nosotros")
    public String sobreNosotros() {
        return "html/user/sobre-nosotros";
    }

    // Redirección para compatibilidad
    @GetMapping("/")
    public String index() {
        return "redirect:/home";
    }
    
}
