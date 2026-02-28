package com.arif.taskpilot_backend.Models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    private String taskName;
    private Boolean completed;
    private LocalDateTime createdAt;

    @PrePersist
    public void setCreatedAt()
    {
        this.createdAt = LocalDateTime.now();
    }
}
