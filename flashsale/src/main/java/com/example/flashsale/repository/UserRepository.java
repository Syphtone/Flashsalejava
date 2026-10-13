package com.example.flashsale.repository;

import com.example.flashsale.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {}
