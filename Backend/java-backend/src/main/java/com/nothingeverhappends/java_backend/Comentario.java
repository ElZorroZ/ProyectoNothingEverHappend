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
import org.springframework.web.multipart.MultipartFile;

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
    private String NombreArchivo;
    private String Base64;
    
    
    public Comentario(int id){
        this.ComentarioID=id;
    }
    public Comentario(int comentID, String nombre, String ape, String coment, Date fecha, byte[] file, String nombre_f){
        this.ComentarioID=comentID;
        this.NombreUsuario=nombre;
        this.ApellidoUsuario=ape;
        this.Contenido=coment;
        this.Fecha=fecha;
        this.Archivo=file;
        this.NombreArchivo = nombre_f;
    }
    public Comentario(int tareaID, int usuID, String coment, byte[] file, String nombre_f){
        this.TareaID=tareaID;
        this.UsuarioID=usuID;
        this.Contenido=coment;
        this.Archivo = file;
        this.NombreArchivo = nombre_f;
    }
    
    public void comentarTarea(ConexionBDD conexion){
        try{
            String consulta = "CALL `railway`.`InsertarComentario`(?,?,?,?,?)";
            
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setString(1, Contenido);
            ps.setInt(2, TareaID);
            ps.setInt(3, UsuarioID);
            ps.setBytes(4, Archivo);
            ps.setString(5, NombreArchivo);
            ResultSet rs = ps.executeQuery();
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
    }
    
    public static Comentario conseguirArchivo(ConexionBDD conexion, int comentarioID){
        Comentario archivo = new Comentario(comentarioID);
        try{
            String consulta = "SELECT Archivo, Nombre FROM Archivo WHERE ComentarioID=?";   
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, comentarioID);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                archivo.setArchivo(rs.getBytes("Archivo"));
                archivo.setNombreArchivo(rs.getString("Nombre"));
            }
        }catch(Exception e) {
            e.printStackTrace();
        } finally { conexion.Desconectar(); }
        return archivo;  
    }
    
    public void setID(int id){
        this.ComentarioID=id;
    }
    public int getID(){
        return ComentarioID;
    }
    public void setTareaID(int Tid){
        this.TareaID=Tid;
    }
    public int getTareaID(){
        return TareaID;
    }
    public void setUsuarioID(int Uid){
        this.UsuarioID=Uid;
    }
    public int getUsuarioID(){
        return UsuarioID;
    }
    public void setContenido(String con){
        this.Contenido=con;
    }
    public String getContenido(){
        return Contenido;
    }
    public void setFecha(Date fech){
        this.Fecha=fech;
    }
    public Date getFecha(){
        return Fecha;
    }
    public void setArchivo(byte[] file){
        this.Archivo=file;
    }
    public byte[] getArchivo(){
        return Archivo;
    }
    public void setNombreArchivo(String nom){
        this.NombreArchivo=nom;
    }
    public String getNombreArchivo(){
        return NombreArchivo;
    }
    public void setBase64(String base){
        this.Base64=base;
    }
    public String getBase64(){
        return Base64;
    }
    public void setApellidoUsaurio(String ape){ this.ApellidoUsuario=ape; }
    public String getApellidoUsuario(){ return ApellidoUsuario; }
    public void setNombreUsaurio(String nom){ this.NombreUsuario=nom; }
    public String getNombreUsuario(){ return NombreUsuario; }
}
