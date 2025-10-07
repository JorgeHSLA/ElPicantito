package com.picantito.picantito.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.service.PedidoService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:4200")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Pedido>> getPedidosByCliente(@PathVariable Integer clienteId) {
        List<Pedido> pedidos = pedidoService.getPedidosByCliente(clienteId);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/repartidor/{repartidorId}")
    public ResponseEntity<List<Pedido>> getPedidosByRepartidor(@PathVariable Integer repartidorId) {
        List<Pedido> pedidos = pedidoService.getPedidosByRepartidor(repartidorId);
        return ResponseEntity.ok(pedidos);
    }

    @PostMapping("path")
    public String postMethodName(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }
    
}
