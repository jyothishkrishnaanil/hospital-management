package hospital_management.repository;

import hospital_management.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientPatientId(
            Long patientId);

    List<Appointment> findByStatusOrderByTokenNumberAsc(
            String status);
            Appointment findFirstByStatusOrderByTokenNumberAsc(
        String status);
List<Appointment>
findByStatusOrderByPriorityLevelDescTokenNumberAsc(
        String status);
}