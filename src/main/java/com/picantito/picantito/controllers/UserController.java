package com.picantito.picantito.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.picantito.picantito.entities.User;



@Controller
public class UserController {

    @GetMapping("/tienda")
    public String tienda() {
        return "html/tienda";
    }

    @GetMapping("/registry")
    public String autentificacion() {
        User user = new User();
        user.setId(null);
        // pasar al frontend
        return "html/registry";
    }

    
    @PostMapping("/registry")
    public String postAutentificacion(@ModelAttribute("User") User user ) {
        
        
        return "html/tienda";
    }

    @GetMapping("/login")
    public String logIn() {
        return "html/login";
    }
    @PostMapping("/login")
    public String postLogin(@ModelAttribute("User") User user ) {
        //TODO: process POST request
        
        return "html/tienda";
    }
}
