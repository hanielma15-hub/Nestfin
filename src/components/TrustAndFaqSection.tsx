import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Eye,
  Key,
  Users,
  Building,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface TrustAndFaqSectionProps {
  onOpenPublishModal: () => void;
}

export const TrustAndFaqSection: React.FC<TrustAndFaqSectionProps> = ({
  onOpenPublishModal,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Por qué NestFind comienza exclusivamente en Montemorelos?',
      a: 'Montemorelos cuenta con una dinámica habitacional vibrante impulsada por familias locales, estudiantes de la Universidad de Montemorelos y profesionistas del sector salud y citrícola. Iniciamos aquí para garantizar cercanía, validar la calidad de cada anuncio y ofrecer una experiencia inmobiliaria enfocada y confiable antes de expandirnos a otros municipios.',
    },
    {
      q: '¿Cómo funcionan los recorridos virtuales 360°?',
      a: 'Cada propiedad con la insignia 360° incluye panoramas esféricos interactivos. Puedes girar en cualquier ángulo desde tu celular o computadora, hacer zoom a los detalles y desplazarte entre cuartos (sala, cocina, recámaras, patio) mediante puntos táctiles interactivos.',
    },
    {
      q: '¿Qué modalidades de renta se aceptan en la plataforma?',
      a: 'En NestFind se contemplan tres modalidades según las necesidades del propietario y el inquilino: Quincenal (muy solicitada por estudiantes y residentes en habitaciones), Mensual (el estándar para casas y departamentos) y Trimestral (para estancias temporales o proyectos específicos).',
    },
    {
      q: '¿Cuál es el rol de NestFind en el proceso de arrendamiento?',
      a: 'NestFind es una plataforma digital intermediaria que facilita el encuentro transparente entre propietarios independientes y personas que buscan un hogar. La plataforma no es dueña de las propiedades listadas; provee la tecnología de búsqueda, los recorridos 360° y las herramientas de contacto directo.',
    },
    {
      q: '¿Qué requisitos suelen solicitarse para rentar?',
      a: 'Habitualmente se solicita 1 mes o quincena de depósito en garantía, identificación oficial vigente y comprobante de ingresos o credencial estudiantil/laboral. Cada anuncio especifica sus requisitos individuales de forma transparente.',
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* SECTION: Beneficios */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
            Ventajas de NestFind
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display mt-3">
            Encontrar tu próximo hogar nunca fue tan fácil
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Diseñado para brindarte certeza, ahorro de tiempo y transparencia desde el primer clic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900">Recorridos 360° auténticos</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Explora dimensiones, iluminación y distribución real de cada habitación sin moverte de donde estés. Cero sorpresas al momento de la visita física.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900">Enfoque local en Montemorelos</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Información clara sobre colonias, zonas cercanas a universidades, hospitales y avenidas clave. Anuncios con precios realistas en pesos mexicanos.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900">Contacto directo y seguro</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Comunícate con propietarios particulares y administradores verificados. Agenda visitas físicas de manera organizada y formaliza acuerdos sin intermediarios confusos.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: Cómo Funciona NestFind */}
      <section className="bg-sand-100/70 border-y border-stone-200/70 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded-full">
              Paso a Paso
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display mt-3">
              ¿Cómo funciona NestFind?
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Un proceso ágil y transparente desde que descubres el inmueble hasta la entrega de llaves.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Busca y Filtra',
                desc: 'Selecciona tipo de vivienda, colonia en Montemorelos, presupuesto y periodicidad deseada.',
              },
              {
                step: '02',
                title: 'Recorre en 360°',
                desc: 'Sumérgete en la vista esférica interactiva para conocer cada espacio antes de agendar.',
              },
              {
                step: '03',
                title: 'Contacta al Anfitrión',
                desc: 'Envía un mensaje o solicita una cita presencial directamente con el propietario.',
              },
              {
                step: '04',
                title: 'Visita y Formaliza',
                desc: 'Conoce la propiedad en persona, revisa los requisitos y firma tu contrato con tranquilidad.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
                <span className="text-2xl font-black text-emerald-700/30 font-display block">
                  {item.step}
                </span>
                <h4 className="font-bold text-sm text-stone-900">{item.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: Para Propietarios Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
              ¿Eres propietario en Montemorelos?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              Renta tu casa, departamento o habitación a inquilinos calificados
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              Publica tu propiedad en minutos, agrega recorridos virtuales 360° para destacar frente a otros anuncios y gestiona tus solicitudes sin intermediarios complicados.
            </p>
          </div>

          <button
            onClick={onOpenPublishModal}
            className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-lg transition whitespace-nowrap cursor-pointer hover:scale-105 shrink-0"
          >
            Publicar mi propiedad gratis
          </button>
        </div>
      </section>

      {/* SECTION: Preguntas Frecuentes (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-wider text-stone-500">
            Dudas Comunes
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900 font-display mt-2">
            Preguntas frecuentes sobre NestFind
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4.5 text-left font-bold text-sm text-stone-900 flex items-center justify-between gap-4 hover:bg-stone-50 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
