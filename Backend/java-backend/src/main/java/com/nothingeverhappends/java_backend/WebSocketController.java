/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

/**
 *
 * @author Agustín Salinas
 */
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public void enviarNotificacion(int UsuarioID) {
        messagingTemplate.convertAndSend("/topic/notificaciones/" + UsuarioID, "Nueva notificación entrante");
    }
    
    @MessageMapping("/mandarComentario") // frontend envía a /app/mandarComentario
    public void sendComentario(@Payload Comentario comentario) {
        // Enviar el comentario al canal
        messagingTemplate.convertAndSend("/topic/comentarios/" + comentario.getTareaID(), comentario);
    }
}

