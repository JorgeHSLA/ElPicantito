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
            return user.get().getPassword().equals(password);
        }
        return false;
    }

    @Override
    public boolean verificacion(User user) {
        // Verificar si el nombre de usuario ya existe
        if (this.existsByNombreUsuario(user.getNombreUsuario()) || this.existsByCorreo(user.getCorreo())) {
            return true;
        }
        return false;
    }

    @Override
    public String edicionPerfil(User loggedUser, User usuario) {
        // Verificar si el nombre de usuario ya existe
        if (!loggedUser.getId().equals(usuario.getId())) {
            return "No tirenes permisos para editar este perfil";
        }
        
        Optional<User> existingUserByUsername = this.findByNombreUsuario(usuario.getNombreUsuario());
        if (existingUserByUsername.isPresent() && !existingUserByUsername.get().getId().equals(usuario.getId())) {
            return "El nombre de usuario ya está registrado por otro usuario";
        }
        
        Optional<User> existingUserByEmail = this.findByCorreo(usuario.getCorreo());
        if (existingUserByEmail.isPresent() && !existingUserByEmail.get().getId().equals(usuario.getId())) {
            return "El correo ya está registrado por otro usuario";
        }
        
        if (usuario.getPassword() == null || usuario.getPassword().trim().isEmpty()) {
            Optional<User> currentUser = this.findById(usuario.getId());
            if (currentUser.isPresent()) {
                usuario.setPassword(currentUser.get().getPassword());
            }
        }

        return "1";
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
