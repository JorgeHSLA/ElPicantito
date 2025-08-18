package com.picantito.picantito.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.picantito.picantito.entities.Producto;

@Repository
public class ComidaRepository {
    
    private Map<Integer, Producto> comidas = new HashMap<>();
    private int nextId = 1;

    public ComidaRepository() {
        inicializarComidas();
    }

    private void inicializarComidas() {
        // Tacos
        addComida(new Producto("Taco al Pastor", "Deliciosa carne marinada con especias tradicionales, piña fresca y cebolla, servido en tortilla de maíz artesanal", 3.50, "https://via.placeholder.com/300x250/8B4D30/FFFFFF?text=Al+Pastor", true, 5));
        addComida(new Producto("Taco de Asada", "Jugosa carne de res a la parrilla, marinada perfectamente y servida con cilantro fresco y cebolla", 4.00, "https://via.placeholder.com/300x250/A0522D/FFFFFF?text=Asada", true, 4));
        addComida(new Producto("Taco de Carnitas", "Carne de cerdo cocinada lentamente con especias tradicionales, servida con salsa verde casera", 3.75, "https://via.placeholder.com/300x250/8B4513/FFFFFF?text=Carnitas", true, 4));
        addComida(new Producto("Taco de Barbacoa", "Tierno y jugoso, cocinado al vapor con chiles y especias tradicionales durante horas", 4.25, "https://via.placeholder.com/300x250/CD853F/FFFFFF?text=Barbacoa", true, 5));
        addComida(new Producto("Taco de Pollo", "Pollo marinado con especias mexicanas, servido con guacamole y pico de gallo", 3.25, "https://via.placeholder.com/300x250/DAA520/FFFFFF?text=Pollo", true, 4));
        addComida(new Producto("Taco Vegano", "Proteína de soya con vegetales frescos y salsa vegana especial", 3.00, "https://via.placeholder.com/300x250/228B22/FFFFFF?text=Vegano", true, 4));
        
        // Bebidas
        addComida(new Producto("Agua de Horchata", "Bebida tradicional de arroz con canela y azúcar", 2.50, "https://via.placeholder.com/300x250/F5DEB3/8B4513?text=Horchata", true, 5));
        addComida(new Producto("Agua de Jamaica", "Bebida refrescante de flor de jamaica con un toque de limón", 2.25, "https://via.placeholder.com/300x250/DC143C/FFFFFF?text=Jamaica", true, 4));
        addComida(new Producto("Coca Cola", "Bebida gaseosa clásica", 2.00, "https://via.placeholder.com/300x250/B22222/FFFFFF?text=Coca+Cola", true, 4));
        addComida(new Producto("Agua Natural", "Agua purificada", 1.50, "https://via.placeholder.com/300x250/87CEEB/000000?text=Agua", true, 5));
        
        // Extras
        addComida(new Producto("Guacamole", "Guacamole fresco hecho con aguacates, limón y especias", 1.75, "https://via.placeholder.com/300x250/6B8E23/FFFFFF?text=Guacamole", true, 5));
        addComida(new Producto("Pico de Gallo", "Mezcla fresca de tomate, cebolla, cilantro y chile", 1.50, "https://via.placeholder.com/300x250/FF6347/FFFFFF?text=Pico+Gallo", true, 4));
    }

    private void addComida(Producto producto) {
        producto.setId(nextId);
        comidas.put(nextId, producto);
        nextId++;
    }

    public List<Producto> findAll() {
        return new ArrayList<>(comidas.values());
    }

    public Optional<Producto> findById(Integer id) {
        return Optional.ofNullable(comidas.get(id));
    }

    public Producto save(Producto producto) {
        if (producto.getId() == null) {
            producto.setId(nextId);
            nextId++;
        }
        comidas.put(producto.getId(), producto);
        return producto;
    }

    public void deleteById(Integer id) {
        comidas.remove(id);
    }
}
