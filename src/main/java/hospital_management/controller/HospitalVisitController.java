package hospital_management.controller;

import hospital_management.entity.HospitalVisit;
import hospital_management.entity.Patient;
import hospital_management.repository.HospitalVisitRepository;
import hospital_management.repository.PatientRepository;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;

@RestController
public class HospitalVisitController {

    private final HospitalVisitRepository visitRepository;
    private final PatientRepository patientRepository;

    public HospitalVisitController(
            HospitalVisitRepository visitRepository,
            PatientRepository patientRepository) {

        this.visitRepository = visitRepository;
        this.patientRepository = patientRepository;
    }
    @GetMapping("/visits")
public List<HospitalVisit> getAllVisits() {
    return visitRepository.findAll();
}
@PutMapping("/visits/{id}")
public HospitalVisit updateVisit(
        @PathVariable Long id,
        @RequestBody HospitalVisit updatedVisit) {

    HospitalVisit visit =
            visitRepository.findById(id).orElse(null);

    if (visit == null) {
        return null;
    }

    visit.setStatus(updatedVisit.getStatus());

    return visitRepository.save(visit);
}
@DeleteMapping("/visits/{id}")
public void deleteVisit(@PathVariable Long id) {
    visitRepository.deleteById(id);
}

    @PostMapping("/visits")
    public HospitalVisit createVisit(@RequestParam Long patientId) {

        Patient patient =
                patientRepository.findById(patientId).orElse(null);

        if (patient == null) {
            return null;
        }

        HospitalVisit visit = new HospitalVisit();
        visit.setPatient(patient);
        visit.setVisitDate(LocalDateTime.now());
        visit.setStatus("ACTIVE");

        return visitRepository.save(visit);
    }
}