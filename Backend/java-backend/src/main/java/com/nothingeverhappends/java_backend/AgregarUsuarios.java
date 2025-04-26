/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

/**
 *
 * @author PC
 */
public class AgregarUsuarios {
    int UsuarioID;
    int OtroID;
    boolean permiso;
    String Email;
    public AgregarUsuarios(int UsuarioID, int OtroID, boolean permiso, String Email){
        this.UsuarioID=UsuarioID;
        this.OtroID=OtroID;
        this.permiso=permiso;
        this.Email=Email;
    }
    public void AgregarRolUsuario(ConexionBDD conexion, String Email,int OtroID, boolean permiso){
        int resultado=0;
        int UsuarioID=0;
        try{
            String consulta = "SELECT FROM Usuario UsuarioID WHERE Email = ?";
            
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setString(1, Email);
            ps.setInt(2, OtroID);
            ps.setBoolean(3, permiso);
            ResultSet rs = ps.executeQuery();

            // Verificar si la consulta devolvió algún resultado
            if (rs.next()) {
                resultado = rs.getInt(1);  // Resultado de la función SQL
                if (resultado != 0) {
                    UsuarioID = resultado;  // Asignar el ID del usuario si es válido
                }
            }
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
        try{
            String consulta = "CALL `railway`.`insertar_rol_proyecto`(?,?,?);";
            
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, UsuarioID);
            ps.setInt(2, OtroID);
            ps.setBoolean(3, permiso);
            ResultSet rs = ps.executeQuery();
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
    }
    public void AgregarTareaUsuario(ConexionBDD conexion, int UsuarioID, int OtroID){
        try{
            String consulta = "CALL `railway`.`insertar_tarea_usuario`(?,?);";
            
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, UsuarioID);
            ps.setInt(2, OtroID);
            ResultSet rs = ps.executeQuery();
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
    }
    
}
