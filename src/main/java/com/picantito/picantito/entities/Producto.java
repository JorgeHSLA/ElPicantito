package com.picantito.picantito.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "productos")
@Data
@AllArgsConstructor
@NoArgsConstructor 
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(length = 500)
    private String descripcion;
    
    @Column(nullable = false)
    private Double precio;
    
    private String imagen;
    
    @Column(nullable = false)
    private Boolean disponible = true;
    
    @Column(nullable = false)
    private Integer calificacion = 5;
    
    @ManyToMany(mappedBy = "productos", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<Adicional> adicionales = new ArrayList<>();

    public Producto(String nombre, String descripcion, Double precio, String imagen, Boolean disponible, Integer calificacion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.disponible = disponible;
        this.calificacion = calificacion;
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