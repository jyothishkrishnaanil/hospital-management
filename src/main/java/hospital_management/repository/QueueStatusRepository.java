package hospital_management.repository;

import hospital_management.entity.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QueueStatusRepository
        extends JpaRepository<
        QueueStatus,
        Long> {
}