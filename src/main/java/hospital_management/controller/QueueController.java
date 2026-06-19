package hospital_management.controller;

import hospital_management.entity.Appointment;
import hospital_management.repository.AppointmentRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class QueueController {

    private final AppointmentRepository appointmentRepository;

    public QueueController(
            AppointmentRepository appointmentRepository) {

        this.appointmentRepository =
                appointmentRepository;
    }

    @GetMapping("/queue")
    public List<Appointment> getQueue() {

        List<Appointment> queue =
                appointmentRepository
                        .findByStatusOrderByPriorityLevelDescTokenNumberAsc(
                                "BOOKED"
                        );

        if (!queue.isEmpty()) {
            queue.remove(0);
        }

        return queue;
    }

    @GetMapping("/current-token")
    public Appointment getCurrentToken() {

        List<Appointment> queue =
                appointmentRepository
                        .findByStatusOrderByPriorityLevelDescTokenNumberAsc(
                                "BOOKED"
                        );

        if (queue.isEmpty()) {
            return null;
        }

        return queue.get(0);
    }
}