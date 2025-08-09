package com.picantito.picantito.entities;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor 
public class User {

    private String id;
    private String name;
    private Integer numero;

}
