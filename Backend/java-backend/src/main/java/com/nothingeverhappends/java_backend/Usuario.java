/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.*;

/**
 *
 * @author Agustín Salinas
 */
public class Usuario {
    private int ID;
    private String nombre;
    private String apellido;
    private String email;
    private String contraseña;
    
    public Usuario(String _mail, String _contra, String _nom, String _ape){
        this.apellido = _ape;
        this.nombre = _nom;
        this.email = _mail;
        this.contraseña = _contra;
    }
    
    public int registrar(ConexionBDD conexion){
        int id = 0;
        try{
            String consulta = "SELECT registrarUsuario(?,?,?,?) AS retorno;";
            
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setString(1, email);
            ps.setString(2, contraseña);
            ps.setString(3, nombre);
            ps.setString(4, apellido);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                id = rs.getInt("retorno");
            }
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
        return id;
    }
    
    public int iniciarSesion(ConexionBDD conexion,String Email, String Contraseña){
        try{
            Connection var=conexion.Conectar();
            
            String sql = "SELECT verificarInicioSesion(?,?);";
            PreparedStatement stmt = var.prepareStatement(sql);
            stmt.setString(1, Email);
            stmt.setString(1, Contraseña);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                ID = rs.getInt("ID");
                
            }
        
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
        return ID;
    }
    
    public int getID(){
        return ID;
    }
    public void setID(int id){
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
   
    public String getContraseña() {
        return contraseña;
    }
    public void setContraseña(String contra) {
        this.contraseña = contra;
    }
}
