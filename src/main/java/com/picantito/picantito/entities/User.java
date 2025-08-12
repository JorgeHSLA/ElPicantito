package com.picantito.picantito.entities;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class User {

    private String id;
    private String name;
    private Integer numero;
    private List<Pedido> pedidos = new ArrayList<>();

}
