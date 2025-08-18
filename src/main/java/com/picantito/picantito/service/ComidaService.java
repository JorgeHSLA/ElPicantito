package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import com.picantito.picantito.entities.Producto;

public interface ComidaService {
    List<Producto> getAllComidas();
    Optional<Producto> getComidaById(Integer id);
    Producto saveComida(Producto producto);
    void deleteComida(Integer id);
}
