package com.picantito.picantito.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.CascadeType;
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
    private Boolean disponible;

    @OneToMany(mappedBy = "adicional", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductoAdicional> productoAdicionales = new ArrayList<>();

    @OneToMany(mappedBy = "adicional", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PedidoProductoAdicional> pedidoProductoAdicionales = new ArrayList<>();

    @Transient
    public List<Pedido> getPedidos() {
        return this.pedidoProductoAdicionales.stream()
            .map(ppa -> ppa.getPedidoProducto().getPedido())
            .distinct()
            .toList();
    }

    public void setPedidos(List<Pedido> pedidos) {
        this.pedidoProductoAdicionales.clear();
        for (Pedido pedido : pedidos) {
            PedidoProducto pedidoProducto = new PedidoProducto();
            pedidoProducto.setPedido(pedido);

            PedidoProductoAdicional ppa = new PedidoProductoAdicional();
            ppa.setPedidoProducto(pedidoProducto);
            ppa.setAdicional(this);
            ppa.setCantidadAdicional(1); // valor por defecto

            this.pedidoProductoAdicionales.add(ppa);
        }
    }
    @Transient
    public List<Producto> getProductos() {
        return this.productoAdicionales.stream()
            .map(ProductoAdicional::getProducto)
            .distinct()
            .collect(Collectors.toCollection(ArrayList::new)); // ✅ mutable
    }


    public void setProductos(List<Producto> productos) {
        this.productoAdicionales.clear();
        for (Producto producto : productos) {
            ProductoAdicional pa = new ProductoAdicional();
            pa.setProducto(producto);
            pa.setAdicional(this);
            this.productoAdicionales.add(pa);
    }
}

    public Adicional(String string, String string2, double d, boolean b) {
        //TODO Auto-generated constructor stub
    }


}
