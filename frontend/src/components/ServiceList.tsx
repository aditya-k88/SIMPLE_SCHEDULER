const ServiceList = ({ services }: { services: any[] }) => (
    <ul className="border rounded p-2 space-y-2">
      {services.map(s => (
        <li key={s.id} className="flex justify-between">
          <span>{s.name}</span>
          <span>{s.duration} min</span>
          <span>${s.price}</span>
        </li>
      ))}
    </ul>
  );
  
  export default ServiceList;