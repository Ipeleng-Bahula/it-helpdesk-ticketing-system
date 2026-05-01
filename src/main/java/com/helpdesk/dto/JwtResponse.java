package com.helpdesk.dto;
import lombok.*;

@Data @AllArgsConstructor
public class JwtResponse {
    private String token;
    private String username;
    private String role;
}