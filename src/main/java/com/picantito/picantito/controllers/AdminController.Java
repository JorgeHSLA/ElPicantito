package com.picantito.picantito.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.picantito.picantito.entities.User;
import org.springframework.web.bind.annotation.RequestParam;


// todo lo que usa admin

@Controller
@GetMapping("/admin")
public String getMethodName(@RequestParam String param) {
    return new String();
}

public class AdminController {


    @GetMapping("/menu")
    public String admin() {
        return "html/admin/adminMenu";
    }

    
    @GetMapping("/estadistica")
    public String estadistica() {
        return new String();
    }
    

    @GetMapping("/tienda")
    public String modificarTienda() {
        return new String();
    }

    @GetMapping("/operadores")
    public String operadores() {
        return new String();
    }
    
}