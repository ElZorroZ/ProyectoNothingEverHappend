/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Date;
/**
 *
 * @author PC
 */
public class Tarea {
    @JsonProperty("ProyectoID")
    int ProyectoID;
    @JsonProperty("Nombre")
    String Nombre;
    @JsonProperty("Descripcion")
    String Descripcion;
    @JsonProperty("Proridad")
    int Prioridad;
    @JsonProperty("Estado")
    String Estado;
    @JsonProperty("Vencimiento")
    Date Vencimiento;
    public Tarea(int ProyectoID, String Nombre, String Descripcion, int Prioridad, String Estado, Date Vencimiento){
        this.ProyectoID=ProyectoID;
        this.Nombre=Nombre;
        this.Descripcion=Descripcion;
        this.Prioridad=Prioridad;
        this.Estado=Estado;
        this.Vencimiento=Vencimiento;
    }
    public void Crear(ConexionBDD conexion, int ProyectoID, String Nombre, String Descripcion, int Prioridad, String Estado, Date Vencimiento){

        try{
            String consulta = " CALL `railway`.`CrearTarea`(?,?,?,?,?,?);";
            
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, ProyectoID);
            ps.setString(2, Nombre);
            ps.setString(3, Descripcion);
            ps.setInt(4, Prioridad);
            ps.setString(5, Estado);
            ps.setDate(6, (java.sql.Date) Vencimiento);
            ResultSet rs = ps.executeQuery();
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
    }
    
    public void Cambiar_Estado(ConexionBDD conexion,String Estado){
        
    }
}
