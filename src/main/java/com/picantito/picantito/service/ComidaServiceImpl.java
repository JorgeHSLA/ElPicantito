package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.repository.ComidaRepository;

@Service
public class ComidaServiceImpl implements ComidaService {

    @Autowired
    private ComidaRepository comidaRepository;

    @Override
    public List<Producto> getAllComidas() {
        return comidaRepository.findAll();
    }

    @Override
    public Optional<Producto> getComidaById(Integer id) {
        return comidaRepository.findById(id);
    }

    @Override
    public Producto saveComida(Producto producto) {
        return comidaRepository.save(producto);
    }

    @Override
    public void deleteComida(Integer id) {
        comidaRepository.deleteById(id);
    }
}
