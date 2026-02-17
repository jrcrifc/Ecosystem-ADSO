import proveedoresService from '../service/proveedoresService.js';

export const getAllProveedores = async (req, res) => {
    try {
        const proveedores = await proveedoresService.getAll();
        res.status(200).json(proveedores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProveedores = async (req, res) => {
    try {
        const proveedor = await proveedoresService.getById(req.params.id);
        res.status(200).json(proveedor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createProveedores = async (req, res) => {
    try {
        const proveedor = await proveedoresService.create(req.body);
        res.status(201).json({ message: 'Proveedor Creado', proveedor });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const updateProveedores = async (req, res) => {
    try {
        await proveedoresService.update(req.params.id, req.body);
        res.status(200).json({ message: 'Proveedor Actualizado' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const deleteProveedores = async (req, res) => {
    try {
        await proveedoresService.delete(req.params.id);
        res.status(200).json({ message: 'Proveedor Eliminado' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};