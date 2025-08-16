package com.picantito.picantito.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Taco extends Producto {
    private String categoria; // "Al Pastor", "Asada", "Carnitas", "Vegetariano", etc.
    private List<String> ingredientes;
    private String nivelPicante; // "Suave", "Medio", "Picante", "Muy Picante"
    private Boolean esVegetariano;
    private String tipoTortilla; // "Maíz", "Harina"
    
    // Constructor completo con ID
    public Taco(Long id, String nombre, String descripcion, Double precio, String imagenUrl,
                Boolean disponible, Integer calificacion, String categoria, List<String> ingredientes,
                String nivelPicante, Boolean esVegetariano, String tipoTortilla) {
        super(id, nombre, descripcion, precio, imagenUrl, disponible, calificacion);
        this.categoria = categoria;
        this.ingredientes = ingredientes;
        this.nivelPicante = nivelPicante;
        this.esVegetariano = esVegetariano;
        this.tipoTortilla = tipoTortilla;
    }
    
    // Constructor sin ID (para crear nuevos tacos)
    public Taco(String nombre, String descripcion, Double precio, String imagenUrl,
                Boolean disponible, Integer calificacion, String categoria, List<String> ingredientes,
                String nivelPicante, Boolean esVegetariano, String tipoTortilla) {
        super(nombre, descripcion, precio, imagenUrl, disponible, calificacion);
        this.categoria = categoria;
        this.ingredientes = ingredientes;
        this.nivelPicante = nivelPicante;
        this.esVegetariano = esVegetariano;
        this.tipoTortilla = tipoTortilla;
    }
}