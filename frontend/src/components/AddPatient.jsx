import { useState } from "react";
import api from "../services/api";

function AddPatient({ onPatientAdded }) {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const addPatient = async () => {
    try {
      await api.post("/patients", {
        fullName,
        gender,
        phoneNumber
      });

      setFullName("");
      setGender("");
      setPhoneNumber("");

      onPatientAdded();
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
        ➕ Add Patient
      </h2>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) =>
          setFullName(e.target.value)
        }
        style={inputStyle}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Gender"
        value={gender}
        onChange={(e) =>
          setGender(e.target.value)
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
        onClick={addPatient}
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
        Add Patient
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #374151",
  backgroundColor: "#111827",
  color: "white",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box"
};

export default AddPatient;