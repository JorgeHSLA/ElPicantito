package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.picantito.picantito.dto.ProductoAdicionalIdDTO;
import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.ProductoAdicional;
import com.picantito.picantito.entities.ProductoAdicionalId;
import com.picantito.picantito.entities.AdicionalCategoria;
import com.picantito.picantito.repository.AdicionalRepository;
import com.picantito.picantito.repository.ProductRepository;
import com.picantito.picantito.repository.ProductoAdicionalRepository;
import com.picantito.picantito.dto.CategorizedAdicionalesResponse;



@Service
public class AdicionalServiceImpl implements AdicionalService {

    @Autowired
    private AdicionalRepository adicionalRepository;

    @Autowired
    private ProductoAdicionalRepository productoAdicionalRepository;

    @Autowired
    private ProductRepository productRepository;

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

    // Implementación de los métodos con DTOs
    @Override
    public List<ProductoAdicionalIdDTO> getProductoAdicionalesIds() {
        List<ProductoAdicional> productoAdicionales = productoAdicionalRepository.findAll();
        return productoAdicionales.stream()
                .map(pa -> new ProductoAdicionalIdDTO(
                        pa.getProducto().getId(),
                        pa.getAdicional().getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductoAdicionalIdDTO> getProductoAdicionalesIdsByProductoId(Integer productoId) {
        List<ProductoAdicional> productoAdicionales = productoAdicionalRepository.findByProductoId(productoId);
        return productoAdicionales.stream()
                .map(pa -> new ProductoAdicionalIdDTO(
                        pa.getProducto().getId(),
                        pa.getAdicional().getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductoAdicionalIdDTO> getProductoAdicionalesIdsByAdicionalId(Integer adicionalId) {
        List<ProductoAdicional> productoAdicionales = productoAdicionalRepository.findByAdicionalId(adicionalId);
        return productoAdicionales.stream()
                .map(pa -> new ProductoAdicionalIdDTO(
                        pa.getProducto().getId(),
                        pa.getAdicional().getId()))
                .collect(Collectors.toList());
    }

    @Override
    public ProductoAdicional crearProductoAdicional(Integer productoId, Integer adicionalId) {
        Optional<Producto> producto = productRepository.findById(productoId);
        if (!producto.isPresent()) {
            throw new RuntimeException("Producto no encontrado con ID: " + productoId);
        }

        Optional<Adicional> adicional = adicionalRepository.findById(adicionalId);
        if (!adicional.isPresent()) {
            throw new RuntimeException("Adicional no encontrado con ID: " + adicionalId);
        }

        Optional<ProductoAdicional> existingRelation = productoAdicionalRepository
                .findByProductoIdAndAdicionalId(productoId, adicionalId);
        if (existingRelation.isPresent()) {
            throw new RuntimeException("La relación producto-adicional ya existe");
        }

        ProductoAdicional productoAdicional = new ProductoAdicional();
        ProductoAdicionalId id = new ProductoAdicionalId();
        id.setProductoId(productoId);
        id.setAdicionalId(adicionalId);
        
        productoAdicional.setId(id);
        productoAdicional.setProducto(producto.get());
        productoAdicional.setAdicional(adicional.get());
        productoAdicional.setCantidadProducto(1);

        return productoAdicionalRepository.save(productoAdicional);
    }

    @Override
    public String eliminarProductoAdicional(Integer productoId, Integer adicionalId) {
        try {
            Optional<ProductoAdicional> relacion = productoAdicionalRepository
                    .findByProductoIdAndAdicionalId(productoId, adicionalId);
            
            if (relacion.isPresent()) {
                productoAdicionalRepository.delete(relacion.get());
                return "SUCCESS";
            } else {
                return "Relación producto-adicional no encontrada";
            }
        } catch (Exception e) {
            return "No se puede eliminar la relación. Error: " + e.getMessage();
        }
    }

    @Override
    public List<Adicional> getByCategoria(AdicionalCategoria categoria) {
        return adicionalRepository.findAll().stream()
            .filter(a -> {
                if (a.getCategoria() != null) return a.getCategoria() == categoria;
                // Fallback heurístico por nombre cuando no hay categoría en datos antiguos
                if (categoria == AdicionalCategoria.PROTEINA) {
                    return isProteinHeuristic(a);
                }
                return false;
            })
            .toList();
    }

    @Override
    public CategorizedAdicionalesResponse getAdicionalesCategorizados() {
        List<Adicional> all = adicionalRepository.findAll();
        List<Adicional> proteinas = all.stream().filter(a -> {
            if (a.getCategoria() != null) return a.getCategoria() == AdicionalCategoria.PROTEINA;
            return isProteinHeuristic(a);
        }).toList();
        List<Adicional> vegetales = all.stream().filter(a -> {
            if (a.getCategoria() != null) return a.getCategoria() == AdicionalCategoria.VEGETAL;
            return isVegetalHeuristic(a);
        }).toList();
        List<Adicional> salsas = all.stream().filter(a -> {
            if (a.getCategoria() != null) return a.getCategoria() == AdicionalCategoria.SALSA;
            return isSalsaHeuristic(a);
        }).toList();
        List<Adicional> quesos = all.stream().filter(a -> {
            if (a.getCategoria() != null) return a.getCategoria() == AdicionalCategoria.QUESO;
            return isQuesoHeuristic(a);
        }).toList();
        // Extras: marcados como EXTRA o los no clasificados por ninguna heurística
        List<Adicional> extras = all.stream().filter(a -> {
            if (a.getCategoria() != null) return a.getCategoria() == AdicionalCategoria.EXTRA;
            return !(isProteinHeuristic(a) || isVegetalHeuristic(a) || isSalsaHeuristic(a) || isQuesoHeuristic(a));
        }).toList();

        return new CategorizedAdicionalesResponse(proteinas, vegetales, salsas, quesos, extras);
    }

    private boolean isProteinHeuristic(Adicional a) {
        if (a.getNombre() == null) return false;
        String n = a.getNombre().toLowerCase();
        String[] keys = {"carne", "res", "cerdo", "pastor", "suadero", "pollo", "pescado", "camar" , "chorizo", "tocino", "barbacoa"};
        for (String k : keys) {
            if (n.contains(k)) return true;
        }
        return false;
    }

    private boolean isVegetalHeuristic(Adicional a) {
        if (a.getNombre() == null) return false;
        String n = a.getNombre().toLowerCase();
        String[] keys = {"lechuga", "tomate", "cebolla", "cilantro", "aguacate", "pepino", "zanahoria", "col", "champiñ", "pimiento"};
        for (String k : keys) {
            if (n.contains(k)) return true;
        }
        return false;
    }

    private boolean isSalsaHeuristic(Adicional a) {
        if (a.getNombre() == null) return false;
        String n = a.getNombre().toLowerCase();
        String[] keys = {"salsa", "habanero", "chipotle", "pico de gallo", "guacamole", "crema"};
        for (String k : keys) {
            if (n.contains(k)) return true;
        }
        return false;
    }

    private boolean isQuesoHeuristic(Adicional a) {
        if (a.getNombre() == null) return false;
        String n = a.getNombre().toLowerCase();
        String[] keys = {"queso", "oaxaca", "fresco", "cheddar", "manchego", "panela"};
        for (String k : keys) {
            if (n.contains(k)) return true;
        }
        return false;
    }
}