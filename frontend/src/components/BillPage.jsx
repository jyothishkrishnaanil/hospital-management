import { useEffect, useState } from "react";
import api from "../services/api";
import { jsPDF } from "jspdf";

function BillPage() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    loadBills();
    loadPatients();
  }, []);

  const loadBills = async () => {
    try {
      const response = await api.get("/bills");
      setBills(response.data);
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

  const createBill = async () => {
    try {
      await api.post(
        `/bills?patientId=${patientId}`,
        {
          amount: amount,
          paymentStatus: "PENDING"
        }
      );

      setPatientId("");
      setAmount("");

      loadBills();
    } catch (error) {
      console.error(error);
    }
  };

  const markPaid = async (id) => {
    try {
      await api.put(`/bills/${id}/pay`);
      loadBills();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBill = async (id) => {
    try {
      await api.delete(`/bills/${id}`);
      loadBills();
    } catch (error) {
      console.error(error);
    }
  };

  const downloadPDF = (bill) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(
      "Hospital Management System",
      20,
      20
    );

    doc.setFontSize(16);
    doc.text(
      "Patient Bill Invoice",
      20,
      35
    );

    doc.line(20, 40, 190, 40);

    doc.setFontSize(12);

    doc.text(
      `Bill ID: ${bill.billId}`,
      20,
      55
    );

    doc.text(
      `Patient: ${
        bill.patient?.fullName || ""
      }`,
      20,
      70
    );

    doc.text(
      `Amount: ₹ ${bill.amount}`,
      20,
      85
    );

    doc.text(
      `Status: ${bill.paymentStatus}`,
      20,
      100
    );

    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      20,
      115
    );

    doc.line(20, 130, 190, 130);

    doc.text(
      "Thank you for choosing our hospital.",
      20,
      145
    );

    doc.save(
      `Bill_${bill.billId}.pdf`
    );
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
  💳 Billing Management
</h1>
<div style={cardStyle}>
  <h3>Generate Bill</h3>


      <select
  style={inputStyle}
        value={patientId}
        onChange={(e) =>
          setPatientId(
            e.target.value
          )
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

      <input
  style={inputStyle}
  type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button
  onClick={createBill}
  style={primaryBtn}
>
  Generate Bill
</button>

<br />
<br />

</div>

<br />

     <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>
              Patient
            </th>
            <th style={cellStyle}>
              Amount
            </th>
            <th style={cellStyle}>
              Status
            </th>
            <th style={cellStyle}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {bills.map((bill) => (
            <tr key={bill.billId}>
              <td style={cellStyle}>
                {bill.billId}
              </td>

              <td style={cellStyle}>
                {
                  bill.patient
                    ?.fullName
                }
              </td>

              <td style={cellStyle}>
                ₹ {bill.amount}
              </td>

              <td style={cellStyle}>
  <span
    style={{
      padding: "6px 12px",
      borderRadius: "20px",
      color: "white",
      fontWeight: "bold",
     background:
  bill.paymentStatus === "PAID"
    ? "#16a34a"
    : "#f59e0b"
    }}
  >
    {bill.paymentStatus}
  </span>
</td>

              <td style={cellStyle}>
                {bill.paymentStatus !==
                  "PAID" && (
                 <button
  style={primaryBtn}
  onClick={() =>
    markPaid(bill.billId)
  }
>
                    Mark Paid
                  </button>
                )}

                {" "}

               <button
  style={secondaryBtn}
  onClick={() =>
    downloadPDF(bill)
  }
>
                  Download PDF
                </button>

                {" "}

                <button
  style={dangerBtn}
  onClick={() =>
    deleteBill(bill.billId)
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
  cursor: "pointer"
};

const secondaryBtn = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#7c3aed",
  color: "white",
  cursor: "pointer"
};

const dangerBtn = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#dc2626",
  color: "white",
  cursor: "pointer"
};

export default BillPage;