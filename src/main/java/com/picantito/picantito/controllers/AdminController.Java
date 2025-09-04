package com.picantito.picantito.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.User;
import com.picantito.picantito.service.AutentificacionService;
import com.picantito.picantito.service.TiendaService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private TiendaService tiendaService;
    
    @Autowired
    private AutentificacionService autentificacionService;

    // Verificar si el usuario es admin
    private boolean isAdmin(HttpSession session) {
        User loggedUser = (User) session.getAttribute("loggedUser");
        return loggedUser != null && loggedUser.isAdmin();
    }

    // Dashboard principal
    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        model.addAttribute("totalProductos", tiendaService.getAllProductos().size());
        model.addAttribute("totalUsuarios", autentificacionService.findAll().size());
        model.addAttribute("totalAdicionales", tiendaService.getAllAdicionales().size());
        
        return "html/admin/dashboard";
    }

    // CRUD Productos
    @GetMapping("/productos")
    public String productos(HttpSession session, Model model) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        List<Producto> productos = tiendaService.getAllProductos();
        model.addAttribute("productos", productos);
        model.addAttribute("nuevoProducto", new Producto());
        
        return "html/admin/productos";
    }

    @PostMapping("/productos/save")
    public String saveProducto(@ModelAttribute("nuevoProducto") Producto producto, 
                              HttpSession session, RedirectAttributes redirectAttributes) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        try {
            tiendaService.saveProducto(producto);
            redirectAttributes.addFlashAttribute("success", "Producto guardado exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al guardar el producto");
        }
        
        return "redirect:/admin/productos";
    }

    @GetMapping("/productos/edit/{id}")
    public String editProducto(@PathVariable Integer id, HttpSession session, Model model) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        Optional<Producto> producto = tiendaService.getProductoById(id);
        if (producto.isPresent()) {
            model.addAttribute("producto", producto.get());
            return "html/admin/edit-producto";
        }  
        return "redirect:/admin/productos";
    }

    @PostMapping("/productos/update")
    public String updateProducto(@ModelAttribute("producto") Producto producto, 
                                HttpSession session, RedirectAttributes redirectAttributes) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        try {
            tiendaService.saveProducto(producto);
            redirectAttributes.addFlashAttribute("success", "Producto actualizado exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar el producto");
        }
        
        return "redirect:/admin/productos";
    }

    @GetMapping("/productos/delete/{id}")
    public String deleteProducto(@PathVariable Integer id, HttpSession session, 
                                RedirectAttributes redirectAttributes) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        try {
            tiendaService.deleteProducto(id);
            redirectAttributes.addFlashAttribute("success", "Producto eliminado exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar el producto");
        }
        
        return "redirect:/admin/productos";
    }

    // CRUD Usuarios
    @GetMapping("/usuarios")
    public String usuarios(HttpSession session, Model model) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        List<User> usuarios = autentificacionService.findAll();
        model.addAttribute("usuarios", usuarios);
        model.addAttribute("nuevoUsuario", new User());
        
        return "html/admin/usuarios";
    }

    @PostMapping("/usuarios/save")
    public String saveUsuario(@ModelAttribute("nuevoUsuario") User usuario, 
                             HttpSession session, RedirectAttributes redirectAttributes) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        try {
            // Verificar duplicados
            if(autentificacionService.verificacion(usuario))
            {
                redirectAttributes.addFlashAttribute("error", "El nombre de usuario o correo ya están registrados");
                return "redirect:/admin/usuarios";
            }
            autentificacionService.save(usuario);
            redirectAttributes.addFlashAttribute("success", "Usuario guardado exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al guardar el usuario");
        }
        
        return "redirect:/admin/usuarios";
    }

    @GetMapping("/usuarios/delete/{id}")
    public String deleteUsuario(@PathVariable Integer id, HttpSession session, 
                               RedirectAttributes redirectAttributes) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        try {
            autentificacionService.deleteById(id);
            redirectAttributes.addFlashAttribute("success", "Usuario eliminado exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar el usuario");
        }
        
        return "redirect:/admin/usuarios";
    }

    @GetMapping("/usuarios/edit/{id}")
    public String editUsuario(@PathVariable Integer id, HttpSession session, Model model) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        Optional<User> usuario = autentificacionService.findById(id);
        if (usuario.isPresent()) {
            model.addAttribute("usuario", usuario.get());
            return "html/admin/edit-usuario";
        }
        
        return "redirect:/admin/usuarios";
    }

    @PostMapping("/usuarios/update")
    public String updateUsuario(@ModelAttribute("usuario") User usuario, 
                               HttpSession session, RedirectAttributes redirectAttributes) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        try {
            if(autentificacionService.verificacion(usuario))
            {
                redirectAttributes.addFlashAttribute("error", "El nombre de usuario o correo ya están registrados");
                return "redirect:/admin/usuarios";
            }

            autentificacionService.save(usuario);
            redirectAttributes.addFlashAttribute("success", "Usuario actualizado exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar el usuario");
        }
        
        return "redirect:/admin/usuarios";
    }

    // CRUD Adicionales
    @GetMapping("/adicionales")
    public String adicionales(HttpSession session, Model model) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        List<Adicional> adicionales = tiendaService.getAllAdicionales();
        List<Producto> productos = tiendaService.getAllProductos();
        
        model.addAttribute("adicionales", adicionales);
        model.addAttribute("productos", productos);
        model.addAttribute("nuevoAdicional", new Adicional());
        
        return "html/admin/adicionales";
    }

    @PostMapping("/adicionales/save")
    public String saveAdicional(@ModelAttribute("nuevoAdicional") Adicional adicional, 
                               HttpSession session, RedirectAttributes redirectAttributes) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        try {
            tiendaService.saveAdicional(adicional);
            redirectAttributes.addFlashAttribute("success", "Adicional guardado exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al guardar el adicional");
        }
        
        return "redirect:/admin/adicionales";
    }

    @GetMapping("/adicionales/edit/{id}")
    public String editAdicional(@PathVariable Integer id, HttpSession session, Model model) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        Optional<Adicional> adicional = tiendaService.getAdicionalById(id);
        if (adicional.isPresent()) {
            List<Producto> productos = tiendaService.getAllProductos();
            model.addAttribute("adicional", adicional.get());
            model.addAttribute("productos", productos);
            return "html/admin/edit-adicional";
        }
        
        return "redirect:/admin/adicionales";
    }

    @PostMapping("/adicionales/update")
    public String updateAdicional(@ModelAttribute("adicional") Adicional adicional, 
                                 @RequestParam(value = "producto.id", required = false) Integer productoId,
                                 HttpSession session, RedirectAttributes redirectAttributes) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        try {
            // Establecer el producto si se selecciono uno
            if (productoId != null && productoId > 0) {
                Optional<Producto> producto = tiendaService.getProductoById(productoId);
                if (producto.isPresent()) {
                    adicional.setProducto(producto.get());
                }
            } else {
                adicional.setProducto(null);
            }
            
            tiendaService.saveAdicional(adicional);
            redirectAttributes.addFlashAttribute("success", "Adicional actualizado exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar el adicional: " + e.getMessage());
        }
        
        return "redirect:/admin/adicionales";
    }

    @GetMapping("/adicionales/delete/{id}")
    public String deleteAdicional(@PathVariable Integer id, HttpSession session, 
                                 RedirectAttributes redirectAttributes) {
        if (!isAdmin(session)) {
            return "redirect:/home";
        }
        
        try {
            tiendaService.deleteAdicional(id);
            redirectAttributes.addFlashAttribute("success", "Adicional eliminado exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar el adicional");
        }
        
        return "redirect:/admin/adicionales";
    }
}