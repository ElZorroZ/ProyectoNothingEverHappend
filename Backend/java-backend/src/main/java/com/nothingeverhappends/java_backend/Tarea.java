/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.mock.web.MockMultipartFile;
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
    int Estado;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @JsonProperty("Vencimiento")
    Date Vencimiento;
    @JsonProperty("Archivo")
    MultipartFile archivoPDF=null;
    @JsonProperty("TareaID")
    int TareaID;
    
    public Tarea(){
    }
    
    public Tarea(int TareaID){
        this.TareaID=TareaID;
    }
    
    public Tarea(int TareaID, MultipartFile archivoPDF){
        this.TareaID=TareaID;
        this.archivoPDF=archivoPDF;
    }
    
    public Tarea(int TareaID,int ProyectoID, String Nombre, String Descripcion, int Prioridad, int Estado, Date Vencimiento){
        this.TareaID=TareaID;
        this.ProyectoID=ProyectoID;
        this.Nombre=Nombre;
        this.Descripcion=Descripcion;
        this.Prioridad=Prioridad;
        this.Estado=Estado;
        this.Vencimiento=Vencimiento;
    }
    public Tarea(int TareaID,int ProyectoID, String Nombre, String Descripcion, int Prioridad, int Estado, Date Vencimiento,MultipartFile archivoPDF){
        this.TareaID=TareaID;
        this.ProyectoID=ProyectoID;
        this.Nombre=Nombre;
        this.Descripcion=Descripcion;
        this.Prioridad=Prioridad;
        this.Estado=Estado;
        this.Vencimiento=Vencimiento;
        this.archivoPDF=archivoPDF;
    }
    
    

    
    
    public void Crear(ConexionBDD conexion){
        
        PreparedStatement ps;
        if (archivoPDF==null){
            try{
                String consulta = " CALL `railway`.`CrearTarea`(?,?,?,?,?,?);";

                ps = conexion.Conectar().prepareStatement(consulta);
                ps.setInt(1, ProyectoID);
                ps.setString(2, Nombre);
                ps.setString(3, Descripcion);
                ps.setInt(4, Prioridad);
                ps.setInt(5, Estado);
                java.sql.Date Vencimientosql = new java.sql.Date(Vencimiento.getTime());
                ps.setDate(6, Vencimientosql);
                ResultSet rs = ps.executeQuery();
                
                if (rs.next()) {
                    TareaID = rs.getInt(1);  // el resultado del SELECT LAST_INSERT_ID()
                }

                rs.close();
                ps.close();
            }catch(Exception e){
                e.printStackTrace();
            }

            try{
                String consulta = " CALL `railway`.`CrearVencimientoTarea`(?,?,?);";

                ps = conexion.Conectar().prepareStatement(consulta);
                ps.setString(1, Nombre);
                ps.setInt(2, TareaID);
                java.sql.Date Vencimientosql = new java.sql.Date(Vencimiento.getTime());
                ps.setDate(3, Vencimientosql);

                ResultSet rs = ps.executeQuery();

            }catch(Exception e){
                e.printStackTrace();
            }
            finally{
                conexion.Desconectar();
            }
            
            
        }else{
            try{
                String consulta = " CALL `railway`.`CrearTarea`(?,?,?,?,?,?);";

                ps = conexion.Conectar().prepareStatement(consulta);
                ps.setInt(1, ProyectoID);
                ps.setString(2, Nombre);
                ps.setString(3, Descripcion);
                ps.setInt(4, Prioridad);
                ps.setInt(5, Estado);
                java.sql.Date Vencimientosql = new java.sql.Date(Vencimiento.getTime());
                ps.setDate(6, Vencimientosql);
                ResultSet rs = ps.executeQuery();
                
                if (rs.next()) {
                    TareaID = rs.getInt(1);  // el resultado del SELECT LAST_INSERT_ID()
                }

                rs.close();
                ps.close();
                
            }catch(Exception e){
                e.printStackTrace();
            }
            try{
                String consulta = " CALL `railway`.`CrearVencimientoTarea`(?,?,?);";

                ps = conexion.Conectar().prepareStatement(consulta);
                ps.setString(1, Nombre);
                ps.setInt(2, TareaID);
                java.sql.Date Vencimientosql = new java.sql.Date(Vencimiento.getTime());
                ps.setDate(3, Vencimientosql);

                ResultSet rs = ps.executeQuery();
                
            }catch(Exception e){
                e.printStackTrace();
            }
            try{
                byte[] pdfBytes = archivoPDF.getBytes();
                String consulta = " CALL `railway`.`IngresarPDFTarea`(?,?);";
                ps = conexion.Conectar().prepareStatement(consulta);
                
                ps.setInt(1,TareaID);
                ps.setBytes(2,pdfBytes);
                ResultSet rs = ps.executeQuery();
                
            }catch(Exception e){
                e.printStackTrace();
            }
            finally{
                conexion.Desconectar();
            }
        }
            
            
   
           
        }

    
    public void ModificarPrioridad(ConexionBDD conexion,int Prioridad,int TareaId){
        try{
            String consulta = " CALL Cambiar_Prioridad(?,?);";   
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, Prioridad);
            ps.setInt(2, TareaId);
            ps.executeQuery();
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
    }
    
    public void ModificarEstado(ConexionBDD conexion,int Estado,int TareaId){
        try{
            String consulta = " CALL `Modificar_Estado`(?,?);";   
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, Estado);
            ps.setInt(2, TareaId);
            ResultSet rs = ps.executeQuery();
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
    }    
    
    
    public List<Comentario> obtenerComentarios(ConexionBDD conexion){
        List<Comentario> comentarios = new ArrayList<>();
        String sql = "SELECT c.ComentarioID, c.TareaID, u.Apellido, u.Nombre, c.Comentario, c.Fecha, a.Archivo " +
                     "FROM Comentario c JOIN Usuario u ON c.UsuarioID = u.UsuarioID " +
                     "JOIN Archivo a ON c.ComentarioID = a.ComentarioID " +
                     "WHERE c.TareaID = ?";

        try (PreparedStatement stmt = conexion.Conectar().prepareStatement(sql)) {
            stmt.setInt(1, this.TareaID);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    int id = rs.getInt("ComentarioID");
                    String apellido = rs.getString("Apellido");
                    String nombre = rs.getString("Nombre");
                    String coment = rs.getString("Comentario");
                    Date fecha = rs.getDate("Fecha");
                    byte[] file = rs.getBytes("Archivo");
                    Comentario com = new Comentario(id, apellido, nombre, coment, fecha, file);
                    comentarios.add(com);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally { conexion.Desconectar(); }

        return comentarios;
    }
    
    public List<Object> ConseguirArchivo(ConexionBDD conexion,int tareaID ){
        List<Object> archivos = new ArrayList<>();
        try{
            String consulta = " CALL `ObtenerArchivoTarea`(?);";   
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, tareaID);
            ResultSet rs = ps.executeQuery();
            Object[][] matriz;
            
            while (rs.next()) {
                    int id = rs.getInt("TareaID");
                    byte[] file = rs.getBytes("Archivo");
                    MultipartFile archivo=new MockMultipartFile(
            "file",                
            "file" + "-" + id,         
            "application/pdf",         
            file              
        );
                    
                    
                    archivos.add(new Tarea(id,archivo));
                   
                }
        }catch(SQLException e) {
            e.printStackTrace();
        } finally { conexion.Desconectar(); }
        return archivos;
        
    }
    
    public int getTareaID() { return TareaID; }
    public int getProyectoID() { return ProyectoID; }
    public String getNombre() { return Nombre; }
    public String getDescripcion() { return Descripcion; }
    public int getPrioridad() { return Prioridad; }
    public int getEstado() { return Estado; }
    public Date getVencimiento() { return Vencimiento; }
    public MultipartFile isLeido() { return archivoPDF; }
}
