/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nothingeverhappends.java_backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
/**
 *
 * @author Agustín Salinas
 */
@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notificar(int usuarioId, Notificaciones notificacion) {
        //Enviar por WebSocket
        messagingTemplate.convertAndSend("/topic/notificaciones/" + usuarioId, notificacion);
        System.out.println("Notificacion "+notificacion.getNotificacionID()+ " para Usuario "+usuarioId);
    }
    
    public void sendComentario(Comentario comentario) {
        // Enviar el comentario al canal
        messagingTemplate.convertAndSend("/topic/comentarios/" + comentario.getTareaID(), comentario);
    }
}
