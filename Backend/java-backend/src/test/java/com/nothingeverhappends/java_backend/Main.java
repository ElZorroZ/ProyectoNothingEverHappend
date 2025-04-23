/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package proyecto2025;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import javax.swing.JOptionPane;



public class Main {

    public String Nombre;
    public int ID;

    public static void main(String[] args) {

        // Datos que simulé yo para comprobar
        Main proyecto = new Main();
        proyecto.ID = 777;
        proyecto.Nombre = "nombreProyecto";

        // llamo al metodo
        proyecto.crearProyecto();
    }

    public void crearProyecto() {

        // Consulta
        String sql = "INSERT INTO railway.Proyecto (ProyectoID, Nombre) VALUES (?, ?)";

        // Obtenemos la conexión
        Connection conn = ConexionBD.obtenerConexion();

        try (PreparedStatement pst = conn.prepareStatement(sql)) {

            // acá seteo el nombre en la consulta
            pst.setInt(1, ID);
            pst.setString(2, Nombre);


            // se ejecuta la consulta
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

        // ¡Ojo! La conexión no se cierra acá. Cerrala después si querés.
    }
}
