package com.picantito.picantito.entities;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
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
    private Timestamp fechaEntrega;
    private Timestamp fechaSolicitud;
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

    @Transient
    public List<Adicional> getAdicionales() {
        return this.pedidoProductos.stream()
            .flatMap(pp -> pp.getPedidoProductoAdicionales().stream()
                .map(PedidoProductoAdicional::getAdicional))
            .toList();
    }

    public void setAdicionales(List<Adicional> adicionales) {
        // Limpio todos los adicionales existentes
        for (PedidoProducto pedidoProducto : this.pedidoProductos) {
            pedidoProducto.getPedidoProductoAdicionales().clear();
            for (Adicional adicional : adicionales) {
                PedidoProductoAdicional ppa = new PedidoProductoAdicional();
                ppa.setPedidoProducto(pedidoProducto);
                ppa.setAdicional(adicional);
                ppa.setCantidadAdicional(1); // valor por defecto
                pedidoProducto.getPedidoProductoAdicionales().add(ppa);
        }
    }
}

}
