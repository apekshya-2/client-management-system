import axios from "axios";
import { useState } from "react";

export default function AddClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/clients", form)
      .then(() => alert("Client Added!"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
      <input placeholder="Phone" onChange={e => setForm({...form, phone:e.target.value})} />
      <button type="submit">Save</button>
    </form>
  );
}
