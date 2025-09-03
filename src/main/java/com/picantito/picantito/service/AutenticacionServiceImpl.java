package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.picantito.picantito.entities.User;
import com.picantito.picantito.repository.UsuarioRepository;

import jakarta.servlet.http.HttpSession;

@Service
public class AutenticacionServiceImpl implements AutentificacionService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<User> findAll() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<User> findById(Integer id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public User save(User user) {
        return usuarioRepository.save(user);
    }

    @Override
    public void deleteById(Integer id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public Optional<User> findByNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario);
    }

    @Override
    public Optional<User> findByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    @Override
    public boolean existsByNombreUsuario(String nombreUsuario) {
        return usuarioRepository.existsByNombreUsuario(nombreUsuario);
    }

    @Override
    public boolean existsByCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }

    @Override
    public boolean authenticate(String nombreUsuario, String password) {
        Optional<User> user = findByNombreUsuario(nombreUsuario);
        if (user.isPresent()) {
            return user.get().getPassword().equals(password);
        }
        return false;
    }

    public String verification(User user, HttpSession session,  RedirectAttributes redirectAttributes) {
        if (this.authenticate(user.getNombreUsuario(), user.getPassword())) {
            Optional<User> authenticatedUser = this.findByNombreUsuario(user.getNombreUsuario());
            if (authenticatedUser.isPresent()) {
                session.setAttribute("loggedUser", authenticatedUser.get());
                
                if (authenticatedUser.get().isAdmin()) {
                    return "redirect:/admin/dashboard";
                } else {
                    return "redirect:/home";
                }
            }

        }
        redirectAttributes.addFlashAttribute("error", "Credenciales incorrectas");
        return "redirect:/login";
    }

    public boolean verificacion(User user) {
        // Verificar si el nombre de usuario ya existe
        if (this.existsByNombreUsuario(user.getNombreUsuario()) || this.existsByCorreo(user.getCorreo())) {
            return true;
        }
        return false;
    }
}
