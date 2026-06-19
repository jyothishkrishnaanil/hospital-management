package hospital_management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentId;

    @ManyToOne
    private Patient patient;

    @ManyToOne
    private Doctor doctor;

    private LocalDateTime appointmentDate;

    private String status;
    private Integer tokenNumber;
    private Integer priorityLevel = 0;

private Boolean returningPatient = false;

    public Long getAppointmentId() {
        return appointmentId;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public Integer getTokenNumber() {
    return tokenNumber;
}

public void setTokenNumber(Integer tokenNumber) {
    this.tokenNumber = tokenNumber;
}
public Boolean getReturningPatient() {
    return returningPatient;
}

public void setReturningPatient(
        Boolean returningPatient) {
    this.returningPatient = returningPatient;
}

public Integer getPriorityLevel() {
    return priorityLevel;
}

public void setPriorityLevel(
        Integer priorityLevel) {
    this.priorityLevel = priorityLevel;
}

}