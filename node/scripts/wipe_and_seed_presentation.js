import db from "../database/db.js";
import { QueryTypes } from "sequelize";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

async function run() {
  console.log("🚀 Iniciando limpieza de base de datos para la presentación de mañana...");
  
  try {
    // 1. Desactivar validaciones de llaves foráneas temporalmente
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");

    // 2. Limpiar tablas transaccionales y de logs por completo
    const tablesToWipe = [
      "solicitudxequipo",
      "estadoxsolicitud",
      "solicitud_prestamos",
      "estadoxequipo",
      "equipos",
      "salidas_reactivos",
      "movimientos_reactivos",
      "reactivos",
      "auditoria",
      "solicitudes_acceso",
      "notificaciones"
    ];

    for (const table of tablesToWipe) {
      console.log(`🧹 Limpiando tabla: ${table}...`);
      await db.query(`TRUNCATE TABLE \`${table}\`;`);
    }

    // 3. Limpiar todos los usuarios EXCEPTUANDO al administrador
    console.log("👤 Limpiando usuarios de pruebas (excepto el Administrador)...");
    await db.query("DELETE FROM usuarios WHERE rol != 'Administrador';");

    // 4. Asegurar que exista un usuario Administrador por defecto
    const adminExist = await db.query(
      "SELECT id_usuario FROM usuarios WHERE rol = 'Administrador' LIMIT 1;",
      { type: QueryTypes.SELECT }
    );

    if (adminExist.length === 0) {
      console.log("📝 No se detectó administrador. Creando administrador por defecto...");
      const hashedPassword = await bcrypt.hash("Admin1234!", 10);
      await db.query(
        `INSERT INTO usuarios (uuid, documento, nombres_apellidos, email, password, rol, estado, createdAt, updatedAt) 
         VALUES (?, '00000000', 'Administrador Lab Ambiental', 'admin@laboratorio.com', ?, 'Administrador', 'aprobado', NOW(), NOW());`,
        { replacements: [uuidv4(), hashedPassword] }
      );
    }

    console.log("✨ Tablas y logs limpios con éxito. Insertando stock controlado de 5 Reactivos y 5 Equipos...");

    // 5. Obtener un Cuentadante de referencia (sin tocar sus registros)
    let cuentadante = await db.query(
      "SELECT id_cuentadante FROM cuentadantes LIMIT 1;",
      { type: QueryTypes.SELECT }
    );
    let id_cuentadante = cuentadante[0]?.id_cuentadante || null;
    if (!id_cuentadante) {
      console.log("📝 No se encontró cuentadante. Creando cuentadante de referencia...");
      await db.query(
        "INSERT INTO cuentadantes (nom_cuentadante, apell_cuentadante, correo_cuentadante, createdat, updatedat) VALUES ('Instructor', 'SENA', 'cuentadante@sena.edu.co', NOW(), NOW());"
      );
      cuentadante = await db.query(
        "SELECT id_cuentadante FROM cuentadantes LIMIT 1;",
        { type: QueryTypes.SELECT }
      );
      id_cuentadante = cuentadante[0].id_cuentadante;
    }

    // 6. Obtener un Proveedor de referencia (sin tocar sus registros)
    let proveedor = await db.query(
      "SELECT id_proveedor FROM proveedor LIMIT 1;",
      { type: QueryTypes.SELECT }
    );
    let id_proveedor = proveedor[0]?.id_proveedor || null;
    if (!id_proveedor) {
      console.log("📝 No se encontró proveedor. Creando proveedor de referencia...");
      await db.query(
        "INSERT INTO proveedor (nom_proveedor, contacto_proveedor, correo_proveedor, createdat, updatedat) VALUES ('Químicos del Caribe', '3001234567', 'ventas@quimicos.com', NOW(), NOW());"
      );
      proveedor = await db.query(
        "SELECT id_proveedor FROM proveedor LIMIT 1;",
        { type: QueryTypes.SELECT }
      );
      id_proveedor = proveedor[0].id_proveedor;
    }

    // ==========================================
    // SEED: EXACTAMENTE 5 EQUIPOS
    // ==========================================
    const mock5Equipos = [
      { grupo: 'Equipo de Laboratorio', nom: 'Microscopio Óptico Binocular', marca: 'Nikon', placa: 'SENA-LAB-001' },
      { grupo: 'Equipo de Laboratorio', nom: 'Centrífuga Digital de Alta Velocidad', marca: 'Eppendorf', placa: 'SENA-LAB-002' },
      { grupo: 'Equipo de Laboratorio', nom: 'pHmetro Digital de Mesa', marca: 'Mettler Toledo', placa: 'SENA-LAB-003' },
      { grupo: 'Equipo de Laboratorio', nom: 'Balanza Analítica de Precisión', marca: 'Ohaus', placa: 'SENA-LAB-004' },
      { grupo: 'Equipo de Laboratorio', nom: 'Agitador Magnético con Calefacción', marca: 'IKA', placa: 'SENA-LAB-005' }
    ];

    console.log("🔧 Creando 5 Equipos limpios en el inventario...");
    for (const eq of mock5Equipos) {
      const [result] = await db.query(
        `INSERT INTO equipos (grupo_equipo, nom_equipo, marca_equipo, no_placa, id_cuentadante, estado, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW());`,
        { replacements: [eq.grupo, eq.nom, eq.marca, eq.placa, id_cuentadante] }
      );
      
      const newId = result;

      // Registrar estado inicial disponible (id_estado_equipo = 1)
      await db.query(
        `INSERT INTO estadoxequipo (id_equipo, id_estado_equipo, createdAt, updatedAt) 
         VALUES (?, 1, NOW(), NOW());`,
        { replacements: [newId] }
      );
    }

    // ==========================================
    // SEED: EXACTAMENTE 5 REACTIVOS
    // ==========================================
    const mock5Reactivos = [
      { pres: 'litros', nom: 'Ácido Clorhídrico 37%', ingles: 'Hydrochloric Acid 37%', formula: 'HCl', clas: 'Peligro para salud', colorAlm: 'Peligro para la salud', colorSt: 'Ciruela', stand: 'A1', col: '2', fila: '3' },
      { pres: 'litros', nom: 'Alcohol Etílico 96%', ingles: 'Ethyl Alcohol 96%', formula: 'C2H5OH', clas: 'Peligro de inflamabilidad', colorAlm: 'Inflamabilidad', colorSt: 'Purpura', stand: 'B2', col: '1', fila: '1' },
      { pres: 'kilogramos', nom: 'Hidróxido de Sodio en Lentijas', ingles: 'Sodium Hydroxide', formula: 'NaOH', clas: 'Peligro de contacto', colorAlm: 'Peligro de contacto', colorSt: 'Rosado', stand: 'C1', col: '4', fila: '2' },
      { pres: 'gramos', nom: 'Sulfato de Cobre Pentahidratado', ingles: 'Copper Sulfate Pentahydrate', formula: 'CuSO4.5H2O', clas: 'Riesgo minimo', colorAlm: 'Riesgo minimo', colorSt: 'Agua marina', stand: 'D2', col: '3', fila: '4' },
      { pres: 'gramos', nom: 'Nitrato de Plata Reactivo', ingles: 'Silver Nitrate', formula: 'AgNO3', clas: 'Peligro de reactividad', colorAlm: 'Riesgo de reactividad', colorSt: 'Ciruela', stand: 'A2', col: '1', fila: '2' }
    ];

    console.log("🧪 Creando 5 Reactivos limpios con sus respectivos lotes y stock inicial...");
    let loteCounter = 1001;
    for (const r of mock5Reactivos) {
      const [reactId] = await db.query(
        `INSERT INTO reactivos (presentacion_reactivo, nom_reactivo, nom_reactivo_ingles, formula_reactivo, color_almacenamiento, color_stand, stand, columna, fila, clasificacion_reactivo, estado, createdat, updatedat) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW());`,
        { replacements: [r.pres, r.nom, r.ingles, r.formula, r.colorAlm, r.colorSt, r.stand, r.col, r.fila, r.clas] }
      );

      // Crear entrada de inventario inicial en movimientos_reactivos
      const cantInit = r.pres === 'litros' ? 5.000 : (r.pres === 'kilogramos' ? 10.000 : 250.000);
      const vencDate = new Date();
      vencDate.setDate(vencDate.getDate() + 180); // Vencimiento a 6 meses de distancia

      await db.query(
        `INSERT INTO movimientos_reactivos (id_reactivo, lote, fecha_vencimiento, cantidad_inicial, id_proveedor, cantidad_salida, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW());`,
        { replacements: [reactId, `LOTE-${loteCounter++}`, vencDate.toISOString().substring(0, 10), cantInit, id_proveedor] }
      );
    }

    // 7. Volver a activar validaciones de llaves foráneas
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("🎉 BASE DE DATOS TOTALMENTE LIMPIA Y LISTA PARA LA PRESENTACIÓN:");
    console.log("   ✅ Auditorías y Logs eliminados.");
    console.log("   ✅ Notificaciones y Solicitudes eliminadas.");
    console.log("   ✅ Accesos y registros de usuarios de prueba eliminados.");
    console.log("   ✅ Único usuario mantenido: Administrador (admin@laboratorio.com / Admin1234!).");
    console.log("   ✅ Proveedores y Cuentadantes intactos.");
    console.log("   ✅ Exactamente 5 Equipos registrados (Disponibles).");
    console.log("   ✅ Exactamente 5 Reactivos registrados con sus lotes iniciales.");
    process.exit(0);

  } catch (error) {
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.error("❌ Error durante el proceso de preparación:", error);
    process.exit(1);
  }
}

run();
