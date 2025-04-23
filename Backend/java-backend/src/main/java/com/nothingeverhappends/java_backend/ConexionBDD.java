/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 *
 * @author Agustín Salinas
 */
public class ConexionBDD {
    Connection conexion = null; // Inicializa la conexión como nula
    
    public Connection Conectar() {
        try {
            // Asegúrate de que la URL esté correctamente formateada
            String url = "jdbc:mysql://root:LgILZCXwllGpscTUGiNQjqfRbGuPbIpE@gondola.proxy.rlwy.net:22412/railway";
            String user = "root"; // Nombre de usuario
            String password = "LgILZCXwllGpscTUGiNQjqfRbGuPbIpE"; // Contraseña

            // Intenta establecer la conexión
            conexion = DriverManager.getConnection(url, user, password);
            
        } catch (SQLException e) {
            System.out.println("No se pudo conectar correctamente a la BDD: "+e.toString());
        }
        return conexion; // Retorna la conexión (puede ser nula si hubo un error)
    }
    
    public void Desconectar(){
        try{
            if(conexion != null && !conexion.isClosed()){
                conexion.close();
                //JOptionPane.showMessageDialog(null, "Se desconecto correctamente la BDD");
            }
        }catch(Exception e){
            System.out.println("ERROR: "+e.toString());
        }
    }
    
    public Connection getConexion(){
        return conexion;
    }
}
