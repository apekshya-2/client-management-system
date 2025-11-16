import axios from "axios";
import { useEffect, useState } from "react";

export default function ClientList() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/clients")
      .then(res => setClients(res.data));
  }, []);

  return (
    <div>
      <h2>Clients</h2>
      {clients.map(c => (
        <p key={c.id}>{c.name} - {c.email}</p>
      ))}
    </div>
  );
}
