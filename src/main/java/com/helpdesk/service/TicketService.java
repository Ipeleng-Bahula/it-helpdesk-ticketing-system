package com.helpdesk.service;

import com.helpdesk.dto.TicketRequest;
import com.helpdesk.model.*;
import com.helpdesk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepo;
    private final UserRepository userRepo;

    public Ticket createTicket(TicketRequest req, String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        Ticket ticket = Ticket.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .priority(req.getPriority())
                .createdBy(user)
                .build();
        return ticketRepo.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepo.findAll();
    }

    public List<Ticket> getMyTickets(String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        return ticketRepo.findByCreatedBy(user);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepo.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public Ticket updateStatus(Long id, Ticket.TicketStatus status) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepo.save(ticket);
    }

    public Ticket assignTicket(Long ticketId, Long technicianId) {
        Ticket ticket = getTicketById(ticketId);
        User tech = userRepo.findById(technicianId).orElseThrow();
        ticket.setAssignedTo(tech);
        ticket.setStatus(Ticket.TicketStatus.IN_PROGRESS);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepo.save(ticket);
    }

    public void deleteTicket(Long id) {
        ticketRepo.deleteById(id);
    }
}