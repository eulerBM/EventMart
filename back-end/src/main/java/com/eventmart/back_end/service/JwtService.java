package com.eventmart.back_end.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;
    private final String tokenSecret;

    public JwtService(
            @Value("${jwt.access-expiration}") long accessTokenExpiration,
            @Value("${jwt.refresh-expiration}") long refreshTokenExpiration,
            @Value("${jwt.secret}") String tokenSecret
    ) {
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
        this.tokenSecret = tokenSecret;
    }

    public SecretKey getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(tokenSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateJwt(String email, UUID idPublic){

        Instant now = Instant.now();

        return Jwts.builder()
                .issuer("taskflow-backend")
                .subject(email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(accessTokenExpiration)))
                .id(UUID.randomUUID().toString())
                .claim("userIdPublic", idPublic)
                .signWith(getSignInKey())
                .compact();

    }

    public String generateRefreshToken(String email) {
        Instant now = Instant.now();

        return Jwts.builder()
                .setIssuer("taskflow-backend")
                .setSubject(email)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(refreshTokenExpiration))) // longo
                .signWith(getSignInKey())
                .compact();
    }
}
