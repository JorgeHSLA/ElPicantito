package com.picantito.picantito.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Producto {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagenUrl;
    private Boolean disponible;
    private Integer calificacion; // De 1 a 5 estrellas
    
    // Constructor sin id (para crear nuevos productos)
    public Producto(String nombre, String descripcion, Double precio, String imagenUrl, Boolean disponible, Integer calificacion) {
        this.id = null; // se necesita asi para las bases de datos, al ser null se le puede agregar un id facil en la bd
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
        this.disponible = disponible;
        this.calificacion = calificacion;
    }
}
