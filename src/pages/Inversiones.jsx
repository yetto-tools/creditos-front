import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Trash2, Edit2, Eye, Loader } from 'lucide-react';
import Card from '../components/Card';
import { inversionesAPI, monedasAPI } from '../services/api';

export default function Inversiones() {
  const [inversiones, setInversiones] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    idMoneda: '',
    capitalInicial: '',
    tasaInteres: '',
    plazoDias: '',
    modalidadPago: 'MENSUAL',
    observaciones: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
  try {
    setLoading(true);

    const [invResp, monResp] = await Promise.all([
      inversionesAPI.getAll().catch(() => ({ datos: [] })),
      monedasAPI.getAll().catch(() => ({ datos: [] })),
    ]);

    // Extraer el array desde la propiedad .datos
    setInversiones(Array.isArray(invResp.datos) ? invResp.datos : []);
    setMonedas(Array.isArray(monResp.datos) ? monResp.datos : []);

  } catch (err) {
    setError('Error al cargar inversiones');
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const payload = {
      idMoneda: parseInt(formData.idMoneda, 10),
      capitalInicial: parseFloat(formData.capitalInicial),
      tasaInteres: parseFloat(formData.tasaInteres),
      plazoDias: parseInt(formData.plazoDias, 10),
      modalidadPago: formData.modalidadPago,
      observaciones: formData.observaciones.trim() || null,
    };

    if (
      !payload.idMoneda ||
      isNaN(payload.capitalInicial) ||
      isNaN(payload.tasaInteres) ||
      isNaN(payload.plazoDias)
    ) {
      setError('Por favor completa todos los campos numéricos correctamente.');
      return;
    }

    const response = await inversionesAPI.create(payload);

    if (response.exitoso) {
      fetchData();
      setShowForm(false);
      setFormData({
        idMoneda: '',
        capitalInicial: '',
        tasaInteres: '',
        plazoDias: '',
        modalidadPago: 'MENSUAL',
        observaciones: '',
      });
    } else {
      setError(response.mensaje || 'Error al crear inversión');
    }
  } catch (err) {
    setError(err.message || 'Error al crear inversión');
  }
};


  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta inversión?')) {
      try {
        await inversionesAPI.delete(id);
        fetchData();
      } catch (err) {
        setError('Error al eliminar inversión');
      }
    }
  };

  const getMonedaNombre = (idMoneda) => {
    const moneda = monedas.find((m) => m.idMoneda === idMoneda);
    return moneda ? moneda.nombreMoneda : 'Desconocida';
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader size={32} className="animate-spin text-teal-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando inversiones...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-sky-100 rounded-lg p-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center space-x-2">
              <TrendingUp className="text-teal-600" />
              <span>Inversiones</span>
            </h1>
            <p className="text-gray-600 mt-2">Gestiona tus inversiones y proyecta tus ganancias</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nueva Inversión</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Formulario Nueva Inversión */}
        {showForm && (
          <Card title="Nueva Inversión" className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
                  <select
                    name="idMoneda"
                    value={formData.idMoneda}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    required
                  >
                    <option value="">Selecciona una moneda</option>
                    {monedas.map((m) => (
                      <option key={m.idMoneda} value={m.idMoneda}>
                        {m.simbolo} - {m.nombreMoneda}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital Inicial
                  </label>
                  <input
                    type="number"
                    name="capitalInicial"
                    value={formData.capitalInicial}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
                >
                  Crear Inversión
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Lista de Inversiones */}
        <div className="grid grid-cols-1 gap-6">
          {inversiones.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 font-medium">No hay inversiones registradas</p>
                <p className="text-gray-500 text-sm mt-1">
                  Crea una nueva inversión para comenzar
                </p>
              </div>
            </Card>
          ) : (
            inversiones.map((inv) => (
              <Card key={inv.idInversion} className="hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <TrendingUp size={20} className="text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {getMonedaNombre(inv.idMoneda)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Capital: {inv.simbolo} {inv.capitalInicial.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2,}) }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Tasa Interés</p>
                        <p className="font-semibold text-gray-800">{inv.tasaInteres}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Plazo</p>
                        <p className="font-semibold text-gray-800">{inv.plazoDias} días</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total a Recibir</p>
                        <p className="font-semibold text-green-600">
                          {inv.simbolo} {inv.montoTotalARecibir?.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2,})}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Estado</p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            inv.estado === 'VIGENTE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {inv.estado}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => alert('Ver detalles')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => alert('Editar')}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(inv.idInversion)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}