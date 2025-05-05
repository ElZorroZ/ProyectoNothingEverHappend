/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 *
 * @author PC
 */
public class Notificaciones {
    int UsuarioID;
    int TareaID;
    public Notificaciones(int UsuarioID, int TareaID){
        this.UsuarioID=UsuarioID;
        this.TareaID=TareaID;
    }
    

    public static void NotificacionUsuarioTarea(ConexionBDD conexion, int UsuarioID, int TareaID){
        Connection conn = null;
        String TareaNombre;
        String ProyNombre;
        int ProyectoID;
        try {
            conn = conexion.Conectar();
            // Buscar nombre de la tarea
            String consulta = "SELECT Nombre,ProyectoID FROM Tarea WHERE TareaID = ?";
            PreparedStatement ps = conn.prepareStatement(consulta);
            ps.setInt(1,TareaID);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                TareaNombre = rs.getString("Nombre");
                ProyectoID=rs.getInt("ProyectoID");
            } else {
                return;
            }
            String consulta2 = "SELECT Nombre FROM Proyecto WHERE ProyectoID = ?";
            ps = conn.prepareStatement(consulta);
            ps.setInt(1,ProyectoID);
            rs = ps.executeQuery();

            if (rs.next()) {
                ProyNombre = rs.getString("Nombre");
            } else {
                return;
            }

            // Llamar al stored procedure correctamente
            String insertRol = "CALL `railway`.`NotificacionUsuarioTarea`(?,?,?,?)";
            ps = conn.prepareStatement(insertRol);
            ps.setInt(1, TareaID);   
            ps.setInt(2, UsuarioID);  
            String nombre="Ha sido asignado a una nueva tarea";
            String Mensaje="Ha sido asignado a la tarea "+TareaNombre+" en el proyecto"+ProyNombre;
            ps.setString(3, nombre); 
            ps.execute();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            conexion.Desconectar();
        }
    }
}
