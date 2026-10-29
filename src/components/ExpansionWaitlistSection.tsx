import React, { useState } from 'react';
import {
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
  Compass,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { Region } from '../types';

interface ExpansionWaitlistSectionProps {
  upcomingRegions: Region[];
  onAddWaitlistEntry: (city: string, email: string) => void;
}

export const ExpansionWaitlistSection: React.FC<ExpansionWaitlistSectionProps> = ({
  upcomingRegions,
  onAddWaitlistEntry,
}) => {
  const [selectedCity, setSelectedCity] = useState(upcomingRegions[0]?.name || 'Linares');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onAddWaitlistEntry(selectedCity, email.trim());
    setSubmitted(true);
  };

  return (
    <section className="py-14 bg-stone-100 border-y border-stone-200/80 my-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200 text-stone-700 text-xs font-semibold mb-3">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>Expansión Estratégica</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
            Próximamente, más cerca de ti
          </h2>

          <p className="mt-2 text-sm text-stone-600 leading-relaxed">
            NestFind comienza en <strong>Montemorelos</strong>, pero nos estamos preparando para
            conectar más hogares en la región citrícola y el estado de Nuevo León.
            Manifiesta tu interés para enterarte antes que nadie cuando abramos en tu ciudad.
          </p>
        </div>

        {/* Upcoming Cities Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
          {upcomingRegions.slice(0, 4).map((region) => (
            <div
              key={region.id}
              className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs text-center space-y-1"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                En preparación
              </span>
              <div className="font-bold text-sm text-stone-900 mt-1">{region.name}</div>
              <div className="text-[11px] text-stone-500">{region.state}</div>
            </div>
          ))}
        </div>

        {/* Waitlist Subscription Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-md border border-stone-200">
          {submitted ? (
            <div className="text-center space-y-3 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-stone-900">
                ¡Gracias por tu interés en {selectedCity}!
              </h4>
              <p className="text-xs text-stone-600">
                Te notificaremos a <strong>{email}</strong> tan pronto como iniciemos operaciones y validaciones de propietarios en tu zona.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-emerald-800 font-semibold underline"
              >
                Registrar otro correo o ciudad
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-xs font-bold uppercase text-stone-400">
                Notificarme cuando NestFind llegue a mi ciudad
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Ciudad de interés
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-800 font-medium"
                  >
                    {upcomingRegions.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}, {r.state}
                      </option>
                    ))}
                    <option value="Otra ciudad">Otra ciudad de Nuevo León</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Tu correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nombre@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Anotarme en la lista de espera</span>
                <Send className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
