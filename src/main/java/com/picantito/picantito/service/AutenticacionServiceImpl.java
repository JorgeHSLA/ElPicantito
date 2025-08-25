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
        // Guardar password sin encriptar para simplicidad
        return usuarioRepository.save(user);
    }

    @Override
    public void deleteById(Integer id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public Optional<User> findByNumero(Integer numero) {
        return usuarioRepository.findByNumero(numero);
    }

    @Override
    public boolean existsByNumero(Integer numero) {
        return usuarioRepository.existsByNumero(numero);
    }

    @Override
    public boolean authenticate(Integer numero, String password) {
        Optional<User> user = findByNumero(numero);
        if (user.isPresent()) {
            return user.get().getPassword().equals(password);
        }
        return false;
    }
}
