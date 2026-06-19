import { useEffect, useState } from "react";
import api from "../services/api";

function MedicalRecordPage() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

  useEffect(() => {
    loadRecords();
    loadPatients();
    loadDoctors();
  }, []);

  const loadRecords = async () => {
    const response = await api.get("/medical-records");
    setRecords(response.data);
  };

  const loadPatients = async () => {
    const response = await api.get("/patients");
    setPatients(response.data);
  };

  const loadDoctors = async () => {
    const response = await api.get("/doctors");
    setDoctors(response.data);
  };

  const saveRecord = async () => {
    try {
      await api.post(
        `/medical-records?patientId=${patientId}&doctorId=${doctorId}`,
        {
          diagnosis,
          prescription
        }
      );

      setDiagnosis("");
      setPrescription("");
      setPatientId("");
      setDoctorId("");

      loadRecords();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRecord = async (id) => {
    try {
      await api.delete(`/medical-records/${id}`);
      loadRecords();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1
  style={{
    fontSize: "42px",
    color: "#60a5fa",
    marginBottom: "25px",
    textShadow:
      "0 0 20px rgba(96,165,250,0.4)"
  }}
>
  📋 Medical Records
</h1>
<div style={cardStyle}>
  <h3>Create Medical Record</h3>
     <select
  style={inputStyle}
  value={patientId}
  onChange={(e) =>
    setPatientId(e.target.value)
  }
>
        <option value="">Select Patient</option>

        {patients.map((patient) => (
          <option
            key={patient.patientId}
            value={patient.patientId}
          >
            {patient.fullName}
          </option>
        ))}
      </select>

      <br /><br />
</div>

<br />
     <select
  style={inputStyle}
  value={doctorId}
  onChange={(e) =>
    setDoctorId(e.target.value)
  }
>
        <option value="">Select Doctor</option>

        {doctors.map((doctor) => (
          <option
            key={doctor.doctorId}
            value={doctor.doctorId}
          >
            {doctor.doctorName}
          </option>
        ))}
      </select>

      <br /><br />

      <input
  style={inputStyle}
  placeholder="Diagnosis"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
      />

      <br /><br />

      <textarea
  style={{
    ...inputStyle,
    height: "100px",
    width: "300px"
  }}
        placeholder="Prescription"
        value={prescription}
        onChange={(e) => setPrescription(e.target.value)}
      />

      <br /><br />

      <button
  onClick={saveRecord}
  style={primaryBtn}
>
  Save Record
</button>

      <br /><br />

     <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>Patient</th>
            <th style={cellStyle}>Doctor</th>
            <th style={cellStyle}>Diagnosis</th>
            <th style={cellStyle}>Prescription</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr key={record.recordId}>
              <td style={cellStyle}>{record.recordId}</td>

              <td style={cellStyle}>
                {record.patient?.fullName}
              </td>

              <td style={cellStyle}>
                {record.doctor?.doctorName}
              </td>

              <td style={cellStyle}>
                {record.diagnosis}
              </td>

              <td style={cellStyle}>
                {record.prescription}
              </td>

              <td style={cellStyle}>
                <button
                  onClick={() =>
                    deleteRecord(record.recordId)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
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
  padding: "12px 18px",
  border: "none",
  borderRadius: "10px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow:
    "0 0 15px rgba(37,99,235,0.35)"
};
const tableStyle = {
  width: "90%",
  margin: "0 auto",
  borderCollapse: "collapse",
  background: "#111827",
  borderRadius: "12px",
  overflow: "hidden"
};

const cellStyle = {
  border: "1px solid #374151",
  padding: "12px"
};

export default MedicalRecordPage;