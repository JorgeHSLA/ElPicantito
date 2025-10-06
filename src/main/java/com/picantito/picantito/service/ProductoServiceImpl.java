package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.repository.ProductRepository;


@Service
public class ProductoServiceImpl implements ProductoService {
    @Autowired
    private ProductRepository productoRepository;
    

    // CRUD Productoss
    @Override
    public List<Producto> getAllProductos() {
        System.out.println("ProductoServiceImpl: Ejecutando getAllProductos()");
        List<Producto> productos = productoRepository.findAll();
        System.out.println("ProductoServiceImpl: Productos encontrados: " + productos.size());
        
        if (productos.isEmpty()) {
            System.out.println("ProductoServiceImpl: ALERTA - No se encontraron productos en la base de datos");
        } else {
            System.out.println("ProductoServiceImpl: Primer producto: " + productos.get(0).getNombre() + 
                              ", ID: " + productos.get(0).getId() + 
                              ", Activo: " + productos.get(0).getActivo() + 
                              ", Disponible: " + productos.get(0).getDisponible());
        }
        
        return productos;
    }

    @Override
    public Optional<Producto> getProductoById(Integer id) {
        return productoRepository.findById(id);
    }

    @Override
    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public List<Producto> getProductosActivos() {
        System.out.println("ProductoServiceImpl: Ejecutando getProductosActivos()");
        List<Producto> productosActivos = productoRepository.findByActivoTrue();
        System.out.println("ProductoServiceImpl: Productos activos encontrados: " + productosActivos.size());
        
        if (productosActivos.isEmpty()) {
            System.out.println("ProductoServiceImpl: ALERTA - No se encontraron productos activos en la base de datos");
        } else {
            System.out.println("ProductoServiceImpl: Primer producto activo: " + productosActivos.get(0).getNombre() + 
                              ", ID: " + productosActivos.get(0).getId());
        }
        
        return productosActivos;
    }

    // eliminado logico
    @Override
    public String eliminarProducto(Integer id) {
        try {
            Optional<Producto> optionalProducto = getProductoById(id);
            if (optionalProducto.isPresent()) {
                productoRepository.deleteById(id);
                return "SUCCESS";
            } else {
                return "Producto no encontrado con ID: " + id;
            }
        } catch (Exception e) {
            return "No se puede eliminar el producto. Error: " + e.getMessage();
        }
    }
    
    @Override
    public List<Producto> getProductosDisponibles() {
        return productoRepository.findByDisponibleTrue();
    }
    


}
