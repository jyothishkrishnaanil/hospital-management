package hospital_management.controller;

import hospital_management.entity.*;
import hospital_management.repository.*;
import hospital_management.service.QRCodeService;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final QRCodeService qrCodeService;

    public PrescriptionController(
            PrescriptionRepository prescriptionRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            QRCodeService qrCodeService) {

        this.prescriptionRepository =
                prescriptionRepository;

        this.patientRepository =
                patientRepository;

        this.doctorRepository =
                doctorRepository;

        this.qrCodeService =
                qrCodeService;
    }

    @GetMapping("/prescriptions")
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @PostMapping("/prescriptions")
    public Prescription createPrescription(
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestBody Prescription request) {

        Patient patient =
                patientRepository.findById(patientId)
                        .orElse(null);

        Doctor doctor =
                doctorRepository.findById(doctorId)
                        .orElse(null);

        if (patient == null || doctor == null) {
            return null;
        }

        Prescription prescription =
                new Prescription();

        prescription.setPatient(patient);

        prescription.setDoctor(doctor);

        prescription.setMedicine(
                request.getMedicine());

        prescription.setDosage(
                request.getDosage());

        prescription.setNotes(
                request.getNotes());

        prescription.setPrescriptionDate(
                LocalDateTime.now());

        return prescriptionRepository.save(
                prescription);
    }

    @DeleteMapping("/prescriptions/{id}")
    public void deletePrescription(
            @PathVariable Long id) {

        prescriptionRepository.deleteById(id);
    }

    @GetMapping("/prescriptions/{id}/qr")
    public String generatePrescriptionQR(
            @PathVariable Long id)
            throws Exception {

        Prescription prescription =
                prescriptionRepository
                        .findById(id)
                        .orElse(null);

        if (prescription == null) {
            return null;
        }

        String qrData =
                "Prescription ID: "
                        + prescription.getPrescriptionId()
                        + "\nPatient: "
                        + prescription.getPatient()
                                .getFullName()
                        + "\nDoctor: "
                        + prescription.getDoctor()
                                .getDoctorName()
                        + "\nMedicine: "
                        + prescription.getMedicine()
                        + "\nDosage: "
                        + prescription.getDosage()
                        + "\nNotes: "
                        + prescription.getNotes();

        return qrCodeService
                .generateQRCode(qrData);
    }
}