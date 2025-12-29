package com.eventmart.back_end.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "users")
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPrivate;

    @Column(unique = true, updatable = false)
    private UUID idPublic;

    @Column(length = 100, nullable = false)
    private String fullName;

    @Column(length = 250, unique = true, nullable = false)
    private String email;

    @Column(length = 100, nullable = false)
    private String password;

    @PrePersist
    public void generateUUID() {
        if (idPublic == null) {
            idPublic = UUID.randomUUID();
        }
    }

    public UserModel() {
    }

    public UserModel(String fullName, String email, String password) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    public Long getIdPrivate() {
        return idPrivate;
    }

    public void setIdPrivate(Long idPrivate) {
        this.idPrivate = idPrivate;
    }

    public UUID getIdPublic() {
        return idPublic;
    }

    public void setIdPublic(UUID idPublic) {
        this.idPublic = idPublic;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
