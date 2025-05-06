/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Proyecto {
    private int ProyectoID;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date FechaInicio;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date FechaFinal;

    private String Descripcion;
    private String Nombre;
    private boolean Permisos;
    private int id;
    
    public Proyecto() {}

    public Proyecto(int id, String nombre, String descripcion, Date inicio, Date fin, boolean permiso) {
        this.ProyectoID = id;
        this.Nombre = nombre;
        this.Descripcion = descripcion;
        this.FechaInicio = inicio;
        this.FechaFinal = fin;
        this.Permisos = permiso;
    }
    
    public Proyecto(int proyectoid){
        this.ProyectoID=proyectoid;
    }

    public void Crear(ConexionBDD conexion){ 

        Connection conn = conexion.Conectar();

        try (CallableStatement pst = conn.prepareCall("{ call Crear_Proyecto(?, ?, ?, ?, ?) }");) {

            java.sql.Date FechaIniciosql = new java.sql.Date(FechaInicio.getTime());
            java.sql.Date FechaFinsql = new java.sql.Date(FechaFinal.getTime());
            
            pst.setString(1, Nombre);
            pst.setDate(2, FechaIniciosql);
            pst.setDate(3, FechaFinsql);
            pst.setString(4, Descripcion);
            pst.registerOutParameter(5, Types.INTEGER);

            
            pst.execute();
            int id_proyecto = pst.getInt(5);

            if (id_proyecto > 0) {
                System.out.println("Proyecto creado");
                ProyectoID=id_proyecto;
            } else {
                System.out.println("Error");
            }
            

        } catch (SQLException ex) {
            ex.printStackTrace();
            System.out.println("Error en la base de datos");
        }
        
        try (CallableStatement pst2 = conn.prepareCall("{ call Agregar_Rol(?,?,?) }");){
            pst2.setInt(1, id);
            pst2.setInt(2, ProyectoID);
            pst2.setInt(3, 1);
            
            pst2.execute();
        
        } 
            
        catch (SQLException ex) {
            ex.printStackTrace();
            System.out.println("Error en la base de datos");
        }
        conexion.Desconectar();
    }
    
    public List<Usuario> verUsuarios(ConexionBDD conexion) {
        List<Usuario> Usuarios = new ArrayList<>();
        String sql = "CALL `railway`.`obtener_usuarios_proyecto`(?);";


        try (PreparedStatement stmt = conexion.Conectar().prepareStatement(sql)) {
            stmt.setInt(1, this.ProyectoID);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    int usuarioid = rs.getInt("UsuarioID");
                    /*
                    String nombre = rs.getString("Nombre");
                    String apellido = rs.getString("Apellido");
                    */

                    Usuario usuario = new Usuario(usuarioid);
                    Usuarios.add(usuario);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally { conexion.Desconectar(); }

        return Usuarios;
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

    public int getId() {return id;}

    public void setId(int id) {this.id = id;}
    
}
