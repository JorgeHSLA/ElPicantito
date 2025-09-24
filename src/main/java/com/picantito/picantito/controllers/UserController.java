package com.picantito.picantito.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.picantito.picantito.entities.User;
import com.picantito.picantito.service.AutentificacionService;

import jakarta.servlet.http.HttpSession;

@Controller
public class UserController {


    @Autowired
    private AutentificacionService autentificacionService;

    
    @PostMapping("/registry")
    public String postAutentificacion(@ModelAttribute("user") User user, 
                                     @RequestParam("password2") String password2,
                                     HttpSession session,
                                     RedirectAttributes redirectAttributes) {
        try {
            String result = autentificacionService.registrarUsuario(user, password2);
            
            if (result.equals("SUCCESS")) {
                Optional<User> savedUser = autentificacionService.findByNombreUsuario(user.getNombreUsuario());
                if (savedUser.isPresent()) {
                    session.setAttribute("loggedUser", savedUser.get());
                    redirectAttributes.addFlashAttribute("success", "¡Bienvenido! Tu cuenta ha sido creada exitosamente");
                    return "redirect:/home";
                }
            } else {
                redirectAttributes.addFlashAttribute("error", result);
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al registrar usuario");
        }
        
        return "redirect:/registry";
    }


    @PostMapping("/login")
    public String postLogin(@ModelAttribute("user") User user, HttpSession session, RedirectAttributes redirectAttributes) {
        
        if (autentificacionService.authenticate(user.getNombreUsuario(), user.getContrasenia())) {
            Optional<User> authenticatedUser = autentificacionService.findByNombreUsuario(user.getNombreUsuario());
            if (authenticatedUser.isPresent()) {
                session.setAttribute("loggedUser", authenticatedUser.get());
                
                if (authenticatedUser.get().isAdmin()) {
                    return "redirect:/home";
                } else {
                    return "redirect:/home";
                }
            }
        }
        
        redirectAttributes.addFlashAttribute("error", "Credenciales incorrectas");
        return "redirect:/login";
    }
    

    @PostMapping("/mi-perfil/update")
    public String updatePerfil(@ModelAttribute("usuario") User usuario, 
                              HttpSession session, RedirectAttributes redirectAttributes) {
        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null) {
            return "redirect:/login";
        }
        
        try {
            String result = autentificacionService.edicionPerfil(loggedUser, usuario);
            
            if (result.equals("SUCCESS")) {
                User updatedUser = autentificacionService.save(usuario);
                session.setAttribute("loggedUser", updatedUser);
                redirectAttributes.addFlashAttribute("success", "Perfil actualizado exitosamente");
            } else {
                redirectAttributes.addFlashAttribute("error", result);
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar el perfil");
        }
        
        return "redirect:/mi-perfil";
    }

    @PostMapping("/mi-perfil/delete")
    public String deletePerfil(HttpSession session, RedirectAttributes redirectAttributes) {
        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null) {
            return "redirect:/login";
        }
        
        try {
            if (autentificacionService.ultimoAdmin(loggedUser) ) {
                redirectAttributes.addFlashAttribute("error", "No puedes eliminar la única cuenta de administrador");
                return "redirect:/mi-perfil";
            }
            
            autentificacionService.deleteById(loggedUser.getId());
            session.invalidate();
            redirectAttributes.addFlashAttribute("success", "Cuenta eliminada exitosamente");
            return "redirect:/home";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar la cuenta");
            return "redirect:/mi-perfil";
        }
    }

    @GetMapping("/")
    public String index() {
        return "redirect:/home";
    }
}
