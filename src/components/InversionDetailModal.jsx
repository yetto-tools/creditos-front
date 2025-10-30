import React from 'react';
import Modal from './Modal';
import { TrendingUp, Calendar, DollarSign, Clock, FileText } from 'lucide-react';

const InversionDetailModal = ({ isOpen, onClose, inversion, monedaNombre }) => {
  if (!inversion) return null;

  const fields = [
    {
      icon: <DollarSign size={20} className="text-green-600" />,
      label: 'Moneda',
      value: monedaNombre
    },
    {
      icon: <DollarSign size={20} className="text-blue-600" />,
      label: 'Capital Inicial',
      value: `Q${inversion.capitalInicial?.toLocaleString('es-GT')}`
    },
    {
      icon: <TrendingUp size={20} className="text-purple-600" />,
      label: 'Tasa de Interés',
      value: `${inversion.tasaInteres}%`
    },
    {
      icon: <Clock size={20} className="text-orange-600" />,
      label: 'Plazo',
      value: `${inversion.plazoDias} días`
    },
    {
      icon: <Calendar size={20} className="text-teal-600" />,
      label: 'Modalidad de Pago',
      value: inversion.modalidadPago
    },
    {
      icon: <DollarSign size={20} className="text-green-600" />,
      label: 'Monto Total a Recibir',
      value: `Q${inversion.montoTotalARecibir?.toLocaleString('es-GT')}`
    },
    {
      icon: <FileText size={20} className="text-gray-600" />,
      label: 'Estado',
      value: inversion.estado
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de la Inversión" size="md">
      <div className="p-6">
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Inversión - {monedaNombre}
                </h3>
                <p className="text-sm text-gray-600">ID: {inversion.idInversion}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{field.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{field.label}</p>
                    <p className="font-semibold text-gray-800">{field.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Observaciones */}
          {inversion.observaciones && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FileText size={20} className="text-gray-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Observaciones</p>
                  <p className="text-gray-800">{inversion.observaciones}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InversionDetailModal;
