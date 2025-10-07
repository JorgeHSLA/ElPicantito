package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.ProductoAdicional;
import com.picantito.picantito.repository.AdicionalRepository;
import com.picantito.picantito.repository.ProductoAdicionalRepository;



@Service
public class AdicionalServiceImpl implements AdicionalService {

    @Autowired
    private AdicionalRepository adicionalRepository;

    @Autowired
    private ProductoAdicionalRepository productoAdicionalRepository;

    // CRUD Adicionales
    @Override
    public List<Adicional> getAllAdicionales() {
        return adicionalRepository.findAll();
    }

    @Override
    public Optional<Adicional> getAdicionalById(Integer id) {
        return adicionalRepository.findById(id);
    }

    @Override
    public Adicional saveAdicional(Adicional adicional) {
        return adicionalRepository.save(adicional);
    }

    @Override
    public String eliminarAdicional(Integer id) {
        try {
            Optional<Adicional> optionalAdicional = getAdicionalById(id);
            if (optionalAdicional.isPresent()) {
                adicionalRepository.deleteById(id);
                return "SUCCESS";
            } else {
                return "Adicional no encontrado con ID: " + id;
            }
        } catch (Exception e) {
            return "No se puede eliminar el adicional. Error: " + e.getMessage();
        }
    }

    @Override
    public List<Adicional> getAdicionalesByProductoId(Integer productoId) {
        return adicionalRepository.findByProductoIdAndDisponibleTrue(productoId);
    }

    @Override
    public List<Adicional> getAdicionalesDisponibles() {
        return adicionalRepository.findByDisponibleTrue();
    }
    
    @Override
    public List<Adicional> getAdicionalesSinAsignar() {
        return adicionalRepository.findByDisponibleTrueAndProductosIsEmpty();
    }


    @Override
    public void updateAdicional(Integer productoId, Adicional adicional) {
        this.saveAdicional(adicional);
    }


    @Override
    public List<Adicional> getAdicionalesDisponiblesParaProducto(Integer productoId) {
        return adicionalRepository.findAvailableForProduct(productoId);
    }

    @Override
    public List<ProductoAdicional> getProductoAdicionales() {
        return productoAdicionalRepository.findAll();
    }
}