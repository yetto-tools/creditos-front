import React, { useState, useEffect } from 'react';
import { TrendingUp, Banknote, DollarSign, Users, Activity } from 'lucide-react';
import Card from '../components/Card';
import { inversionesAPI, prestamosAPI, saldoAPI } from '../services/api';

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalInversiones: 0,
    totalPrestamos: 0,
    saldoDisponible: 0,
    inversionesActivas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const [inversiones, prestamos, saldo] = await Promise.all([
          inversionesAPI.getByUsuario(user.idUsuario).catch(() => []),
          prestamosAPI.getByUsuario(user.idUsuario).catch(() => []),
          saldoAPI.getByUsuario(user.idUsuario).catch(() => ({ saldo: 0 })),
        ]);

        const inversion = Array.isArray(inversiones) ? inversiones : [];
        const prestamo = Array.isArray(prestamos) ? prestamos : [];

        setStats({
          totalInversiones: inversion.reduce((sum, inv) => sum + (inv.montoTotalARecibir || 0), 0),
          totalPrestamos: prestamo.reduce((sum, pres) => sum + (pres.montoTotalARecibir || 0), 0),
          saldoDisponible: saldo.saldo || 0,
          inversionesActivas: inversion.filter(inv => inv.estado === 'VIGENTE').length,
        });
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
        setError('No se pudieron cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.idUsuario]);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-gradient-to-br ${color} text-white rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Icon size={24} className="opacity-80" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Bienvenido, {user?.nombreCompleto || 'Usuario'}
          </h1>
          <p className="text-gray-600">Panel de control - Sistema de Operaciones Financieras</p>
        </div>

        {/* Estadísticas */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={DollarSign}
              title="Saldo Disponible"
              value={`Q${stats.saldoDisponible.toLocaleString('es-GT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              color="from-green-400 to-emerald-600"
            />
            <StatCard
              icon={TrendingUp}
              title="Total Inversiones"
              value={`Q${stats.totalInversiones.toLocaleString('es-GT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              color="from-blue-400 to-teal-600"
            />
            <StatCard
              icon={Banknote}
              title="Total Préstamos"
              value={`Q${stats.totalPrestamos.toLocaleString('es-GT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              color="from-orange-400 to-red-600"
            />
            <StatCard
              icon={Activity}
              title="Inversiones Activas"
              value={stats.inversionesActivas}
              color="from-purple-400 to-pink-600"
            />
          </div>
        )}

        {/* Información General */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información del Usuario */}
          <Card title="Información de Cuenta" icon={Users}>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Usuario</p>
                <p className="text-lg font-semibold text-gray-800">{user?.usuario}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nombre Completo</p>
                <p className="text-lg font-semibold text-gray-800">{user?.nombreCompleto}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID Usuario</p>
                <p className="text-lg font-semibold text-gray-800 font-mono">{user?.idUsuario}</p>
              </div>
            </div>
          </Card>

          {/* Acciones Rápidas */}
          <Card title="Acciones Rápidas" icon={Activity}>
            <div className="space-y-2">
              <a
                href="/inversiones"
                className="block w-full bg-gradient-to-r from-blue-500 to-teal-600 text-white py-2 rounded-lg text-center font-semibold hover:shadow-lg transition"
              >
                + Nueva Inversión
              </a>
              <a
                href="/prestamos"
                className="block w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 rounded-lg text-center font-semibold hover:shadow-lg transition"
              >
                + Nuevo Préstamo
              </a>
              <a
                href="/perfil"
                className="block w-full bg-gradient-to-r from-gray-500 to-gray-700 text-white py-2 rounded-lg text-center font-semibold hover:shadow-lg transition"
              >
                Ver Perfil
              </a>
            </div>
          </Card>
        </div>

        {/* Información Adicional */}
        <div className="mt-8 grid grid-cols-1 gap-6">
          <Card title="Sobre el Sistema">
            <div className="space-y-4">
              <p className="text-gray-700">
                Bienvenido al <strong>Sistema de Operaciones Financieras Bancarias</strong>. 
                Esta aplicación te permite gestionar tus inversiones y préstamos de forma segura y eficiente.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Inversiones</h4>
                  <p className="text-sm text-blue-800">Gestiona tus inversiones y proyecta tus ganancias.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Préstamos</h4>
                  <p className="text-sm text-orange-800">Controla tus préstamos y pagos programados.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}