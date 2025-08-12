package com.picantito.picantito.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class HomeController {
    //http://localhost:9998/home
    @GetMapping("/home")
    public String menu() {

        return "html/home";

    }
    
}
