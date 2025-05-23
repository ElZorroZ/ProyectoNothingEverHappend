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
    byte[] file_archivo;


    
    public Tarea(){
    }
    
    public Tarea(int TareaID){
        this.TareaID=TareaID;
    }
    
    public Tarea(int TareaID, MultipartFile archivoPDF){
        this.TareaID=TareaID;
        this.archivoPDF=archivoPDF;
    }

    public Tarea(int TareaID, byte[] file_archivo){
        this.TareaID=TareaID;
        this.file_archivo=file_archivo;
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
    
    public Tarea(int TareaID, String Nombre, String Descripcion, Date Vencimiento, MultipartFile archivoPDF){
        this.TareaID=TareaID;
        this.Nombre=Nombre;
        this.Descripcion=Descripcion;
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

       public void Modificar(ConexionBDD conexion){
        try{
            String consulta = "CALL `railway`.`Modificar_Tarea`(?,?,?,?);";   
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, TareaID);
            ps.setString(2, Nombre);
            ps.setString(3, Descripcion);
            java.sql.Date Vencimientosql = new java.sql.Date(Vencimiento.getTime());
            ps.setDate(4, Vencimientosql);
            ps.executeQuery();
        }catch(Exception e){
            e.printStackTrace();
        }
        try{
            String consulta = "CALL `railway`.`Modificar_Archivo`(?, ?);";   
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, TareaID);
            byte[] pdfBytes = archivoPDF.getBytes();
            ps.setBytes(2,pdfBytes);
            ps.executeQuery();
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
        }
    }
       
       public void Eliminar(ConexionBDD conexion){
        try{
            String consulta = "CALL `railway`.`Borrar_Tarea`(?);";   
            PreparedStatement ps = conexion.Conectar().prepareStatement(consulta);
            ps.setInt(1, TareaID);
            
            ps.executeQuery();
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            conexion.Desconectar();
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
        String sql = "CALL `ObtenerComentarios`(?);";

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
                    String nomFile = rs.getString("NombreArchivo");
                    Comentario com = new Comentario(id, apellido, nombre, coment, fecha, file, nomFile);
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
            
            while (rs.next()) {
                    int id = rs.getInt("TareaID");
                    byte[] file = rs.getBytes("Archivo");          
                    
                    archivos.add(new Tarea(id,file));
                   
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
    
    public MultipartFile getArchivoPDF() {
        return archivoPDF;
    }

    public void setArchivoPDF(MultipartFile archivoPDF) {
        this.archivoPDF = archivoPDF;
    }

    public byte[] getFile_archivo() {
        return file_archivo;
    }

    public void setFile_archivo(byte[] file_archivo) {
        this.file_archivo = file_archivo;
    }

    
}
