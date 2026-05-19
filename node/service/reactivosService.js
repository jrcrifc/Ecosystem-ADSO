import reactivosModel from "../models/reactivosModel.js";
import movimientoreactivoModel from "../models/movimientoreactivosModel.js";

class reactivosService {
    async getAll() {
        const reactivos = await reactivosModel.findAll({
            include: [{
                model: movimientoreactivoModel,
                as: 'movimientos',
                where: { estado: 1 },
                required: false,
                attributes: ['cantidad_inicial', 'cantidad_salida']
            }],
            order: [['id_reactivo', 'DESC']]
        });

        return reactivos.map(r => {
            const item = r.toJSON();
            const totalInicial = (item.movimientos || []).reduce((acc, m) => acc + parseFloat(m.cantidad_inicial || 0), 0);
            const totalSalida = (item.movimientos || []).reduce((acc, m) => acc + parseFloat(m.cantidad_salida || 0), 0);
            item.cantidad_presentacion = parseFloat((totalInicial - totalSalida).toFixed(3));
            return item;
        });
    }

    async getById(id_reactivo) {
        const reactivo = await reactivosModel.findByPk(id_reactivo, {
            include: [{
                model: movimientoreactivoModel,
                as: 'movimientos',
                where: { estado: 1 },
                required: false,
                attributes: ['cantidad_inicial', 'cantidad_salida']
            }]
        });
        if (!reactivo) throw new Error('reactivo no encontrado');
        const item = reactivo.toJSON();
        const totalInicial = (item.movimientos || []).reduce((acc, m) => acc + parseFloat(m.cantidad_inicial || 0), 0);
        const totalSalida = (item.movimientos || []).reduce((acc, m) => acc + parseFloat(m.cantidad_salida || 0), 0);
        item.cantidad_presentacion = parseFloat((totalInicial - totalSalida).toFixed(3));
        return item;
    }

    async create(data) {
    console.log("📥 Datos a guardar:", JSON.stringify(data, null, 2));
    try {
        return await reactivosModel.create(data);
    } catch (error) {
        console.error("❌ Error Sequelize completo:", error.errors); // ← esto muestra el campo exacto
        throw error;
    }
}

    async update(id,data){
        const result = await reactivosModel.update(data, { where: { id_reactivo: id }})
        
        const updated = result[0]

        if (updated === 0) throw new Error('')

            return true
    }

    async delete(id) {
        const deleted = await reactivosModel.destroy({where: {id_reactivo : id }})
        if(!deleted) throw new Error('')
            return true
    }
    
}


export default new reactivosService()