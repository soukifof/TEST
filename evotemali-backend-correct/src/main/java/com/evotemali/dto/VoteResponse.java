package com.evotemali.dto;

import java.util.Date;

public class VoteResponse {
    private boolean success;
    private String message;
    private String referenceVote;
    private Date dateVote;
    private String candidatNom;

    // ✅ CONSTRUCTEUR CORRECT
    public VoteResponse(boolean success, String message, String referenceVote, Date dateVote, String candidatNom) {
        this.success = success;
        this.message = message;
        this.referenceVote = referenceVote;
        this.dateVote = dateVote;
        this.candidatNom = candidatNom;
    }

    // Constructeur par défaut
    public VoteResponse() {}

    // Getters et Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getReferenceVote() { return referenceVote; }
    public void setReferenceVote(String referenceVote) { this.referenceVote = referenceVote; }

    public Date getDateVote() { return dateVote; }
    public void setDateVote(Date dateVote) { this.dateVote = dateVote; }

    public String getCandidatNom() { return candidatNom; }
    public void setCandidatNom(String candidatNom) { this.candidatNom = candidatNom; }
}