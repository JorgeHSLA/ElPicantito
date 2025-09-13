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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
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
    private Float precio;
    private Float precioDeAdquisicion;
    private String imagen;
    private Boolean disponible;
    private Integer calificacion;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PedidoProducto> pedidoProductos = new ArrayList<>();

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductoAdicional> productoAdicionales = new ArrayList<>();

    @Transient
    public List<Adicional> getAdicionales() {
        return this.productoAdicionales.stream()
            .map(ProductoAdicional::getAdicional)
            .toList();
    }

    public void setAdicionales(List<Adicional> adicionales) {
        this.productoAdicionales.clear();
        for (Adicional adicional : adicionales) {
            ProductoAdicional pa = new ProductoAdicional();
            pa.setProducto(this);
            pa.setAdicional(adicional);
            pa.setCantidadProducto(1); // valor por defecto
            this.productoAdicionales.add(pa);
        }
    }
    @Transient
    public List<Pedido> getPedidos() {
        return this.pedidoProductos.stream()
            .map(PedidoProducto::getPedido)
            .distinct()
            .toList();
    }

    public void setPedidos(List<Pedido> pedidos) {
        this.pedidoProductos.clear();
        for (Pedido pedido : pedidos) {
            PedidoProducto pp = new PedidoProducto();
            pp.setPedido(pedido);
            pp.setProducto(this);
            pp.setCantidadProducto(1); // valor por defecto
            this.pedidoProductos.add(pp);
        }
    }

    public Producto(String nombre, String descripcion, double precio, String imagen, boolean disponible, int calificacion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = (float) precio;
        this.imagen = imagen;
        this.disponible = disponible;
        this.calificacion = calificacion;
    }


}

