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

    // PERFIL DE USUARIO
    @GetMapping("/mi-perfil")
    public String miPerfil(HttpSession session, Model model) {
        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null) {
            return "redirect:/login";
        }
        
        // Obtener datos actualizados del usuario
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
            // Verificar que el usuario solo edite su propio perfil
            if (!loggedUser.getId().equals(usuario.getId())) {
                redirectAttributes.addFlashAttribute("error", "No tienes permisos para editar este perfil");
                return "redirect:/mi-perfil";
            }
            
            // Verificar duplicados para otros usuarios
            Optional<User> existingUserByUsername = autentificacionService.findByNombreUsuario(usuario.getNombreUsuario());
            if (existingUserByUsername.isPresent() && !existingUserByUsername.get().getId().equals(usuario.getId())) {
                redirectAttributes.addFlashAttribute("error", "El nombre de usuario ya está registrado por otro usuario");
                return "redirect:/mi-perfil";
            }
            
            Optional<User> existingUserByEmail = autentificacionService.findByCorreo(usuario.getCorreo());
            if (existingUserByEmail.isPresent() && !existingUserByEmail.get().getId().equals(usuario.getId())) {
                redirectAttributes.addFlashAttribute("error", "El correo ya está registrado por otro usuario");
                return "redirect:/mi-perfil";
            }
            
            // Si la contraseña está vacía, mantener la actual
            if (usuario.getPassword() == null || usuario.getPassword().trim().isEmpty()) {
                Optional<User> currentUser = autentificacionService.findById(usuario.getId());
                if (currentUser.isPresent()) {
                    usuario.setPassword(currentUser.get().getPassword());
                }
            }
            
            // Mantener el rol actual
            usuario.setRole(loggedUser.getRole());
            
            // Guardar cambios
            User updatedUser = autentificacionService.save(usuario);
            
            // Actualizar la sesión
            session.setAttribute("loggedUser", updatedUser);
            
            redirectAttributes.addFlashAttribute("success", "Perfil actualizado exitosamente");
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
            // No permitir que admins eliminen su cuenta si son el único admin
            if (loggedUser.isAdmin()) {
                long adminCount = autentificacionService.findAll().stream()
                    .filter(User::isAdmin)
                    .count();
                
                if (adminCount <= 1) {
                    redirectAttributes.addFlashAttribute("error", "No puedes eliminar la única cuenta de administrador");
                    return "redirect:/mi-perfil";
                }
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
