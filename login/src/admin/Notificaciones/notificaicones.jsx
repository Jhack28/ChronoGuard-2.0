import React, { useState, useEffect } from 'react';
import { Bell, Check, X, MessageCircle, Calendar, User, Hash } from 'lucide-react';

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [responseMessage, setResponseMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Simular carga de notificaciones desde la API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Simulación de datos - reemplaza con tu endpoint real
        const mockData = [
          {
            id: 1,
            idUsuario: 101,
            tipo: 'Solicitud',
            mensaje: 'Solicitud de permisos para acceder al módulo de reportes',
            fechaEnvio: '2024-07-08T10:30:00Z'
          },
          {
            id: 2,
            idUsuario: 102,
            tipo: 'Aprobación',
            mensaje: 'Necesita aprobación para cambios en configuración del sistema',
            fechaEnvio: '2024-07-08T09:15:00Z'
          },
          {
            id: 3,
            idUsuario: 103,
            tipo: 'Alerta',
            mensaje: 'Intento de acceso no autorizado detectado',
            fechaEnvio: '2024-07-08T08:45:00Z'
          },
          {
            id: 4,
            idUsuario: 104,
            tipo: 'Solicitud',
            mensaje: 'Solicitud de vacaciones del 15 al 25 de julio',
            fechaEnvio: '2024-07-07T16:20:00Z'
          }
        ];

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotifications(mockData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Solicitud':
        return 'bg-blue-100 text-blue-800';
      case 'Aprobación':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alerta':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (notification, action) => {
    setSelectedNotification(notification);
    setActionType(action);
    setIsModalOpen(true);
    setResponseMessage('');
  };

  const handleSubmitResponse = async () => {
    if (!responseMessage.trim()) {
      alert('Por favor, ingresa un mensaje de respuesta');
      return;
    }

    setSubmitting(true);
    
    try {
      // Aquí harías la llamada a tu API
      const response = await fetch('/notificaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId: selectedNotification.id,
          action: actionType,
          responseMessage: responseMessage,
          userId: selectedNotification.idUsuario
        })
      });

      if (response.ok) {
        // Actualizar la lista de notificaciones
        setNotifications(prev => 
          prev.filter(n => n.id !== selectedNotification.id)
        );
        
        setIsModalOpen(false);
        setResponseMessage('');
        alert(`Notificación ${actionType === 'approve' ? 'aprobada' : 'rechazada'} exitosamente`);
      } else {
        throw new Error('Error al procesar la respuesta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la respuesta. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
    setActionType('');
    setResponseMessage('');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Panel de Notificaciones</h1>
        </div>
        <p className="text-gray-600">Gestiona y responde a las notificaciones del sistema</p>
      </div>

      {/* Tabla de Notificaciones */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    ID Notificación
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    ID Usuario
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mensaje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha de Envío
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No hay notificaciones pendientes</p>
                  </td>
                </tr>
              ) : (
                notifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{notification.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {notification.idUsuario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(notification.tipo)}`}>
                        {notification.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                      <div className="truncate" title={notification.mensaje}>
                        {notification.mensaje}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(notification.fechaEnvio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(notification, 'approve')}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleAction(notification, 'reject')}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                        >
                          <X className="h-3 w-3" />
                          Rechazar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Respuesta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              {/* Header del Modal */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {actionType === 'approve' ? 'Aprobar' : 'Rechazar'} Notificación
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Información de la Notificación */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>ID:</strong> #{selectedNotification?.id}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Usuario:</strong> {selectedNotification?.idUsuario}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Mensaje:</strong> {selectedNotification?.mensaje}
                </p>
              </div>

              {/* Campo de Respuesta */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje de Respuesta *
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder={`Escribe tu respuesta para ${actionType === 'approve' ? 'aprobar' : 'rechazar'} esta notificación...`}
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitResponse}
                  disabled={submitting || !responseMessage.trim()}
                  className={`px-4 py-2 text-white rounded-md disabled:opacity-50 ${
                    actionType === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {submitting ? 'Enviando...' : (actionType === 'approve' ? 'Aprobar' : 'Rechazar')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;