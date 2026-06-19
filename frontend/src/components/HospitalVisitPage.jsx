import { useEffect, useState } from "react";
import api from "../services/api";

function HospitalVisitPage() {
  const [visits, setVisits] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] =
    useState("");

  useEffect(() => {
    loadVisits();
    loadPatients();
  }, []);

  const loadVisits = async () => {
    try {
      const response = await api.get("/visits");
      setVisits(response.data);
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

  const createVisit = async () => {
    if (!selectedPatient) {
      alert("Select Patient");
      return;
    }

    try {
      await api.post(
        `/visits?patientId=${selectedPatient}`
      );

      setSelectedPatient("");

      loadVisits();

      alert("Visit Created");
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      await api.put(`/visits/${id}`, {
        status
      });

      loadVisits();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteVisit = async (id) => {
    try {
      await api.delete(`/visits/${id}`);

      loadVisits();
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
  🏥 Hospital Visit Management
</h1>

     <div style={cardStyle}>
  <h2>Create Visit</h2>

  <select
    value={selectedPatient}
    onChange={(e) =>
      setSelectedPatient(e.target.value)
    }
    style={inputStyle}
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

  <button
    onClick={createVisit}
    style={primaryBtn}
  >
    Create Visit
  </button>
</div>

<br />

  <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>Patient</th>
            <th style={cellStyle}>Visit Date</th>
            <th style={cellStyle}>Status</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {visits.map((visit) => (
            <tr key={visit.visitId}>
              <td style={cellStyle}>
                {visit.visitId}
              </td>

              <td style={cellStyle}>
                {visit.patient?.fullName}
              </td>

              <td style={cellStyle}>
                {visit.visitDate
                  ? new Date(
                      visit.visitDate
                    ).toLocaleString()
                  : ""}
              </td>

              <td style={cellStyle}>
  <span
    style={{
      padding: "6px 12px",
      borderRadius: "20px",
      color: "white",
      fontWeight: "bold",
      backgroundColor:
        visit.status === "COMPLETED"
          ? "green"
          : visit.status === "CANCELLED"
          ? "red"
          : "orange"
    }}
  >
    {visit.status}
  </span>
</td>

              <td style={cellStyle}>
                <button
  style={primaryBtn}
  onClick={() =>
    updateStatus(
      visit.visitId,
      "COMPLETED"
    )
  }
>
  Complete
</button>

                {"  "}

                <button
  style={dangerBtn}
  onClick={() => {
    if (
      window.confirm(
        "Delete this visit?"
      )
    ) {
      deleteVisit(
        visit.visitId
      );
    }
  }}
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
  width: "600px",
  margin: "0 auto",
  padding: "30px",
  borderRadius: "20px",
  background:
    "linear-gradient(145deg,#111827,#1f2937)",
  border:
    "1px solid rgba(255,255,255,0.08)",
  boxShadow:
    "0 0 30px rgba(59,130,246,0.15)"
};

const inputStyle = {
  width: "300px",
  padding: "12px",
  borderRadius: "10px",
    border: "1px solid #374151",
  background: "#0f172a",
  color: "white"
};

const primaryBtn = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer"
};

const dangerBtn = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "8px",
  background: "#dc2626",
  color: "white",
  cursor: "pointer"
};
export default HospitalVisitPage;