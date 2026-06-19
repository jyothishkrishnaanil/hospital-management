import { useEffect, useState } from "react";
import api from "../services/api";
import AddPatient from "./AddPatient";
import { jsPDF } from "jspdf";
function PatientPage() {
  const [patients, setPatients] = useState([]);
const [history, setHistory] =
  useState(null);

const [showHistory,
  setShowHistory] =
  useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await api.get("/patients");
      setPatients(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePatient = async (id) => {
    try {
      await api.delete(`/patients/${id}`);
      loadPatients();
    } catch (error) {
      console.error(error);
    }
  };

  const editPatient = (patient) => {
    setEditingId(patient.patientId);
    setFullName(patient.fullName);
    setGender(patient.gender);
    setPhoneNumber(patient.phoneNumber);
  };
  const downloadHistoryPDF = () => {
  if (!history) return;

  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(18);
  doc.text("Patient History Report", 20, y);

  y += 15;

  doc.setFontSize(12);

  doc.text(
    `Patient: ${history.patient.fullName}`,
    20,
    y
  );

  y += 10;

  doc.text(
    `Phone: ${history.patient.phoneNumber}`,
    20,
    y
  );

  y += 15;

  doc.text("Appointments", 20, y);

  y += 10;

  history.appointments?.forEach(
    (appointment) => {
      doc.text(
        `Doctor: ${
          appointment.doctor?.doctorName
        }`,
        20,
        y
      );

      y += 8;

      doc.text(
        `Status: ${appointment.status}`,
        20,
        y
      );

      y += 12;
    }
  );

  doc.text(
    "Medical Records",
    20,
    y
  );

  y += 10;

  history.medicalRecords?.forEach(
    (record) => {
      doc.text(
        `Diagnosis: ${record.diagnosis}`,
        20,
        y
      );

      y += 8;

      doc.text(
        `Prescription: ${record.prescription}`,
        20,
        y
      );

      y += 12;
    }
  );

  doc.text(
    "Prescriptions",
    20,
    y
  );

  y += 10;

  history.prescriptions?.forEach(
    (prescription) => {
      doc.text(
        `Medicine: ${prescription.medicine}`,
        20,
        y
      );

      y += 8;

      doc.text(
        `Dosage: ${prescription.dosage}`,
        20,
        y
      );

      y += 12;
    }
  );

  doc.text("Bills", 20, y);

  y += 10;

  history.bills?.forEach((bill) => {
    doc.text(
      `₹ ${bill.amount} - ${bill.paymentStatus}`,
      20,
      y
    );

    y += 10;
  });

  doc.text(
    "Hospital Visits",
    20,
    y
  );

  y += 10;

  history.visits?.forEach((visit) => {
    doc.text(
      `${visit.status}`,
      20,
      y
    );

    y += 10;
  });

  doc.save(
    `Patient_${history.patient.patientId}_History.pdf`
  );
};
const viewHistory = async (
  patientId
) => {
  try {
    const response =
      await api.get(
        `/patients/${patientId}/history`
      );

    setHistory(response.data);
    setShowHistory(true);
  } catch (error) {
    console.error(error);
  }
};
  const updatePatient = async () => {
    try {
      await api.put(`/patients/${editingId}`, {
        fullName,
        gender,
        phoneNumber
      });

      setEditingId(null);
      setFullName("");
      setGender("");
      setPhoneNumber("");

      loadPatients();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    return (
      patient.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.phoneNumber
        .toString()
        .includes(searchTerm)
    );
  });

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "30px"
      }}
    >
      <div
  style={{
    background:
      "linear-gradient(135deg,#1e293b,#0f172a)",
    padding: "25px",
    borderRadius: "20px",
    marginBottom: "25px",
    border:
      "1px solid rgba(255,255,255,0.08)"
  }}
>
<h1
  style={{
    color: "#60a5fa",
    margin: 0,
    fontSize: "56px"
  }}
>
    👤 Patient Management
  </h1>

  <p
  style={{
    color: "#94a3b8",
    marginTop: "15px",
    fontSize: "18px"
  }}
>
    Add, search, edit and manage patients
  </p>
</div>

      <AddPatient onPatientAdded={loadPatients} />

      <br />

      <h3>Search Patient</h3>

      <input
        type="text"
        placeholder="Search by Name or Phone"
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
       style={{
  padding: "12px",
  width: "350px",
  borderRadius: "10px",
  border: "1px solid #374151",
  background: "#111827",
  color: "white"
}}
      />

      <br />
      <br />

      {editingId && (
        <div>
          <h3>Edit Patient</h3>

          <input
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            placeholder="Name"
          />

          <br />
          <br />

          <input
            value={gender}
            onChange={(e) =>
              setGender(e.target.value)
            }
            placeholder="Gender"
          />

          <br />
          <br />

          <input
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value)
            }
            placeholder="Phone"
          />

          <br />
          <br />

          <button onClick={updatePatient}>
            Update Patient
          </button>

          <br />
          <br />
        </div>
      )}
{showHistory && history && (
  <div
   style={{
  background:
    "linear-gradient(145deg,#111827,#1f2937)",
  border:
    "1px solid rgba(255,255,255,0.08)",
  padding: "25px",
  width: "90%",
  margin: "20px auto",
  textAlign: "left",
  borderRadius: "20px",
  boxShadow:
    "0 0 40px rgba(59,130,246,0.15)"
}}
  >
    <h2 style={{ textAlign: "center" }}>
      Patient History
    </h2>

    <h3>
      Patient: {history.patient.fullName}
    </h3>

    <hr />

    <h3>Appointments</h3>

    {history.appointments?.length > 0 ? (
      history.appointments.map(
        (appointment) => (
          <div
            key={appointment.appointmentId}
            style={{
              marginBottom: "15px"
            }}
          >
            <b>Doctor:</b>{" "}
            {appointment.doctor?.doctorName}

            <br />

            <b>Status:</b>{" "}
            {appointment.status}

            <br />

            <b>Date:</b>{" "}
            {new Date(
              appointment.appointmentDate
            ).toLocaleString()}
          </div>
        )
      )
    ) : (
      <p>No Appointments Found</p>
    )}

    <hr />

    <h3>Medical Records</h3>

    {history.medicalRecords?.length > 0 ? (
      history.medicalRecords.map(
        (record) => (
          <div
            key={record.recordId}
            style={{
              marginBottom: "15px"
            }}
          >
            <b>Diagnosis:</b>{" "}
            {record.diagnosis}

            <br />

            <b>Prescription:</b>{" "}
            {record.prescription}
          </div>
        )
      )
    ) : (
      <p>No Medical Records Found</p>
    )}

    <hr />

    <h3>Prescriptions</h3>

    {history.prescriptions?.length > 0 ? (
      history.prescriptions.map(
        (prescription) => (
          <div
            key={
              prescription.prescriptionId
            }
            style={{
              marginBottom: "15px"
            }}
          >
            <b>Medicine:</b>{" "}
            {prescription.medicine}

            <br />

            <b>Dosage:</b>{" "}
            {prescription.dosage}

            <br />

            <b>Notes:</b>{" "}
            {prescription.notes}
          </div>
        )
      )
    ) : (
      <p>No Prescriptions Found</p>
    )}

    <hr />

    <h3>Bills</h3>

    {history.bills?.length > 0 ? (
      history.bills.map((bill) => (
        <div
          key={bill.billId}
          style={{
            marginBottom: "15px"
          }}
        >
          <b>Amount:</b> ₹ {bill.amount}

          <br />

          <b>Status:</b>{" "}
          {bill.paymentStatus}
        </div>
      ))
    ) : (
      <p>No Bills Found</p>
    )}

    <hr />

    <h3>Hospital Visits</h3>

    {history.visits?.length > 0 ? (
      history.visits.map((visit) => (
        <div
          key={visit.visitId}
          style={{
            marginBottom: "15px"
          }}
        >
          <b>Status:</b>{" "}
          {visit.status}

          <br />

          <b>Date:</b>{" "}
          {new Date(
            visit.visitDate
          ).toLocaleString()}
        </div>
      ))
    ) : (
      <p>No Visits Found</p>
    )}

    <br />

    <button
  onClick={downloadHistoryPDF}
>
  Download PDF
</button>

{" "}

<button
  onClick={() =>
    setShowHistory(false)
  }
>
  Close
</button>
  </div>
)}
      <table style={tableStyle}>
        <thead>
          <tr><th
  style={{
    ...cellStyle,
    background: "#1f2937",
    color: "#60a5fa"
  }}
>
            ID</th>
            <th
  style={{
    ...cellStyle,
    background: "#1f2937",
    color: "#60a5fa"
  }}
>Name</th>
           <th
  style={{
    ...cellStyle,
    background: "#1f2937",
    color: "#60a5fa"
  }}
>Gender</th>
          <th
  style={{
    ...cellStyle,
    background: "#1f2937",
    color: "#60a5fa"
  }}
>Phone</th>
          <th
  style={{
    ...cellStyle,
    background: "#1f2937",
    color: "#60a5fa"
  }}
>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPatients.map((patient) => (
            <tr
  key={patient.patientId}
  onMouseEnter={(e) =>
    e.currentTarget.style.background =
      "#1f2937"
  }
  onMouseLeave={(e) =>
    e.currentTarget.style.background =
      "transparent"
  }
>
              <td style={cellStyle}>
                {patient.patientId}
              </td>

              <td style={cellStyle}>
                {patient.fullName}
              </td>

              <td style={cellStyle}>
                {patient.gender}
              </td>

              <td style={cellStyle}>
                {patient.phoneNumber}
              </td>

             <td style={cellStyle}>
  <button
    onClick={() =>
      editPatient(patient)
    }
  >
    Edit
  </button>

  {" "}

  <button
  style={{
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
}}
    onClick={() =>
      deletePatient(
        patient.patientId
      )
    }
  >
    Delete
  </button>

  {" "}

  <button
  style={{
  background: "#10b981",
  transition: "0.3s",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
}}
onMouseEnter={(e) => {
  e.currentTarget.style.boxShadow =
    "0 0 15px rgba(16,185,129,0.6)";
}}

onMouseLeave={(e) => {
  e.currentTarget.style.boxShadow =
    "none";
}}
    onClick={() =>
      viewHistory(
        patient.patientId
      )
    }
  >
    History
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const tableStyle = {
  margin: "0 auto",
  borderCollapse: "collapse",
  width: "95%",
  textAlign: "center",
  background:
    "linear-gradient(145deg,#111827,#1f2937)",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow:
    "0 0 30px rgba(59,130,246,0.12)"
};
const cellStyle = {
  border: "1px solid #374151",
  padding: "14px",
  color: "white"
};

export default PatientPage;