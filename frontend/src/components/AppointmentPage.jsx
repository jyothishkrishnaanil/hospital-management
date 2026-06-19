import { useEffect, useState } from "react";
import api from "../services/api";

function AppointmentPage() {
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [searchPatient, setSearchPatient] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");

  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [specialization, setSpecialization] = useState("");

  useEffect(() => {
    loadAppointments();
    loadQueue();
    loadPatients();
    loadDoctors();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await api.get("/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadQueue = async () => {
    try {
      const queueResponse = await api.get("/queue");
      setQueue(queueResponse.data);

      const currentResponse = await api.get("/current-token");
      setCurrentPatient(currentResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadPatients = async () => {
    const response = await api.get("/patients");
    setPatients(response.data);
  };

  const loadDoctors = async () => {
    const response = await api.get("/doctors");
    setDoctors(response.data);
  };

  const handleSpecializationChange = (value) => {
    setSpecialization(value);

    const filtered = doctors.filter(
      (doctor) =>
        doctor.specialization &&
        doctor.specialization.toLowerCase() === value.toLowerCase()
    );

    setFilteredDoctors(filtered);

    if (filtered.length > 0) {
      setSelectedDoctor(filtered[0].doctorId);
    } else {
      setSelectedDoctor("");
    }
  };

  const createAppointment = async () => {
    if (!selectedPatient || !selectedDoctor) {
      alert("Please select patient and doctor");
      return;
    }

    await api.post(
      `/appointments?patientId=${selectedPatient}&doctorId=${selectedDoctor}`
    );

    loadAppointments();
    loadQueue();
  };

  const completeAppointment = async (id) => {
    await api.put(`/appointments/${id}/complete`);
    loadAppointments();
    loadQueue();
  };

  const cancelAppointment = async (id) => {
    await api.put(`/appointments/${id}/cancel`);
    loadAppointments();
    loadQueue();
  };

  const returnPatient = async (id) => {
    await api.put(`/appointments/${id}/return`);
    loadAppointments();
    loadQueue();
  };

  const callNextPatient = async () => {
    await api.put("/appointments/call-next");
    loadAppointments();
    loadQueue();
  };

  const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  const filteredAppointments = appointments.filter((appointment) => {
    const patientMatch =
      appointment.patient?.fullName?.toLowerCase()
        .includes(searchPatient.toLowerCase());

    const statusMatch =
      statusFilter === "" || appointment.status === statusFilter;

    const doctorMatch =
      doctorFilter === "" ||
      appointment.doctor?.doctorName === doctorFilter;

    return patientMatch && statusMatch && doctorMatch;
  });

  return (
    <div style={pageStyle}>
     <h1
  style={{
    marginBottom: "25px",
    fontSize: "42px",
    color: "#60a5fa",
    textShadow:
      "0 0 20px rgba(96,165,250,0.4)"
  }}
>
  📅 Appointment Management
</h1>

      <div style={topGrid}>
        <div style={cardStyle}>
          <h3>Current Patient</h3>
          <div style={tokenStyle}>
            #{currentPatient?.tokenNumber || "-"}
          </div>
          <h2>{currentPatient?.patient?.fullName || "No Patient"}</h2>

          <button style={primaryBtn} onClick={callNextPatient}>
            Call Next Patient
          </button>
        </div>

        <div style={cardStyle}>
          <h3>Waiting Queue</h3>

          {queue.length === 0 ? (
            <p>No Patients Waiting</p>
          ) : (
            queue.map((appointment) => (
              <div key={appointment.appointmentId} style={queueCard}>
                <div style={{fontWeight:"bold",color:"#60a5fa"}}>
                  Token #{appointment.tokenNumber}
                </div>

                <div>{appointment.patient?.fullName}</div>

                {appointment.returningPatient && (
                  <div style={priorityBadge}>⭐ PRIORITY</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={cardStyle}>
        <h3>Filters & Booking</h3>

        <div style={row}>
          <input
            style={inputStyle}
            placeholder="Search Patient"
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
          />

          <select style={inputStyle} value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="BOOKED">BOOKED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <select style={inputStyle} value={doctorFilter} onChange={(e)=>setDoctorFilter(e.target.value)}>
            <option value="">All Doctors</option>
            {doctors.map((doctor)=>(
              <option key={doctor.doctorId} value={doctor.doctorName}>
                {doctor.doctorName}
              </option>
            ))}
          </select>
        </div>

        <div style={row}>
          <select style={inputStyle} value={selectedPatient} onChange={(e)=>setSelectedPatient(e.target.value)}>
            <option value="">Select Patient</option>
            {patients.map((patient)=>(
              <option key={patient.patientId} value={patient.patientId}>
                {patient.fullName}
              </option>
            ))}
          </select>

          <select style={inputStyle} value={specialization} onChange={(e)=>handleSpecializationChange(e.target.value)}>
            <option value="">Select Department</option>
            {specializations.map((spec)=>(
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          <select style={inputStyle} value={selectedDoctor} onChange={(e)=>setSelectedDoctor(e.target.value)}>
            <option value="">Select Doctor</option>
            {filteredDoctors.map((doctor)=>(
              <option key={doctor.doctorId} value={doctor.doctorId}>
                {doctor.doctorName}
              </option>
            ))}
          </select>

          <button style={primaryBtn} onClick={createAppointment}>
            Book Appointment
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>ID</th>
<th style={cellStyle}>Patient</th>
<th style={cellStyle}>Doctor</th>
<th style={cellStyle}>Token</th>
<th style={cellStyle}>Date</th>
<th style={cellStyle}>Status</th>
<th style={cellStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((appointment)=>(
              <tr key={appointment.appointmentId}>
  <td style={cellStyle}>
    {appointment.appointmentId}
  </td>

  <td style={cellStyle}>
    {appointment.patient?.fullName}
  </td>

  <td style={cellStyle}>
    {appointment.doctor?.doctorName}
  </td>

  <td style={cellStyle}>
    {appointment.tokenNumber}
  </td>

  <td style={cellStyle}>
    {new Date(
      appointment.appointmentDate
    ).toLocaleString()}
  </td>

  <td style={cellStyle}>
    {appointment.status}
  </td>

  <td style={cellStyle}>
                  {appointment.status === "BOOKED" && (
                    <>
                      <button style={primaryBtn} onClick={()=>completeAppointment(appointment.appointmentId)}>Complete</button>
                      <button style={dangerBtn} onClick={()=>cancelAppointment(appointment.appointmentId)}>Cancel</button>
                      {!appointment.returningPatient && (
                        <button style={secondaryBtn} onClick={()=>returnPatient(appointment.appointmentId)}>
                          Return From Test
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const pageStyle={padding:"20px",color:"white"};
const topGrid={display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"20px"};
const cardStyle={
  background:
    "linear-gradient(145deg,#111827,#1f2937)",
  border:"1px solid #374151",
  borderRadius:"20px",
  padding:"20px",
  boxShadow:
    "0 0 25px rgba(59,130,246,0.12)"
};
const tokenStyle={
  fontSize:"48px",
  fontWeight:"bold",
  color:"#60a5fa",
  textShadow:
    "0 0 20px rgba(96,165,250,0.6)"
};
const queueCard={
  background:
    "linear-gradient(145deg,#1f2937,#111827)",
  padding:"14px",
  borderRadius:"12px",
  marginBottom:"12px",
  border:"1px solid #374151"
};
const priorityBadge={
  color:"#facc15",
  fontWeight:"bold",
  textShadow:
    "0 0 12px rgba(250,204,21,0.6)"
};
const row={display:"flex",gap:"10px",flexWrap:"wrap",marginBottom:"10px"};
const inputStyle={
  padding:"12px",
  borderRadius:"10px",
  minWidth:"220px",
  background:"#0f172a",
  color:"white",
  border:"1px solid #374151"
};
const primaryBtn={
  margin:"2px",
  padding:"10px 14px",
  border:"none",
  borderRadius:"8px",
  background:"#2563eb",
  color:"white",
  cursor:"pointer",
  boxShadow:
    "0 0 15px rgba(37,99,235,0.35)"
};
const dangerBtn={
  margin:"2px",
  padding:"10px 14px",
  border:"none",
  borderRadius:"8px",
  background:"#dc2626",
  color:"white",
  cursor:"pointer",
  boxShadow:
    "0 0 15px rgba(220,38,38,0.35)"
};
const secondaryBtn={
  margin:"2px",
  padding:"10px 14px",
  border:"none",
  borderRadius:"8px",
  background:"#7c3aed",
  color:"white",
  cursor:"pointer",
  boxShadow:
    "0 0 15px rgba(124,58,237,0.35)"
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#111827",
  borderRadius: "12px",
  overflow: "hidden"
};
const cellStyle = {
  border: "1px solid #374151",
  padding: "12px"
};
export default AppointmentPage;
