import { useState } from "react";
import api from "../services/api";

function AddDoctor({ onDoctorAdded }) {
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const addDoctor = async () => {
    try {
      await api.post("/doctors", {
        doctorName,
        specialization,
        phoneNumber
      });

      setDoctorName("");
      setSpecialization("");
      setPhoneNumber("");

      onDoctorAdded();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        width: "500px",
        margin: "0 auto 40px auto",
        padding: "30px",
        borderRadius: "20px",
        background:
          "linear-gradient(145deg,#111827,#1f2937)",
        border:
          "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 0 30px rgba(59,130,246,0.15)"
      }}
    >
      <h2
        style={{
          color: "#60a5fa",
          marginBottom: "25px"
        }}
      >
        🩺 Add Doctor
      </h2>

      <input
        type="text"
        placeholder="Doctor Name"
        value={doctorName}
        onChange={(e) =>
          setDoctorName(e.target.value)
        }
        style={inputStyle}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Specialization"
        value={specialization}
        onChange={(e) =>
          setSpecialization(e.target.value)
        }
        style={inputStyle}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) =>
          setPhoneNumber(e.target.value)
        }
        style={inputStyle}
      />

      <br />
      <br />

      <button
        onClick={addDoctor}
        style={{
          width: "100%",
          padding: "12px",
          border: "none",
          borderRadius: "10px",
          background:
            "linear-gradient(135deg,#2563eb,#3b82f6)",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "16px",
          boxShadow:
            "0 0 15px rgba(59,130,246,0.3)"
        }}
      >
        Add Doctor
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #374151",
  backgroundColor: "#0f172a",
  color: "white",
  fontSize: "15px",
  boxSizing: "border-box"
};

export default AddDoctor;