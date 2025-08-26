package com.picantito.picantito.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.User;
import com.picantito.picantito.service.AutentificacionService;
import com.picantito.picantito.service.TiendaService;

import jakarta.servlet.http.HttpSession;

@Controller
public class UserController {

    @Autowired
    private TiendaService tiendaService;
    
    @Autowired
    private AutentificacionService autentificacionService;

    @GetMapping("/tienda")
    public String tienda(Model model) {
        List<Producto> productos = tiendaService.getAllProductos();
        model.addAttribute("productos", productos);
        return "html/user/tienda";
    }

    @GetMapping("/registry")
    public String autentificacion(Model model) {
        model.addAttribute("user", new User());
        return "html/user/registry";
    }
    
    @PostMapping("/registry")
    public String postAutentificacion(@ModelAttribute("user") User user, RedirectAttributes redirectAttributes) {
        try {
            // Verificar si el nombre de usuario ya existe
            if (autentificacionService.existsByNombreUsuario(user.getNombreUsuario())) {
                redirectAttributes.addFlashAttribute("error", "El nombre de usuario ya está registrado");
                return "redirect:/registry";
            }
            
            // Verificar si el correo ya existe
            if (autentificacionService.existsByCorreo(user.getCorreo())) {
                redirectAttributes.addFlashAttribute("error", "El correo electrónico ya está registrado");
                return "redirect:/registry";
            }
            
            autentificacionService.save(user);
            redirectAttributes.addFlashAttribute("success", "Usuario registrado exitosamente");
            return "redirect:/login";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al registrar usuario");
            return "redirect:/registry";
        }
    }

    @GetMapping("/login")
    public String logIn(Model model) {
        model.addAttribute("user", new User());
        return "html/user/logIn";
    }
    
    @PostMapping("/login")
    public String postLogin(@ModelAttribute("user") User user, HttpSession session, RedirectAttributes redirectAttributes) {
        if (autentificacionService.authenticate(user.getNombreUsuario(), user.getPassword())) {
            Optional<User> authenticatedUser = autentificacionService.findByNombreUsuario(user.getNombreUsuario());
            if (authenticatedUser.isPresent()) {
                session.setAttribute("loggedUser", authenticatedUser.get());
                
                if (authenticatedUser.get().isAdmin()) {
                    return "redirect:/admin/dashboard";
                } else {
                    return "redirect:/tienda";
                }
            }
        }
        
        redirectAttributes.addFlashAttribute("error", "Credenciales incorrectas");
        return "redirect:/login";
    }
    
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/home";
    }

    @GetMapping("/home")
    public String menu() {
        return "html/user/home";
    }

    @GetMapping("/sobre-nosotros")
    public String sobreNosotros() {
        return "html/user/sobre-nosotros";
    }

    @GetMapping("/")
    public String index() {
        return "redirect:/home";
    }
}
