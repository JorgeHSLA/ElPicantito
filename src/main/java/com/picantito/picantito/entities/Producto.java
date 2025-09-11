package com.picantito.picantito.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "productos")
@Data
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
    
    // Nuevo campo según diagrama ER
    // private Double precioDeAdquisicion;
    
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