import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import Home from './page/home/index.jsx';

function App() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
      const screenWidth = window.innerWidth;
      
      // Detectar por tamaño de pantalla también
      const isSmallScreen = screenWidth < 1024; // Menor a 1024px se considera móvil/tablet
      
      setIsMobileOrTablet(isMobile || isTablet || isSmallScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (isMobileOrTablet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center shadow-2xl">
          {/* Icono animado */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
              <div className="relative bg-gray-700 p-4 rounded-full">
                <Monitor className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          {/* Título */}
          <h1 className="text-2xl font-bold text-white mb-4">
            Sistema No Compatible
          </h1>
          
          {/* Mensaje principal */}
          <p className="text-gray-300 mb-6 leading-relaxed">
            Este sistema está optimizado para computadoras de escritorio y laptops.
          </p>
          
          {/* Dispositivos no soportados */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <Smartphone className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-xs text-gray-400 mt-2">Móvil</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <Tablet className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-xs text-gray-400 mt-2">Tablet</span>
            </div>
          </div>
          
          {/* Instrucciones */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <Monitor className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-blue-400 font-semibold">Solución</span>
            </div>
            <p className="text-sm text-gray-300">
              Por favor, accede desde una <strong className="text-white">computadora de escritorio</strong> o <strong className="text-white">laptop</strong> para una experiencia óptima.
            </p>
          </div>
          
          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Resolución mínima recomendada: 1024px
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <Home />;
}

export default App;
