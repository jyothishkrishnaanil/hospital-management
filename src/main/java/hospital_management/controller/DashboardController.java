package hospital_management.controller;

import hospital_management.repository.PatientRepository;
import hospital_management.repository.DoctorRepository;
import hospital_management.repository.AppointmentRepository;
import hospital_management.repository.BillRepository;
import hospital_management.repository.MedicalRecordRepository;
import hospital_management.repository.PrescriptionRepository;
import hospital_management.repository.HospitalVisitRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DashboardController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillRepository billRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final HospitalVisitRepository hospitalVisitRepository;

    public DashboardController(
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository,
            BillRepository billRepository,
            MedicalRecordRepository medicalRecordRepository,
            PrescriptionRepository prescriptionRepository,
            HospitalVisitRepository hospitalVisitRepository) {

        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.billRepository = billRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.hospitalVisitRepository = hospitalVisitRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboardStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("totalBills", billRepository.count());

        stats.put(
                "totalMedicalRecords",
                medicalRecordRepository.count());

        stats.put(
                "totalPrescriptions",
                prescriptionRepository.count());

        stats.put(
                "totalVisits",
                hospitalVisitRepository.count());

        return stats;
    }
}