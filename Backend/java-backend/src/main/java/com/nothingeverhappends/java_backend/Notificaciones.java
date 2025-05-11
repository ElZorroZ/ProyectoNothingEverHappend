/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDateTime;
import java.util.Date;

/**
 *
 * @author PC
 */
public class Notificaciones {
    private int UsuarioID;
    private int TareaID;
    private int NotificacionID;
    private String Titulo;
    private String Mensaje;
    
    private LocalDateTime Fecha;
    private boolean Leido;
            
    public Notificaciones(int UsuarioID, int TareaID){
        this.UsuarioID=UsuarioID;
        this.TareaID=TareaID;
    }

    public Notificaciones(int NotificacionID, int UsuarioID, int TareaID, String Titulo, String Mensaje, LocalDateTime Fecha, boolean Leido){
        this.NotificacionID=NotificacionID;
        this.UsuarioID=UsuarioID;
        this.TareaID=TareaID;
        this.Titulo=Titulo;
        this.Mensaje=Mensaje;
        this.Fecha=Fecha;
        this.Leido=Leido;
    }
    
    public static Notificaciones NotificacionUsuarioRol(ConexionBDD conexion, int UsuarioID, int ProyectoID, boolean permiso){
        Notificaciones note = new Notificaciones(UsuarioID, ProyectoID);
        try {
            Connection conn = conexion.Conectar();
            // Llamar al stored procedure correctamente
            String consulta = "CALL `railway`.`NotificacionUsuarioRol`(?,?,?)";
            PreparedStatement ps = conn.prepareStatement(consulta);
            ps.setInt(1, ProyectoID);   
            ps.setInt(2, UsuarioID);
            ps.setBoolean(3, permiso);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                note.NotificacionID = rs.getInt("NotificacionID");
                note.Titulo = rs.getString("Titulo");
                note.Mensaje = rs.getString("Mensaje");
                note.Fecha = rs.getTimestamp("Fecha").toLocalDateTime();
                note.Leido = rs.getBoolean("Leido");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            conexion.Desconectar();
        }
        return note;
    }
    
    public static Notificaciones NotificacionUsuarioTarea(ConexionBDD conexion, int UsuarioID, int TareaID){
        Notificaciones note = new Notificaciones(UsuarioID, TareaID);
        try {
            Connection conn = conexion.Conectar();
            // Llamar al stored procedure correctamente
            String consulta = "CALL `railway`.`NotificacionUsuarioTarea`(?,?)";
            PreparedStatement ps = conn.prepareStatement(consulta);
            ps.setInt(1, TareaID);   
            ps.setInt(2, UsuarioID);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                note.NotificacionID = rs.getInt("NotificacionID");
                note.Titulo = rs.getString("Titulo");
                note.Mensaje = rs.getString("Mensaje");
                note.Fecha = rs.getTimestamp("Fecha").toLocalDateTime();
                note.Leido = rs.getBoolean("Leido");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            conexion.Desconectar();
        }
        return note;
    }
    
    public int getNotificacionID() { return NotificacionID; }
    public int getUsuarioID() { return UsuarioID; }
    public int getTareaID() { return TareaID; }
    public String getTitulo() { return Titulo; }
    public String getMensaje() { return Mensaje; }
    public LocalDateTime getFecha() { return Fecha; }
    public boolean isLeido() { return Leido; }
}
