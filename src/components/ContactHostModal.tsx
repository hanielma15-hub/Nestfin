import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Send,
  User,
  Phone,
  Mail,
  Info,
} from 'lucide-react';
import { Property } from '../types';
import { formatPrice } from '../utils/filterProperties';

interface ContactHostModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactHostModal: React.FC<ContactHostModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [intentType, setIntentType] = useState<'info' | 'visita'>('info');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState(
    'Hola, me interesa este inmueble que vi en NestFind Montemorelos. ¿Podrían compartirme más detalles o agendar una cita?'
  );
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSentSuccess(true);
  };

  const handleResetAndClose = () => {
    setSentSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-800 text-emerald-300 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Contactar al Propietario</h3>
              <p className="text-xs text-stone-500">{property.title}</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            aria-label="Cerrar modal de contacto"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-stone-900">¡Mensaje enviado con éxito!</h4>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
              Tu solicitud ha sido transmitida a <strong>{property.host.name}</strong>.
              El anunciante suele responder en <strong>{property.host.responseTime}</strong> vía correo o teléfono.
            </p>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-2 text-stone-600">
              <p className="font-bold text-stone-800">Próximos pasos transparentes:</p>
              <p>1. El propietario confirmará la disponibilidad y resolverá tus preguntas.</p>
              <p>2. Si ambos están conformes, acordarán una visita física para conocer el lugar.</p>
              <p>3. No se solicita ningún anticipo ni pago previo antes de la firma formal del contrato.</p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800 transition"
            >
              Entendido, volver a la propiedad
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Property mini recap */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-stone-900 truncate">{property.title}</div>
                <div className="text-[11px] text-stone-500">{property.colonia}, Montemorelos</div>
                <div className="text-xs font-extrabold text-forest-800">
                  {formatPrice(property.price, property.period)}
                </div>
              </div>
            </div>

            {/* Type of Inquiry (Solicitar Información vs Agendar Visita) */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1.5">
                ¿Qué deseas realizar?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIntentType('info')}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    intentType === 'info'
                      ? 'bg-forest-900 text-white border-forest-950 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Solicitar información
                </button>
                <button
                  type="button"
                  onClick={() => setIntentType('visita')}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    intentType === 'visita'
                      ? 'bg-forest-900 text-white border-forest-950 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Agendar visita física
                </button>
              </div>
            </div>

            {intentType === 'visita' && (
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                  Fecha tentativa de visita
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                Tu nombre completo
              </label>
              <input
                type="text"
                required
                placeholder="ej. Juan Martínez Rodríguez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="ej. 826 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                Mensaje para el anfitrión
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                NestFind protege tu privacidad. Este paso solo abre comunicación directa para resolver dudas o coordinar una visita.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-emerald-300" />
              <span>Enviar solicitud de contacto</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
