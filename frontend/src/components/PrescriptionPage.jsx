import { useEffect, useState } from "react";
import api from "../services/api";
import { jsPDF } from "jspdf";
function PrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [notes, setNotes] = useState("");
  const [qrCode, setQrCode] =
  useState("");

const [showQR, setShowQR] =
  useState(false);

  useEffect(() => {
    loadPrescriptions();
    loadPatients();
    loadDoctors();
  }, []);

  const loadPrescriptions = async () => {
    try {
      const response = await api.get("/prescriptions");
      setPrescriptions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await api.get("/patients");
      setPatients(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await api.get("/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const savePrescription = async () => {
    if (
      !selectedPatient ||
      !selectedDoctor ||
      !medicine
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await api.post(
        `/prescriptions?patientId=${selectedPatient}&doctorId=${selectedDoctor}`,
        {
          medicine,
          dosage,
          notes
        }
      );

      setSelectedPatient("");
      setSelectedDoctor("");
      setMedicine("");
      setDosage("");
      setNotes("");

      loadPrescriptions();

      alert("Prescription Saved");
    } catch (error) {
      console.error(error);
    }
  };

  const deletePrescription = async (id) => {
    try {
      await api.delete(`/prescriptions/${id}`);

      loadPrescriptions();
    } catch (error) {
      console.error(error);
    }
  };
  const viewQR = async (id) => {
  try {
    const response =
      await api.get(
        `/prescriptions/${id}/qr`
      );

    setQrCode(response.data);

    setShowQR(true);
  } catch (error) {
    console.error(error);
  }
};
const downloadPrescriptionPDF =
  async (prescription) => {

    try {

      const response =
        await api.get(
          `/prescriptions/${prescription.prescriptionId}/qr`
        );

      const qr =
        response.data;

      const doc =
        new jsPDF();

      doc.setFontSize(20);

      doc.text(
        "Hospital Prescription",
        20,
        20
      );

      doc.setFontSize(12);

      doc.text(
        `Patient: ${prescription.patient?.fullName}`,
        20,
        50
      );

      doc.text(
        `Doctor: ${prescription.doctor?.doctorName}`,
        20,
        65
      );

      doc.text(
        `Medicine: ${prescription.medicine}`,
        20,
        80
      );

      doc.text(
        `Dosage: ${prescription.dosage}`,
        20,
        95
      );

      doc.text(
        `Notes: ${prescription.notes}`,
        20,
        110
      );

      doc.addImage(
        `data:image/png;base64,${qr}`,
        "PNG",
        20,
        130,
        60,
        60
      );

      doc.save(
        `Prescription_${prescription.prescriptionId}.pdf`
      );

    } catch (error) {
      console.error(error);
    }
};

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "30px"
      }}
    >
      <h1
  style={{
    fontSize: "42px",
    color: "#60a5fa",
    marginBottom: "25px",
    textShadow:
      "0 0 20px rgba(96,165,250,0.4)"
  }}
>
  💊 Prescription Management
</h1>
<div style={cardStyle}>
  <h3>Create Prescription</h3>

      <select
      style={inputStyle}
        value={selectedPatient}
        onChange={(e) =>
          setSelectedPatient(e.target.value)
        }
      >
        <option value="">
          Select Patient
        </option>

        {patients.map((patient) => (
          <option
            key={patient.patientId}
            value={patient.patientId}
          >
            {patient.fullName}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select
      style={inputStyle}
        value={selectedDoctor}
        onChange={(e) =>
          setSelectedDoctor(e.target.value)
        }
      >
        <option value="">
          Select Doctor
        </option>

        {doctors.map((doctor) => (
          <option
            key={doctor.doctorId}
            value={doctor.doctorId}
          >
            {doctor.doctorName}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
  style={inputStyle}
  type="text"
  placeholder="Medicine"
  value={medicine}
        onChange={(e) =>
          setMedicine(e.target.value)
        }
      />

      <br />
      <br />

      <input
  style={inputStyle}
  type="text"
  placeholder="Dosage"
        value={dosage}
        onChange={(e) =>
          setDosage(e.target.value)
        }
      />

      <br />
      <br />

     <textarea
  style={{
    ...inputStyle,
    width: "300px",
    height: "100px"
  }}
  placeholder="Notes"
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
      />

      <br />
      <br />

      <button
  onClick={savePrescription}
  style={primaryBtn}
>
  Save Prescription
</button>

<br />
<br />

</div>

<br />
{showQR && (
  <div
    style={{
      border: "1px solid #374151",
      padding: "20px",
      marginBottom: "20px",
      borderRadius: "10px",
      backgroundColor: "#111827"
    }}
  >
    <h3>Prescription QR Code</h3>

    <img
      src={`data:image/png;base64,${qrCode}`}
      alt="QR Code"
      style={{
        width: "250px"
      }}
    />

    <br />
    <br />

    <button
      onClick={() =>
        setShowQR(false)
      }
    >
      Close
    </button>
  </div>
)}
     <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>Patient</th>
            <th style={cellStyle}>Doctor</th>
            <th style={cellStyle}>Medicine</th>
            <th style={cellStyle}>Dosage</th>
            <th style={cellStyle}>Notes</th>
            <th style={cellStyle}>Date</th>
            <th style={cellStyle}>QR</th>
<th style={cellStyle}>PDF</th>
<th style={cellStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {prescriptions.map(
            (prescription) => (
              <tr
                key={
                  prescription.prescriptionId
                }
              >
                <td style={cellStyle}>
                  {
                    prescription.prescriptionId
                  }
                </td>

                <td style={cellStyle}>
                  {
                    prescription.patient
                      ?.fullName
                  }
                </td>

                <td style={cellStyle}>
                  {
                    prescription.doctor
                      ?.doctorName
                  }
                </td>

                <td style={cellStyle}>
                  {prescription.medicine}
                </td>

                <td style={cellStyle}>
                  {prescription.dosage}
                </td>

                <td style={cellStyle}>
                  {prescription.notes}
                </td>

                <td style={cellStyle}>
                  {prescription.prescriptionDate
                    ? new Date(
                        prescription.prescriptionDate
                      ).toLocaleString()
                    : ""}
                </td>

               <td style={cellStyle}>
  <button
    onClick={() =>
      viewQR(
        prescription.prescriptionId
      )
    }
  >
    View QR
  </button>
</td>

<td style={cellStyle}>
  <button
    onClick={() =>
      downloadPrescriptionPDF(
        prescription
      )
    }
  >
    PDF
  </button>
</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

const tableStyle = {
  margin: "0 auto",
  borderCollapse: "collapse",
  width: "90%",
  backgroundColor: "#111827",
  borderRadius: "10px",
  overflow: "hidden"
};

const cellStyle = {
  border: "1px solid #374151",
  padding: "12px"
};
const cardStyle = {
  background:
    "linear-gradient(145deg,#111827,#1f2937)",
  border: "1px solid #374151",
  borderRadius: "20px",
  padding: "25px",
  width: "600px",
  margin: "0 auto",
  boxShadow:
    "0 0 25px rgba(59,130,246,0.12)"
};

const inputStyle = {
  padding: "12px",
  borderRadius: "10px",
  minWidth: "300px",
  background: "#0f172a",
  color: "white",
  border: "1px solid #374151"
};

const primaryBtn = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  boxShadow:
    "0 0 15px rgba(37,99,235,0.35)"
};

const dangerBtn = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#dc2626",
  color: "white",
  cursor: "pointer"
};
export default PrescriptionPage;