package com.picantito.picantito.entities;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class Pedido {

    private Integer id;
    private String nombre;
    private Double precio;
    private List<Producto> productos = new ArrayList<>();
    private Date fechaEntrega;
    private Date fechaSolicitud;
    
}
