package com.picantito.picantito.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.picantito.picantito.entities.Role;
import com.picantito.picantito.entities.User;
import com.picantito.picantito.repository.RoleRepository;
import com.picantito.picantito.repository.UsuarioRepository;


@Service
public class AutenticacionServiceImpl implements AutentificacionService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
        // Encriptar la contraseña si no está ya encriptada
        if (user.getContrasenia() != null && !user.getContrasenia().startsWith("$2a$")) {
            user.setContrasenia(passwordEncoder.encode(user.getContrasenia()));
        }
        
        // Si el usuario es nuevo y no tiene roles asignados, asignar el rol USER por defecto
        if (user.getId() == null && (user.getRoles() == null || user.getRoles().isEmpty())) {
            Optional<Role> roleUser = roleRepository.findByNombre("USER");
            if (roleUser.isPresent()) {
                user.setRoles(new HashSet<>());
                user.getRoles().add(roleUser.get());
            }
        }
        
        return usuarioRepository.save(user);
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
    public boolean authenticateNonDelivery(String nombreUsuario, String password) {
        Optional<User> user = findByNombreUsuario(nombreUsuario);
        if (user.isPresent()) { 
            User foundUser = user.get();
            // Verificar que la contraseña sea correcta Y el usuario NO sea un repartidor
            return foundUser.getContrasenia().equals(password) && !"REPARTIDOR".equals(foundUser.getRol());
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
        
        // Establecer rol por defecto USER
        Role userRole = roleRepository.findByNombre("USER")
            .orElseGet(() -> {
                Role newRole = new Role();
                newRole.setNombre("USER");
                return roleRepository.save(newRole);
            });
        
        user.setRoles(new HashSet<>());
        user.getRoles().add(userRole);
        
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
        
        // Mantener los roles del usuario logueado (no permitir cambio de rol en edición de perfil)
        usuario.setRoles(loggedUser.getRoles());
        
        try {
            this.save(usuario);
            return "SUCCESS";
        } catch (Exception e) {
            return "Error al actualizar el perfil: " + e.getMessage();
        }
    }

    @Override
    public String eliminarUsuario(Integer id) {
        try {
            Optional<User> optionalUsuario = findById(id);
            if (optionalUsuario.isPresent()) {
                usuarioRepository.deleteById(id);
                return "SUCCESS";
            } else {
                return "Usuario no encontrado con ID: " + id;
            }
        } catch (Exception e) {
            return "No se puede eliminar el usuario. Error: " + e.getMessage();
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

    @Override
    public List<User> findByRol(String rol) {
        return usuarioRepository.findByRol(rol);
    }

    @Override
    public List<User> findByRolAndEstado(String rol, String estado) {
        return usuarioRepository.findByRolAndEstado(rol, estado);
    }
}
