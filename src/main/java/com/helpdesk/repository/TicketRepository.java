package com.helpdesk.repository;

import com.helpdesk.model.Ticket;
import com.helpdesk.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedBy(User user);
    List<Ticket> findByAssignedTo(User user);
    List<Ticket> findByStatus(Ticket.TicketStatus status);
}