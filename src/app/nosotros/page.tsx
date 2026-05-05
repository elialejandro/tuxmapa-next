'use client';

// ============================================================
// Nosotros Page — Team & About
// ============================================================

import Toolbar from '@/components/Toolbar';

interface TeamMember {
  name: string;
  role: string;
  avatarUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Julio Cesar G.',
    role: 'Gestor Empresarial',
    avatarUrl:
      'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Prescription01&hairColor=Black&facialHairType=BeardMedium&facialHairColor=Black&clotheType=BlazerShirt&eyeType=Happy&eyebrowType=Default&mouthType=Default&skinColor=Light',
  },
  {
    name: 'Carlos Aguilar',
    role: 'Desarrollador iOS y Android',
    avatarUrl:
      'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Prescription02&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light',
  },
  {
    name: 'Eli Alejandro M.',
    role: 'Desarrollador Web FullStack',
    avatarUrl:
      'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortRound&accessoriesType=Prescription01&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Happy&eyebrowType=Default&mouthType=Default&skinColor=Brown',
  },
  {
    name: 'Carlos Fernando R.',
    role: 'Desarrollador Web FullStack',
    avatarUrl:
      'https://avataaars.io/?avatarStyle=Circle&topType=Hat&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light',
  },
  {
    name: 'Julio Cesar G.E.',
    role: 'Vinculación Empresarial',
    avatarUrl:
      'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Prescription01&hairColor=Brown&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light',
  },
];

export default function NosotrosPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <Toolbar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
          {/* Header */}
          <section className="text-center space-y-4">
            <div className="flex justify-center">
              <img
                src="/tuxmapa_logo.png"
                alt="Tuxmapa Logo"
                className="w-24 h-24 object-contain"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">
              ¡La App donde encuentras tu ruta!
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tuxmapa es tu herramienta de transporte público en Tuxtla Gutiérrez,
              Chiapas. Encuentra rutas, optimiza tus viajes y descubre las mejores
              conexiones para moverte por la ciudad.
            </p>
          </section>

          {/* Features */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 text-center">
              Características
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Encuentra tu ruta */}
              <div className="bg-white rounded-xl shadow-sm p-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Encuentra tu ruta
                </h3>
                <p className="text-sm text-slate-600">
                  Busca cualquier ruta de transporte público y visualiza su recorrido
                  en el mapa.
                </p>
              </div>

              {/* Feature 2: Localiza las rutas cercanas */}
              <div className="bg-white rounded-xl shadow-sm p-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Localiza las rutas cercanas
                </h3>
                <p className="text-sm text-slate-600">
                  Selecciona un punto en el mapa y descubre qué rutas pasan cerca de
                  ti.
                </p>
              </div>

              {/* Feature 3: Multidispositivos */}
              <div className="bg-white rounded-xl shadow-sm p-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Multidispositivos
                </h3>
                <p className="text-sm text-slate-600">
                  Accede desde tu teléfono, tablet o computadora. Tuxmapa funciona en
                  cualquier dispositivo.
                </p>
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 text-center">
              Conoce al Equipo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-xl shadow-sm p-6 text-center space-y-3"
                >
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-20 h-20 mx-auto rounded-full bg-slate-100"
                  />
                  <h3 className="text-lg font-semibold text-slate-800">
                    {member.name}
                  </h3>
                  <p className="text-sm text-slate-600">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Clients */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 text-center">
              Nuestros clientes
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 bg-white rounded-xl shadow-sm p-8">
              <img
                src="/heineken_logo.png"
                alt="Heineken"
                className="h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <img
                src="/conecultachiapas.png"
                alt="Conecult Chiapas"
                className="h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}