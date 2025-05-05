/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonProperty("Prioridad")
    int Prioridad; //1 Es baja, 2 Media, 3 Alta
    @JsonProperty("Estado")
    String Estado;
    @JsonProperty("Vencimiento")
    Date Vencimiento;
    @JsonIgnore
    int TareaID;
    
    public Tarea(int ProyectoID, String Nombre, String Descripcion, int Prioridad, String Estado, Date Vencimiento){
        this.ProyectoID=ProyectoID;
        this.Nombre=Nombre;
        this.Descripcion=Descripcion;
        this.Prioridad=Prioridad;
        this.Estado=Estado;
        this.Vencimiento=Vencimiento;
    }
    
    public Tarea(){
    }
    public void Crear(ConexionBDD conexion){
        PreparedStatement ps;
        try{
            String consulta = " CALL `railway`.`CrearTarea`(?,?,?,?,?,?);";
            
            ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, ProyectoID);
            ps.setString(2, Nombre);
            ps.setString(3, Descripcion);
            ps.setInt(4, Prioridad);
            ps.setString(5, Estado);
            java.sql.Date Vencimientosql = new java.sql.Date(Vencimiento.getTime());
            ps.setDate(6, Vencimientosql);
            ResultSet rs = ps.executeQuery();
        }catch(Exception e){
            e.printStackTrace();
        }
        
        try{
            String consulta = " CALL `railway`.`CrearVencimientoTarea`(?,?);";
            
            ps = conexion.Conectar().prepareStatement(consulta);
            ps.setString(1, Nombre);
            java.sql.Date Vencimientosql = new java.sql.Date(Vencimiento.getTime());
            ps.setDate(2, Vencimientosql);
           
            ResultSet rs = ps.executeQuery();
            
        }catch(Exception e){
            e.printStackTrace();
        }
        finally{
            conexion.Desconectar();
        }
    }
    
    public void ModificarPrioridad(ConexionBDD conexion,int Prioridad,int TareaId){
        try{
            String consulta = " CALL `Cambiar_Estado`(?,?);";   
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, Prioridad);
            ps.setInt(2, TareaId);
            ResultSet rs = ps.executeQuery();
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
    }
}
