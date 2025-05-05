/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.util.Date;

/**
 *
 * @author Agustín Salinas
 */
public class Comentario {
    private int ComentarioID;
    private int TareaID;
    private int UsuarioID;
    private String Contenido;
    private Date Fecha;
    
    public Comentario(int comentID, int tareaID, int usuID, String coment, Date fecha){
        this.ComentarioID=comentID;
        this.TareaID=tareaID;
        this.UsuarioID=usuID;
        this.Contenido=coment;
        this.Fecha=fecha;
    }
    public Comentario(int tareaID, int usuID, String coment){
        this.TareaID=tareaID;
        this.UsuarioID=usuID;
        this.Contenido=coment;
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
}
