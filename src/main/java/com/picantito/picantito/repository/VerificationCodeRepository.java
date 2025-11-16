package com.picantito.picantito.repository;

import com.picantito.picantito.entities.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    
    Optional<VerificationCode> findByEmail(String email);
    
    Optional<VerificationCode> findByEmailAndCode(String email, String code);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM VerificationCode v WHERE v.expirationTime < :dateTime")
    void deleteByExpirationTimeBefore(@Param("dateTime") LocalDateTime dateTime);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM VerificationCode v WHERE v.email = :email")
    void deleteByEmail(@Param("email") String email);
}
