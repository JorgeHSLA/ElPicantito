package com.picantito.picantito.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.User;

@Repository 
public class UsuarioRepository /*extends JpaRepository<Usuario, Integer> */{

    private Map<Integer, User> usuarios = new HashMap<>();

    public UsuarioRepository() {
        // Productos quemados
        Producto taco1 = new Producto("Taco al Pastor", "Carne de cerdo con piña", 12.5, "url-taco-pastor", true, 5);
        Producto taco2 = new Producto("Taco de Pollo", "Pollo marinado con cebolla", 10.0, "url-taco-pollo", true, 4);
        Producto bebida1 = new Producto("Agua de Horchata", "Bebida de arroz con canela", 8.0, "url-horchata", true, 5);
        Producto bebida2 = new Producto("Agua de Jamaica", "Bebida refrescante de flor de jamaica", 7.0, "url-jamaica", true, 4);

        // Pedidos quemados
        Pedido pedido1 = new Pedido(
                1,
                "Pedido 1",
                20.5,
                Arrays.asList(taco1, bebida1),
                new Date(), // fecha entrega
                new Date()  // fecha solicitud
        );

        Pedido pedido2 = new Pedido(
                2,
                "Pedido 2",
                19.5,
                Arrays.asList(taco2, bebida2),
                new Date(),
                new Date()
        );

        Pedido pedido3 = new Pedido(
                3,
                "Pedido 3",
                30.5,
                Arrays.asList(taco1, taco2, bebida1),
                new Date(),
                new Date()
        );

        // Usuarios quemados
        User user1 = new User("U1", "Carlos López", 123456789, Arrays.asList(pedido1, pedido3));
        User user2 = new User("U2", "María Pérez", 987654321, Arrays.asList(pedido2));

        usuarios.put(1, user1);
        usuarios.put(2, user2);
    }


}



    
