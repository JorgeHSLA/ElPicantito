package com.picantito.picantito.service;

import com.picantito.picantito.entities.RevokedToken;
import com.picantito.picantito.repository.RevokedTokenRepository;
import com.picantito.picantito.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
public class TokenRevocationService {

    @Autowired
    private RevokedTokenRepository revokedTokenRepository;

    @Autowired
    private JwtService jwtService;

    @Transactional
    public void revokeToken(String token) {
        if (token != null && !isTokenRevoked(token)) {
            Date expiration = jwtService.extractExpiration(token);
            LocalDateTime expiresAt = expiration.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            RevokedToken revokedToken = RevokedToken.builder()
                    .token(token)
                    .revokedAt(LocalDateTime.now())
                    .expiresAt(expiresAt)
                    .build();

            revokedTokenRepository.save(revokedToken);
        }
    }

    public boolean isTokenRevoked(String token) {
        return revokedTokenRepository.existsByToken(token);
    }

    // Limpieza automática de tokens expirados cada día a las 3 AM
    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional
    public void cleanupExpiredTokens() {
        revokedTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
