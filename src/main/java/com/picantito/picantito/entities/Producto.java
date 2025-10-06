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
@Table(name = "productos")
@Data
@NoArgsConstructor
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;
    @Column(name = "preciodeventa")
    private Float precioDeVenta;
    @Column(name = "preciodeadquisicion")
    private Float precioDeAdquisicion;
    private String imagen;
    private Boolean disponible;
    private Integer calificacion;
    private Boolean activo = true;


    public Producto(String nombre, String descripcion, double precio, String imagen, boolean disponible, int calificacion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioDeVenta = (float) precio;
        this.imagen = imagen;
        this.disponible = disponible;
        this.calificacion = calificacion;
    }


}

