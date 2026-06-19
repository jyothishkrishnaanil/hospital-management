import { useState, useEffect } from "react";
import api from "./services/api";
import { jsPDF } from "jspdf";
import PatientPage from "./components/PatientPage";
import DoctorPage from "./components/DoctorPage";
import AppointmentPage from "./components/AppointmentPage";
import MedicalRecordPage from "./components/MedicalRecordPage";
import BillPage from "./components/BillPage";
import PrescriptionPage from "./components/PrescriptionPage";
import HospitalVisitPage from "./components/HospitalVisitPage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
const [role, setRole] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
const [recentAppointments,
  setRecentAppointments] =
  useState([]);
  const [appointmentStatusData,
  setAppointmentStatusData] =
  useState([]);
  const [activePage, setActivePage] =
    useState("dashboard");

const [stats, setStats] = useState({
  totalPatients: 0,
  totalDoctors: 0,
  totalAppointments: 0,
  totalBills: 0,
  totalMedicalRecords: 0,
  totalPrescriptions: 0,
  totalVisits: 0,
  waitingQueue: 0,
  priorityPatients: 0,
  totalRevenue: 0
});

 const handleLogin = async () => {
  try {
    const response = await api.post("/login", {
      username,
      password
    });

    console.log(response.data);

    if (
      response.data.message ===
      "Login Successful"
    ) {
      setLoggedIn(true);

      setRole(
        response.data.role
      );

      setMessage(
        `Login Successful as ${response.data.role}`
      );
    } else {
      setMessage(
        response.data.message
      );
    }
  } catch (error) {
    console.error(error);

    setMessage(
      "Server Error. Please try again."
    );
  }
};

  useEffect(() => {
    if (loggedIn) {
      api
        .get("/dashboard")
        .then((response) => {
          setStats(response.data);

setRecentAppointments(
  response.data.recentAppointments || []
);
setAppointmentStatusData([
  {
    name: "BOOKED",
    value:
      response.data.bookedAppointments || 0
  },
  {
    name: "COMPLETED",
    value:
      response.data.completedAppointments || 0
  },
  {
    name: "CANCELLED",
    value:
      response.data.cancelledAppointments || 0
  }
]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [loggedIn]);
  const chartData = [
  {
  name: "Queue",
  value: stats.waitingQueue
},
{
  name: "Priority",
  value: stats.priorityPatients
},
    {
    name: "Patients",
    value: stats.totalPatients
  },
  {
    name: "Doctors",
    value: stats.totalDoctors
  },
  {
    name: "Appointments",
    value: stats.totalAppointments
  },
  {
    name: "Bills",
    value: stats.totalBills
  },
  {
    name: "Records",
    value: stats.totalMedicalRecords
  },
  {
    name: "Prescriptions",
    value: stats.totalPrescriptions
  },
  {
    name: "Visits",
    value: stats.totalVisits
  }
];
const downloadDashboardPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text(
    "Hospital Dashboard Report",
    20,
    20
  );

  doc.setFontSize(12);

  doc.text(
    `Total Patients: ${stats.totalPatients}`,
    20,
    50
  );

  doc.text(
    `Total Doctors: ${stats.totalDoctors}`,
    20,
    65
  );

  doc.text(
    `Total Appointments: ${stats.totalAppointments}`,
    20,
    80
  );

  doc.text(
    `Total Bills: ${stats.totalBills}`,
    20,
    95
  );

  doc.text(
    `Total Medical Records: ${stats.totalMedicalRecords}`,
    20,
    110
  );

  doc.text(
    `Total Prescriptions: ${stats.totalPrescriptions}`,
    20,
    125
  );

  doc.text(
    `Total Hospital Visits: ${stats.totalVisits}`,
    20,
    140
  );

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    20,
    170
  );

  doc.save(
    "Hospital_Dashboard_Report.pdf"
  );
};
  const renderPage = () => {
    switch (activePage) {
      case "patients":
        return <PatientPage />;

      case "doctors":
        return <DoctorPage />;

      case "appointments":
        return <AppointmentPage />;

      case "medical":
        return <MedicalRecordPage />;

      case "bills":
        return <BillPage />;

      case "prescriptions":
        return <PrescriptionPage />;

      case "visits":
        return <HospitalVisitPage />;

      default:
        return (
          <div>
<div
  style={{
    background:
      "linear-gradient(135deg,#1e293b,#0f172a)",
    borderRadius: "24px",
    padding: "35px",
    marginBottom: "35px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.3)"
  }}
>
  <h1
    style={{
      color: "#60a5fa",
      margin: 0,
      fontSize: "56px"
    }}
  >
    🏥 Hospital Dashboard
  </h1>

  <h3
    style={{
      color: "#cbd5e1",
      marginTop: "10px"
    }}
  >
    Welcome back, {role}
  </h3>

  <div
    style={{
      display: "flex",
      gap: "24px",
      marginTop: "25px",
      flexWrap: "wrap"
    }}
  >
    <div
      style={{
        background: "#111827",
        padding: "15px 25px",
        borderRadius: "14px"
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: "14px"
        }}
      >
        Active Queue
      </div>

      <div
        style={{
          color: "#ffffff",
          fontSize: "28px",
          fontWeight: "bold"
        }}
      >
        {stats.waitingQueue}
      </div>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "15px 25px",
        borderRadius: "14px"
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: "14px"
        }}
      >
        Priority Patients
      </div>

      <div
        style={{
          color: "#facc15",
          fontSize: "28px",
          fontWeight: "bold"
        }}
      >
        {stats.priorityPatients}
      </div>
    </div>

    <div
      style={{
        background: "#111827",
        padding: "15px 25px",
        borderRadius: "14px"
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: "14px"
        }}
      >
        Total Appointments
      </div>

      <div
        style={{
          color: "#60a5fa",
          fontSize: "28px",
          fontWeight: "bold"
        }}
      >
        {stats.totalAppointments}
      </div>
    </div>
  </div>
</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
"repeat(4, 1fr)",
                gap: "24px",
                justifyContent: "center",
                marginTop: "30px"
              }}
            >
  <div
  style={{
    ...cardStyle,
    cursor: "pointer"
  }}
  onClick={() =>
    setActivePage("patients")
  }
onMouseEnter={(e) => {
  e.currentTarget.style.transform =
    "translateY(-8px)";
  e.currentTarget.style.boxShadow =
    "0 0 30px rgba(59,130,246,0.35)";
}}
 onMouseLeave={(e) => {
  e.currentTarget.style.transform =
    "translateY(0px)";
  e.currentTarget.style.boxShadow =
    "0 10px 30px rgba(0,0,0,0.25)";
}}
>
                <div style={{ fontSize: "32px" }}>👤</div>

<div
  style={{
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "10px",
    color: "#cbd5e1"
  }}
>
  Patients
</div>

<div
  style={{
    fontSize: "42px",
    fontWeight: "bold",
    marginTop: "15px",
    color: "white"
  }}
>
  {stats.totalPatients}
</div>
              </div>

        <div
  style={{
    ...cardStyle,
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#0f172a,#1e293b)",
    border:
      "1px solid #3b82f6",
    boxShadow:
      "0 0 20px rgba(59,130,246,0.2)"
      
  }}onClick={() =>
  setActivePage("doctors")
}
onMouseEnter={(e) => {
  e.currentTarget.style.transform =
    "translateY(-8px)";
  e.currentTarget.style.boxShadow =
    "0 0 30px rgba(59,130,246,0.35)";
}}
 onMouseLeave={(e) => {
  e.currentTarget.style.transform =
    "translateY(0px)";
  e.currentTarget.style.boxShadow =
    "0 10px 30px rgba(0,0,0,0.25)";
}}
>
  <div style={{ fontSize: "32px" }}>🩺</div>

<div
  style={{
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "10px",
    color: "#cbd5e1"
  }}
>
  Doctors
</div>

<div
  style={{
    fontSize: "42px",
    fontWeight: "bold",
    marginTop: "15px",
    color: "white"
  }}
>
  {stats.totalDoctors}
</div>
</div>

<div
  style={{
    ...cardStyle,
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#0f172a,#1e293b)",
    border:
      "1px solid #06b6d4",
    boxShadow:
      "0 0 20px rgba(6,182,212,0.2)"
  }}
  onClick={() => setActivePage("appointments")}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform =
      "translateY(-8px)";
    e.currentTarget.style.boxShadow =
      "0 0 35px rgba(6,182,212,0.5)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "translateY(0px)";
    e.currentTarget.style.boxShadow =
      "0 0 20px rgba(6,182,212,0.2)";
  }}
>
  <div style={{ fontSize: "32px" }}>📅</div>

<div
  style={{
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "10px",
    color: "#cbd5e1"
  }} 

 
>
  Appointments
</div>

<div
  style={{
    fontSize: "42px",
    fontWeight: "bold",
    marginTop: "15px",
    color: "white"
  }}
>
  {stats.totalAppointments}
</div>
</div>
   <div
  style={{
    ...cardStyle,
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#0f172a,#1e293b)",
    border:
      "1px solid #8b5cf6",
    boxShadow:
      "0 0 20px rgba(139,92,246,0.2)"
  }}
  onMouseEnter={(e) => {
  e.currentTarget.style.transform =
    "translateY(-8px)";
  e.currentTarget.style.boxShadow =
    "0 0 35px rgba(139,92,246,0.5)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform =
    "translateY(0px)";
  e.currentTarget.style.boxShadow =
    "0 0 20px rgba(139,92,246,0.2)";
}}
>
  <div style={{ fontSize: "32px" }}>⏳</div>

<div
  style={{
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "10px",
    color: "#cbd5e1"
  }}
>
  Queue
</div>

<div
  style={{
    fontSize: "42px",
    fontWeight: "bold",
    marginTop: "15px",
    color: "white"
  }}
>
  {stats.waitingQueue}
</div>
</div>

<div
  style={{
    ...cardStyle,
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#0f172a,#1e293b)",
    border:
      "1px solid #eab308",
    boxShadow:
      "0 0 20px rgba(234,179,8,0.2)"
  }}
  onMouseEnter={(e) => {
  e.currentTarget.style.transform =
    "translateY(-8px)";
  e.currentTarget.style.boxShadow =
    "0 0 35px rgba(234,179,8,0.5)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform =
    "translateY(0px)";
  e.currentTarget.style.boxShadow =
    "0 0 20px rgba(234,179,8,0.2)";
}}
>
  <div style={{ fontSize: "32px" }}>⭐</div>

<div
  style={{
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "10px",
    color: "#cbd5e1"
  }}
>
  Priority
</div>

<div
  style={{
    fontSize: "42px",
    fontWeight: "bold",
    marginTop: "15px",
    color: "white"
  }}
>
  {stats.priorityPatients}
</div>
</div>

              <div
style={{
  ...cardStyle,
  cursor: "pointer",
  background:
    "linear-gradient(135deg,#0f172a,#1e293b)",
  border:
    "1px solid #10b981",
  boxShadow:
    "0 0 20px rgba(16,185,129,0.2)"
}} onClick={() => setActivePage("bills")}
 onMouseEnter={(e) => {
  e.currentTarget.style.transform =
    "translateY(-8px)";
  e.currentTarget.style.boxShadow =
    "0 0 35px rgba(16,185,129,0.5)"
}}
  onMouseLeave={(e) => {
  e.currentTarget.style.transform =
    "translateY(0px)";
  e.currentTarget.style.boxShadow =
    "0 10px 30px rgba(0,0,0,0.25)";
}}
>

                <h3>💳 Bills</h3>
<h2>{stats.totalBills}</h2>
              </div>
              <div
  style={{
    ...cardStyle,
    border: "1px solid #10b981"
  }}
>
  <h3>💰 Revenue</h3>
  <h2>₹ {stats.totalRevenue}</h2>
</div>

  <div
  style={{
    ...cardStyle,
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#0f172a,#1e293b)",
    border:
      "1px solid #ec4899",
    boxShadow:
      "0 0 20px rgba(236,72,153,0.2)"
  }}onClick={() => setActivePage("medical")}
 onMouseEnter={(e) => {
  e.currentTarget.style.transform =
    "translateY(-8px)";
  e.currentTarget.style.boxShadow =
    "0 0 35px rgba(16,185,129,0.5)"
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform =
    "translateY(0px)";
  e.currentTarget.style.boxShadow =
    "0 10px 30px rgba(0,0,0,0.25)";
}}
>
  <h3>📋 Medical Records</h3>
  <h2>{stats.totalMedicalRecords}</h2>
</div>

<div
  style={{
    ...cardStyle,
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#0f172a,#1e293b)",
    border:
      "1px solid #f97316",
    boxShadow:
      "0 0 20px rgba(249,115,22,0.2)"
  }}onClick={() => setActivePage("visits")}
  onMouseEnter={(e) => {
  e.currentTarget.style.transform =
    "translateY(-8px)";
  e.currentTarget.style.boxShadow =
    "0 0 35px rgba(16,185,129,0.5)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform =
    "translateY(0px)";
  e.currentTarget.style.boxShadow =
    "0 10px 30px rgba(0,0,0,0.25)";
}}
>
  <h3>💊 Prescriptions</h3>
  <h2>{stats.totalPrescriptions}</h2>
</div>
<div
  style={{
    ...cardStyle,
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#0f172a,#1e293b)",
    border:
      "1px solid #6366f1",
    boxShadow:
      "0 0 20px rgba(99,102,241,0.2)"
  }}
  onMouseEnter={(e) => {
  e.currentTarget.style.transform =
    "translateY(-8px)";
  e.currentTarget.style.boxShadow =
    "0 0 35px rgba(16,185,129,0.5)";
}}
 onMouseLeave={(e) => {
  e.currentTarget.style.transform =
    "translateY(0px)";
  e.currentTarget.style.boxShadow =
    "0 10px 30px rgba(0,0,0,0.25)";
}}
>
  <h3>🏥 Hospital Visits</h3>

  
  <h2>{stats.totalVisits}</h2>
  
</div>
     
            </div>
            
            
            <br />
<div
  style={{
    width: "90%",
    height: "450px",
    margin: "40px auto",
   background:
  "linear-gradient(145deg,#111827,#1f2937)",

boxShadow:
  "0 0 40px rgba(59,130,246,0.15)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #374151"
  }}
>
  <h3>
    Hospital Statistics
  </h3>

  <ResponsiveContainer
    width="100%"
    height="85%"
  >
    <BarChart
      data={chartData}
    >
<XAxis
  dataKey="name"
  stroke="#d1d5db"
  angle={-35}
  textAnchor="end"
  height={80}
/>
<YAxis
  stroke="#d1d5db"
/>

      <Tooltip
  contentStyle={{
    backgroundColor: "#111827",
    border: "1px solid #374151",
    color: "white"
  }}
/>

 <Bar
  dataKey="value"
  fill="#3b82f6"
  radius={[8, 8, 0, 0]}
  label={{
    position: "top",
    fill: "#d1d5db"
  }}
/>
    </BarChart>
  </ResponsiveContainer>
</div>
<div
  style={{
    marginTop: "40px",
    background:
      "linear-gradient(145deg,#111827,#1f2937)",
    padding: "20px",
    borderRadius: "20px",
    border: "1px solid #374151"
  }}
>
  <h2
    style={{
      color: "#60a5fa"
    }}
  >
    Recent Appointments
  </h2>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse"
    }}
  >
    <thead>
      <tr>
        <th style={cellStyle}>Patient</th>
        <th style={cellStyle}>Doctor</th>
        <th style={cellStyle}>Token</th>
        <th style={cellStyle}>Status</th>
      </tr>
    </thead>

    <tbody>
      {recentAppointments.map(
        (appointment) => (
          <tr
            key={
              appointment.appointmentId
            }
          >
            <td style={cellStyle}>
              {
                appointment.patient
                  ?.fullName
              }
            </td>

            <td style={cellStyle}>
              {
                appointment.doctor
                  ?.doctorName
              }
            </td>

            <td style={cellStyle}>
              {
                appointment.tokenNumber
              }
            </td>

            <td style={cellStyle}>
              {
                appointment.status
              }
            </td>
          </tr>
        )
      )}
    </tbody>
  </table>
</div>
<div
  style={{
    width: "90%",
    height: "400px",
    margin: "40px auto",
    background:
      "linear-gradient(145deg,#111827,#1f2937)",
    borderRadius: "20px",
    padding: "20px",
    border: "1px solid #374151"
  }}
>
  <h3>
    Appointment Status
  </h3>

  <ResponsiveContainer
    width="100%"
    height="90%"
  >
    <PieChart>
      <Pie
  data={appointmentStatusData}
  dataKey="value"
  nameKey="name"
  outerRadius={120}
  label
>
  {appointmentStatusData.map(
    (entry, index) => (
      <Cell
        key={index}
        fill={
          [
            "#3b82f6", // BOOKED
            "#22c55e", // COMPLETED
            "#ef4444"  // CANCELLED
          ][index]
        }
      />
    )
  )}
</Pie>

      <Legend />
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>
<button
  onClick={downloadDashboardPDF}
 style={{
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#2563eb",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow:
    "0 2px 5px rgba(0,0,0,0.3)"
}}
>
  Download Dashboard PDF
</button>
          </div>
        );
    }
  };
  

  if (loggedIn) {
    return (
<div
  style={{
    display: "flex",
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0f172a,#111827,#1e293b)"
  }}
>
        <div
          style={{
            width: "280px",
background:
  "rgba(17,24,39,0.95)",
backdropFilter: "blur(12px)",
padding: "24px",
borderRight: "1px solid rgba(255,255,255,0.08)",
boxShadow:
  "8px 0 30px rgba(0,0,0,0.3)"
          }}
        >
<div
  style={{
    textAlign: "center",
    marginBottom: "35px"
  }}
>
  <div
    style={{
      fontSize: "48px"
    }}
  >
    🏥
  </div>

  <h2
    style={{
      color: "#ffffff",
      margin: 0,
      fontSize: "28px"
    }}
  >
    HMS
  </h2>

  <p
    style={{
      color: "#94a3b8",
      marginTop: "8px"
    }}
  >
    Hospital Management System
  </p>
</div>

 <button
  style={{
    ...sidebarButton,
    backgroundColor:
      activePage === "dashboard"
? "linear-gradient(135deg,#2563eb,#3b82f6)"
: "transparent"

  }}
  onClick={() =>
    setActivePage("dashboard")
  }
>
  🏠 Dashboard
</button>

          {(role === "ADMIN" ||
  role === "RECEPTIONIST") && (
  <button
    style={{
      ...sidebarButton,
      backgroundColor:
        activePage === "patients"
          ? "#2563eb"
          : "#6b7280"
    }}
    onClick={() =>
      setActivePage("patients")
    }
  >
    👤 Patients
  </button>
)}

          {role === "ADMIN" && (
  <button
    style={{
      ...sidebarButton,
      backgroundColor:
        activePage === "doctors"
          ? "#2563eb"
          : "#6b7280"
    }}
    onClick={() =>
      setActivePage("doctors")
    }
  >
    🩺 Doctors
  </button>
)}

          <button
  style={{
    ...sidebarButton,
    backgroundColor:
      activePage === "appointments"
        ? "#2563eb"
        : "#6b7280"
  }}
  onClick={() =>
    setActivePage("appointments")
  }
>
  📅 Appointments
</button>

          <button
  style={{
    ...sidebarButton,
    backgroundColor:
      activePage === "medical"
        ? "#2563eb"
        : "#6b7280"
  }}
  onClick={() =>
    setActivePage("medical")
  }
>
  📋 Medical Records
</button>

          <button
  style={{
    ...sidebarButton,
    backgroundColor:
      activePage === "prescriptions"
        ? "#2563eb"
        : "#6b7280"
  }}
  onClick={() =>
    setActivePage("prescriptions")
  }
>
  💊 Prescriptions
</button>
{(role === "ADMIN" ||
  role === "RECEPTIONIST") && (
         <button
  style={{
    ...sidebarButton,
    backgroundColor:
      activePage === "bills"
        ? "#2563eb"
        : "#6b7280"
  }}
  onClick={() =>
    setActivePage("bills")
  }
>
  💳 Bills
  
</button>
  )}
  
  {(role === "ADMIN" ||
  role === "RECEPTIONIST") && (
          <button
  style={{
    ...sidebarButton,
    backgroundColor:
      activePage === "visits"
        ? "#2563eb"
        : "#6b7280"
  }}
  onClick={() =>
    setActivePage("visits")
  }
>
  🏥 Hospital Visits
   

</button>
  )}
          <button
  style={{
    ...sidebarButton,
    marginTop: "30px",
    backgroundColor: "#dc2626"
  }}
  onClick={() =>
    setLoggedIn(false)
  }
>
 🚪 Logout
</button>
        </div>

       <div
  style={{
    flex: 1,
    padding: "30px"
  }}
>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
      background:
        "linear-gradient(135deg,#111827,#1e293b)",
      padding: "15px 25px",
      borderRadius: "15px",
      border: "1px solid #374151",
      boxShadow:
        "0 8px 25px rgba(0,0,0,0.3)"
    }}
  >

    <div>
      <h2
        style={{
          margin: 0,
          color: "#60a5fa"
        }}
      >
        Hospital Management System
      </h2>

      <p
        style={{
          margin: 0,
          color: "#9ca3af"
        }}
      >
        Welcome back, {role}
      </p>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px"
      }}
    >
      <span
        style={{
          fontSize: "24px"
        }}
      >
        🔔
      </span>

      <div
        style={{
          backgroundColor: "#2563eb",
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontWeight: "bold"
        }}
      >
        {role.charAt(0)}
      </div>
    </div>

  </div>

  {renderPage()}
</div>
      </div>
    );
  }

 return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#030712"
    }}
  >
    <div
      style={{
        width: "350px",
        padding: "30px",
        borderRadius: "12px",
        backgroundColor: "#111827",
        boxShadow:
          "0 4px 15px rgba(0,0,0,0.4)",
        textAlign: "center"
      }}
    >
      <h1
  style={{
    color: "#60a5fa",
    marginBottom: "5px",
    fontSize: "36px"
  }}
>
  🏥 HMS
</h1>

<h3
  style={{
    color: "#d1d5db",
    marginTop: "0"
  }}
>
  Hospital Management System
</h3>
      <p
        style={{
          color: "#9ca3af",
          marginBottom: "25px"
        }}
      >
        Admin Login
      </p>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
        style={{
          width: "90%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #374151"
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        style={{
          width: "90%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #374151"
        }}
      />

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "12px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#2563eb",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Login
      </button>

      <p
        style={{
          marginTop: "15px",
          color: "#f87171"
        }}
      >
        {message}
      </p>
    </div>
  </div>
);
}

const cardStyle = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "20px",
  padding: "18px",
  minHeight: "140px",
  background:
    "linear-gradient(145deg,#111827,#1f2937)",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.25)",
  transition: "all 0.3s ease"
};
const cellStyle = {
  border: "1px solid #374151",
  padding: "12px",
  textAlign: "center"
};
const sidebarButton = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  border: "none",
  cursor: "pointer",
  borderRadius: "8px",
  color: "white",
  fontWeight: "bold",
  fontSize: "14px",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
};

export default App;