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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "adicionales")
@Data
@NoArgsConstructor
public class Adicional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(length = 500)
    private String descripcion;
    
    @Column(nullable = false)
    private Double precio;
    
    // Nuevos campos según diagrama ER
    // private Double precioDeAdquisicion;
    // private Integer cantidad;
    
    @Column(nullable = false)
    private Boolean disponible = true;
    
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "producto_adicional",
        joinColumns = @JoinColumn(name = "adicional_id"),
        inverseJoinColumns = @JoinColumn(name = "producto_id")
    )
    private List<Producto> productos = new ArrayList<>();

    public Adicional(String nombre, String descripcion, Double precio, Boolean disponible) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.disponible = disponible;
    }

    @Override
    public String toString() {
        return "Adicional{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", precio=" + precio +
                ", disponible=" + disponible +
                '}';
    }
}
