package hospital_management.controller;

import hospital_management.entity.*;
import hospital_management.repository.*;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class PatientHistoryController {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final BillRepository billRepository;
    private final HospitalVisitRepository visitRepository;

    public PatientHistoryController(
            PatientRepository patientRepository,
            AppointmentRepository appointmentRepository,
            MedicalRecordRepository medicalRecordRepository,
            PrescriptionRepository prescriptionRepository,
            BillRepository billRepository,
            HospitalVisitRepository visitRepository) {

        this.patientRepository =
                patientRepository;

        this.appointmentRepository =
                appointmentRepository;

        this.medicalRecordRepository =
                medicalRecordRepository;

        this.prescriptionRepository =
                prescriptionRepository;

        this.billRepository =
                billRepository;

        this.visitRepository =
                visitRepository;
    }

    @GetMapping("/patients/{id}/history")
    public Map<String, Object> getPatientHistory(
            @PathVariable Long id) {

        Patient patient =
                patientRepository.findById(id)
                        .orElse(null);

        if (patient == null) {
            return null;
        }

        Map<String, Object> history =
                new HashMap<>();

        history.put(
                "patient",
                patient);

        history.put(
                "appointments",
                appointmentRepository
                        .findByPatientPatientId(id));

        history.put(
                "medicalRecords",
                medicalRecordRepository
                        .findByPatientPatientId(id));

        history.put(
                "prescriptions",
                prescriptionRepository
                        .findByPatientPatientId(id));

        history.put(
                "bills",
                billRepository
                        .findByPatientPatientId(id));

        history.put(
                "visits",
                visitRepository
                        .findByPatientPatientId(id));

        return history;
    }
}