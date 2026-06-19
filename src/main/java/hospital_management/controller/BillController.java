package hospital_management.controller;

import hospital_management.entity.Bill;
import hospital_management.entity.Patient;
import hospital_management.repository.BillRepository;
import hospital_management.repository.PatientRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
public class BillController {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;

    public BillController(
            BillRepository billRepository,
            PatientRepository patientRepository) {

        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping("/bills")
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }
    @DeleteMapping("/bills/{id}")
public void deleteBill(@PathVariable Long id) {
    billRepository.deleteById(id);
}
@PutMapping("/bills/{id}/pay")
public Bill markBillPaid(@PathVariable Long id) {

    Bill bill = billRepository.findById(id).orElse(null);

    if (bill == null) {
        return null;
    }

    bill.setPaymentStatus("PAID");

    return billRepository.save(bill);
}
    @PostMapping("/bills")
    public Bill createBill(
            @RequestParam Long patientId,
            @RequestBody Bill billRequest) {

        Patient patient =
                patientRepository.findById(patientId).orElse(null);

        if (patient == null) {
            return null;
        }

        Bill bill = new Bill();

        bill.setPatient(patient);
        bill.setAmount(billRequest.getAmount());
        bill.setPaymentStatus(billRequest.getPaymentStatus());
        bill.setBillDate(LocalDateTime.now());

        return billRepository.save(bill);
    }
}