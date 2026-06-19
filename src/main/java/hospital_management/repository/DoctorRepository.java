package hospital_management.repository;

import hospital_management.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByPhoneNumber(String phoneNumber);
    List<Doctor> findBySpecialization(String specialization);
}