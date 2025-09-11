package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.ProductosAdicionales;
import com.picantito.picantito.repository.AdicionalRepository;
import com.picantito.picantito.repository.ProductRepository;
import com.picantito.picantito.repository.ProductosAdicionalesRepository;

@Service
public class TiendaServiceImpl implements TiendaService {

    @Autowired
    private ProductRepository productoRepository;
    
    @Autowired
    private AdicionalRepository adicionalRepository;
    
    @Autowired
    private ProductosAdicionalesRepository productosAdicionalesRepository;

    // CRUD Productos
    @Override
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
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
    public String eliminarProducto(Integer id) {
        try {
            Optional<Producto> producto = getProductoById(id);
            if (producto.isPresent()) {
                // Eliminar todas las relaciones del producto con adicionales
                List<ProductosAdicionales> relaciones = productosAdicionalesRepository.findByProducto(producto.get());
                productosAdicionalesRepository.deleteAll(relaciones);
                
                // Ahora eliminar el producto
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
            Optional<Adicional> adicional = getAdicionalById(id);
            if (adicional.isPresent()) {
                // Eliminar todas las relaciones del adicional con productos
                List<ProductosAdicionales> relaciones = productosAdicionalesRepository.findByAdicional(adicional.get());
                productosAdicionalesRepository.deleteAll(relaciones);
                
                // Ahora eliminar el adicional
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
    public List<Adicional> getAdicionalesDisponibles() {
        return adicionalRepository.findByDisponibleTrue();
    }

    @Override
    public List<Producto> getProductosByAdicional(Integer adicionalId) {
        Optional<Adicional> adicional = getAdicionalById(adicionalId);
        if (adicional.isPresent()) {
            List<ProductosAdicionales> relaciones = productosAdicionalesRepository.findByAdicional(adicional.get());
            return relaciones.stream()
                    .map(ProductosAdicionales::getProducto)
                    .toList();
        }
        return List.of();
    }

    // Gestión de relaciones Productos-Adicionales
    @Override
    public List<ProductosAdicionales> getProductosAdicionalesByProducto(Integer productoId) {
        Optional<Producto> producto = getProductoById(productoId);
        if (producto.isPresent()) {
            return productosAdicionalesRepository.findByProducto(producto.get());
        }
        return List.of();
    }

    @Override
    public List<ProductosAdicionales> getProductosAdicionalesByAdicional(Integer adicionalId) {
        Optional<Adicional> adicional = getAdicionalById(adicionalId);
        if (adicional.isPresent()) {
            return productosAdicionalesRepository.findByAdicional(adicional.get());
        }
        return List.of();
    }

    @Override
    public ProductosAdicionales saveProductoAdicional(ProductosAdicionales productoAdicional) {
        return productosAdicionalesRepository.save(productoAdicional);
    }

    @Override
    public String eliminarProductoAdicional(Integer id) {
        try {
            productosAdicionalesRepository.deleteById(id);
            return "SUCCESS";
        } catch (Exception e) {
            return "Error al eliminar la relación: " + e.getMessage();
        }
    }

    @Override
    public String asociarAdicionalAProducto(Integer productoId, Integer adicionalId, Integer cantidad) {
        try {
            Optional<Producto> producto = getProductoById(productoId);
            Optional<Adicional> adicional = getAdicionalById(adicionalId);
            
            if (producto.isPresent() && adicional.isPresent()) {
                // Verificar si ya existe la relación
                List<ProductosAdicionales> existentes = productosAdicionalesRepository
                    .findByProductoAndAdicional(producto.get(), adicional.get());
                
                if (existentes.isEmpty()) {
                    ProductosAdicionales nuevaRelacion = new ProductosAdicionales(
                        adicional.get(), producto.get(), cantidad);
                    productosAdicionalesRepository.save(nuevaRelacion);
                    return "SUCCESS";
                } else {
                    return "La relación ya existe";
                }
            } else {
                return "Producto o adicional no encontrado";
            }
        } catch (Exception e) {
            return "Error al asociar adicional a producto: " + e.getMessage();
        }
    }

    @Override
    public String desasociarAdicionalDeProducto(Integer productoId, Integer adicionalId) {
        try {
            Optional<Producto> producto = getProductoById(productoId);
            Optional<Adicional> adicional = getAdicionalById(adicionalId);
            
            if (producto.isPresent() && adicional.isPresent()) {
                List<ProductosAdicionales> relaciones = productosAdicionalesRepository
                    .findByProductoAndAdicional(producto.get(), adicional.get());
                
                if (!relaciones.isEmpty()) {
                    productosAdicionalesRepository.deleteAll(relaciones);
                    return "SUCCESS";
                } else {
                    return "No existe la relación";
                }
            } else {
                return "Producto o adicional no encontrado";
            }
        } catch (Exception e) {
            return "Error al desasociar adicional del producto: " + e.getMessage();
        }
    }

    @Override
    public String asociarAdicionalAProductos(Integer adicionalId, List<Integer> productosIds) {
        try {
            Optional<Adicional> adicional = getAdicionalById(adicionalId);
            if (!adicional.isPresent()) {
                return "Adicional no encontrado";
            }

            // Eliminar todas las relaciones existentes del adicional
            List<ProductosAdicionales> relacionesExistentes = productosAdicionalesRepository.findByAdicional(adicional.get());
            productosAdicionalesRepository.deleteAll(relacionesExistentes);

            // Crear nuevas relaciones
            if (productosIds != null && !productosIds.isEmpty()) {
                for (Integer productoId : productosIds) {
                    Optional<Producto> producto = getProductoById(productoId);
                    if (producto.isPresent()) {
                        ProductosAdicionales nuevaRelacion = new ProductosAdicionales(
                            adicional.get(), producto.get(), 1); // cantidad por defecto = 1
                        productosAdicionalesRepository.save(nuevaRelacion);
                    }
                }
            }

            return "SUCCESS";
        } catch (Exception e) {
            return "Error al asociar adicional a productos: " + e.getMessage();
        }
    }
}
