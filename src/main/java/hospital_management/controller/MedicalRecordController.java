package hospital_management.controller;

import hospital_management.entity.*;
import hospital_management.repository.*;
import hospital_management.repository.MedicalRecordRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class MedicalRecordController {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public MedicalRecordController(
            MedicalRecordRepository medicalRecordRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {

        this.medicalRecordRepository =
                medicalRecordRepository;
        this.patientRepository =
                patientRepository;
        this.doctorRepository =
                doctorRepository;
    }

    @GetMapping("/medical-records")
    public List<MedicalRecord> getAllRecords() {
        return medicalRecordRepository.findAll();
    }

    @PostMapping("/medical-records")
    public MedicalRecord createRecord(
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestBody MedicalRecord request) {

        Patient patient =
                patientRepository.findById(patientId)
                        .orElse(null);

        Doctor doctor =
                doctorRepository.findById(doctorId)
                        .orElse(null);

        if (patient == null || doctor == null) {
            return null;
        }

        MedicalRecord record = new MedicalRecord();

        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setDiagnosis(request.getDiagnosis());
        record.setPrescription(
                request.getPrescription()
        );
        record.setVisitDate(
                LocalDateTime.now()
        );

        return medicalRecordRepository.save(record);
    }

    @DeleteMapping("/medical-records/{id}")
    public void deleteRecord(
            @PathVariable Long id) {

        medicalRecordRepository.deleteById(id);
    }
}