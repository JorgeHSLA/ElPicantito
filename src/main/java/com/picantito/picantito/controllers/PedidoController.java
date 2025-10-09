package com.picantito.picantito.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picantito.picantito.dto.CrearPedidoDTO;
import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.service.PedidoService;
@RestController
@RequestMapping("/api/pedidos")
//@CrossOrigin(originPatterns = "*", allowCredentials = "false") // Para desarrollo - permite todos los orígenes
@CrossOrigin(origins = "http://localhost:4200") // Solo para Angular
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


    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody CrearPedidoDTO pedidoDTO) {
        try {
            System.out.println("Recibido DTO: " + pedidoDTO);
            Pedido nuevoPedido = pedidoService.crearPedido(pedidoDTO);
            return new ResponseEntity<>(nuevoPedido, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creando pedido: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
