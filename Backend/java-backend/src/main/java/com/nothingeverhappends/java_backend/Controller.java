/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.util.Date;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import org.springframework.http.HttpStatus;
import com.nothingeverhappends.java_backend.Tarea;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class Controller {

    private ConexionBDD conexion = new ConexionBDD();

    @PostMapping("/registro")
    public ResponseEntity<String> registrarUsuario(@RequestBody Usuario usuario) {
        try {
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
    public ResponseEntity<?> iniciarSesion(@RequestBody Usuario usuario) {
        try {
            String email = usuario.getEmail();
            String password = usuario.getPassword();
            int resultado = usuario.iniciarSesion(conexion, email, password);
            if (resultado > 0) {
                int id = usuario.getID(); 
                return ResponseEntity.ok().body(Map.of(
                    "mensaje", "Inicio de sesión exitoso",
                    "id", id
                ));
            } else {
                return ResponseEntity.status(400).body(Map.of(
                    "mensaje", "Credenciales incorrectas"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "mensaje", "Error interno del servidor: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/crearproyecto")
    public void crearProyecto(@RequestBody Proyecto proyecto) {
        try {
            System.out.println("Nombre: " + proyecto.getNombre());
            System.out.println("FechaInicio: " + proyecto.getFechaInicio());
            System.out.println("FechaFinal: " + proyecto.getFechaFinal());
            System.out.println("Descripcion: " + proyecto.getDescripcion());
            System.out.println("id de usuario: " + proyecto.getId());

            proyecto.Crear(conexion);
        } catch (Exception e) {
            e.printStackTrace(); // <-- ¡Para ver si falla!
            System.out.println("Ocurrió un error en el controlador.");
        }
    }
    
    @GetMapping("/proyectos/{id}")
    public ResponseEntity<?> verProyectos(@PathVariable int id) {
        Usuario usuario = new Usuario();
        usuario.setID(id);

        List<Proyecto> proyectos = usuario.verProyectos(conexion);

        if (proyectos.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "mensaje", "No tienes ningún proyecto asignado."
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                "mensaje", "Proyectos obtenidos exitosamente.",
                "proyectos", proyectos
            ));
        }
    }
    
    @PostMapping("/agregarrolusuario")
    public ResponseEntity<String> AgregarRolUsuario(@RequestBody AgregarUsuarios agregarusuarios) {
        try {
            String Email = agregarusuarios.getEmail();
            int ProyectoID = agregarusuarios.getOtroID(); // Usar OtroID del objeto recibido
            boolean Permiso = agregarusuarios.isPermiso(); // Usar permiso del objeto recibido

            // Llama a la función con los valores correctos
            agregarusuarios.AgregarRolUsuario(conexion, Email, ProyectoID, Permiso);

            // Si todo está bien, devolver una respuesta exitosa
            return ResponseEntity.ok("Usuario agregado exitosamente");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Ocurrió un error en el controlador.");
            // Si hay un error, devolver una respuesta de error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Ocurrió un error al agregar el usuario");
        }
    }

    @PostMapping("/agregartareausuario")
    public void AgregarTareaUsuario(@RequestBody AgregarUsuarios agregarusuarios ){
        try {
            int UsuarioID = 0;
            int ProyectoID = 0;
            agregarusuarios.AgregarTareaUsuario(conexion, UsuarioID,ProyectoID);
        } catch (Exception e) {
            e.printStackTrace(); // <-- ¡Para ver si falla!
            System.out.println("Ocurrió un error en el controlador.");
        }
    }
    @PostMapping("/modificarprioridad/{Prioridad}/{TareaId}")
    public void Modificar_Prioridad(@PathVariable int Prioridad,@PathVariable int TareaId){
        try {
            Tarea tarea= new Tarea();
            tarea.ModificarPrioridad(conexion, Prioridad, TareaId);
            
        } catch (Exception e) {
            e.printStackTrace(); // <-- ¡Para ver si falla!
            System.out.println("Ocurrió un error en el controlador.");
        }
    }
    @PostMapping("/creartarea")
    public void crearTarea(@RequestBody Tarea tarea) {
        try {
            tarea.Crear(conexion);
        } catch (Exception e) {
            e.printStackTrace(); // <-- ¡Para ver si falla!
            System.out.println("Ocurrió un error en el controlador.");
        }
    }

}
