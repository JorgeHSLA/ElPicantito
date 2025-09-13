package com.picantito.picantito.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/login")
    public String logIn(Model model) {
        model.addAttribute("user", new User());
        return "html/user/logIn";
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

    @GetMapping("/mi-perfil")
    public String miPerfil(HttpSession session, Model model) {
        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null) {
            return "redirect:/login";
        }
        
        Optional<User> usuario = autentificacionService.findById(loggedUser.getId());
        if (usuario.isPresent()) {
            model.addAttribute("usuario", usuario.get());
            return "html/user/mi-perfil";
        }
        
        return "redirect:/logout";
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
