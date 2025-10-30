import React from 'react';
import Modal from './Modal';
import { User, Mail, Shield, UserCheck } from 'lucide-react';

const UsuarioDetailModal = ({ isOpen, onClose, usuario }) => {
  if (!usuario) return null;

  const fields = [
    {
      icon: <User size={20} className="text-blue-600" />,
      label: 'Usuario',
      value: usuario.usuario
    },
    {
      icon: <UserCheck size={20} className="text-green-600" />,
      label: 'Nombre Completo',
      value: usuario.nombreCompleto
    },
    {
      icon: <Mail size={20} className="text-purple-600" />,
      label: 'Correo Electrónico',
      value: usuario.correoElectronico
    },
    {
      icon: <Shield size={20} className="text-orange-600" />,
      label: 'Estado',
      value: usuario.estado
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle del Usuario" size="md">
      <div className="p-6">
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <User size={24} className="text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {usuario.nombreCompleto}
                </h3>
                <p className="text-sm text-gray-600">ID: {usuario.idUsuario}</p>
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
                    {field.label === 'Estado' ? (
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          field.value === 'ACTIVO'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {field.value}
                      </span>
                    ) : (
                      <p className="font-semibold text-gray-800">{field.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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

export default UsuarioDetailModal;
