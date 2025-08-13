import React, { useState, useEffect, useMemo } from 'react';
import { Table, Target, User, Search, Filter, Download, BarChart3, TrendingUp, TrendingDown, Minus, Award, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import playersData from "../data/players.json";
import ComparisonView from './ComparisonView';

const TabGeneral = ({ activeTab = 'general' }) => {
    const [selectedYear, setSelectedYear] = useState('Clausura 2025');
    const [selectedFilter, setSelectedFilter] = useState('Seleccione un atleta');
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [players, setPlayers] = useState([]);
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards' | 'stats'
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('ovrGeneral');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [showComparison, setShowComparison] = useState(false);

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6); // 6 para cards, 10 para tabla

    useEffect(() => {
        setPlayers(playersData.players);
    }, []);

    // Ajustar items por página según el modo de vista
    useEffect(() => {
        if (viewMode === 'table') {
            setItemsPerPage(10);
        } else if (viewMode === 'cards') {
            setItemsPerPage(6);
        }
        setCurrentPage(1); // Reset a la primera página al cambiar vista
    }, [viewMode]);

    // Filtrado y ordenamiento mejorado
    const filteredAndSortedPlayers = useMemo(() => {
        let filtered = players.filter(player =>
            player.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.sort((a, b) => {
            const aValue = a[sortBy] || 0;
            const bValue = b[sortBy] || 0;
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        });
    }, [players, searchTerm, sortBy, sortOrder]);

    // Paginación
    const totalPages = Math.ceil(filteredAndSortedPlayers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPlayers = filteredAndSortedPlayers.slice(startIndex, endIndex);

    // Reset página cuando cambia la búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const getOverallBadge = (percentage) => {
        const value = parseInt(percentage);
        if (value >= 90) return { bg: 'from-emerald-500 to-emerald-600', text: 'text-esmerald-600', color: '#10b981', label: 'Excelente' };
        if (value >= 80) return { bg: 'from-green-500 to-green-600', text: 'text-white', color: '#00d383', label: 'Muy Bueno' };
        if (value >= 70) return { bg: 'from-yellow-500 to-yellow-600', text: 'text-white', color: '#d97706', label: 'Bueno' };
        if (value >= 60) return { bg: 'from-orange-500 to-orange-600', text: 'text-white', color: '#ea580c', label: 'Regular' };
        return { bg: 'from-red-500 to-red-600', text: 'text-white', color: '#dc2626', label: 'Necesita Mejora' };
    };

    const getMetricColor = (value) => {
        if (!value) return '#374151';
        if (value >= 90) return '#10b98180'; // Verde con 50% opacidad
        if (value >= 80) return '#00d38380'; // Verde claro con 50% opacidad
        if (value >= 70) return '#d9770680'; // Naranja con 50% opacidad
        if (value >= 60) return '#ea580c80'; // Naranja oscuro con 50% opacidad
        return '#dc262680'; // Rojo con 50% opacidad
    };

    const getMetricColorText = (value) => {
        if (!value) return '#374151';
        if (value >= 90) return '#10b981';
        if (value >= 80) return '#00d383';
        if (value >= 70) return '#d97706';
        if (value >= 60) return '#ea580c';
        return '#dc2626';
    };
    // Componente de paginador
    const Paginator = () => {
        const getPageNumbers = () => {
            const pages = [];
            const maxVisiblePages = 5;

            if (totalPages <= maxVisiblePages) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) pages.push(i);
                    pages.push('...');
                    pages.push(totalPages);
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
                } else {
                    pages.push(1);
                    pages.push('...');
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                    pages.push('...');
                    pages.push(totalPages);
                }
            }
            return pages;
        };

        // Comentar o eliminar esta línea para mostrar siempre el paginador
        // if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-between mt-6 p-4 bg-[#2e2e2e] rounded-lg border border-gray-700">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>Mostrando</span>
                    <span className="text-white font-medium">{startIndex + 1}</span>
                    <span>a</span>
                    <span className="text-white font-medium">{Math.min(endIndex, filteredAndSortedPlayers.length)}</span>
                    <span>de</span>
                    <span className="text-white font-medium">{filteredAndSortedPlayers.length}</span>
                    <span>atletas</span>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Items per page selector */}
                    <div className="flex items-center space-x-2 mr-4">
                        <span className="text-sm text-gray-400">Mostrar:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="bg-[#1a1a1a] border border-gray-600 rounded px-2 py-1 text-white text-sm focus:border-[#00d383] focus:outline-none"
                        >
                            {viewMode === 'table' ? (
                                <>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </>
                            ) : (
                                <>
                                    <option value={3}>3</option>
                                    <option value={6}>6</option>
                                    <option value={9}>9</option>
                                    <option value={12}>12</option>
                                </>
                            )}
                        </select>
                    </div>

                    {/* Previous button */}
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded transition-all ${currentPage === 1
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white hover:bg-[#00d383] border border-gray-600 hover:border-[#00d383]'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center space-x-1">
                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                disabled={page === '...'}
                                className={`px-3 py-2 rounded text-sm font-medium transition-all ${page === currentPage
                                    ? 'bg-[#00d383] text-white'
                                    : page === '...'
                                        ? 'text-gray-500 cursor-default'
                                        : 'bg-[#1a1a1a] text-white hover:bg-[#00d383] border border-gray-600 hover:border-[#00d383]'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Next button */}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded transition-all ${currentPage === totalPages
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white hover:bg-[#00d383] border border-gray-600 hover:border-[#00d383]'
                            }`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };



    // Radar Chart mejorado
    const EnhancedRadarChart = ({ player, size = 140 }) => {
        const metrics = [
            { name: 'Física', value: player.fisica || 0, angle: 0 },
            { name: 'Deportivo', value: player.deportivo || 0, angle: 51.4 },
            { name: 'Competencia', value: player.competencia || 0, angle: 102.8 },
            { name: 'Psicología', value: player.psicologia || 0, angle: 154.2 },
            { name: 'Antropometría', value: player.antropometria || 0, angle: 205.6 },
            { name: 'Médica', value: player.medica || 0, angle: 257 },
            { name: 'Fisioterapia', value: player.fisioterapia || 0, angle: 308.4 }
        ];

        const centerX = size / 2;
        const centerY = size / 2;
        const maxRadius = (size / 2) - 20;

        const getPoint = (angle, radius) => {
            const radian = (angle * Math.PI) / 180;
            return {
                x: centerX + radius * Math.cos(radian - Math.PI / 2),
                y: centerY + radius * Math.sin(radian - Math.PI / 2)
            };
        };

        const pathData = metrics.map((metric, index) => {
            const radius = (metric.value / 100) * maxRadius;
            const point = getPoint(metric.angle, radius);
            return index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`;
        }).join(' ') + ' Z';

        return (
            <div className="relative">
                <svg width={size} height={size} className="transform rotate-0">
                    {/* Grid circles */}
                    {[20, 40, 60, 80, 100].map(percent => (
                        <circle
                            key={percent}
                            cx={centerX}
                            cy={centerY}
                            r={(percent / 100) * maxRadius}
                            fill="none"
                            stroke="#374151"
                            strokeWidth="0.5"
                            opacity="0.3"
                        />
                    ))}

                    {/* Grid lines */}
                    {metrics.map((metric, index) => {
                        const point = getPoint(metric.angle, maxRadius);
                        return (
                            <line
                                key={index}
                                x1={centerX}
                                y1={centerY}
                                x2={point.x}
                                y2={point.y}
                                stroke="#374151"
                                strokeWidth="0.5"
                                opacity="0.3"
                            />
                        );
                    })}

                    {/* Data area */}
                    <motion.path
                        d={pathData}
                        fill={getOverallBadge(player.ovrGeneral).color}
                        fillOpacity="0.2"
                        stroke={getOverallBadge(player.ovrGeneral).color}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />

                    {/* Data points */}
                    {metrics.map((metric, index) => {
                        if (!metric.value) return null;
                        const radius = (metric.value / 100) * maxRadius;
                        const point = getPoint(metric.angle, radius);
                        return (
                            <motion.circle
                                key={index}
                                cx={point.x}
                                cy={point.y}
                                r="3"
                                fill={getMetricColor(metric.value)}
                                stroke="white"
                                strokeWidth="1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                style={{
                                    filter: `drop-shadow(0 0 4px ${getMetricColor(metric.value)}60)`
                                }}
                            />
                        );
                    })}
                </svg>

                {/* Labels */}
                <div className="absolute inset-0">
                    {metrics.map((metric, index) => {
                        const labelRadius = maxRadius + 15;
                        const point = getPoint(metric.angle, labelRadius);
                        return (
                            <div
                                key={index}
                                className="absolute text-xs text-gray-400 font-medium"
                                style={{
                                    left: point.x - 20,
                                    top: point.y - 8,
                                    width: 40,
                                    textAlign: 'center'
                                }}
                            >
                                {metric.name.slice(0, 4)}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Barra de progreso mejorada
    const EnhancedProgressBar = ({ value, max = 100, color, showValue = true }) => {
        const percentage = value ? (value / max) * 100 : 0;
        return (
            <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                        className="h-2 rounded-full"
                        style={{
                            background: `linear-gradient(90deg, ${color || getMetricColor(value)}, ${color || getMetricColor(value)}dd)`,
                            boxShadow: `0 0 8px ${color || getMetricColor(value)}40`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>
                {showValue && (
                    <span className="text-white text-xs w-8 text-right font-medium">
                        {value || '-'}
                    </span>
                )}
            </div>
        );
    };

    // Tarjeta de atleta estilo FIFA
    const EnhancedAthleteCard = ({ player, index }) => {
        const badge = getOverallBadge(player.ovrGeneral);
        const isSelected = selectedPlayers.includes(player.id);

        const toggleSelection = () => {
            if (isSelected) {
                setSelectedPlayers(prev => prev.filter(id => id !== player.id));
            } else {
                setSelectedPlayers(prev => [...prev, player.id]);
            }
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] rounded-xl border transition-all duration-300 hover:shadow-2xl relative overflow-hidden ${isSelected ? 'border-[#00d383] shadow-lg shadow-[#00d383]/20' : 'border-gray-700 hover:border-gray-600'
                    }`}
            >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                </div>

                {/* Selection checkbox */}
                <button
                    onClick={toggleSelection}
                    className={`absolute top-3 right-3 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20 ${isSelected ? 'bg-[#00d383] border-[#00d383] shadow-lg shadow-[#00d383]/30' : 'border-gray-500 hover:border-gray-400 hover:bg-gray-700/50'
                        }`}
                >
                    {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>

                {/* Layout horizontal como FIFA */}
                <div className="flex h-full">
                    {/* Lado izquierdo - Imagen y datos básicos */}
                    <div className="flex-1 p-4">
                        {/* Imagen del jugador */}
                        <div className="w-24 h-32 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                            {player.image ? (
                                <img
                                    src={player.image}
                                    alt={player.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <User className={`w-12 h-12 text-white ${player.image ? 'hidden' : 'block'}`} />
                        </div>

                        {/* Información del jugador */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-1">{player.name}</h3>
                            <div className="text-gray-300 text-sm mb-1">
                                <div>Edad: <span className="text-yellow-400">18</span> <span className="text-yellow-400">● DFC</span></div>
                            </div>
                            <div className="text-gray-300 text-xs mb-2">
                                <div>Altura: 183 cm</div>
                                <div>Pierna buena: Derecha</div>
                            </div>
                        </div>

                        {/* Sección Sin observar */}
                        <div className="mt-4">
                            <div className="flex items-center text-orange-500 text-sm mb-2">
                                <Eye className="w-4 h-4 mr-2" />
                                <span>Sin observar</span>
                            </div>
                            <div className="text-gray-400 text-xs">
                                <div>No se está observando con más</div>
                                <div>detenimiento a {player.name.split(' ')[0]}</div>
                                <div className="mt-1">Cláusula de rescisión: Ninguno/a</div>
                                <div className="mt-1">Precio estimado: <span className="text-green-400 text-lg text-bold">80K</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Lado derecho - Club y estadísticas */}
                    <div className="flex-1 p-4">

                        {/* OVR Badge grande */}
                        <div className="text-right mb-4 mr-12">
                            <div className={`inline-flex items-center px-4 py-2 rounded-xl text-2xl font-bold bg-gradient-to-r text-green-400 shadow-lg `}>
                                <TrendingUp className="w-4 h-4 mr-2" />
                                <span>{player.ovrGeneral}%</span>
                            </div>
                        </div>

                        {/* Sección Resumen */}
                        <div>
                            <h4 className="text-white font-semibold text-lg mb-3">Resumen</h4>
                            {/* Gráfico Radar de estadísticas - Versión compacta */}
                            <div className="flex flex-col items-center">
                                <h4 className="text-white font-semibold text-lg mb-4">Estadísticas</h4>

                                {/* Componente Radar Chart - Más pequeño */}
                                <div className="relative">
                                    <svg width="160" height="160" className="drop-shadow-lg">
                                        {/* Definir las métricas del radar */}
                                        {(() => {
                                            const radarMetrics = [
                                                { key: 'fisica', label: 'Física' },
                                                { key: 'deportivo', label: 'Deportivo' },
                                                { key: 'competencia', label: 'Competencia' },
                                                { key: 'psicologia', label: 'Psicología' },
                                                { key: 'antropometria', label: 'Antropometría' },
                                                { key: 'medica', label: 'Médica' },
                                                { key: 'fisioterapia', label: 'Fisioterapia' },
                                                { key: 'partido', label: 'Partido' }
                                            ];

                                            const center = 80;
                                            const radius = 60;
                                            const angleStep = (2 * Math.PI) / radarMetrics.length;

                                            // Generar puntos del polígono
                                            const generatePolygonPoints = () => {
                                                return radarMetrics.map((metric, index) => {
                                                    const value = player[metric.key] || 0;
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
                                                        strokeWidth="0.8"
                                                    />
                                                );
                                            });

                                            // Generar círculos concéntricos
                                            const concentricCircles = [25, 50, 75, 100].map((percentage) => (
                                                <circle
                                                    key={percentage}
                                                    cx={center}
                                                    cy={center}
                                                    r={(percentage / 100) * radius}
                                                    fill="none"
                                                    stroke="#374151"
                                                    strokeWidth="0.8"
                                                    opacity="0.4"
                                                />
                                            ));

                                            return (
                                                <>
                                                    {/* Grilla */}
                                                    {concentricCircles}
                                                    {gridLines}

                                                    {/* Polígono del jugador */}
                                                    <polygon
                                                        points={generatePolygonPoints()}
                                                        fill="url(#playerGradient)"
                                                        stroke="#00d383"
                                                        strokeWidth="2"
                                                        opacity="0.6"
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
                                                                r="2.5"
                                                                fill={getMetricColorText(value)}
                                                                stroke="white"
                                                                strokeWidth="1.5"
                                                            />
                                                        );
                                                    })}

                                                    {/* Gradiente */}
                                                    <defs>
                                                        <radialGradient id="playerGradient">
                                                            <stop offset="0%" stopColor="#00d383" stopOpacity="0.7" />
                                                            <stop offset="100%" stopColor="#00d383" stopOpacity="0.1" />
                                                        </radialGradient>
                                                    </defs>
                                                </>
                                            );
                                        })()}
                                    </svg>

                                    {/* Etiquetas alrededor del radar - Más compactas */}
                                    <div className="absolute inset-0">
                                        {(() => {
                                            const radarMetrics = [
                                                { key: 'fisica', label: 'Física' },
                                                { key: 'deportivo', label: 'Deportivo' },
                                                { key: 'competencia', label: 'Competencia' },
                                                { key: 'psicologia', label: 'Psicología' },
                                                { key: 'antropometria', label: 'Antropometría' },
                                                { key: 'medica', label: 'Médica' },
                                                { key: 'fisioterapia', label: 'Fisioterapia' },
                                                { key: 'partido', label: 'Partido' }
                                            ];

                                            const center = 80;
                                            const radius = 60;
                                            const angleStep = (2 * Math.PI) / radarMetrics.length;

                                            return radarMetrics.map((metric, index) => {
                                                const angle = index * angleStep - Math.PI / 2;
                                                const labelDistance = radius + 20;
                                                const x = center + Math.cos(angle) * labelDistance;
                                                const y = center + Math.sin(angle) * labelDistance;
                                                const value = player[metric.key];

                                                return (
                                                    <div
                                                        key={metric.key}
                                                        className="absolute text-xs text-center transform -translate-x-1/2 -translate-y-1/2"
                                                        style={{
                                                            left: `${x}px`,
                                                            top: `${y}px`,
                                                            width: '50px'
                                                        }}
                                                    >
                                                        <div className="text-gray-300 font-medium text-[10px] leading-tight">{metric.label}</div>
                                                        <div
                                                            className="text-xs font-bold mt-0.5"
                                                            style={{
                                                                color: getMetricColorText(value),
                                                                textShadow: `0 0 4px ${getMetricColorText(value)}40, 0 1px 2px rgba(0,0,0,0.8)`
                                                            }}
                                                        >
                                                            {value || '-'}
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                </div>

                                {/* Leyenda compacta */}
                                <div className="mt-3 text-center">
                                    <div className="flex justify-center space-x-3 text-[10px]">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                                            <span className="text-gray-400">Bajo</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                                            <span className="text-gray-400">Medio</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                            <span className="text-gray-400">Alto</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    // Tabla mejorada
    const EnhancedTable = () => {
        const handleSort = (field) => {
            if (sortBy === field) {
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
            } else {
                setSortBy(field);
                setSortOrder('desc');
            }
        };

        return (
            <div className="rounded-xl overflow-hidden border border-gray-700 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a]">
                <table className="w-full">
                    <thead className="bg-[#1a1a1a] border-b border-gray-700">
                        <tr>
                            <th className="text-left p-4 text-gray-400 text-xs font-medium uppercase tracking-wider">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4" />
                                    <span>Atleta</span>
                                </div>
                            </th>
                            {[
                                { key: 'ovrGeneral', label: 'OVR General' },
                                { key: 'fisica', label: 'Física' },
                                { key: 'deportivo', label: 'Deportivo' },
                                { key: 'competencia', label: 'Competencia' },
                                { key: 'psicologia', label: 'Psicología' },
                                { key: 'antropometria', label: 'Antropometría' },
                                { key: 'medica', label: 'Médica' },
                                { key: 'fisioterapia', label: 'Fisioterapia' },
                                { key: 'partido', label: 'Partido' }
                            ].map(({ key, label }) => (
                                <th
                                    key={key}
                                    className="text-center p-4 text-gray-400 text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort(key)}
                                >
                                    <div className="flex items-center justify-center space-x-1">
                                        <span>{label}</span>
                                        {sortBy === key && (
                                            <span className="text-[#00d383]">
                                                {sortOrder === 'desc' ? '↓' : '↑'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {currentPlayers.map((player, index) => {
                                const isSelected = selectedPlayers.includes(player.id);
                                return (
                                    <motion.tr
                                        key={player.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`border-t border-gray-700 hover:bg-[#141414] transition-all cursor-pointer ${isSelected ? 'bg-[#00d383]/10 border-[#00d383]/30' : ''
                                            }`}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedPlayers(prev => prev.filter(id => id !== player.id));
                                            } else {
                                                setSelectedPlayers(prev => [...prev, player.id]);
                                            }
                                        }}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-2 h-2 rounded-full transition-all ${isSelected ? 'bg-[#00d383]' : 'bg-gray-600'
                                                    }`} />
                                                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-white text-sm font-medium">{player.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center items-center">
                                                {(() => {
                                                    const value = player.ovrGeneral;
                                                    if (value >= 80) {
                                                        return (
                                                            <div className="flex items-center space-x-2">
                                                                <TrendingUp className="w-3 h-3 text-green-500" />
                                                                <span className="text-green-500 font-bold text-sm">{value}</span>
                                                            </div>
                                                        );
                                                    } else if (value >= 60) {
                                                        return (
                                                            <div className="flex items-center space-x-2">
                                                                <Minus className="w-3 h-3 text-yellow-500" />
                                                                <span className="text-yellow-500 font-bold text-sm">{value}</span>
                                                            </div>
                                                        );
                                                    } else {
                                                        return (
                                                            <div className="flex items-center space-x-2">
                                                                <TrendingDown className="w-3 h-3 text-red-500" />
                                                                <span className="text-red-500 font-bold text-sm">{value}</span>
                                                            </div>
                                                        );
                                                    }
                                                })()
                                                }
                                            </div>
                                        </td>
                                        {[
                                            player.fisica,
                                            player.deportivo,
                                            player.competencia,
                                            player.psicologia,
                                            player.antropometria,
                                            player.medica,
                                            player.fisioterapia,
                                            player.partido
                                        ].map((value, idx) => (
                                            <td key={idx} className="p-4 text-center">
                                                <div className="flex items-center justify-center">
                                                    <span
                                                        className="text-sm font-medium px-2 py-1 rounded"
                                                        style={{
                                                            color: getMetricColorText(value),

                                                            backgroundColor: `${getMetricColor(value)}20`
                                                        }}
                                                    >
                                                        {value || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                        ))}
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        );
    };

    // Modificar la función renderContent
    const renderContent = () => {
        // Si está en modo comparación y hay jugadores seleccionados
        if (showComparison && selectedPlayers.length > 1) {
            return (
                <ComparisonView
                    selectedPlayers={selectedPlayers}
                    playersData={playersData}
                    onRemovePlayer={(playerId) => {
                        setSelectedPlayers(prev => prev.filter(id => id !== playerId));
                    }}
                    onClearAll={() => {
                        setSelectedPlayers([]);
                        setShowComparison(false);
                    }}
                />
            );
        }

        // Resto de la lógica existente
        switch (viewMode) {
            case 'cards':
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentPlayers.map((player, index) => (
                                <EnhancedAthleteCard key={player.id} player={player} index={index} />
                            ))}
                        </div>
                        <Paginator />
                    </>
                );
            default:
                return (
                    <>
                        <EnhancedTable />
                        <Paginator />
                    </>
                );
        }
    };

    return (
        <div className="flex-1 p-6 overflow-auto" style={{ backgroundColor: '#141414' }}>
            {/* Header simplificado - SIN TABS */}
            <div className="flex items-center justify-end mb-6">
                <div className="flex items-center space-x-3">
                    <button className="hover:bg-[#3e3e3e] text-white px-4 py-2 rounded text-sm flex items-center space-x-2 transition-all" style={{ backgroundColor: '#2e2e2e' }}>
                        <span>Once Page</span>
                        <span>→</span>
                    </button>
                </div>
            </div>

            {/* Resto del componente sin cambios */}
            {!showComparison && (
                <div className="bg-[#2e2e2e] rounded-xl p-4 mb-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2 text-[#00d383]" />
                            Resumen General
                        </h3>

                        <div className="flex items-center space-x-2">
                            {/* Botón de Exportar */}
                            <button className="hover:bg-[#3e3e3e] text-white px-3 py-1.5 rounded text-xs flex items-center space-x-1.5 transition-all" style={{ backgroundColor: '#1a1a1a' }}>
                                <Download className="w-3.5 h-3.5" />
                                <span>Exportar</span>
                            </button>

                            {/* Comparación toggle */}
                            {selectedPlayers.length > 1 && (
                                <button
                                    onClick={() => setShowComparison(!showComparison)}
                                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center space-x-1.5 ${showComparison ? 'bg-[#00d383] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {showComparison ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    <span>{showComparison ? 'Ocultar' : 'Comparar'} ({selectedPlayers.length})</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Búsqueda */}
                        <div className="relative flex-1 min-w-[180px]">
                            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar atleta..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-400 focus:border-[#00d383] focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Filtros existentes */}
                        <div className="relative">
                            <button
                                className="bg-white text-black px-3 py-2 text-xs min-w-[130px] flex items-center justify-between border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                            >
                                <span className="font-medium">{selectedYear}</span>
                                <svg className={`w-3.5 h-3.5 ml-2 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {isYearDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 w-full z-20">
                                    <div className="relative">
                                        <div className="absolute -top-1.5 left-3 w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                                        <div className="bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden">
                                            <div className="py-1">
                                                {['Clausura 2025', 'Apertura 2025', 'Apertura 2024'].map((year) => (
                                                    <div
                                                        key={year}
                                                        className={`px-3 py-2 text-xs cursor-pointer transition-colors ${selectedYear === year
                                                            ? 'font-medium bg-gray-100 text-black'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedYear(year);
                                                            setIsYearDropdownOpen(false);
                                                        }}
                                                    >
                                                        {year}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Toggle de vista mejorado */}
                        <div className="flex bg-[#1a1a1a] rounded-lg p-0.5 border border-gray-600">
                            {[
                                { mode: 'table', icon: Table, label: 'Tabla' },
                                { mode: 'cards', icon: Target, label: 'Gráficos' },
                            ].map(({ mode, icon: Icon, label }) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center space-x-1.5 ${viewMode === mode
                                        ? 'bg-[#00d383] text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-[#2e2e2e]'
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Información de resultados */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                        <div className="text-xs text-gray-400">
                            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredAndSortedPlayers.length)} de {filteredAndSortedPlayers.length} atletas
                            {selectedPlayers.length > 0 && (
                                <span className="ml-2 text-[#00d383]">• {selectedPlayers.length} seleccionados</span>
                            )}
                        </div>
                        {selectedPlayers.length > 0 && (
                            <button
                                onClick={() => setSelectedPlayers([])}
                                className="text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                Limpiar selección
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TabGeneral;

