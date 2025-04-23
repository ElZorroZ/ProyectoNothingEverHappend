/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
import com.nothingeverhappends.java_backend.ConexionBDD;
import com.nothingeverhappends.java_backend.Usuario;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class Controller {
    private ConexionBDD conexion = new ConexionBDD();

    // Crear persona
    @PostMapping("/registro")
    public ResponseEntity<String> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            // Suponiendo que el método registrar devuelve un ID mayor a 0 si el registro fue exitoso
            int resultado = usuario.registrar(conexion);
            if (resultado > 0) {
                return ResponseEntity.ok("Registro exitoso");
            } else {
                return ResponseEntity.status(400).body("Error en el registro");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno del servidor: " + e.getMessage());
        }
    }

    @PostMapping("/iniciosesion")
    public ResponseEntity<String> iniciarSesion(@RequestBody Usuario usuario) {
        try {
            String email = usuario.getEmail();
            String password = usuario.getPassword(); 
            int resultado = usuario.iniciarSesion(conexion, email, password);
            if (resultado > 0) {
                return ResponseEntity.ok("Inicio de sesión exitoso");
            } else {
                return ResponseEntity.status(400).body("Credenciales incorrectas");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno del servidor: " + e.getMessage());
        }
    }
}
