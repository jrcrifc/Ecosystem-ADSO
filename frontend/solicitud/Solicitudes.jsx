import React, { useEffect, useState } from 'react';
import sService from './solicitudService';

export default function Solicitudes(){
  const [list, setList] = useState([]);
  const [titulo, setTitulo] = useState('');
  useEffect(()=>{ load(); },[]);
  const load = async ()=> { const { data } = await sService.getAll(); setList(data); };
  const add = async ()=> { if(!titulo) return; await sService.create({ titulo }); setTitulo(''); load(); };
  return (
    <div>
      <h4>Solicitudes</h4>
      <ul>{list.map(s=> <li key={s.id}>{s.titulo}</li>)}</ul>
      <div className="input-group">
        <input className="form-control" value={titulo} onChange={e=>setTitulo(e.target.value)} placeholder="titulo"/>
        <button className="btn btn-primary" onClick={add}>Agregar</button>
      </div>
    </div>
  );
}
