import { useEffect, useState } from "react";
import api from "../services/api";
import AddDoctor from "./AddDoctor";

function DoctorPage() {
  const [doctors, setDoctors] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response =
        await api.get("/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await api.delete(
        `/doctors/${id}`
      );
      loadDoctors();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredDoctors =
    doctors.filter((doctor) => {
      return (
        doctor.doctorName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        doctor.specialization
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        doctor.phoneNumber
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
      <h2
  style={{
    color: "#60a5fa",
    fontSize: "36px",
    marginBottom: "25px"
  }}
>
  🩺 Doctors Management
</h2>

      <AddDoctor
        onDoctorAdded={loadDoctors}
      />

      <br />

      <h3>Search Doctor</h3>

     <input
  type="text"
  placeholder="🔍 Search Name, Specialization or Phone"
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(
      e.target.value
    )
  }
  style={{
    padding: "12px",
    width: "400px",
    borderRadius: "10px",
    border: "1px solid #374151",
    backgroundColor: "#111827",
    color: "white",
    outline: "none"
  }}
/>

      <br />
      <br />

      <table
  style={{
    margin: "0 auto",
    borderCollapse: "collapse",
    width: "90%",
    background:
      "linear-gradient(145deg,#111827,#1f2937)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow:
      "0 0 30px rgba(59,130,246,0.15)"
  }}
>
        <thead>
          <tr>
            <th style={cellStyle}>
              ID
            </th>
            <th style={cellStyle}>
              Name
            </th>
            <th style={cellStyle}>
              Specialization
            </th>
            <th style={cellStyle}>
              Phone
            </th>
            <th style={cellStyle}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredDoctors.map(
            (doctor) => (
              <tr
                key={
                  doctor.doctorId
                }
              >
                <td
                  style={cellStyle}
                >
                  {
                    doctor.doctorId
                  }
                </td>

                <td
                  style={cellStyle}
                >
                  {
                    doctor.doctorName
                  }
                </td>

                <td
                  style={cellStyle}
                >
                  {
                    doctor.specialization
                  }
                </td>

                <td
                  style={cellStyle}
                >
                  {
                    doctor.phoneNumber
                  }
                </td>

                <td
                  style={cellStyle}
                >
                 <button
  onClick={() =>
    deleteDoctor(
      doctor.doctorId
    )
  }
  style={{
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold"
  }}
>
  Delete
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

const cellStyle = {
  border: "1px solid #374151",
  padding: "14px",
  color: "white",
  backgroundColor: "#111827"
};

export default DoctorPage;