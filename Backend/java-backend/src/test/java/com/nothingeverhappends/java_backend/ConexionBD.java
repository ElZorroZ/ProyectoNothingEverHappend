/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package proyecto2025;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionBD {

    // Parámetros de conexión
    private static final String URL = "jdbc:mysql://gondola.proxy.rlwy.net:22412/railway"; // Cambiar por tu URL de base de datos
    private static final String USUARIO = "root"; // Cambiar por tu usuario
    private static final String CONTRASENA = "LgILZCXwllGpscTUGiNQjqfRbGuPbIpE"; // Cambiar por tu contraseña

    private static Connection conexion = null;

    // Método para obtener la conexión
    public static Connection obtenerConexion() {
        if (conexion == null) {
            try {
                // Cargar el driver de MySQL (aunque desde JDBC 4.0 ya no es necesario explícitamente)
                Class.forName("com.mysql.cj.jdbc.Driver");

                // Establecer la conexión
                conexion = DriverManager.getConnection(URL, USUARIO, CONTRASENA);
                System.out.println("Conexión exitosa con la base de datos.");
            } catch (ClassNotFoundException | SQLException e) {
                System.out.println("Error al conectar con la base de datos: " + e.getMessage());
            }
        }
        return conexion;
    }

    // Método para cerrar la conexión
    public static void cerrarConexion() {
        if (conexion != null) {
            try {
                conexion.close();
                System.out.println("Conexión cerrada.");
            } catch (SQLException e) {
                System.out.println("Error al cerrar la conexión: " + e.getMessage());
            }
        }
    }
}