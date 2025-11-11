package com.picantito.picantito.dto;

import java.util.List;

import com.picantito.picantito.entities.Adicional;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategorizedAdicionalesResponse {
    private List<Adicional> proteinas;
    private List<Adicional> vegetales;
    private List<Adicional> salsas;
    private List<Adicional> quesos;
    private List<Adicional> extras;
}
