/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.io.InputStream;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Base64;
import java.util.Date;

/**
 *
 * @author Agustín Salinas
 */
public class Comentario {
    private int ComentarioID;
    private int TareaID;
    private int UsuarioID;
    private String NombreUsuario;
    private String ApellidoUsuario;
    private String Contenido;
    private Date Fecha;
    private byte[] Archivo;
    
    public Comentario(int comentID, String nombre, String ape, String coment, Date fecha, byte[] file){
        this.ComentarioID=comentID;
        this.NombreUsuario=nombre;
        this.ApellidoUsuario=ape;
        this.Contenido=coment;
        this.Fecha=fecha;
        this.Archivo=file;
    }
    public Comentario(int tareaID, int usuID, String coment, String file){
        this.TareaID=tareaID;
        this.UsuarioID=usuID;
        this.Contenido=coment;
        this.Archivo = (file != null) ? Base64.getDecoder().decode(file) : null;
    }
    
    public void comentarTarea(ConexionBDD conexion){
        try{
            String consulta = "CALL `railway`.`InsertarComentario`(?,?,?,?)";
            
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setString(1, Contenido);
            ps.setInt(2, TareaID);
            ps.setInt(3, UsuarioID);
            ps.setBytes(4, Archivo);
            ResultSet rs = ps.executeQuery();
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
    }
    
    public void setID(int id){
        this.ComentarioID=id;
    }
    public int getID(){
        return ComentarioID;
    }
    public int getTareaID(){
        return TareaID;
    }
    public int getUsuarioID(){
        return UsuarioID;
    }
    public String Contenido(){
        return Contenido;
    }
    public Date getFecha(){
        return Fecha;
    }
    public byte[] getArchivo(){
        return Archivo;
    }
}
