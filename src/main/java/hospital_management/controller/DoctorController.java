package hospital_management.controller;

import hospital_management.entity.Doctor;
import hospital_management.repository.DoctorRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @PostMapping("/doctors")
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @GetMapping("/doctors")
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @PutMapping("/doctors/{id}")
    public Doctor updateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor updatedDoctor) {

        Doctor doctor = doctorRepository.findById(id).orElse(null);

        if (doctor == null) {
            return null;
        }

        doctor.setDoctorName(updatedDoctor.getDoctorName());
        doctor.setSpecialization(updatedDoctor.getSpecialization());
        doctor.setPhoneNumber(updatedDoctor.getPhoneNumber());

        return doctorRepository.save(doctor);
    }

    @DeleteMapping("/doctors/{id}")
    public void deleteDoctor(@PathVariable Long id) {
        doctorRepository.deleteById(id);
    }
@GetMapping("/doctors/specialization/{specialization}")
public List<Doctor> getDoctorsBySpecialization(
        @PathVariable String specialization) {

    return doctorRepository.findBySpecialization(
            specialization);
}
    @GetMapping("/doctors/search")
    public Doctor searchDoctor(
            @RequestParam("phone") String phone) {

        return doctorRepository.findByPhoneNumber(phone)
                .orElse(null);
    }
    
}