/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Usuario {
    private int ID;
    private String nombre;
    private String apellido;
    private String email;
    private String password; 

    // Constructor vacío
    public Usuario() {
    }

    // Constructor con parámetros
    public Usuario(String _mail, String _password, String _nom, String _ape) {
        this.apellido = _ape;
        this.nombre = _nom;
        this.email = _mail;
        this.password = hashearContraseña(_password);
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
        int id = 0;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            String consulta = "SELECT registrarUsuario(?,?,?,?) AS retorno;";
            ps = conexion.Conectar().prepareStatement(consulta);
            ps.setString(1, email);
            ps.setString(2, password);  
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

            // Sentencia SQL para verificar el inicio de sesión
            String sql = "SELECT verificarInicioSesion(?, ?);";
            stmt = var.prepareStatement(sql);
            stmt.setString(1, email);
            stmt.setString(2, password);

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