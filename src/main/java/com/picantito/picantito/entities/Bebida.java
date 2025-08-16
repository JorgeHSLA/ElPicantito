package com.picantito.picantito.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Bebida extends Producto {
    private String tipo; // "Refresco", "Agua Fresca", "Jugo Natural", "Cerveza", "Agua"
    private String tamaño; // "Chico", "Mediano", "Grande"
    private Boolean conHielo;
    private Boolean esAlcoholica;
    private Integer temperaturaRecomendada; // En grados Celsius
    
    // Constructor completo con ID
    public Bebida(Long id, String nombre, String descripcion, Double precio, String imagenUrl,
                  Boolean disponible, Integer calificacion, String tipo, String tamaño, 
                  Boolean conHielo, Boolean esAlcoholica, Integer temperaturaRecomendada) {
        super(id, nombre, descripcion, precio, imagenUrl, disponible, calificacion);
        this.tipo = tipo;
        this.tamaño = tamaño;
        this.conHielo = conHielo;
        this.esAlcoholica = esAlcoholica;
        this.temperaturaRecomendada = temperaturaRecomendada;
    }
    
    // Constructor sin ID (para crear nuevas bebidas)
    public Bebida(String nombre, String descripcion, Double precio, String imagenUrl,
                  Boolean disponible, Integer calificacion, String tipo, String tamaño, 
                  Boolean conHielo, Boolean esAlcoholica, Integer temperaturaRecomendada) {
        super(nombre, descripcion, precio, imagenUrl, disponible, calificacion);
        this.tipo = tipo;
        this.tamaño = tamaño;
        this.conHielo = conHielo;
        this.esAlcoholica = esAlcoholica;
        this.temperaturaRecomendada = temperaturaRecomendada;
    }
}

