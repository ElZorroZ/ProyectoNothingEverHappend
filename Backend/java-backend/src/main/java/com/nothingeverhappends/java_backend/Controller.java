/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
import com.nothingeverhappends.java_backend.ConexionBDD;
import com.nothingeverhappends.java_backend.Usuario;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class Controller{
    private ConexionBDD conexion = new ConexionBDD();
    
    // Crear persona
    @PostMapping("/registro")
    public int registrarUsuario(@RequestBody Usuario usuario) {
        
        return usuario.registrar(conexion);
    }
   
    @PostMapping("/iniciosesion")
    public int iniciarSesion(@RequestBody Usuario usuario) {
        String Email= usuario.getEmail();
        String Contraseña= usuario.getContraseña();
        return usuario.iniciarSesion(conexion,Email,Contraseña);
    }

}
