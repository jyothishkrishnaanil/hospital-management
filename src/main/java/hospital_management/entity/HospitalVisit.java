package hospital_management.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "hospital_visits")
@Getter
@Setter
public class HospitalVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long visitId;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    private LocalDateTime visitDate;

    private String status;
 public void setPatient(Patient patient) {
    this.patient = patient;
}

public void setVisitDate(LocalDateTime visitDate) {
    this.visitDate = visitDate;
}

public void setStatus(String status) {
    this.status = status;
}
}