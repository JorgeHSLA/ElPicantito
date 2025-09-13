package com.picantito.picantito.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Float precio;
    private Float precioDeAdquisicion;
    private Date fechaEntrega;
    private Date fechaSolicitud;
    private String estado;
    private String direccion;

    @ManyToOne
    @JoinColumn(name = "clientes_id")
    private User cliente;

    @ManyToOne
    @JoinColumn(name = "repartidor_id")
    private User repartidor;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PedidoProducto> pedidoProductos = new ArrayList<>();
}
