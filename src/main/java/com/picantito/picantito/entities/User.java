package com.picantito.picantito.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Data
@AllArgsConstructor
@NoArgsConstructor 
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private Integer numero;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String role = "USER"; // USER o ADMIN
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pedido> pedidos = new ArrayList<>();
    
    // Constructor sin ID
    public User(String name, Integer numero, String password) {
        this.name = name;
        this.numero = numero;
        this.password = password;
        this.role = "USER";
    }
    
    // Constructor con rol
    public User(String name, Integer numero, String password, String role) {
        this.name = name;
        this.numero = numero;
        this.password = password;
        this.role = role;
    }
    
    public boolean isAdmin() {
        return "ADMIN".equals(this.role);
    }
}
