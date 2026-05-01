package com.helpdesk.dto;
import com.helpdesk.model.Ticket;
import lombok.Data;

@Data
public class TicketRequest {
    private String title;
    private String description;
    private Ticket.TicketPriority priority;
}