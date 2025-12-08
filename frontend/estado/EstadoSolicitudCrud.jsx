import React, { useEffect, useState } from 'react';
import estadoService from './estadoService';

export default function EstadoSolicitudCrud(){
  const [estados, setEstados] = useState([]);
  const [nuevo, setNuevo] = useState('');

  const cargar = async ()=> {
    const { data } = await estadoService.getAll();
    setEstados(data);
  };
  useEffect(()=>{cargar()},[]);

  const agregar = async () => {
    if(!nuevo) return;
    await estadoService.create({ estado: nuevo });
    setNuevo('');
    cargar();
  };

  return (
    <div>
      <h4>Estados</h4>
      <ul>
        {estados.map(e=> <li key={e.id_estado_solicitud}>{e.estado}</li>)}
      </ul>
      <div className="input-group">
        <input className="form-control" value={nuevo} onChange={e=>setNuevo(e.target.value)} placeholder="nuevo estado"/>
        <button className="btn btn-primary" onClick={agregar}>Agregar</button>
      </div>
    </div>
  );
}
