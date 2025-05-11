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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class Controller {

    private ConexionBDD conexion = new ConexionBDD();
    
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            int resultado = usuario.registrar(conexion);
            if (resultado > 0) {
                return ResponseEntity.ok().body(Map.of(
                    "mensaje", "Registro exitoso",
                    "id", resultado
                ));
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
        Usuario usuario = new Usuario(id);

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
    // --- Ver Tareas asignadas a un usuario --- //
    @GetMapping("/tareas/{UsuarioID}/{ProyectoID}")
    public ResponseEntity<?> verTareas(@PathVariable int UsuarioID,  @PathVariable int ProyectoID) {
        Usuario usuario = new Usuario(UsuarioID);

        Map<String, Object>  Tareas = usuario.verTareas(conexion, ProyectoID);

        if (Tareas.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "mensaje", "No tienes ningúna tarea asignada."
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                "mensaje", "Tareas obtenidas exitosamente.",
                "Tareas", Tareas
            ));
        }
    }
    
    @GetMapping("/tareas/archivo/{TareaID}")
    public ResponseEntity<byte[]> verArchivosTarea(@PathVariable int TareaID) {
        Tarea tar = new Tarea(TareaID);
        List<Object> archivos = tar.ConseguirArchivo(conexion, TareaID);

        if (archivos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            // Suponiendo que hay solo un archivo por tarea
            byte[] archivo = ((Tarea) archivos.get(0)).getFile_archivo();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.attachment()
                .filename("tarea" + TareaID + ".pdf").build());

            return new ResponseEntity<>(archivo, headers, HttpStatus.OK);
        }
    }    
    @GetMapping("/usuariosProyectoTarea/{ProyectoID}/{TareaID}")
    public ResponseEntity<?> verUsuarios(@PathVariable int ProyectoID, @PathVariable int TareaID) {
        Proyecto proyecto = new Proyecto(ProyectoID);

        List<Usuario> Usuarios = proyecto.verUsuarios(conexion, TareaID);

        if (Usuarios.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "mensaje", "No tienes ningún usuario en el proyecto."
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                "mensaje", "Usuarios del proyecto obtenidos exitosamente.",
                "usuarios", Usuarios
            ));
        }
    }
    
    @GetMapping("/notificaciones/{id}")
    public ResponseEntity<?> verNotificaciones(@PathVariable int id) {
        Usuario usuario = new Usuario(id);

        List<Notificaciones> nots = usuario.verNotificaciones(conexion);

        if (nots.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "mensaje", "No tienes ninguna notificación."
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                "mensaje", "Notificaciones obtenidas exitosamente.",
                "notificaciones", nots
            ));
        }
    }
    
    @PostMapping("/agregarrolusuario")
    public ResponseEntity<String> AgregarRolUsuario(@RequestBody AgregarUsuarios agregarusuarios) {
        try {
            int UsuarioID = agregarusuarios.getUsuarioID();
            String Email = agregarusuarios.getEmail();
            int ProyectoID = agregarusuarios.getOtroID(); // Usar OtroID del objeto recibido
            boolean Permiso = agregarusuarios.isPermiso(); // Usar permiso del objeto recibido

            // Llama a la función con los valores correctos
            agregarusuarios.AgregarRolUsuario(conexion, UsuarioID, Email, ProyectoID, Permiso);
            notificationService.notificar(UsuarioID, Notificaciones.NotificacionUsuarioRol(conexion, UsuarioID, ProyectoID, Permiso));

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
            int UsuarioID = agregarusuarios.getUsuarioID();
            int TareaID = agregarusuarios.getOtroID();
            
            agregarusuarios.AgregarTareaUsuario(conexion);
            notificationService.notificar(UsuarioID, Notificaciones.NotificacionUsuarioTarea(conexion,  UsuarioID,  TareaID));
        } catch (Exception e) {
            e.printStackTrace(); // <-- ¡Para ver si falla!
            System.out.println("Ocurrió un error en el controlador.");
        }
    }
    @PostMapping("/modificarprioridad/{Prioridad}/{TareaId}")
    public void Modificar_Prioridad(@PathVariable int Prioridad,@PathVariable int TareaId){
        try {
            Tarea tarea= new Tarea(TareaId);
            tarea.ModificarPrioridad(conexion, Prioridad, TareaId);
            
        } catch (Exception e) {
            e.printStackTrace(); // <-- ¡Para ver si falla!
            System.out.println("Ocurrió un error en el controlador.");
        }
    }
    
    @PostMapping("/modificarestado/{Estado}/{TareaId}")
    public void Modificar_Estado(@PathVariable int Estado,@PathVariable int TareaId){
        try {
            Tarea tarea= new Tarea(TareaId);
            tarea.ModificarEstado(conexion, Estado, TareaId);
            
        } catch (Exception e) {
            e.printStackTrace(); // <-- ¡Para ver si falla!
            System.out.println("Ocurrió un error en el controlador.");
        }
    }    
    
    @PostMapping(value = "/creartarea", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void crearTarea(
        @RequestParam("TareaID") int TareID,
        @RequestParam("ProyectoID") int ProyectoID,
        @RequestParam("Nombre") String Nombre,
        @RequestParam("Descripcion") String Descripcion,
        @RequestParam("Prioridad") int Prioridad,
        @RequestParam("Estado") int Estado,
        @RequestParam("Vencimiento") @DateTimeFormat(pattern = "yyyy-MM-dd") Date Vencimiento,
        @RequestParam(value = "Archivo", required = false) MultipartFile archivoPDF
        
    ) {
        try {
            
            Tarea tarea = new Tarea(TareID,ProyectoID, Nombre, Descripcion, Prioridad, Estado, Vencimiento,archivoPDF);
            tarea.Crear(conexion);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Ocurrió un error en el controlador.");
        }
    }

    @PostMapping("/comentar")
    public ResponseEntity<String> guardarComentario(@RequestBody Comentario comentario) {
        try {
            comentario.comentarTarea(conexion);

            return ResponseEntity.ok("Comentario con/sin archivo guardado.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al guardar comentario.");
        }
    }
    
    @GetMapping("/comentarios/{tareaID}")
    public ResponseEntity<?> getComentarios(@PathVariable int tareaID) {
        Tarea tarea = new Tarea(tareaID);
        List<Comentario> comentarios =tarea.obtenerComentarios(conexion);

        if (comentarios.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "mensaje", "Esta tarea aún no tiene comentarios."
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                "mensaje", "Comentarios obtenidos exitosamente.",
                "comentarios", comentarios
            ));
        }
    }
}
