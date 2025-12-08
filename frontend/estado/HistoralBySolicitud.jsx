import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function HistoralBySolicitud({ idSolicitud }) {
  const [hist, setHist] = useState([]);
  useEffect(()=>{ load(); },[idSolicitud]);

  const load = async () => {
    const { data } = await api.get(`/estadoxsolicitud/historial/${idSolicitud}`);
    setHist(data);
  };

  return (
    <div>
      <h4>Historial solicitud #{idSolicitud}</h4>
      <table className="table table-sm">
        <thead><tr><th>#</th><th>Estado</th><th>Fecha</th></tr></thead>
        <tbody>
          {hist.map((h,i)=>(
            <tr key={h.id_estadoxsolicitud}>
              <td>{i+1}</td>
              <td>{h.estado_solicitud?.estado}</td>
              <td>{h.createdat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
