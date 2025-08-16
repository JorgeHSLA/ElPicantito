package com.picantito.picantito.service;

import java.util.List;
import java.util.Map;

public interface EstadisticaService {

    // Total de ventas por día (para graficar líneas o barras)
    Map<String, Double> ventasPorDia();

    // Productos más vendidos (para gráfico de barras o pie)
    Map<String, Long> productosMasVendidos();

    // Total de pedidos por cliente (para análisis de consumo)
    Map<String, Long> pedidosPorCliente();

    // Asociación simple de productos (para red de relaciones)
    Map<String, List<String>> productosAsociados();

    // ingredientes mas consumidos
    Map<String, Long> ingredientesMasConsumidos();

    // recomendaciones de productos que no valen la pena
    List<String> productosNoRecomendados();

    // recomendaciones de productos que valen la pena
    List<String> productosRecomendados();

    // mejores horas de venta, para grafica de percentiles
    Map<Integer, Long> ventasPorHora();

    // Ingresos acumulados (para curva de crecimiento)
    Double ingresosTotales();


    // EL string es el nombre de porducto Long la cantidad

    
}
