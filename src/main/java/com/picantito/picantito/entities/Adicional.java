package com.picantito.picantito.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
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
    private Float precio;
    private Float precioDeAdquisicion;
    private Integer cantidad;

    @OneToMany(mappedBy = "adicional", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductoAdicional> productoAdicionales = new ArrayList<>();

    @OneToMany(mappedBy = "adicional", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PedidoProductoAdicional> pedidoProductoAdicionales = new ArrayList<>();
}
