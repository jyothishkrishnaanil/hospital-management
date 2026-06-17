package hospital_management.controller;

import hospital_management.entity.Patient;
import hospital_management.repository.PatientRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;




import java.util.List;

@RestController
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @GetMapping("/patients")
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
@PostMapping("/patients")
public Patient createPatient(@RequestBody Patient patient) {
    return patientRepository.save(patient);
}
@GetMapping("/patients/search")
public Patient searchPatient(@RequestParam String phone) {
    return patientRepository.findByPhoneNumber(phone).orElse(null);
}
@DeleteMapping("/patients/{id}")
public void deletePatient(@PathVariable Long id) {
    patientRepository.deleteById(id);
}
@PutMapping("/patients/{id}")
public Patient updatePatient(
        @PathVariable Long id,
        @RequestBody Patient updatedPatient) {

    Patient patient = patientRepository.findById(id).orElse(null);

    if (patient == null) {
        return null;
    }

    patient.setFullName(updatedPatient.getFullName());
    patient.setGender(updatedPatient.getGender());
    patient.setBloodGroup(updatedPatient.getBloodGroup());
    patient.setPhoneNumber(updatedPatient.getPhoneNumber());
    patient.setAddress(updatedPatient.getAddress());
    patient.setEmergencyContactName(updatedPatient.getEmergencyContactName());
    patient.setEmergencyContactNumber(updatedPatient.getEmergencyContactNumber());

    return patientRepository.save(patient);
}

}