/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.io.InputStream;
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
    private InputStream Archivo;
    
    public Comentario(int comentID, String nombre, String ape, String coment, Date fecha, InputStream file){
        this.ComentarioID=comentID;
        this.NombreUsuario=nombre;
        this.ApellidoUsuario=ape;
        this.Contenido=coment;
        this.Fecha=fecha;
        this.Archivo=file;
    }
    public Comentario(int tareaID, int usuID, String coment, InputStream file){
        this.TareaID=tareaID;
        this.UsuarioID=usuID;
        this.Contenido=coment;
        this.Archivo=file;
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
    public InputStream getArchivo(){
        return Archivo;
    }
}
