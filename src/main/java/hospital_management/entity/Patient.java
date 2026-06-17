package hospital_management.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "patients")
@Getter
@Setter
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long patientId;
    @Column(nullable = false)
    private String fullName;
    private String gender;
    private String bloodGroup;
    private String phoneNumber;
    private String address;
    private String emergencyContactName;
    private String emergencyContactNumber;
}