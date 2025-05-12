/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author PC
 */
public class AgregarUsuarios {
    @JsonProperty("UsuarioID")
    int UsuarioID;
    @JsonProperty("OtroID")
    int OtroID;
    @JsonProperty("permiso")
    boolean permiso;
    @JsonProperty("email")
    String Email;
        
    public AgregarUsuarios(int usuarioID, int tareaID){
        this.UsuarioID=usuarioID;
        this.OtroID=tareaID;
    }
    public AgregarUsuarios(){
    }
    public AgregarUsuarios(int UsuarioID, int OtroID, boolean permiso, String Email){
        this.UsuarioID=UsuarioID;
        this.OtroID=OtroID;
        this.permiso=permiso;
        this.Email=Email;
    }
    public void AgregarRolUsuario(ConexionBDD conexion, String Email, int ProyectoID, boolean permiso) {
        Connection conn = null;
        try {
            conn = conexion.Conectar();
            // Buscar UsuarioID
            String consulta = "CALL `railway`.`UsuarioID_Del_ID`(?);";
            PreparedStatement ps = conn.prepareStatement(consulta);
            ps.setString(1, Email.trim().toLowerCase());
            System.out.println("Email que estoy buscando: [" + Email.trim().toLowerCase() + "]");
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                UsuarioID = rs.getInt("UsuarioID");
            } else {
                return;
            }

            // Llamar al stored procedure correctamente
            String insertRol = "CALL railway.insertar_rol_proyecto(?,?,?)";
            ps = conn.prepareStatement(insertRol);
            ps.setInt(1, ProyectoID);   
            ps.setInt(2, UsuarioID);    
            ps.setBoolean(3, permiso); 
            ps.execute();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            conexion.Desconectar();
        }
    }
    
    public void AgregarTareaUsuario(ConexionBDD conexion){
        try{
            String consulta = "CALL `railway`.`insertar_tarea_usuario`(?,?);";
            
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, UsuarioID);
            ps.setInt(2, OtroID);
            ResultSet rs = ps.executeQuery();
        }catch(Exception e){
            System.out.println(e);
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
    }

    public int getUsuarioID() {
        return UsuarioID;
    }

    public void setUsuarioID(int UsuarioID) {
        this.UsuarioID = UsuarioID;
    }

    public int getOtroID() {
        return OtroID;
    }

    public void setOtroID(int OtroID) {
        this.OtroID = OtroID;
    }

    public boolean isPermiso() {
        return permiso;
    }

    public void setPermiso(boolean permiso) {
        this.permiso = permiso;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String Email) {
        this.Email = Email;
    }
    
}
