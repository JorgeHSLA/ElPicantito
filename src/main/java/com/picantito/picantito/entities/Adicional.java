package com.picantito.picantito.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    
    @Column(nullable = false)
    private Double precioDeAdquisicion;
    
    @Column(nullable = false)
    private Integer cantidad;
    
    @Column(nullable = false)
    private Boolean disponible = true;

    public Adicional(String nombre, String descripcion, Double precio, Double precioDeAdquisicion, Integer cantidad, Boolean disponible) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.precioDeAdquisicion = precioDeAdquisicion;
        this.cantidad = cantidad;
        this.disponible = disponible;
    }

    @Override
    public String toString() {
        return "Adicional{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", precio=" + precio +
                ", precioDeAdquisicion=" + precioDeAdquisicion +
                ", cantidad=" + cantidad +
                ", disponible=" + disponible +
                '}';
    }
}
