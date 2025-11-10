package com.picantito.picantito.models;

import java.util.List;
import java.util.Map;

public class EstadisticaDTO {

    private Map<String, Float> ventasPorDia;
    private List<Integer> mejoresClientes;
    private List<Integer> productosMenosVendidos;
    private List<Integer> productosMasVendidos;
    private List<Integer> adicionalesMasConsumidos;
    private List<Integer> adicionalesMenosConsumidos;
    private List<Integer> productosNoRecomendados;
    private List<Integer> productosRecomendados;
    private Float ingresosTotales;
    private Float ingresosNetos;
    private Integer totalPedidos;

    // Constructor vacío
    public EstadisticaDTO() {}

    // Constructor con parámetros
    public EstadisticaDTO(Map<String, Float> ventasPorDia, List<Integer> mejoresClientes,
                          List<Integer> productosMenosVendidos, List<Integer> productosMasVendidos,
                          List<Integer> adicionalesMasConsumidos, List<Integer> adicionalesMenosConsumidos,
                          List<Integer> productosNoRecomendados, List<Integer> productosRecomendados,
                          Float ingresosTotales, Float ingresosNetos, Integer totalPedidos) {
        this.ventasPorDia = ventasPorDia;
        this.mejoresClientes = mejoresClientes;
        this.productosMenosVendidos = productosMenosVendidos;
        this.productosMasVendidos = productosMasVendidos;
        this.adicionalesMasConsumidos = adicionalesMasConsumidos;
        this.adicionalesMenosConsumidos = adicionalesMenosConsumidos;
        this.productosNoRecomendados = productosNoRecomendados;
        this.productosRecomendados = productosRecomendados;
        this.ingresosTotales = ingresosTotales;
        this.ingresosNetos = ingresosNetos;
        this.totalPedidos = totalPedidos;
    }

    // Getters y Setters
    public Map<String, Float> getVentasPorDia() {
        return ventasPorDia;
    }

    public void setVentasPorDia(Map<String, Float> ventasPorDia) {
        this.ventasPorDia = ventasPorDia;
    }

    public List<Integer> getMejoresClientes() {
        return mejoresClientes;
    }

    public void setMejoresClientes(List<Integer> mejoresClientes) {
        this.mejoresClientes = mejoresClientes;
    }

    public List<Integer> getProductosMenosVendidos() {
        return productosMenosVendidos;
    }

    public void setProductosMenosVendidos(List<Integer> productosMenosVendidos) {
        this.productosMenosVendidos = productosMenosVendidos;
    }

    public List<Integer> getProductosMasVendidos() {
        return productosMasVendidos;
    }

    public void setProductosMasVendidos(List<Integer> productosMasVendidos) {
        this.productosMasVendidos = productosMasVendidos;
    }

    public List<Integer> getAdicionalesMasConsumidos() {
        return adicionalesMasConsumidos;
    }

    public void setAdicionalesMasConsumidos(List<Integer> adicionalesMasConsumidos) {
        this.adicionalesMasConsumidos = adicionalesMasConsumidos;
    }

    public List<Integer> getAdicionalesMenosConsumidos() {
        return adicionalesMenosConsumidos;
    }

    public void setAdicionalesMenosConsumidos(List<Integer> adicionalesMenosConsumidos) {
        this.adicionalesMenosConsumidos = adicionalesMenosConsumidos;
    }

    public List<Integer> getProductosNoRecomendados() {
        return productosNoRecomendados;
    }

    public void setProductosNoRecomendados(List<Integer> productosNoRecomendados) {
        this.productosNoRecomendados = productosNoRecomendados;
    }

    public List<Integer> getProductosRecomendados() {
        return productosRecomendados;
    }

    public void setProductosRecomendados(List<Integer> productosRecomendados) {
        this.productosRecomendados = productosRecomendados;
    }

    public Float getIngresosTotales() {
        return ingresosTotales;
    }

    public void setIngresosTotales(Float ingresosTotales) {
        this.ingresosTotales = ingresosTotales;
    }

    public Float getIngresosNetos() {
        return ingresosNetos;
    }

    public void setIngresosNetos(Float ingresosNetos) {
        this.ingresosNetos = ingresosNetos;
    }

    public Integer getTotalPedidos() {
        return totalPedidos;
    }

    public void setTotalPedidos(Integer totalPedidos) {
        this.totalPedidos = totalPedidos;
    }
}