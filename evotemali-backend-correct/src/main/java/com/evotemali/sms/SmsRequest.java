package com.evotemali.sms;


public class SmsRequest {
    private String to;
    private String message; // facultatif si généré côté backend

    // Getters et setters
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
