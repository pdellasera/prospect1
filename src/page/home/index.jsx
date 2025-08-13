import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import playersData from '../../data/players.json';
import TabGeneral from '../../components/TabGenreal';
import { TrendingUp } from 'lucide-react';

const Home = () => {
    const [activeTab, setActiveTab] = useState('General');
    const [selectedCategory, setSelectedCategory] = useState('mayor');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [players, setPlayers] = useState([]);
    
    // Funciones de colores consistentes con AthleteTable
    const getOverallBadge = (percentage) => {
        const value = parseInt(percentage);
        if (value >= 90) return { bg: 'from-emerald-500 to-emerald-600', text: 'text-white', color: '#10b981', label: 'Excelente' };
        if (value >= 80) return { bg: 'from-green-500 to-green-600', text: 'text-white', color: '#00d383', label: 'Muy Bueno' };
        if (value >= 70) return { bg: 'from-yellow-500 to-yellow-600', text: 'text-white', color: '#d97706', label: 'Bueno' };
        if (value >= 60) return { bg: 'from-orange-500 to-orange-600', text: 'text-white', color: '#ea580c', label: 'Regular' };
        return { bg: 'from-red-500 to-red-600', text: 'text-white', color: '#dc2626', label: 'Necesita Mejora' };
    };

    const getMetricColor = (value) => {
        if (!value) return '#374151';
        if (value >= 90) return '#10b981';
        if (value >= 80) return '#00d383';
        if (value >= 70) return '#d97706';
        if (value >= 60) return '#ea580c';
        return '#dc2626';
    };
    
    const tabs = [
        { id: 'General', label: 'General' },
        { id: 'Fisica', label: 'Física' },
        { id: 'Deportivo', label: 'Deportivo' },
        { id: 'AspectosComplementarios', label: 'Aspectos Complementarios' }
    ];

    const categories = [
        { id: 'mayor', label: 'Mayor' },
        { id: 'sub20', label: 'Sub-20' },
        { id: 'sub18', label: 'Sub-18' }
    ];

    useEffect(() => {
        setPlayers(playersData.players);
    }, []);

    // Cálculo de estadísticas promedio
    const avgStats = useMemo(() => {
        if (players.length === 0) return {};
        
        // Obtener todos los aspectos únicos de los jugadores (excluyendo id y name)
        const allAspects = new Set();
        players.forEach(player => {
            Object.keys(player).forEach(key => {
                if (key !== 'id' && key !== 'name' && player[key] !== null) {
                    allAspects.add(key);
                }
            });
        });

        // Calcular promedio para cada aspecto
        const stats = {};
        allAspects.forEach(aspect => {
            const validValues = players
                .map(player => player[aspect])
                .filter(value => value !== null && value !== undefined);
            
            if (validValues.length > 0) {
                stats[aspect] = Math.round(
                    validValues.reduce((sum, value) => sum + value, 0) / validValues.length
                );
            }
        });

        return stats;
    }, [players]);

    // Función para formatear el nombre del aspecto para mostrar
    const formatAspectName = (aspect) => {
        const aspectNames = {
            ovrGeneral: 'General (ovr)',
            fisica: 'Físicas (ovr)',
            deportivo: 'Deportivo (ovr)',
            competencia: 'Competencia (ovr)',
            psicologia: 'Psicología (ovr)',
            antropometria: 'Antropometría (ovr)',
            medica: 'Médica (ovr)',
            fisioterapia: 'Fisioterapia (ovr)',
            partido: 'Partido (ovr)'
        };
        return aspectNames[aspect] || `${aspect.charAt(0).toUpperCase() + aspect.slice(1)} (ovr)`;
    };

    return (
        <div className="flex h-screen w-screen text-white overflow-hidden" style={{ backgroundColor: '#141414' }}>
            {/* Sidebar */}
            <div className="w-64 flex flex-col border-r border-gray-700" style={{ backgroundColor: '#141414' }}>
                {/* Logo/Brand */}
                <div className="p-6">
                    <h1 className="text-xl font-bold" style={{ color: '#00d383' }}>Teams</h1>
                    <p className="text-sm text-gray-500">by Prospect</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4">
                    <div className="space-y-1">
                        <div className="text-white px-3 py-2 rounded text-sm font-medium" style={{ backgroundColor: '#00d383' }}>
                            Ojeadores
                        </div>
                        <div className="text-gray-400 px-3 py-2 hover:bg-[#2e2e2e] rounded cursor-pointer text-sm">
                            Fichas Técnicas
                        </div>
                        <div className="text-gray-400 px-3 py-2 hover:bg-[#2e2e2e] rounded cursor-pointer text-sm">
                            Evaluaciones
                        </div>
                        <div className="text-gray-400 px-3 py-2 hover:bg-[#2e2e2e] rounded cursor-pointer text-sm">
                            Documentación
                        </div>
                        <div className="text-gray-400 px-3 py-2 hover:bg-[#2e2e2e] rounded cursor-pointer text-sm">
                            Configuración
                        </div>
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 mt-auto">
                    <p className="text-xs text-gray-600">Teams by Prospect</p>
                    <p className="text-xs text-gray-600">Version 1.0.7</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col" style={{ backgroundColor: '#141414' }}>
                {/* Top Navigation Bar */}
                <div className="px-4 py-2 flex justify-between items-center border-b border-gray-700 h-12" style={{ backgroundColor: '#141414' }}>
                    <div className="flex items-center space-x-3">
                        <button className="text-gray-500 hover:text-white text-sm">
                            ← Volver
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Categorías:</span>
                            <div className="relative">
                                <button
                                    className="flex items-center space-x-1 bg-[#2e2e2e] hover:bg-[#3e3e3e] px-3 py-1 rounded border border-gray-600 transition-colors"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <span className="text-sm text-white">
                                        {categories.find(cat => cat.id === selectedCategory)?.label || selectedCategory}
                                    </span>
                                    <svg 
                                        className={`w-3 h-3 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-full bg-[#2e2e2e] border border-gray-600 rounded shadow-lg z-10">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#3e3e3e] transition-colors ${
                                                    selectedCategory === category.id ? 'text-[#00d383]' : 'text-white'
                                                }`}
                                                onClick={() => {
                                                    setSelectedCategory(category.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                {category.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button className="hover:bg-[#2e2e2e] p-1 rounded" style={{ backgroundColor: '#2e2e2e' }}>
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button className="hover:bg-[#2e2e2e] p-1 rounded" style={{ backgroundColor: '#2e2e2e' }}>
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button className="hover:bg-[#2e2e2e] p-1 rounded" style={{ backgroundColor: '#2e2e2e' }}>
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Team Header Section */}
                <div className="px-6 py-4 border-b border-gray-700" style={{ backgroundColor: '#2e2e2e' }}>
                    <div className="flex items-center justify-between">
                        {/* Left side - Team info */}
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xl font-bold">T</span>
                            </div>
                            <div>
                                <h1 className="text-white text-xl font-bold">Team Name</h1>
                                <p className="text-gray-400 text-sm">Descripción del equipo</p>
                            </div>
                        </div>

                        {/* Right side - Stats */}
                        <div className="w-[300px] mt-4 ">
                            <h3 className="text-white text-xs font-semibold mb-2 text-center">Estadísticas Generales</h3>
                            
                            {/* Primera fila - 5 items */}
                            <div className="grid grid-cols-5 gap-x-4 gap-y-4 mb-4">
                                {Object.entries(avgStats)
                                    .filter(([aspect]) => aspect !== "image")
                                    .slice(0, 5)
                                    .map(([aspect, value], index) => {
                                    return (
                                        <motion.div
                                            key={aspect}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="flex flex-col items-center justify-center rounded-md px-2 py-2 transition-all h-[40px] text-center"
                                        >
                                            <div 
                                                className="inline-flex items-center justify-center px-1.5 py-0.5 rounded font-bold min-w-[32px] mb-1 text-[12px] text-center"
                                                style={{ 
                                                    color: getMetricColor(value), 
                                                }}
                                            >
                                                 <TrendingUp className="w-2 h-2 mr-1" />
                                                {value}%
                                            </div>
                                            <div className="text-white font-medium text-center text-[10px]">
                                                {formatAspectName(aspect).replace(' (ovr)', '')}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                            
                            {/* Línea separadora */}
                            <div className="w-full h-px bg-gray-600 mb-2"></div>
                            
                            {/* Segunda fila - 4 items */}
                            <div className="grid grid-cols-4 gap-x-1 gap-y-4">
                                {Object.entries(avgStats)
                                    .filter(([aspect]) => aspect !== "image")
                                    .slice(5, 9)
                                    .map(([aspect, value], index) => {
                                    return (
                                        <motion.div
                                            key={aspect}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: (index + 5) * 0.03 }}
                                            className="flex flex-col items-center justify-center rounded-md px-2 py-2 transition-all h-[40px] text-center"
                                        >
                                            <div 
                                                className="inline-flex items-center justify-center px-1.5 py-0.5 rounded font-bold min-w-[32px] mb-1 text-[12px] text-center"
                                                style={{ 
                                                    color: getMetricColor(value), 
                                                }}
                                            >
                                                 <TrendingUp className="w-2 h-2 mr-1" />
                                                {value}%
                                            </div>
                                            <div className="text-white font-medium text-center text-[10px]">
                                                {formatAspectName(aspect).replace(' (ovr)', '')}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-6 mt-6">
                        {tabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`pb-2 text-sm cursor-pointer transition-all ${
                                    activeTab === tab.id
                                        ? 'text-white border-b-2 border-[#00d383] font-medium'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area - Ahora usando el componente */}
                <TabGeneral activeTab={activeTab} />
            </div>
        </div>
    );
};

export default Home;
