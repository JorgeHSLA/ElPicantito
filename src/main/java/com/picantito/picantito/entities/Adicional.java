package com.picantito.picantito.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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

    private String nombre;
    private String descripcion;
    @Column(name = "preciodeadquisicion")
    private Float precioDeAdquisicion;
    
    @Column(name = "preciodeventa")
    private Float precioDeVenta;
    private Integer cantidad;
    private Boolean disponible;
    private Boolean activo = true;


    @JsonIgnore
    @OneToMany(mappedBy = "adicional", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductoAdicional> productoAdicionales = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "adicional", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PedidoProductoAdicional> pedidoProductoAdicionales = new ArrayList<>();


}
