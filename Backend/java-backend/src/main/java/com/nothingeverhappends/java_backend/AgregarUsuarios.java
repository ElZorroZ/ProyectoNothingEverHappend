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
    public void AgregarRolUsuario(ConexionBDD conexion, int UsuarioID,int OtroID, boolean permiso){
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
