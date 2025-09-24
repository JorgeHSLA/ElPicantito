package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.picantito.picantito.entities.User;
import com.picantito.picantito.repository.UsuarioRepository;


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
            return user.get().getContrasenia().equals(password);
        }
        return false;
    }

    @Override
    public String registrarUsuario(User user, String password2) {
        // Validar que las contraseñas coincidan
        if (!user.getContrasenia().equals(password2)) {
            return "Las contraseñas no coinciden";
        }
        
        // Validar que no esté duplicado
        if (this.existsByNombreUsuario(user.getNombreUsuario()) || this.existsByCorreo(user.getCorreo())) {
            return "El nombre de usuario o correo ya está registrado";
        }
        
        // Establecer rol por defecto
        user.setRol("USER");
        
        try {
            this.save(user);
            return "SUCCESS";
        } catch (Exception e) {
            return "Error al registrar usuario: " + e.getMessage();
        }
    }

    @Override
    public String crearUsuario(User usuario) {
        if (this.existsByNombreUsuario(usuario.getNombreUsuario()) || this.existsByCorreo(usuario.getCorreo())) {
            return "El nombre de usuario o correo ya están registrados";
        }
        
        try {
            this.save(usuario);
            return "SUCCESS";
        } catch (Exception e) {
            return "Error al guardar el usuario: " + e.getMessage();
        }
    }

    @Override
    public String actualizarUsuario(User usuario) {
        Optional<User> existingUserByUsername = this.findByNombreUsuario(usuario.getNombreUsuario());
        if (existingUserByUsername.isPresent() && !existingUserByUsername.get().getId().equals(usuario.getId())) {
            return "El nombre de usuario ya está registrado por otro usuario";
        }
        
        Optional<User> existingUserByEmail = this.findByCorreo(usuario.getCorreo());
        if (existingUserByEmail.isPresent() && !existingUserByEmail.get().getId().equals(usuario.getId())) {
            return "El correo ya está registrado por otro usuario";
        }
        
        if (usuario.getContrasenia() == null || usuario.getContrasenia().trim().isEmpty()) {
            Optional<User> currentUser = this.findById(usuario.getId());
            if (currentUser.isPresent()) {
                usuario.setContrasenia(currentUser.get().getContrasenia());
            }
        }
        
        try {
            this.save(usuario);
            return "SUCCESS";
        } catch (Exception e) {
            return "Error al actualizar el usuario: " + e.getMessage();
        }
    }

    @Override
    public String edicionPerfil(User loggedUser, User usuario) {
        if (!loggedUser.getId().equals(usuario.getId())) {
            return "No tienes permisos para editar este perfil";
        }
        
        Optional<User> existingUserByUsername = this.findByNombreUsuario(usuario.getNombreUsuario());
        if (existingUserByUsername.isPresent() && !existingUserByUsername.get().getId().equals(usuario.getId())) {
            return "El nombre de usuario ya está registrado por otro usuario";
        }
        
        Optional<User> existingUserByEmail = this.findByCorreo(usuario.getCorreo());
        if (existingUserByEmail.isPresent() && !existingUserByEmail.get().getId().equals(usuario.getId())) {
            return "El correo ya está registrado por otro usuario";
        }
        
        if (usuario.getContrasenia() == null || usuario.getContrasenia().trim().isEmpty()) {
            Optional<User> currentUser = this.findById(usuario.getId());
            if (currentUser.isPresent()) {
                usuario.setContrasenia(currentUser.get().getContrasenia());
            }
        }
        
        usuario.setRol(loggedUser.getRol());
        
        try {
            this.save(usuario);
            return "SUCCESS";
        } catch (Exception e) {
            return "Error al actualizar el perfil: " + e.getMessage();
        }
    }

    @Override
    public boolean ultimoAdmin(User loggedUser){
        if (loggedUser.isAdmin()) {
            long adminCount = this.findAll().stream()
                .filter(User::isAdmin)
                .count();

            if (adminCount <= 1) {
                return true;
            }
        }
        return false;
    }
}
