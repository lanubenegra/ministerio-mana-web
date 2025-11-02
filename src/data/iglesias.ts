
export type Iglesia = {
  ciudad: string;
  nombre?: string;
  direccion: string;
  telefono?: string;
  contacto?: string;
  email?: string;
  lat: number; lng: number;
};

export const IGLESIAS: Iglesia[] = [
  { ciudad: 'Medellín (Ditaires, Itagüí)', direccion:'Cra 64 #35-39, Ditaires, Itagüí', telefono:'+57 312 422 6129', contacto:'Ernesto Lozano', email:'medellin@ministeriomana.org', lat: 6.1708, lng: -75.6140 },
  { ciudad: 'Medellín', direccion:'Calle 30A #80-107', telefono:'+57 300 587 7370', contacto:'Mónica Palacios', lat: 6.2308, lng: -75.5906 },
  { ciudad: 'Bogotá', direccion:'Calle 25 F # 74 B – 04, Modelia', telefono:'+57 318 493 7659', contacto:'Jesús Antonio Reyes', email:'jesusantonio@ministeriomana.org', lat: 4.6723, lng: -74.1308 },
  { ciudad: 'Cali', direccion:'Av. Roosevelt #27-44, 2° piso', telefono:'+57 305 223 2890', contacto:'Julián Tabima', email:'cali@ministeriomana.org', lat: 3.4315, lng: -76.5364 },
  { ciudad: 'Armenia', direccion:'Cra 17 #1N–27 Nueva Cecilia', telefono:'+57 315 286 5175', contacto:'Dagoberto Martínez', lat: 4.5438, lng: -75.6726 },
  { ciudad: 'La Unión', direccion:'Calle 14 #16-44 Barrio La Cruz', telefono:'+57 317 591 8318', contacto:'Victor Franco', lat: 5.9749, lng: -75.3597 },
  { ciudad: 'Tuluá', direccion:'Calle 14 #3-82 Portal de San Felipe', telefono:'+57 317 465 5226', contacto:'Alexander Valencia', lat: 4.0834, lng: -76.1954 },
  { ciudad: 'Buenaventura', direccion:'', telefono:'+57 315 483 3033', contacto:'Humberto Gutiérrez', lat: 3.8801, lng: -77.0312 },
  { ciudad: 'Bucaramanga', direccion:'Cabecera Country Hotel. Calle 48 # 34 – 29', telefono:'+57 311 473 3983', contacto:'Adrián Gutiérrez', email:'iglesiabucaramanga@ministeriomana.org', lat: 7.1193, lng: -73.1227 },
  { ciudad: 'Marinilla', direccion:'', telefono:'+57 312 847 2997', contacto:'Elizabeth Cano', lat: 6.1736, lng: -75.3360 },
  { ciudad: 'Ibagué', direccion:'Cra 7A #51-71 Rincon de Piedra Pintada', telefono:'+57 317 285 2399', contacto:'Delfín Quiroz', email:'iglesiaibague@ministeriomana.org', lat: 4.4447, lng: -75.2421 },
  { ciudad: 'Cartago', direccion:'Calle 12 #1N–28, Salón de Eventos Emprender', telefono:'+57 316 428 0558', contacto:'Edwin Grijalba', email:'cartago@ministeriomana.org', lat: 4.7464, lng: -75.9117 },
  { ciudad: 'Manizales', direccion:'Cra 23 #67A-55 Apto 502B, Ed. Atalaya', telefono:'+57 311 777 0660', contacto:'José Aristizabal', lat: 5.0703, lng: -75.5138 },
  { ciudad: 'Pasto', direccion:'', telefono:'+57 301 558 2036', contacto:'Hugo Gomez', lat: 1.2136, lng: -77.2811 },
];
