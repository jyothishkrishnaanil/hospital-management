package hospital_management.controller;

import hospital_management.entity.Appointment;
import hospital_management.entity.Patient;
import hospital_management.entity.Doctor;
import hospital_management.repository.AppointmentRepository;
import hospital_management.repository.PatientRepository;
import hospital_management.repository.DoctorRepository;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentController(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {

        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }
    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
    return appointmentRepository.findAll();
}
@PutMapping("/appointments/{id}/complete")
public Appointment completeAppointment(
        @PathVariable Long id) {

    Appointment appointment =
            appointmentRepository.findById(id).orElse(null);

    if (appointment == null) {
        return null;
    }

    appointment.setStatus("COMPLETED");

    return appointmentRepository.save(appointment);
}
@PutMapping("/appointments/{id}/cancel")
public Appointment cancelAppointment(
        @PathVariable Long id) {

    Appointment appointment =
            appointmentRepository.findById(id).orElse(null);

    if (appointment == null) {
        return null;
    }

    appointment.setStatus("CANCELLED");

    return appointmentRepository.save(appointment);
}

@PutMapping(
    "/appointments/{id}/return"
)
public Appointment returnPatient(
        @PathVariable Long id) {

    Appointment appointment =
            appointmentRepository
                    .findById(id)
                    .orElse(null);

    if (appointment == null) {
        return null;
    }

    appointment.setReturningPatient(
            true);

    appointment.setPriorityLevel(
            1);

    return appointmentRepository
            .save(appointment);
}
    @PostMapping("/appointments")
    public Appointment createAppointment(
            @RequestParam Long patientId,
            @RequestParam Long doctorId) {

        Patient patient =
                patientRepository.findById(patientId).orElse(null);

        Doctor doctor =
                doctorRepository.findById(doctorId).orElse(null);

        if (patient == null || doctor == null) {
            return null;
        }

       Appointment appointment = new Appointment();

appointment.setPatient(patient);
appointment.setDoctor(doctor);
appointment.setAppointmentDate(LocalDateTime.now());
appointment.setStatus("BOOKED");

List<Appointment> appointments =
        appointmentRepository.findAll();

appointment.setTokenNumber(
        appointments.size() + 1
);

return appointmentRepository.save(appointment);

    }
}