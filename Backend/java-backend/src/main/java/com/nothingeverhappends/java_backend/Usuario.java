/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import org.apache.pdfbox.pdmodel.PDDocument;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

public class Usuario {
    private int ID;
    private String nombre;
    private String apellido;
    private String email;
    private String password; 
    private String password2;

    // Constructor con solo id
    public Usuario(int id) {
        this.ID=id;
    }
    public Usuario(int id, String Nombre, String Apellido) {
        this.ID=id;
        this.nombre=Nombre;
        this.apellido=Apellido;
    }
    public Usuario() {
    // Constructor vacío requerido por Jackson
    }

    // Constructor con parámetros
    public Usuario(String _mail, String _password, String _nom, String _ape) {
        this.apellido = _ape;
        this.nombre = _nom;
        this.email = _mail; 
    }
    
    
    // CIFRAR LA CONTRASEÑA
    
    private String hashearContraseña(String contraseña) {

        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256"); //OBJETO QUE USA ALGORITMO SHA-256
            byte[] hashBytes = md.digest(contraseña.getBytes()); // SE TRANSFORMA EN UN ARRAY DE BYTES

            // CONVIERTE BYTE X BYTE A TEXTO HEXADECIMAL
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    // Método para registrar usuario
    public int registrar(ConexionBDD conexion) {
        
        System.out.println("Contraseña: " + password);
        
        password2 = hashearContraseña(password);
        
        System.out.println("Contraseña cifrada: " + password2);
        
        int id = 0;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            String consulta = "SELECT registrarUsuario(?,?,?,?) AS retorno;";
            ps = conexion.Conectar().prepareStatement(consulta);
            ps.setString(1, email);
            ps.setString(2, password2);  
            ps.setString(3, nombre);
            ps.setString(4, apellido);
            rs = ps.executeQuery();
            if (rs.next()) {
                id = rs.getInt("retorno");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (ps != null) ps.close();
                conexion.Desconectar();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return id;
    }

    public int iniciarSesion(ConexionBDD conexion, String email, String password) {
        int resultado = 0;  // Asume 0 por defecto como fallo
        ResultSet rs = null;
        PreparedStatement stmt = null;

        try {
            // Establecer la conexión a la base de datos
            Connection var = conexion.Conectar();
            
            password2 = hashearContraseña(password);
            // Sentencia SQL para verificar el inicio de sesión
            String sql = "SELECT verificarInicioSesion(?, ?);";
            stmt = var.prepareStatement(sql);
            stmt.setString(1, email);
            stmt.setString(2, password2);

            // Ejecutar la consulta
            rs = stmt.executeQuery();

            // Verificar si la consulta devolvió algún resultado
            if (rs.next()) {
                resultado = rs.getInt(1);  // Resultado de la función SQL
                if (resultado != 0) {
                    ID = resultado;  // Asignar el ID del usuario si es válido
                }
            }
        } catch (SQLException e) {
            // Manejo de excepciones SQL
            e.printStackTrace();
        } finally {
            // Cerrar ResultSet, PreparedStatement y la conexión
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                conexion.Desconectar();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return resultado;  // Retorna 0 si falló (usuario no encontrado o contraseña incorrecta), ID si fue exitoso
    }

    public List<Proyecto> verProyectos(ConexionBDD conexion) {
        List<Proyecto> proyectos = new ArrayList<>();
        String sql = "SELECT p.ProyectoID, p.Nombre, p.Descripcion, p.Fecha_de_inicio, p.Fecha_de_final, rp.Permiso " +
                     "FROM Proyecto p " +
                     "INNER JOIN Rol_Proyecto rp ON p.ProyectoID = rp.ProyectoID " +
                     "WHERE rp.UsuarioID = ?";

        try (PreparedStatement stmt = conexion.Conectar().prepareStatement(sql)) {
            stmt.setInt(1, this.ID);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    int id = rs.getInt("ProyectoID");
                    String nombre = rs.getString("Nombre");
                    String descripcion = rs.getString("Descripcion");
                    Date fechaInicio = rs.getDate("Fecha_de_inicio");
                    Date fechaFin = rs.getDate("Fecha_de_final");
                    boolean permiso = rs.getBoolean("Permiso");

                    Proyecto proyecto = new Proyecto(id, nombre, descripcion, fechaInicio, fechaFin, permiso);
                    proyectos.add(proyecto);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally { conexion.Desconectar(); }

        return proyectos;
    }
    
    // --- Ver Tareas asignadar a un usuario --- // 
    public Map<String, Object> verTareas(ConexionBDD conexion, int ProyectoID) {
        List<Tarea> Tareas = new ArrayList<>();
        double porcentaje = 0.0; // Variable para almacenar el porcentaje
        String sql = "CALL `railway`.`obtener_tareas_usuario_proyecto`(?, ?);";

        Map<String, Object> resultado = new HashMap<>(); // Usamos un Map para devolver ambos datos

        try (PreparedStatement stmt = conexion.Conectar().prepareStatement(sql)) {
            stmt.setInt(1, this.ID);
            stmt.setInt(2, ProyectoID);

            boolean hasResults = stmt.execute();
            int paso = 0;

            while (hasResults) {
                try (ResultSet rs = stmt.getResultSet()) {
                    if (paso == 0) {
                        // Primer SELECT: obtener las tareas
                        while (rs.next()) {
                            int tareaid = rs.getInt("TareaID");
                            int proyectoid = rs.getInt("ProyectoID");
                            String nombreTarea = rs.getString("Nombre");
                            String descripcion = rs.getString("Descripcion");
                            int prioridad = rs.getInt("Prioridad");
                            int estado = rs.getInt("Estado");
                            Date vencimiento = rs.getDate("Vencimiento");

                            // Creamos el objeto Tarea
                            Tarea tarea = new Tarea(tareaid, proyectoid, nombreTarea, descripcion, prioridad, estado, vencimiento);
                            Tareas.add(tarea); // Guardamos la tarea en la lista
                        }
                    } else if (paso == 1) {
                        // Segundo SELECT: obtener el porcentaje
                        while (rs.next()) {
                            porcentaje = rs.getDouble("Porcentaje"); // Obtenemos el porcentaje
                        }
                    }
                }
                // Ir a la siguiente consulta
                hasResults = stmt.getMoreResults();
                paso++;
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            conexion.Desconectar();
        }

        // Almacenamos los resultados en el Map
        resultado.put("tareas", Tareas);  // La lista de tareas
        resultado.put("porcentaje", porcentaje);  // El porcentaje

        return resultado; // Devolvemos el Map con las tareas y el porcentaje
    }
    
    public List<Notificaciones> verNotificaciones(ConexionBDD conexion) {
        List<Notificaciones> notificaciones = new ArrayList<>();
        String sql = "SELECT NotificacionID, TareaID, Titulo, Mensaje, Fecha, Leido " +
                     "FROM Notificacion " +
                     "WHERE UsuarioID = ?";

        try (PreparedStatement stmt = conexion.Conectar().prepareStatement(sql)) {
            stmt.setInt(1, this.ID);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    int id = rs.getInt("NotificacionID");
                    int tarea = rs.getInt("TareaID");
                    String titulo = rs.getString("Titulo");
                    String mensaje = rs.getString("Mensaje");
                    LocalDateTime fecha = rs.getTimestamp("Fecha").toLocalDateTime();
                    boolean leido = rs.getBoolean("Leido");

                    Notificaciones not = new Notificaciones(id, ID, tarea, titulo, mensaje, fecha, leido);
                    notificaciones.add(not);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally { conexion.Desconectar(); }

        return notificaciones;
    }

    // Métodos Getter y Setter
    public int getID() {
        return ID;
    }

    public void setID(int id) {
        this.ID = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String ape) {
        this.apellido = ape;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String mail) {
        this.email = mail;
    }

    public String getPassword() {  
        return password;
    }

    public void setPassword(String password) {  
        this.password = password;
    }
}