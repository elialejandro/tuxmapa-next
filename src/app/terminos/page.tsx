'use client';

// ============================================================
// Términos y Condiciones Page
// ============================================================

import Toolbar from '@/components/Toolbar';

export default function TerminosPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <Toolbar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4">
              Términos y Condiciones de Uso
            </h1>

            <div className="prose prose-slate max-w-none space-y-4 text-slate-600">
              <p>
                Bienvenido a Tuxmapa. Al acceder y utilizar esta aplicación, aceptas
                cumplir con los siguientes términos y condiciones de uso. Si no estás
                de acuerdo con alguno de estos términos, por favor no utilices la
                aplicación.
              </p>

              <h2 className="text-lg font-semibold text-slate-800 pt-4">
                1. Aceptación de los Términos
              </h2>
              <p>
                Al utilizar Tuxmapa, confirmas que has leído, comprendido y aceptado
                estar bound by estos términos y condiciones. Nos reservamos el
                derecho de modificar estos términos en cualquier momento sin previo
                aviso.
              </p>

              <h2 className="text-lg font-semibold text-slate-800 pt-4">
                2. Descripción del Servicio
              </h2>
              <p>
                Tuxmapa es una aplicación de información de transporte público que
                proporciona datos sobre rutas, horarios y trayectorias en Tuxtla
                Gutiérrez, Chiapas. La aplicación está diseñada únicamente para
                fines informativos.
              </p>

              <h2 className="text-lg font-semibold text-slate-800 pt-4">
                3. Uso Responsable
              </h2>
              <p>
                Te comprometes a utilizar Tuxmapa de manera responsable y de
                acuerdo con todas las leyes aplicables. No está permitido:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Utilizar la aplicación para fines ilegales o no autorizados</li>
                <li>Intentar acceder a sistemas no autorizados</li>
                <li>Interferir con el funcionamiento de la aplicación</li>
                <li>Realizar ingeniería inversa o descompilar la aplicación</li>
              </ul>

              <h2 className="text-lg font-semibold text-slate-800 pt-4">
                4. Limitación de Responsabilidad
              </h2>
              <p>
                Tuxmapa se proporciona "tal cual" sin garantías de ningún tipo. No
                garantizamos que la información sea precisa, completa o actualizada.
                Los horarios y rutas están sujetos a cambios sin previo aviso.
              </p>

              <h2 className="text-lg font-semibold text-slate-800 pt-4">
                5. Propiedad Intelectual
              </h2>
              <p>
                Todo el contenido, diseño, logo y código de Tuxmapa están protegidos
                por derechos de propiedad intelectual. Queda prohibida la reproducción
                o distribución no autorizada.
              </p>

              <h2 className="text-lg font-semibold text-slate-800 pt-4">
                6. Privacidad
              </h2>
              <p>
                Respetamos tu privacidad. La información que recopilamos se utiliza
                únicamente para mejorar tu experiencia en la aplicación. No
                compartimos tus datos personales con terceros sin tu consentimiento.
              </p>

              <h2 className="text-lg font-semibold text-slate-800 pt-4">
                7. Modificaciones al Servicio
              </h2>
              <p>
                Nos reservamos el derecho de modificar, suspender o discontinuar
                cualquier parte de Tuxmapa en cualquier momento, con o sin previo
                aviso.
              </p>

              <h2 className="text-lg font-semibold text-slate-800 pt-4">
                8. Ley Aplicable
              </h2>
              <p>
                Estos términos se rigen por las leyes de México. Cualquier disputa
                será resuelta en los tribunales competentes del estado de Chiapas.
              </p>

              <h2 className="text-lg font-semibold text-slate-800 pt-4">
                9. Contacto
              </h2>
              <p>
                Si tienes alguna pregunta sobre estos términos, por favor contáctanos
                a través de nuestro sitio web corporativo.
              </p>

              <p className="text-sm text-slate-500 pt-4 border-t border-slate-200">
                Última actualización: Mayo 2026
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}