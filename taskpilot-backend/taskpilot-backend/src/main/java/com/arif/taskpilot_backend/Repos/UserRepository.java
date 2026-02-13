package com.arif.taskpilot_backend.Repos;

import com.arif.taskpilot_backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends JpaRepository<User,Long> {

}
