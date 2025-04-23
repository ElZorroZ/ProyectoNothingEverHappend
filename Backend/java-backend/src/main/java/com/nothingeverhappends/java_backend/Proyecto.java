/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import java.util.Date;


/**
 *
 * @author Gaspar
 */
public class Proyecto {
    private int ProyectoID;
    private Date FechaInicio;
    private String Descripcion;
    private String Nombre;
    private Date FechaFinal;
    private int UsuarioID;
    private boolean Permisos;
    
    public void Crear(ConexionBDD conexion,String Nombre, String Descripcion, Date FechaInicio, Date FechaFin, int Usuario ){
        String sql = "INSERT INTO railway.Proyecto (Nombre,Fecha_de_inicio,Fecha_de_final,Descripcion) VALUES (?,?,?,?)";

        // Obtenemos la conexión
        Connection conn = conexion.Conectar();

        try (PreparedStatement pst = conn.prepareStatement(sql)) {

            java.sql.Date FechaIniciosql = new java.sql.Date(FechaInicio.getTime());
            java.sql.Date FechaFinsql = new java.sql.Date(FechaFin.getTime());
            
            pst.setString(1, Nombre);
            pst.setDate(2, FechaIniciosql);
            pst.setDate(3, FechaFinsql);
            pst.setString(4, Descripcion);


            // se ejecuta la consulta
            int filasAfectadas = pst.executeUpdate();

            if (filasAfectadas > 0) {
                System.out.println("Proyecto creado");
            } else {
                System.out.println("Error");
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
            System.out.println("Error en la base de datos");
        }
        conexion.Desconectar();
    }
}
    

