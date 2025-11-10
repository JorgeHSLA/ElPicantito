package com.picantito.picantito.entities;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoAdicionalId implements Serializable {
    private Integer adicionalId;
    private Integer productoId;
}
