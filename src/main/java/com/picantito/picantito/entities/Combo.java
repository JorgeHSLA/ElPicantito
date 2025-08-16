package com.picantito.picantito.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Combo {
    private Long id;
    
    @NotNull(message = "El nombre del combo no puede ser nulo")
    private String nombre;
    
    private String descripcion;
    
    @NotNull(message = "El precio del combo no puede ser nulo")
    private Double precio;
    
    private String imagenUrl;
    
    @NotNull(message = "La disponibilidad del combo debe especificarse")
    private Boolean disponible;
    
    private Integer calificacion; // De 1 a 5 estrellas
    
    @NotEmpty(message = "Un combo debe tener al menos un producto")
    private List<Producto> productos;
    
    private Double descuento; // Porcentaje de descuento aplicado
    private String categoria; // "Familiar", "Individual", "Pareja", "Especial"
    private Boolean esPromocion; // Si es una promoción temporal
    private String tipoCombo; // "Básico", "Premium", "Deluxe"
    
    // Constructor sin ID (para crear nuevos combos)
    public Combo(String nombre, String descripcion, Double precio, String imagenUrl,
                 Boolean disponible, Integer calificacion, List<Producto> productos,
                 Double descuento, String categoria, Boolean esPromocion, String tipoCombo) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
        this.disponible = disponible;
        this.calificacion = calificacion;
        this.productos = productos != null ? productos : new ArrayList<>();
        this.descuento = descuento;
        this.categoria = categoria;
        this.esPromocion = esPromocion;
        this.tipoCombo = tipoCombo;
    }
    
    // Constructor con productos vacíos (se agregan después)
    public Combo(Long id, String nombre, String descripcion, Double precio, String imagenUrl,
                 Boolean disponible, Integer calificacion, Double descuento, String categoria, 
                 Boolean esPromocion, String tipoCombo) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
        this.disponible = disponible;
        this.calificacion = calificacion;
        this.productos = new ArrayList<>();
        this.descuento = descuento;
        this.categoria = categoria;
        this.esPromocion = esPromocion;
        this.tipoCombo = tipoCombo;
    }
    
    // Métodos de utilidad
    
    /**
     * Calcula el precio total de todos los productos sin descuento
     */
    public Double getPrecioTotalProductos() {
        if (productos == null || productos.isEmpty()) {
            return 0.0;
        }
        return productos.stream()
                       .mapToDouble(Producto::getPrecio)
                       .sum();
    }
    
    /**
     * Calcula el ahorro que representa el combo
     */
    public Double getAhorro() {
        Double precioTotalProductos = getPrecioTotalProductos();
        return precioTotalProductos - this.precio;
    }
    
    /**
     * Calcula el porcentaje de ahorro del combo
     */
    public Double getPorcentajeAhorro() {
        Double precioTotalProductos = getPrecioTotalProductos();
        if (precioTotalProductos == 0) {
            return 0.0;
        }
        return ((precioTotalProductos - this.precio) / precioTotalProductos) * 100;
    }
    
    /**
     * Agrega un producto al combo
     */
    public void agregarProducto(Producto producto) {
        if (this.productos == null) {
            this.productos = new ArrayList<>();
        }
        this.productos.add(producto);
    }
    
    /**
     * Remueve un producto del combo
     */
    public boolean removerProducto(Long productoId) {
        if (this.productos == null) {
            return false;
        }
        return this.productos.removeIf(producto -> producto.getId().equals(productoId));
    }
    
    /**
     * Verifica si el combo tiene al menos un producto
     */
    public boolean esValido() {
        return productos != null && !productos.isEmpty();
    }
    
    /**
     * Cuenta la cantidad de productos en el combo
     */
    public int getCantidadProductos() {
        return productos != null ? productos.size() : 0;
    }
    
    /**
     * Verifica si el combo es completamente vegetariano
     */
    public Boolean esVegetariano() {
        if (productos == null || productos.isEmpty()) {
            return false;
        }
        
        return productos.stream().allMatch(producto -> {
            if (producto instanceof Taco) {
                return ((Taco) producto).getEsVegetariano();
            } else if (producto instanceof Extra) {
                return ((Extra) producto).getEsVegetariano();
            } else if (producto instanceof Bebida) {
                return true; // Las bebidas generalmente son vegetarianas
            }
            return false;
        });
    }
    
    /**
     * Obtiene el nivel de picante máximo del combo
     */
    public String getNivelPicanteMaximo() {
        if (productos == null || productos.isEmpty()) {
            return "Ninguno";
        }
        
        String[] niveles = {"Suave", "Medio", "Picante", "Muy Picante"};
        int maxNivel = -1;
        
        for (Producto producto : productos) {
            if (producto instanceof Taco) {
                String nivel = ((Taco) producto).getNivelPicante();
                for (int i = 0; i < niveles.length; i++) {
                    if (niveles[i].equals(nivel) && i > maxNivel) {
                        maxNivel = i;
                    }
                }
            } else if (producto instanceof Extra) {
                String intensidad = ((Extra) producto).getIntensidad();
                for (int i = 0; i < niveles.length; i++) {
                    if (niveles[i].equals(intensidad) && i > maxNivel) {
                        maxNivel = i;
                    }
                }
            }
        }
        
        return maxNivel >= 0 ? niveles[maxNivel] : "Suave";
    }
}
