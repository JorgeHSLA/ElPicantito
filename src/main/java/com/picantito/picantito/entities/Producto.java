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

    @Column(nullable = false)
    private Double precioDeAdquision;

    //@Column(length = 1000) pongo essto para que javi lo vea, si solo pone column puede que la uri se corte porque max son 255 chars, por eso se pasa a 1000
    private String imagen;
    
    @Column(nullable = false)
    private Boolean disponible = true;
    
    @Column(nullable = false)
    private Integer calificacion = 5;
    
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Adicional> adicionales = new ArrayList<>();

    // Constructor sin ID (para nuevos productos)
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
                ", precio=" + precio +
                ", disponible=" + disponible +
                ", calificacion=" + calificacion +
                // NO incluir adicionales aquí para evitar referencia circular
                '}';
    }
}