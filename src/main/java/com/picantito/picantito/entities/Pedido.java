package com.picantito.picantito.entities;

import java.sql.Timestamp;
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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "precio_de_adquisicion")
    private Float precioDeAdquisicion;

    @Column(name = "precio_de_venta")
    private Float precioDeVenta;

    @Column(name = "fecha_entrega")
    private Timestamp fechaEntrega;
    
    @Column(name = "fecha_solicitud")
    private Timestamp fechaSolicitud;
    
    @Column(name = "estado")
    private String estado;
    
    @Column(name = "direccion")
    private String direccion;

    @ManyToOne
    @JoinColumn(name = "clientes_id")
    private User cliente;

    @ManyToOne
    @JoinColumn(name = "repartidor_id")
    private User repartidor;

    @JsonIgnore
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PedidoProducto> pedidoProductos = new ArrayList<>();
}
