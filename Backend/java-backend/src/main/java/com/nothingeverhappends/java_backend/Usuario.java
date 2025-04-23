/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.sql.*;

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
        this.password = _password;  
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
        try {
            Connection var = conexion.Conectar();

            String sql = "SELECT verificarInicioSesion(?,?);";
            PreparedStatement stmt = var.prepareStatement(sql);
            stmt.setString(1, email);
            stmt.setString(2, password);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                ID = rs.getInt("ID");
                resultado = 1;  // Si la consulta tiene resultados, el inicio de sesión es exitoso.
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            conexion.Desconectar();
        }
        return resultado;  // Retorna 1 si fue exitoso, 0 si falló
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