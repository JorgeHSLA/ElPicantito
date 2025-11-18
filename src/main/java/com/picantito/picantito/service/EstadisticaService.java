package com.picantito.picantito.service;

import java.util.List;
import java.util.Map;

public interface EstadisticaService {

    // Total de ventas por día (para graficar líneas o barras) (string el dia, float la suma del valor de las ventas)
    Map<String, Float> ventasPorDia();

    // Cantidad de pedidos por día
    Map<String, Integer> pedidosPorDia();


    // Mejores clientes (lista de ids de clientes que más han comprado)
    List<Integer> mejoresClientes();


    // Productos menos vendidos 
    List<Integer> productosMenosVendidos();

    // Productos más vendidos 
    List<Integer> productosMasVendidos();

    // lista de ids de adicionales más consumidos
    List<Integer> AdicionalesMasConsumidos();

    // lista de ids de adicionales menos consumidos
    List<Integer> AdicionalesMenosConsumidos();

    // recomendaciones de productos que no valen la pena en ids (los que generan menos ganancias)
    List<Integer> productosNoRecomendados();

    // recomendaciones de productos que valen la pena en ids (los que generan más ganancias)
    List<Integer> productosRecomendados();

    // Ingresos acumulados (para curva de crecimiento)
    Float ingresosTotales();

    // Ingresos netos (después de costos y gastos)
    Float ingresosNetos();

    // Número total de pedidos
    Integer totalPedidos();
    

    
}
