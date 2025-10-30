import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Loader } from 'lucide-react';

const PrestamoEditModal = ({ isOpen, onClose, prestamo, monedas, onSave }) => {
  const [formData, setFormData] = useState({
    idMoneda: '',
    entidadFinanciera: '',
    capitalPrestado: '',
    tasaInteres: '',
    plazoDias: '',
    modalidadPago: 'MENSUAL',
    observaciones: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (prestamo) {
      setFormData({
        idMoneda: prestamo.idMoneda || '',
        entidadFinanciera: prestamo.entidadFinanciera || '',
        capitalPrestado: prestamo.capitalPrestado || '',
        tasaInteres: prestamo.tasaInteres || '',
        plazoDias: prestamo.plazoDias || '',
        modalidadPago: prestamo.modalidadPago || 'MENSUAL',
        observaciones: prestamo.observaciones || '',
      });
      setError(null);
    }
  }, [prestamo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(prestamo.idPrestamo, formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al actualizar el préstamo');
    } finally {
      setLoading(false);
    }
  };

  if (!prestamo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Préstamo" size="lg">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
              <select
                name="idMoneda"
                value={formData.idMoneda}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="">Selecciona una moneda</option>
                {monedas.map((m) => (
                  <option key={m.idMoneda} value={m.idMoneda}>
                    {m.nombreMoneda}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entidad Financiera
              </label>
              <input
                type="text"
                name="entidadFinanciera"
                value={formData.entidadFinanciera}
                onChange={handleChange}
                placeholder="Nombre del banco/entidad"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capital Prestado
              </label>
              <input
                type="number"
                name="capitalPrestado"
                value={formData.capitalPrestado}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de Interés (%)
              </label>
              <input
                type="number"
                name="tasaInteres"
                value={formData.tasaInteres}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plazo (Días)</label>
              <input
                type="number"
                name="plazoDias"
                value={formData.plazoDias}
                onChange={handleChange}
                placeholder="0"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidad de Pago
              </label>
              <select
                name="modalidadPago"
                value={formData.modalidadPago}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="MENSUAL">Mensual</option>
                <option value="FINAL">Final</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              placeholder="Notas adicionales (opcional)"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PrestamoEditModal;
