package hospital_management.repository;

import hospital_management.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository
        extends JpaRepository<Prescription, Long> {

    List<Prescription> findByPatientPatientId(
            Long patientId);
}