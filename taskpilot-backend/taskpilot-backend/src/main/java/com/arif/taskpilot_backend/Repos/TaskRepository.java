package com.arif.taskpilot_backend.Repos;

import com.arif.taskpilot_backend.Models.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

}
