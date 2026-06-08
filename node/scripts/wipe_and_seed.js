// ============================================================
// 🌱 SCRIPT DE LIMPIEZA Y RESTAURACIÓN DE BD (wipe_and_seed.js)
// Este script realiza una limpieza total (TRUNCATE) de las tablas
// transaccionales y de inventario de la base de datos, deshabilitando
// temporalmente las restricciones de clave foránea.
// Posteriormente, siembra datos iniciales de prueba (10 equipos y 10 reactivos
// químicos con sus respectivos lotes de stock) y asegura la existencia de un
// cuentadante, un proveedor y un aprendiz de prueba.
// Ejecución:
//   node scripts/wipe_and_seed.js
// ============================================================

import db from "../database/db.js";
import { QueryTypes } from "sequelize";

async function run() {
  console.log("🚀 Iniciando limpieza y re-semillado de la Base de Datos...");
  
  try {
    // 1. Desactivar validaciones de llaves foráneas temporalmente para poder truncar tablas relacionadas
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");

    // 2. Limpiar tablas transaccionales y maestras de inventario
    const tablesToWipe = [
      "solicitudxequipo",
      "estadoxsolicitud",
      "solicitud_prestamos",
      "estadoxequipo",
      "equipos",
      "salidas_reactivos",
      "movimientos_reactivos",
      "reactivos"
    ];

    for (const table of tablesToWipe) {
      console.log(`🧹 Limpiando tabla: ${table}...`);
      await db.query(`TRUNCATE TABLE \`${table}\`;`);
    }

    console.log("✨ Tablas limpias con éxito. Procediendo a insertar registros reales...");

    // 3. Obtener un Cuentadante de prueba (o crearlo si no existe en la BD)
    let cuentadante = await db.query(
      "SELECT id_cuentadante FROM cuentadantes LIMIT 1;",
      { type: QueryTypes.SELECT }
    );
    let id_cuentadante = cuentadante[0]?.id_cuentadante || null;
    if (!id_cuentadante) {
      console.log("📝 No se encontró cuentadante. Creando cuentadante de prueba...");
      await db.query(
        "INSERT INTO cuentadantes (nom_cuentadante, apell_cuentadante, tel_cuentadante, estado) VALUES ('Instructor', 'SENA', '3001234567', 'activo');"
      );
      cuentadante = await db.query(
        "SELECT id_cuentadante FROM cuentadantes LIMIT 1;",
        { type: QueryTypes.SELECT }
      );
      id_cuentadante = cuentadante[0].id_cuentadante;
    }

    // 4. Obtener un Proveedor de prueba (o crearlo si no existe en la BD)
    let proveedor = await db.query(
      "SELECT id_proveedor FROM proveedor LIMIT 1;",
      { type: QueryTypes.SELECT }
    );
    let id_proveedor = proveedor[0]?.id_proveedor || null;
    if (!id_proveedor) {
      console.log("📝 No se encontró proveedor. Creando proveedor de prueba...");
      await db.query(
        "INSERT INTO proveedor (nom_proveedor, apel_proveedor, tel_proveedor, dir_proveedor, estado, createdAt, updatedAt) VALUES ('Químicos del Caribe', 'S.A.S.', '3001234567', 'Calle 10 # 5-4', 1, NOW(), NOW());"
      );
      proveedor = await db.query(
        "SELECT id_proveedor FROM proveedor LIMIT 1;",
        { type: QueryTypes.SELECT }
      );
      id_proveedor = proveedor[0].id_proveedor;
    }

    // 5. Obtener un Usuario de prueba (o crearlo si no existe en la BD)
    let usuario = await db.query(
      "SELECT id_usuario FROM usuarios WHERE rol != 'Administrador' LIMIT 1;",
      { type: QueryTypes.SELECT }
    );
    let id_usuario = usuario[0]?.id_usuario || null;
    if (!id_usuario) {
      console.log("📝 No se encontró usuario de prueba. Creando aprendiz de prueba...");
      // Contraseña por defecto es encriptación de "123456"
      await db.query(
        `INSERT INTO usuarios (nombres_apellidos, email, password, documento, rol, estado, numero_ficha, nombre_ficha, es_sena_empresa, createdAt, updatedAt) 
         VALUES ('Aprendiz SENA Prueba', 'aprendiz@sena.edu.co', '$2b$10$R7Msn0XyTqG0.KjBwM8Q2.9WzZ9w6pQxKj1.Yc3/R8uOa44n5aK0G', '1098765432', 'Aprendiz', 'aprobado', '2672134', 'ADSO - Ficha 2672134', 1, NOW(), NOW());`
      );
      usuario = await db.query(
        "SELECT id_usuario FROM usuarios WHERE rol != 'Administrador' LIMIT 1;",
        { type: QueryTypes.SELECT }
      );
      id_usuario = usuario[0].id_usuario;
    }

    // ==========================================
    // SEED: EQUIPOS (10 REGISTROS MAQUETADOS)
    // ==========================================
    const mockEquipos = [
      { grupo: 'Equipo de Laboratorio', nom: 'Microscopio Óptico Binocular', marca: 'Nikon', placa: 'SENA-LAB-001' },
      { grupo: 'Equipo de Laboratorio', nom: 'Centrífuga Digital de Alta Velocidad', marca: 'Eppendorf', placa: 'SENA-LAB-002' },
      { grupo: 'Equipo de Laboratorio', nom: 'pHmetro Digital de Mesa', marca: 'Mettler Toledo', placa: 'SENA-LAB-003' },
      { grupo: 'Equipo de Laboratorio', nom: 'Balanza Analítica de Precisión', marca: 'Ohaus', placa: 'SENA-LAB-004' },
      { grupo: 'Equipo de Laboratorio', nom: 'Agitador Magnético con Calefacción', marca: 'IKA', placa: 'SENA-LAB-005' },
      { grupo: 'Maquinaria, Equipos y Herramientas', nom: 'Osciloscopio Digital de 4 Canales', marca: 'Tektronix', placa: 'SENA-LAB-006' },
      { grupo: 'Maquinaria, Equipos y Herramientas', nom: 'Multímetro Fluke Industrial', marca: 'Fluke', placa: 'SENA-LAB-007' },
      { grupo: 'Equipo de Laboratorio', nom: 'Incubadora Microbiológica', marca: 'Memmert', placa: 'SENA-LAB-008' },
      { grupo: 'Equipo de Laboratorio', nom: 'Autoclave Vertical Digital', marca: 'Tuttnauer', placa: 'SENA-LAB-009' },
      { grupo: 'Equipo de Laboratorio', nom: 'Mufla de Calentamiento de Alta Temp', marca: 'Carbolite', placa: 'SENA-LAB-010' }
    ];

    const idsEquiposCreados = [];
    console.log("🔧 Creando 10 Equipos en el inventario...");
    for (const eq of mockEquipos) {
      const [result] = await db.query(
        `INSERT INTO equipos (grupo_equipo, nom_equipo, marca_equipo, no_placa, id_cuentadante, estado, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW());`,
        { replacements: [eq.grupo, eq.nom, eq.marca, eq.placa, id_cuentadante] }
      );
      
      const newId = result;
      idsEquiposCreados.push(newId);

      // Registrar estado inicial de disponibilidad del equipo en la tabla estadoxequipo (disponible = ID 1)
      await db.query(
        `INSERT INTO estadoxequipo (id_equipo, id_estado_equipo, createdAt, updatedAt) 
         VALUES (?, 1, NOW(), NOW());`,
        { replacements: [newId] }
      );
    }

    // ==========================================
    // SEED: REACTIVOS Y MOVIMIENTOS (10 REGISTROS MAQUETADOS)
    // ==========================================
    const mockReactivos = [
      { pres: 'litros', nom: 'Ácido Clorhídrico 37%', ingles: 'Hydrochloric Acid 37%', formula: 'HCl', clas: 'Peligro para salud', colorAlm: 'Peligro para la salud', colorSt: 'Ciruela', stand: 'A1', col: '2', fila: '3' },
      { pres: 'litros', nom: 'Alcohol Etílico 96%', ingles: 'Ethyl Alcohol 96%', formula: 'C2H5OH', clas: 'Peligro de inflamabilidad', colorAlm: 'Inflamabilidad', colorSt: 'Purpura', stand: 'B2', col: '1', fila: '1' },
      { pres: 'kilogramos', nom: 'Hidróxido de Sodio en Lentijas', ingles: 'Sodium Hydroxide', formula: 'NaOH', clas: 'Peligro de contacto', colorAlm: 'Peligro de contacto', colorSt: 'Rosado', stand: 'C1', col: '4', fila: '2' },
      { pres: 'gramos', nom: 'Sulfato de Cobre Pentahidratado', ingles: 'Copper Sulfate Pentahydrate', formula: 'CuSO4.5H2O', clas: 'Riesgo minimo', colorAlm: 'Riesgo minimo', colorSt: 'Agua marina', stand: 'D2', col: '3', fila: '4' },
      { pres: 'gramos', nom: 'Nitrato de Plata Reactivo', ingles: 'Silver Nitrate', formula: 'AgNO3', clas: 'Peligro de reactividad', colorAlm: 'Riesgo de reactividad', colorSt: 'Ciruela', stand: 'A2', col: '1', fila: '2' },
      { pres: 'gramos', nom: 'Fenolftaleína en Polvo', ingles: 'Phenolphthalein', formula: 'C20H14O4', clas: 'Evalué el almacenamiento individualmente', colorAlm: 'Preparados', colorSt: 'Ciruela', stand: 'E1', col: '2', fila: '1' },
      { pres: 'litros', nom: 'Ácido Sulfúrico Concentrado', ingles: 'Sulfuric Acid', formula: 'H2SO4', clas: 'Peligro para salud', colorAlm: 'Peligro para la salud', colorSt: 'Cafe', stand: 'F1', col: '1', fila: '4' },
      { pres: 'kilogramos', nom: 'Bicarbonato de Sodio', ingles: 'Sodium Bicarbonate', formula: 'NaHCO3', clas: 'Riesgo minimo', colorAlm: 'Riesgo minimo', colorSt: 'Purpura', stand: 'D3', col: '2', fila: '2' },
      { pres: 'litros', nom: 'Agua Destilada Desionizada', ingles: 'Distilled Water', formula: 'H2O', clas: 'Riesgo minimo', colorAlm: 'Riesgo minimo', colorSt: 'Purpura', stand: 'G1', col: '1', fila: '1' },
      { pres: 'kilogramos', nom: 'Cloruro de Sodio Puro', ingles: 'Sodium Chloride', formula: 'NaCl', clas: 'Riesgo minimo', colorAlm: 'Riesgo minimo', colorSt: 'Purpura', stand: 'D1', col: '1', fila: '1' }
    ];

    console.log("🧪 Creando 10 Reactivos y sus movimientos de stock inicial...");
    let loteCounter = 1001;
    for (const r of mockReactivos) {
      const [reactId] = await db.query(
        `INSERT INTO reactivos (presentacion_reactivo, nom_reactivo, nom_reactivo_ingles, formula_reactivo, color_almacenamiento, color_stand, stand, columna, fila, clasificacion_reactivo, estado, createdat, updatedat) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW());`,
        { replacements: [r.pres, r.nom, r.ingles, r.formula, r.colorAlm, r.colorSt, r.stand, r.col, r.fila, r.clas] }
      );

      // Crear entrada de inventario en movimientos_reactivos con lote inicial
      const cantInit = r.pres === 'litros' ? 5.000 : (r.pres === 'kilogramos' ? 10.000 : 250.000);
      const vencOffsetDays = Math.floor(Math.random() * 365) + 30; // Calcular fecha de vencimiento en el futuro
      const vencDate = new Date();
      vencDate.setDate(vencDate.getDate() + vencOffsetDays);

      await db.query(
        `INSERT INTO movimientos_reactivos (id_reactivo, lote, fecha_vencimiento, cantidad_inicial, id_proveedor, cantidad_salida, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW());`,
        { replacements: [reactId, `LOTE-${loteCounter++}`, vencDate.toISOString().substring(0, 10), cantInit, id_proveedor] }
      );
    }

    console.log("📋 Dejando solicitudes y movimientos vacíos para tus pruebas...");

    // 6. Volver a activar las validaciones de llaves foráneas para mantener integridad referencial
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("🎉 ¡Base de Datos limpiada con éxito! Equipos y Reactivos creados listos para tus propias pruebas.");
    process.exit(0);

  } catch (error) {
    // Si ocurre un error, asegurar que se restablezcan las llaves foráneas
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.error("❌ Error durante el proceso de limpieza y semilla:", error);
    process.exit(1);
  }
}

run();
