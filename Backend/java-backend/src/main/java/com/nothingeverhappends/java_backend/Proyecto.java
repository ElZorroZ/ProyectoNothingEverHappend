/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;

public class Proyecto {
    private int ProyectoID;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date FechaInicio;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date FechaFinal;

    private String Descripcion;
    private String Nombre;
    private boolean Permisos;

    public Proyecto(int id, String nombre, String descripcion, Date inicio, Date fin, boolean permiso) {
        this.ProyectoID = id;
        this.Nombre = nombre;
        this.Descripcion = descripcion;
        this.FechaInicio = inicio;
        this.FechaFinal = fin;
        this.Permisos = permiso;
    }

    public void Crear(ConexionBDD conexion){
        String sql = "INSERT INTO railway.Proyecto (Nombre,Fecha_de_inicio,Fecha_de_final,Descripcion) VALUES (?,?,?,?)";

        Connection conn = conexion.Conectar();

        try (PreparedStatement pst = conn.prepareStatement(sql)) {

            java.sql.Date FechaIniciosql = new java.sql.Date(FechaInicio.getTime());
            java.sql.Date FechaFinsql = new java.sql.Date(FechaFinal.getTime());
            
            pst.setString(1, Nombre);
            pst.setDate(2, FechaIniciosql);
            pst.setDate(3, FechaFinsql);
            pst.setString(4, Descripcion);

            int filasAfectadas = pst.executeUpdate();

            if (filasAfectadas > 0) {
                System.out.println("Proyecto creado");
            } else {
                System.out.println("Error");
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
            System.out.println("Error en la base de datos");
        }
        finally{ conexion.Desconectar(); }
    }

    // Getters y setters

    public int getProyectoID() { return ProyectoID; }
    public void setProyectoID(int ProyectoID) { this.ProyectoID = ProyectoID; }

    public Date getFechaInicio() { return FechaInicio; }
    public void setFechaInicio(Date FechaInicio) { this.FechaInicio = FechaInicio; }

    public Date getFechaFinal() { return FechaFinal; }
    public void setFechaFinal(Date FechaFinal) { this.FechaFinal = FechaFinal; }

    public String getDescripcion() { return Descripcion; }
    public void setDescripcion(String Descripcion) { this.Descripcion = Descripcion; }

    public String getNombre() { return Nombre; }
    public void setNombre(String Nombre) { this.Nombre = Nombre; }

    public boolean isPermisos() { return Permisos; }
    public void setPermisos(boolean Permisos) { this.Permisos = Permisos; }
}
