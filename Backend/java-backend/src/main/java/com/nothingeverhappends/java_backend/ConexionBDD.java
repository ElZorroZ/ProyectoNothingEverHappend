/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import java.sql.CallableStatement;
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
            String url = "jdbc:mysql://root:LgILZCXwllGpscTUGiNQjqfRbGuPbIpE@gondola.proxy.rlwy.net:22412/railway";
            String user = "root";
            String password = "LgILZCXwllGpscTUGiNQjqfRbGuPbIpE";
            conexion = DriverManager.getConnection(url, user, password);

            if (conexion != null) {
                System.out.println("Conexión a la base de datos exitosa.");
            } else {
                System.out.println("La conexión fue nula.");
            }
        } catch (SQLException e) {
            System.out.println("Error de conexión a la base de datos: " + e.getMessage());
            // Puedes lanzar una excepción personalizada o retornar un mensaje más claro si lo deseas
        }
        return conexion;
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

    CallableStatement prepareCall(String sql) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }
}
