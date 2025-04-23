import { useState } from "react";
import { createService } from "../services/api";

const ServiceForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [form, setForm] = useState({ name: "", duration: "", price: "" });

  const submit = async () => {
    const { name, duration, price } = form;
    if (!name || !duration || !price) return;
    await createService({ name, duration: +duration, price: +price });
    onSuccess();
    setForm({ name: "", duration: "", price: "" });
  };

  return (
    <div className="space-y-2">
      <input type="text" placeholder="Service Name" className="w-full border p-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input type="number" placeholder="Duration (min)" className="w-full border p-2" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
      <input type="number" placeholder="Price ($)" className="w-full border p-2" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
      <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">Add Service</button>
    </div>
  );
};

export default ServiceForm;
