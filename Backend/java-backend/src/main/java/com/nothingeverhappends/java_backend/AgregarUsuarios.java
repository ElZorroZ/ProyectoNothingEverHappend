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
    private int UsuarioID;
    private int OtroID;
    private boolean permiso;
    public AgregarUsuarios(int UsuarioID, int OtroID, boolean permiso){
    this.UsuarioID=UsuarioID;
    this.OtroID=OtroID;
    this.permiso=permiso;
}
    public void ExtaerDatos (ArrayList Datos){
        UsuarioID = (int) Datos.get(0);
        OtroID = (int) Datos.get(1);
        if (Datos.size()==3){
            permiso = (boolean) Datos.get(2);
        }
    }
    
    public void AgregarRolUsuario (ArrayList Datos){
        ExtaerDatos (Datos);
    }
    public void AgregarTareaUsuario (ArrayList Datos){
        ExtaerDatos (Datos);
        
    }
    public void InsertarRolUsuario(ConexionBDD conexion){
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
    public void InsertarTareaUsuario(ConexionBDD conexion){
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
