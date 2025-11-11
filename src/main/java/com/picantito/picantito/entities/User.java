package com.picantito.picantito.entities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuarios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "nombrecompleto", nullable = false)
    private String nombreCompleto;

    @Column(name = "nombreusuario", unique = true, nullable = false)
    private String nombreUsuario;
    
    @Column(nullable = false)
    private String telefono;
    
    @Column(unique = true, nullable = false)
    private String correo;
    
    @Column(nullable = false)
    private String contrasenia;
    
    @Column(nullable = true)
    private String estado;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @JsonIgnore
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Pedido> pedidosCliente = new ArrayList<>();
    
    @JsonIgnore
    @OneToMany(mappedBy = "repartidor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Pedido> pedidosRepartidor = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    public boolean isAdmin() {
        return roles.stream().anyMatch(role -> "ADMIN".equalsIgnoreCase(role.getNombre()));
    }

    // Método para compatibilidad con DTOs existentes, devuelve el nombre del primer rol o null
    public String getRol() {
        return roles.isEmpty() ? null : roles.iterator().next().getNombre();
    }
    
    // Método helper para agregar un rol por nombre (útil en tests y migrations)
    public void addRoleByName(String roleName) {
        Role role = new Role();
        role.setNombre(roleName);
        if (this.roles == null) {
            this.roles = new HashSet<>();
        }
        this.roles.add(role);
    }

}
