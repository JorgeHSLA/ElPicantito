package com.picantito.picantito.security;

import com.picantito.picantito.entities.User;
import com.picantito.picantito.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Servicio para cargar detalles del usuario para Spring Security
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = usuarioRepository.findByNombreUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Validar que el usuario no esté eliminado
        if ("ELIMINADO".equals(user.getRol())) {
            throw new UsernameNotFoundException("La cuenta ha sido eliminada");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getNombreUsuario())
                .password(user.getContrasenia())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRol())))
                .build();
    }

    /**
     * Carga un usuario por su ID
     */
    public User loadUserById(Integer userId) {
        return usuarioRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con ID: " + userId));
    }
}
