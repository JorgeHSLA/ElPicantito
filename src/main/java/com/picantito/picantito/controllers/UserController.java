package com.picantito.picantito.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.picantito.picantito.dto.LoginRequest;
import com.picantito.picantito.dto.LoginResponse;
import com.picantito.picantito.dto.UserDto;
import com.picantito.picantito.dto.response.UserResponseDTO;
import com.picantito.picantito.entities.User;
import com.picantito.picantito.mapper.UserMapper;
import com.picantito.picantito.mapper.UserDtoMapper;
import com.picantito.picantito.security.JwtService;
import com.picantito.picantito.service.AutentificacionService;
import com.picantito.picantito.service.TokenRevocationService;

import jakarta.servlet.http.HttpServletRequest;



@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(originPatterns = "*", allowCredentials = "false") // Para desarrollo - permite todos los orígenes
public class UserController {

    @Autowired
    private AutentificacionService autentificacionService;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private UserDtoMapper userDtoMapper;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private TokenRevocationService tokenRevocationService;
    
    // === LOGIN ===
    // Login de usuario: http://localhost:9998/api/usuarios/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Validación básica
            if (loginRequest.getNombreUsuario() == null || loginRequest.getContrasenia() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Nombre de usuario y contraseña son obligatorios"));
            }
            
            // Buscar el usuario
            Optional<User> optionalUser = autentificacionService.findByNombreUsuario(loginRequest.getNombreUsuario());
            
            if (!optionalUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Nombre de usuario no encontrado"));
            }
            
            User user = optionalUser.get();
            
            // Verificar si el usuario está activo
            if (!user.getActivo()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "La cuenta no está activa"));
            }
            
            // Autenticar usando Spring Security
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getNombreUsuario(),
                    loginRequest.getContrasenia()
                )
            );

            // Generar token JWT
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtService.generateToken(userDetails);

            // Extraer roles sin el prefijo "ROLE_"
            var roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .map(role -> role.replace("ROLE_", ""))
                    .collect(Collectors.toSet());

            // Construir respuesta
            LoginResponse response = LoginResponse.builder()
                    .token(jwt)
                    .type("Bearer")
                    .id(user.getId())
                    .nombreUsuario(user.getNombreUsuario())
                    .nombreCompleto(user.getNombreCompleto())
                    .correo(user.getCorreo())
                    .roles(roles)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }
    }

    // === LOGOUT ===
    // Logout de usuario (revoca el token JWT): http://localhost:9998/api/usuarios/logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            String jwt = getJwtFromRequest(request);
            
            if (jwt != null) {
                tokenRevocationService.revokeToken(jwt);
                return ResponseEntity.ok(Map.of("mensaje", "Sesión cerrada exitosamente"));
            }
            
            return ResponseEntity.badRequest().body(Map.of("error", "No se encontró token para cerrar sesión"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al cerrar sesión: " + e.getMessage()));
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // === CREATE (Crear usuario) ===
    // Crear un nuevo usuario: http://localhost:9998/api/usuarios
    @PostMapping
    public ResponseEntity<?> crearUsuario(@RequestBody User usuario) {
        try {
            // Validación básica
            if (usuario.getNombreUsuario() == null || usuario.getNombreUsuario().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre de usuario es obligatorio");
            }
            
            // Verificar si ya existe un usuario con ese nombre o correo
            Optional<User> existenteUsuario = autentificacionService.findByNombreUsuario(usuario.getNombreUsuario());
            Optional<User> existenteCorreo = autentificacionService.findByCorreo(usuario.getCorreo());
            
            if (existenteUsuario.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("El nombre de usuario ya está en uso");
            }
            
            if (existenteCorreo.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo electrónico ya está registrado");
            }
            
            // Verificar que el estado solo exista para repartidores
            if (!"REPARTIDOR".equals(usuario.getRol()) && usuario.getEstado() != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("El estado solo puede ser asignado a repartidores");
            }
            
            // Guardar el nuevo usuario
            User nuevoUsuario = autentificacionService.save(usuario);
            UserDto userDTO = userDtoMapper.toDto(nuevoUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear usuario: " + e.getMessage());
        }
    }
    
    // === READ (Obtener todos los usuarios) ===
    // Obtener todos los usuarios: http://localhost:9998/api/usuarios
    // Soporta parámetros de consulta opcionales: rol y estado
    // Ejemplo: http://localhost:9998/api/usuarios?rol=REPARTIDOR
    // Ejemplo: http://localhost:9998/api/usuarios?rol=REPARTIDOR&estado=DISPONIBLE
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsuarios(
            @RequestParam(required = false) String rol,
            @RequestParam(required = false) String estado) {
        
        List<User> usuarios;
        
        // Si se especifica rol y estado
        if (rol != null && estado != null) {
            usuarios = autentificacionService.findByRolAndEstado(rol.toUpperCase(), estado.toUpperCase());
        }
        // Si solo se especifica rol
        else if (rol != null) {
            usuarios = autentificacionService.findByRol(rol.toUpperCase());
        }
        // Si no se especifica ningún filtro, devolver todos
        else {
            usuarios = autentificacionService.findAll();
        }
        
        List<UserResponseDTO> userDTOs = userMapper.toListDTO(usuarios);
        return ResponseEntity.ok(userDTOs);
    }

    // === READ (Obtener usuario por ID) ===
    // Obtener información de un usuario específico: http://localhost:9998/api/usuarios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getUsuarioById(@PathVariable Integer id) {
        Optional<User> usuario = autentificacionService.findById(id);
        if (usuario.isPresent()) {
            UserResponseDTO userDTO = userMapper.toDTO(usuario.get());
            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario no encontrado con ID: " + id);
        }
    }
    
    // === READ POR TIPO DE USUARIO ===
    // 1. Obtener usuarios de tipo ADMIN
    // Obtener todos los usuarios administradores: http://localhost:9998/api/usuarios/tipo/admin
    @GetMapping("/tipo/admin")
    public ResponseEntity<List<UserResponseDTO>> getUsuariosAdmin() {
        List<User> admins = autentificacionService.findByRol("ADMIN");
        return ResponseEntity.ok(userMapper.toListDTO(admins));
    }
    
    // 2. Obtener usuarios de tipo CLIENTE
    // Obtener todos los usuarios clientes: http://localhost:9998/api/usuarios/tipo/cliente
    @GetMapping("/tipo/cliente")
    public ResponseEntity<List<UserResponseDTO>> getUsuariosCliente() {
        List<User> clientes = autentificacionService.findByRol("CLIENTE");
        return ResponseEntity.ok(userMapper.toListDTO(clientes));
    }
    
    // 3. Obtener usuarios de tipo OPERADOR
    // Obtener todos los usuarios operadores: http://localhost:9998/api/usuarios/tipo/operador
    @GetMapping("/tipo/operador")
    public ResponseEntity<List<UserResponseDTO>> getUsuariosOperador() {
        List<User> operadores = autentificacionService.findByRol("OPERADOR");
        return ResponseEntity.ok(userMapper.toListDTO(operadores));
    }
    
    // 4. Obtener usuarios de tipo REPARTIDOR
    // Obtener todos los usuarios repartidores: http://localhost:9998/api/usuarios/tipo/repartidor
    @GetMapping("/tipo/repartidor")
    public ResponseEntity<List<UserResponseDTO>> getUsuariosRepartidor() {
        List<User> repartidores = autentificacionService.findByRol("REPARTIDOR");
        return ResponseEntity.ok(userMapper.toListDTO(repartidores));
    }
    
    // Obtener repartidores por estado: http://localhost:9998/api/usuarios/repartidores/estado/{estado}
    @GetMapping("/repartidores/estado/{estado}")
    public ResponseEntity<?> getRepartidoresPorEstado(@PathVariable String estado) {
        List<User> repartidores = autentificacionService.findByRolAndEstado("REPARTIDOR", estado);
        return ResponseEntity.ok(userMapper.toListDTO(repartidores));
    }
    
    // === UPDATE (Actualizar usuario) ===
    // Actualizar información de un usuario: http://localhost:9998/api/usuarios/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @RequestBody User usuario) {
        try {
            Optional<User> optionalUsuario = autentificacionService.findById(id);
            if (!optionalUsuario.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado con ID: " + id);
            }
            
            User usuarioExistente = optionalUsuario.get();
            
            // Verificar que el estado solo exista para repartidores
            if (!"REPARTIDOR".equals(usuario.getRol()) && usuario.getEstado() != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Si no es repartidor no puede tener estado");
            }
            
            // Aseguramos que el ID sea el correcto
            usuario.setId(id);
            
            // Si la contraseña viene null o vacía, preservar la contraseña existente
            if (usuario.getContrasenia() == null || usuario.getContrasenia().trim().isEmpty()) {
                usuario.setContrasenia(usuarioExistente.getContrasenia());
            }
            
            // Verificar si cambia el email o nombre de usuario para validar duplicados
            if (!usuarioExistente.getNombreUsuario().equals(usuario.getNombreUsuario())) {
                Optional<User> existente = autentificacionService.findByNombreUsuario(usuario.getNombreUsuario());
                if (existente.isPresent() && !existente.get().getId().equals(id)) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("El nombre de usuario ya está en uso");
                }
            }
            
            if (!usuarioExistente.getCorreo().equals(usuario.getCorreo())) {
                Optional<User> existente = autentificacionService.findByCorreo(usuario.getCorreo());
                if (existente.isPresent() && !existente.get().getId().equals(id)) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo electrónico ya está registrado");
                }
            }
            
            // Actualizar usuario (el servicio maneja los roles automáticamente)
            User usuarioActualizado = autentificacionService.actualizarUsuarioConRol(usuario);
            UserResponseDTO userDTO = userMapper.toDTO(usuarioActualizado);
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar usuario: " + e.getMessage());
        }
    }
    
    // === DELETE (Eliminar usuario lógicamente) ===
    // Eliminar usuario (marcado lógico): http://localhost:9998/api/usuarios/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id) {
        try {
            String resultado = autentificacionService.eliminarUsuario(id);
            if ("SUCCESS".equals(resultado)) {
                return ResponseEntity.ok()
                        .body(Map.of(
                            "mensaje", "Usuario eliminado correctamente",
                            "id", id
                        ));
            } else if (resultado != null && resultado.startsWith("Usuario no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(resultado);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(resultado);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar usuario: " + e.getMessage());
        }
    }
    
    // Cambiar estado de repartidor: http://localhost:9998/api/usuarios/repartidor/{id}/estado/{estado}
    @PutMapping("/repartidor/{id}/estado/{estado}")
    public ResponseEntity<?> cambiarEstadoRepartidor(@PathVariable Integer id, @PathVariable String estado) {
        try {
            Optional<User> optionalUsuario = autentificacionService.findById(id);
            if (!optionalUsuario.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado con ID: " + id);
            }
            
            User usuario = optionalUsuario.get();
            
            // Verificar que sea repartidor
            if (!"REPARTIDOR".equals(usuario.getRol())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El usuario no es un repartidor");
            }
            
            usuario.setEstado(estado);
            autentificacionService.save(usuario);
            
            return ResponseEntity.ok()
                    .body(Map.of(
                        "mensaje", "Estado de repartidor actualizado correctamente", 
                        "id", id, 
                        "estado", estado
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar estado: " + e.getMessage());
        }
    }
    
    // === ENDPOINT SIMPLE CON DTOs ===
    /**
     * Endpoint que devuelve usuarios usando UserDto (sin contraseñas)
     * GET /api/usuarios/dto
     */
    @GetMapping("/dto")
    public ResponseEntity<List<UserDto>> getAllUsuariosDto() {
        try {
            List<User> usuarios = autentificacionService.findAll();
            List<UserDto> usuariosDto = userDtoMapper.toListDto(usuarios);
            return ResponseEntity.ok(usuariosDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    

    

}