import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Trophy, TrendingUp, X, Activity, Target, Brain, Ruler, Heart, 
    Wrench, Play, Star, Award, BarChart3, Zap, Shield, Eye, ChevronDown, ChevronUp 
} from 'lucide-react';

const ComparisonView = ({ selectedPlayers, playersData, onRemovePlayer, onClearAll }) => {
    const [viewMode, setViewMode] = useState('radar'); // Solo 'radar' y 'detailed'
    const [expandedPlayer, setExpandedPlayer] = useState(null);

    // Filtrar los datos de los jugadores seleccionados
    const selectedPlayersData = playersData.players.filter(player => 
        selectedPlayers.includes(player.id)
    );

    // Métricas principales para el radar chart
    const radarMetrics = [
        { key: 'ovrGeneral', label: 'General', max: 100 },
        { key: 'fisica', label: 'Física', max: 100 },
        { key: 'deportivo', label: 'Deportivo', max: 100 },
        { key: 'competencia', label: 'Competencia', max: 100 },
        { key: 'psicologia', label: 'Psicología', max: 100 },
        { key: 'antropometria', label: 'Antropometría', max: 100 }
    ];

    // Todas las métricas para vista detallada
    const allMetrics = [
        { key: 'ovrGeneral', label: 'General', icon: Trophy, category: 'Principal' },
        { key: 'fisica', label: 'Física', icon: Activity, category: 'Físico' },
        { key: 'deportivo', label: 'Deportivo', icon: Target, category: 'Técnico' },
        { key: 'competencia', label: 'Competencia', icon: Award, category: 'Mental' },
        { key: 'psicologia', label: 'Psicología', icon: Brain, category: 'Mental' },
        { key: 'antropometria', label: 'Antropometría', icon: Ruler, category: 'Físico' },
        { key: 'medica', label: 'Médica', icon: Heart, category: 'Salud' },
        { key: 'fisioterapia', label: 'Fisioterapia', icon: Wrench, category: 'Salud' },
        { key: 'partido', label: 'Partido', icon: Play, category: 'Rendimiento' }
    ];

    // Función para obtener el color según el valor (paleta original)
    const getMetricColor = (value) => {
        if (!value) return '#374151';
        if (value >= 90) return '#10b981';
        if (value >= 80) return '#00d383';
        if (value >= 70) return '#d97706';
        if (value >= 60) return '#ea580c';
        return '#dc2626';
    };

    // Nueva función para obtener color basado en ranking en cada métrica
    const getProgressBarColor = (metricKey, playerValue, playerId) => {
        if (!playerValue || playerValue === 0) return '#374151';
        
        // Obtener todos los valores de esta métrica y ordenarlos
        const allValues = selectedPlayersData
            .map(player => ({ id: player.id, value: player[metricKey] || 0 }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);
        
        // Encontrar la posición del jugador actual
        const playerIndex = allValues.findIndex(item => item.id === playerId);
        
        if (playerIndex === 0) {
            // El mejor valor - verde
            return '#10b981';
        } else if (playerIndex === 1 && playerValue >= 80 && playerValue < 90) {
            // Segundo lugar y está entre 80-90% - naranja
            return '#f97316';
        } else {
            // El resto - amarillo
            return '#eab308';
        }
    };

    // Función para encontrar el valor más alto en cada métrica
    const getHighestValue = (metricKey) => {
        return Math.max(...selectedPlayersData.map(player => player[metricKey] || 0));
    };

    // Componente de radar chart
    const RadarChart = ({ player, size = 200 }) => {
        const center = size / 2;
        const radius = size / 2 - 20;
        const angleStep = (2 * Math.PI) / radarMetrics.length;

        // Generar puntos del polígono
        const generatePolygonPoints = (values) => {
            return radarMetrics.map((metric, index) => {
                const value = values[metric.key] || 0;
                const angle = index * angleStep - Math.PI / 2;
                const distance = (value / 100) * radius;
                const x = center + Math.cos(angle) * distance;
                const y = center + Math.sin(angle) * distance;
                return `${x},${y}`;
            }).join(' ');
        };

        // Generar líneas de la grilla
        const gridLines = radarMetrics.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            return (
                <line
                    key={index}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#374151"
                    strokeWidth="1"
                />
            );
        });

        // Generar círculos concéntricos
        const concentricCircles = [20, 40, 60, 80, 100].map((percentage) => (
            <circle
                key={percentage}
                cx={center}
                cy={center}
                r={(percentage / 100) * radius}
                fill="none"
                stroke="#374151"
                strokeWidth="1"
                opacity="0.3"
            />
        ));

        return (
            <div className="relative">
                <svg width={size} height={size} className="drop-shadow-lg">
                    {/* Grilla */}
                    {concentricCircles}
                    {gridLines}
                    
                    {/* Polígono del jugador */}
                    <polygon
                        points={generatePolygonPoints(player)}
                        fill="url(#playerGradient)"
                        stroke="#00d383"
                        strokeWidth="2"
                        opacity="0.7"
                    />
                    
                    {/* Puntos de datos */}
                    {radarMetrics.map((metric, index) => {
                        const value = player[metric.key] || 0;
                        const angle = index * angleStep - Math.PI / 2;
                        const distance = (value / 100) * radius;
                        const x = center + Math.cos(angle) * distance;
                        const y = center + Math.sin(angle) * distance;
                        return (
                            <circle
                                key={metric.key}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#00d383"
                                stroke="white"
                                strokeWidth="2"
                            />
                        );
                    })}
                    
                    {/* Gradiente */}
                    <defs>
                        <radialGradient id="playerGradient">
                            <stop offset="0%" stopColor="#00d383" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#00d383" stopOpacity="0.2" />
                        </radialGradient>
                    </defs>
                </svg>
                
                {/* Etiquetas */}
                <div className="absolute inset-0">
                    {radarMetrics.map((metric, index) => {
                        const angle = index * angleStep - Math.PI / 2;
                        const labelDistance = radius + 15;
                        const x = center + Math.cos(angle) * labelDistance;
                        const y = center + Math.sin(angle) * labelDistance;
                        return (
                            <div
                                key={metric.key}
                                className="absolute text-xs text-gray-300 font-medium transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: x, top: y }}
                            >
                                {metric.label}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (selectedPlayersData.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
            >
                <div className="w-24 h-24 bg-[#2e2e2e] rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
                    <Trophy className="w-12 h-12 text-[#00d383]" />
                </div>
                <div className="text-gray-400 text-xl mb-2 font-medium">No hay atletas seleccionados</div>
                <div className="text-gray-500 text-sm">Selecciona al menos 2 atletas para ver la comparación</div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="bg-[#2e2e2e] rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-[#00d383] rounded-xl flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">Comparación de Atletas</h1>
                            <p className="text-gray-400">Análisis detallado de rendimiento • {selectedPlayersData.length} atletas</p>
                        </div>
                    </div>
                    <button
                        onClick={onClearAll}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                        <X className="w-4 h-4" />
                        <span>Limpiar Todo</span>
                    </button>
                </div>
                
                {/* Selector de vista - Solo Radar y Detallado */}
                <div className="flex space-x-2">
                    {[
                        { key: 'radar', label: 'Radar', icon: BarChart3 },
                        { key: 'detailed', label: 'Detallado', icon: Eye }
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setViewMode(key)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                                viewMode === key
                                    ? 'bg-[#00d383] text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Vista de radar */}
            {viewMode === 'radar' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {selectedPlayersData.map((player, index) => (
                        <motion.div
                            key={player.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#2e2e2e] rounded-xl p-6 border border-gray-700"
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
                                <div className="inline-block px-3 py-1 rounded-full bg-[#00d383] text-white font-bold text-sm">
                                    {player.ovrGeneral || '--'} OVR
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <RadarChart player={player} size={280} />
                            </div>
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => onRemovePlayer(player.id)}
                                    className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1 transition-colors mx-auto"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Remover</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Vista detallada */}
            {viewMode === 'detailed' && (
                <div className="bg-[#2e2e2e] rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#1a1a1a] border-b border-gray-700">
                                    <th className="text-left p-4 text-gray-400 text-sm font-medium uppercase tracking-wider">
                                        Métrica
                                    </th>
                                    {selectedPlayersData.map((player) => (
                                        <th key={player.id} className="text-center p-4 text-gray-400 text-sm font-medium uppercase tracking-wider min-w-[150px]">
                                            <div className="flex flex-col items-center space-y-2">
                                                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="text-white font-medium text-sm">{player.name}</div>
                                                <div className="px-2 py-1 rounded-full bg-[#00d383] text-white font-bold text-xs">
                                                    {player.ovrGeneral || '--'}
                                                </div>
                                                <button
                                                    onClick={() => onRemovePlayer(player.id)}
                                                    className="text-red-400 hover:text-red-300 text-xs flex items-center space-x-1 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                    <span>Remover</span>
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allMetrics.map((metric, index) => {
                                    const highestValue = getHighestValue(metric.key);
                                    const IconComponent = metric.icon;
                                    return (
                                        <motion.tr
                                            key={metric.key}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-gray-700 hover:bg-[#1a1a1a] transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center space-x-2">
                                                    <IconComponent className="w-5 h-5 text-[#00d383]" />
                                                    <div>
                                                        <span className="text-white font-medium">{metric.label}</span>
                                                        <div className="text-gray-500 text-xs">{metric.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {selectedPlayersData.map((player) => {
                                                const value = player[metric.key] || 0;
                                                const isHighest = value === highestValue && value > 0;
                                                return (
                                                    <td key={player.id} className="p-4 text-center">
                                                        <div className="flex flex-col items-center space-y-2">
                                                            <div
                                                                className={`px-3 py-2 rounded-lg font-bold text-sm transition-all transform ${
                                                                    isHighest 
                                                                        ? 'bg-[#00d383] text-white shadow-lg scale-105 ring-2 ring-[#00d383] ring-opacity-50' 
                                                                        : 'bg-gray-700 text-gray-300'
                                                                }`}
                                                            >
                                                                {value || '-'}
                                                            </div>
                                                            {/* Barra de progreso visual */}
                                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full transition-all duration-500`}
                                                                    style={{ 
                                                                        width: `${Math.max(value, 0)}%`,
                                                                        backgroundColor: getProgressBarColor(metric.key, value, player.id)
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            {isHighest && value > 0 && (
                                                                <div className="flex items-center space-x-1 text-[#00d383] text-xs">
                                                                    <TrendingUp className="w-3 h-3" />
                                                                    <span>Mejor</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ComparisonView;