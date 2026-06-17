package hospital_management.controller;

import hospital_management.entity.Doctor;
import hospital_management.entity.Patient;
import hospital_management.entity.Prescription;
import hospital_management.repository.DoctorRepository;
import hospital_management.repository.PatientRepository;
import hospital_management.repository.PrescriptionRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public PrescriptionController(
            PrescriptionRepository prescriptionRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {

        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/prescriptions")
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @PostMapping("/prescriptions")
    public Prescription createPrescription(
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestBody Prescription prescription) {

        Patient patient =
                patientRepository.findById(patientId).orElse(null);

        Doctor doctor =
                doctorRepository.findById(doctorId).orElse(null);

        if (patient == null || doctor == null) {
            return null;
        }

        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setPrescriptionDate(LocalDateTime.now());

        return prescriptionRepository.save(prescription);
    }
}