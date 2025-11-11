package com.picantito.picantito.repository;

import com.picantito.picantito.entities.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    boolean existsByToken(String token);
    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
