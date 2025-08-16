package com.picantito.picantito.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Extra extends Producto {
    private String categoria; // "Salsa", "Guarnición", "Acompañamiento", "Postre"
    private String intensidad; // Para salsas: "Suave", "Picante", "Muy Picante"
    private Boolean esVegetariano;
    private String origen; // "Casero", "Tradicional", "Especial"
    
    // Constructor completo con ID
    public Extra(Long id, String nombre, String descripcion, Double precio, String imagenUrl,
                 Boolean disponible, Integer calificacion, String categoria, String intensidad, 
                 Boolean esVegetariano, String origen) {
        super(id, nombre, descripcion, precio, imagenUrl, disponible, calificacion);
        this.categoria = categoria;
        this.intensidad = intensidad;
        this.esVegetariano = esVegetariano;
        this.origen = origen;
    }
    
    // Constructor sin ID (para crear nuevos extras)
    public Extra(String nombre, String descripcion, Double precio, String imagenUrl,
                 Boolean disponible, Integer calificacion, String categoria, String intensidad, 
                 Boolean esVegetariano, String origen) {
        super(nombre, descripcion, precio, imagenUrl, disponible, calificacion);
        this.categoria = categoria;
        this.intensidad = intensidad;
        this.esVegetariano = esVegetariano;
        this.origen = origen;
    }
}