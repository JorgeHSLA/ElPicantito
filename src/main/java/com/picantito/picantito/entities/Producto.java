package com.picantito.picantito.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class Producto {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagen; // URL de la imagen
    private Boolean disponible;
    private Integer calificacion; // 1-5 estrellas

    // Constructor sin ID (para nuevos productos)
    public Producto(String nombre, String descripcion, Double precio, String imagen, Boolean disponible, Integer calificacion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.disponible = disponible;
        this.calificacion = calificacion;
//        this.id = null;  // SE PONE NULO PARA QUE SEA AUTOMATICO EN LA BASE DE DATOS
    }



    @Override
    public String toString() {
        return "Producto{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", precio=" + precio +
                ", imagen='" + imagen + '\'' +
                ", disponible=" + disponible +
                ", calificacion=" + calificacion +
                '}';
    }
}
