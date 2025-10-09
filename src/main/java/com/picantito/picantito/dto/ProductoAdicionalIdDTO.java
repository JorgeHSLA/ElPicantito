package com.picantito.picantito.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductoAdicionalIdDTO {
    private Integer productoId;
    private Integer adicionalId;
    
    // Constructor
    public ProductoAdicionalIdDTO(Integer productoId, Integer adicionalId) {
        this.productoId = productoId;
        this.adicionalId = adicionalId;
    }
}