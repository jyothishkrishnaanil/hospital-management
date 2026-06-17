package hospital_management.repository;

import hospital_management.entity.HospitalVisit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalVisitRepository
        extends JpaRepository<HospitalVisit, Long> {
}