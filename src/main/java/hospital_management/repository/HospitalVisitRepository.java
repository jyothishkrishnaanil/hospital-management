package hospital_management.repository;

import hospital_management.entity.HospitalVisit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalVisitRepository
        extends JpaRepository<HospitalVisit, Long> {

    List<HospitalVisit> findByPatientPatientId(
            Long patientId);
}