import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Upload, Download, TrendingUp, Droplets, Home, BarChart3, Leaf, AlertTriangle } from 'lucide-react';

const HydroMonitor = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plantData, setPlantData] = useState({
    'Bok choy': [],
    'Chili': [],
    'Purple basil': [],
    'Thai basil': [],
    'Lemon basil': []
  });
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    ph: '',
    tds: '',
    temperature: ''
  });
  const [error, setError] = useState('');
  const [isVideoMaximized, setIsVideoMaximized] = useState(false);
  const [pastDays, setPastDays] = useState(7);
  const [alerts, setAlerts] = useState([]);
  const [highlightTabs, setHighlightTabs] = useState({ temperature: false, ph: false, tds: false });
  const csvInputRef = useRef(null);

  const plantInfo = {
    'Bok choy': {
      image: '/assets/water-spinach.png',
      color: 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)',
      description: 'Nutrient-rich leafy green',
      optimalPH: '5.5-6.5',
      optimalTDS: '900-1200',
      optimalTemperature: '18-24'
    },
    'Chili': {
      image: '/assets/chili-plant.png',
      color: 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)',
      description: 'Spicy pepper variety',
      optimalPH: '6.0-6.8',
      optimalTDS: '1000-1750',
      optimalTemperature: '21-29'
    },
    'Purple basil': {
      image: '/assets/purple-basil.png',
      color: 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)',
      description: 'Aromatic purple-leafed herb',
      optimalPH: '5.5-6.5',
      optimalTDS: '500-800',
      optimalTemperature: '20-26'
    },
    'Thai basil': {
      image: '/assets/thai-basil.png',
      color: 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)',
      description: 'Sweet and spicy Asian herb',
      optimalPH: '6.0-7.0',
      optimalTDS: '600-900',
      optimalTemperature: '20-26'
    },
    'Lemon basil': {
      image: '/assets/lemon-basil.png',
      color: 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)',
      description: 'Citrusy aromatic herb',
      optimalPH: '5.8-6.8',
      optimalTDS: '500-750',
      optimalTemperature: '20-26'
    }
  };

  // Optimal ranges for Chili
  const ranges = {
    temperature: { min: 21, max: 29 },
    ph: { min: 6.0, max: 6.8 },
    tds: { min: 1000, max: 1750 }
  };

  // Fetch and parse CSV
  const fetchCSV = async () => {
    try {
      const response = await fetch('/sensor_data_may.csv');
      const text = await response.text();
      const rows = text.split('\n').slice(1); // Skip header
      const data = rows.map(row => {
        const [id, timestamp, temperature, ph, tds, humidity] = row.split(',');
        return {
          id: parseInt(id),
          timestamp,
          temperature: parseFloat(temperature),
          ph: parseFloat(ph),
          tds: parseFloat(tds),
          humidity: parseFloat(humidity),
          date: timestamp.split(' ')[0]
        };
      }).filter(row => !isNaN(row.temperature) && !isNaN(row.ph) && !isNaN(row.tds));
      setPlantData(prev => ({ ...prev, 'Chili': data }));
    } catch (error) {
      setError('Failed to load CSV data');
      console.error(error);
    }
  };

  // Fetch alerts from JSON
  const fetchAlerts = async () => {
    try {
      const response = await fetch('/sensor_alerts_messages.json');
      const data = await response.json();
      setAlerts(data);
      updateTabHighlights(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setError('Failed to load alerts');
      generateAlertsFromCSV();
    }
  };

  // Generate alerts from CSV if JSON is empty
  const generateAlertsFromCSV = () => {
    const chiliData = plantData['Chili'];
    const newAlerts = [];
    const highlights = { temperature: false, ph: false, tds: false };

    chiliData.forEach(row => {
      if (row.temperature < ranges.temperature.min || row.temperature > ranges.temperature.max) {
        highlights.temperature = true;
        newAlerts.push(`Temperature out of range at ${row.timestamp}: ${row.temperature}°C`);
      }
      if (row.ph < ranges.ph.min || row.ph > ranges.ph.max) {
        highlights.ph = true;
        newAlerts.push(`pH out of range at ${row.timestamp}: ${row.ph}`);
      }
      if (row.tds < ranges.tds.min || row.tds > ranges.tds.max) {
        highlights.tds = true;
        newAlerts.push(`TDS out of range at ${row.timestamp}: ${row.tds} ppm`);
      }
    });

    setAlerts(newAlerts);
    setHighlightTabs(highlights);
  };

  // Update tab highlights based on alerts
  const updateTabHighlights = (alertsData) => {
    const highlights = { temperature: false, ph: false, tds: false };
    alertsData.forEach(message => {
      if (message.toLowerCase().includes('temperature')) highlights.temperature = true;
      if (message.toLowerCase().includes('ph')) highlights.ph = true;
      if (message.toLowerCase().includes('tds')) highlights.tds = true;
    });
    setHighlightTabs(highlights);
  };

  // Initial data fetch
  useEffect(() => {
  fetchCSV();
  fetchAlerts();
}, [fetchCSV, fetchAlerts]);

  const isImagePath = (image) => {
    return typeof image === 'string' && /\.(jpg|jpeg|png|gif|webp)$/i.test(image);
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 16px'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '32px'
    },
    title: {
      fontSize: '3.75rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '16px',
      background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textAlign: 'center'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#bfdbfe',
      textAlign: 'center',
      marginBottom: '48px'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    primaryButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.3)'
      }
    },
    activeButton: {
      background: '#212763',
      color: 'white'
    },
    greenButton: {
      background: '#90B093',
      color: 'white',
      '&:hover': {
        background: '#059669'
      }
    },
    purpleButton: {
      background: '#896490',
      color: 'white',
      '&:hover': {
        background: '#7c3aed'
      }
    },
    plantCard: {
      padding: '32px',
      borderRadius: '16px',
      cursor: 'pointer',
      transform: 'scale(1)',
      transition: 'all 0.3s ease',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      textAlign: 'center'
    },
    plantEmoji: {
      fontSize: '5rem',
      marginBottom: '16px'
    },
    plantName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '8px'
    },
    plantDescription: {
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: '16px'
    },
    plantStats: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px'
    },
    input: {
      width: '100%',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      padding: '12px 16px',
      color: 'white',
      fontSize: '16px',
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.5)'
      },
      '&:focus': {
        outline: 'none',
        border: '2px solid #60a5fa'
      }
    },
    label: {
      color: 'white',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    },
    grid: {
      display: 'grid',
      gap: '32px'
    },
    gridCols3: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    },
    gridCols2: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px'
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      marginBottom: '32px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      color: 'white'
    },
    th: {
      textAlign: 'left',
      padding: '12px 16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      fontWeight: '600'
    },
    td: {
      padding: '12px 16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    chartContainer: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      padding: '24px'
    },
    chartTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    pageTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    submitButton: {
      width: '100%',
      background: 'linear-gradient(135deg,rgb(2, 17, 53) 2%,rgb(4, 0, 119) 100%)',
      color: 'white',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '1.125rem',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    },
    resetButton: {
      width: '100%',
      background: 'linear-gradient(135deg,rgb(28, 36, 54) 2%,rgb(60, 58, 110) 100%)',
      color: 'white',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '1.125rem',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    },
    statsCard: {
      padding: '24px',
      borderRadius: '16px',
      color: 'white',
      textAlign: 'center'
    },
    statsIcon: {
      fontSize: '2rem',
      marginRight: '12px'
    },
    statsTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center'
    },
    statItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    error: {
      color: '#f87171',
      fontSize: '1rem',
      marginBottom: '16px',
      textAlign: 'center'
    },
    videoContainer: {
      position: 'fixed',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      cursor: 'pointer'
    },
    videoMinimized: {
      bottom: '17px',
      left: '17px',
      width: '170px',
      height: '100px'
    },
    videoMaximized: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50vw',
      height: '50vh',
      zIndex: 2000,
      boxShadow: '0 0 20px 8px rgba(255, 255, 255, 0.7)',
      border: '2px solid rgba(255, 255, 255, 0.9)'
    },
    video: {
      width: '100',
      height: '100%',
      objectFit: 'cover'
    },
    tabs: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px'
    },
    tabButton: {
      padding: '10px 20px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    tabButtonActive: {
      border: '2px solid #f87171',
      background: 'rgba(248, 113, 113, 0.2)'
    },
    alertsSection: {
      marginTop: '24px',
      padding: '16px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.05)'
    },
    alertsList: {
      listStyleType: 'none',
      padding: 0,
      margin: 0
    },
    alertItem: {
      padding: '12px',
      marginBottom: '8px',
      borderLeft: '4px solid #f87171',
      background: 'rgba(248, 113, 113, 0.1)',
      color: 'white',
      borderRadius: '4px'
    }
  };

  const handleResetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      ph: '',
      tds: '',
      temperature: ''
    });
    setError('');
  };

  const handleSubmit = () => {
    if (!selectedPlant) {
      setError('Please select a plant.');
      return;
    }
    if (!formData.date || !formData.ph || !formData.tds || !formData.temperature) {
      setError('Please fill in all required fields (Date, pH, TDS, Temperature).');
      return;
    }
    if (isNaN(formData.ph) || formData.ph < 0 || formData.ph > 14) {
      setError('pH must be a number between 0 and 14.');
      return;
    }
    if (isNaN(formData.tds) || formData.tds < 0) {
      setError('TDS must be a positive number.');
      return;
    }
    if (isNaN(formData.temperature)) {
      setError('Temperature must be a number.');
      return;
    }

    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      temperature: parseFloat(formData.temperature),
      ph: parseFloat(formData.ph),
      tds: parseFloat(formData.tds),
      date: formData.date
    };

    setPlantData(prev => ({
      ...prev,
      [selectedPlant]: [...prev[selectedPlant], newEntry]
    }));

    handleResetForm();
    setCurrentPage('dashboard');
    setError('');
  };

  const exportToCSV = () => {
    const allData = [];
    Object.keys(plantData).forEach(plantName => {
      plantData[plantName].forEach(entry => {
        allData.push({
          id: entry.id,
          timestamp: entry.timestamp,
          temperature: entry.temperature,
          ph: entry.ph,
          tds: entry.tds
        });
      });
    });

    const csvData = [];
    csvData.push(['id', 'timestamp', 'temperature', 'ph', 'tds']);
    allData.forEach(row => {
      csvData.push([row.id, row.timestamp, row.temperature, row.ph, row.tds]);
    });
    
    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hydro_monitor_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          setError('Invalid CSV file: No data found.');
          return;
        }
        const headers = lines[0].split(',').map(header => header.trim());
        if (!headers.includes('id') || !headers.includes('timestamp') || !headers.includes('temperature') || !headers.includes('ph') || !headers.includes('tds')) {
          setError('Invalid CSV file: Required headers (id, timestamp, temperature, ph, tds) missing.');
          return;
        }

        const importedData = { 
          'Bok choy': [], 
          'Chili': [], 
          'Purple basil': [], 
          'Thai basil': [], 
          'Lemon basil': [] 
        };
        const plantName = 'Chili'; // Hardcode to Chili for this task
        if (!plantName || !importedData[plantName]) {
          setError('Invalid plant name.');
          return;
        }

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(val => val.trim());
          if (values.length >= headers.length) {
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });

            importedData[plantName].push({
              id: row.id || Date.now() + Math.random(),
              timestamp: row.timestamp || new Date().toISOString(),
              temperature: parseFloat(row.temperature) || 0,
              ph: parseFloat(row.ph) || 0,
              tds: parseFloat(row.tds) || 0,
              date: row.date || row.timestamp.split(' ')[0]
            });
          }
        }

        setPlantData(prev => ({
          ...prev,
          [plantName]: [...prev[plantName], ...importedData[plantName]]
        }));
        setError('CSV imported successfully!');
        if (csvInputRef.current) csvInputRef.current.value = '';
        fetchAlerts(); // Refresh alerts after import
      } catch (err) {
        setError('Error importing CSV: Please ensure the file is valid.');
      }
    };
    
    reader.onerror = () => {
      setError('Error reading CSV file.');
    };
    reader.readAsText(file);
  };

  const getChartData = (dataType) => {
    const chartData = [];
    Object.keys(plantData).forEach(plantName => {
      plantData[plantName].forEach(entry => {
        chartData.push({
          date: entry.date,
          plant: plantName,
          ph: entry.ph,
          tds: entry.tds,
          temperature: entry.temperature,
          [plantName]: entry[dataType]
        });
      });
    });
    
    return chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getTrendAnalysis = (dataType, days) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentData = Object.keys(plantData)
      .flatMap(plantName => 
        plantData[plantName]
          .filter(entry => new Date(entry.date) >= cutoffDate)
          .map(entry => ({ ...entry, plantName }))
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (recentData.length < 2) {
      return { trend: 'Insufficient data', slope: 0, rangeStatus: '' };
    }

    const values = recentData.map(entry => entry[dataType]);
    const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
    const firstHalf = values.slice(0, Math.ceil(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const slope = secondAvg - firstAvg;
    let trend = 'Stable';
    if (slope > 0.1) trend = 'Increasing';
    else if (slope < -0.1) trend = 'Decreasing';

    let rangeStatus = '';
    const plantNames = [...new Set(recentData.map(entry => entry.plantName))];
    plantNames.forEach(plantName => {
      const optimalRange = dataType === 'ph' ? plantInfo[plantName].optimalPH :
                          dataType === 'tds' ? plantInfo[plantName].optimalTDS :
                          plantInfo[plantName].optimalTemperature;
      const [min, max] = optimalRange.split('-').map(Number);
      if (avgValue < min) rangeStatus += `${plantName}: Below optimal (${optimalRange}). `;
      else if (avgValue > max) rangeStatus += `${plantName}: Above optimal (${optimalRange}). `;
      else rangeStatus += `${plantName}: Within optimal (${optimalRange}). `;
    });

    return { trend, slope: slope.toFixed(2), rangeStatus };
  };

  // Monitoring Page
  const renderMonitoringPage = () => (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.flexBetween}>
            <h1 style={styles.pageTitle}>
              <BarChart3 size={32} />
              Monitoring - Chili
            </h1>
            <button
              onClick={() => setCurrentPage('dashboard')}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              <Home size={20} />
            </button>
          </div>

          <div style={styles.tabs}>
            <button
              style={{
                ...styles.tabButton,
                ...(highlightTabs.temperature ? styles.tabButtonActive : {})
              }}
            >
              <TrendingUp size={16} />
              Temperature
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(highlightTabs.ph ? styles.tabButtonActive : {})
              }}
            >
              <Droplets size={16} />
              pH
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(highlightTabs.tds ? styles.tabButtonActive : {})
              }}
            >
              <TrendingUp size={16} />
              TDS
            </button>
          </div>

          <div style={styles.alertsSection}>
            <h2 style={{ ...styles.chartTitle, marginBottom: '16px' }}>
              <AlertTriangle size={24} color="#f87171" />
              Alerts
            </h2>
            {error && <div style={styles.error}>{error}</div>}
            <ul style={styles.alertsList}>
              {alerts.length === 0 ? (
                <li style={styles.alertItem}>No alerts at this time.</li>
              ) : (
                alerts.map((alert, index) => (
                  <li key={index} style={styles.alertItem}>{alert}</li>
                ))
              )}
            </ul>
          </div>

          <div style={styles.chartContainer}>
            <h2 style={styles.chartTitle}>
              <BarChart3 size={24} color="#60a5fa" />
              Sensor Data (Chili)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={plantData['Chili'].slice(-pastDays)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={3} name="Temperature (°C)" />
                <Line type="monotone" dataKey="ph" stroke="#10b981" strokeWidth={3} name="pH" />
                <Line type="monotone" dataKey="tds" stroke="#8b5cf6" strokeWidth={3} name="TDS (ppm)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentPage === 'monitoring') {
    return renderMonitoringPage();
  }

  if (currentPage === 'entry' && selectedPlant) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.flexBetween}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {isImagePath(plantInfo[selectedPlant].image) ? (
                  <img
                    src={plantInfo[selectedPlant].image}
                    alt={selectedPlant}
                    style={{
                      width: '96px',
                      height: '96px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    onError={() => console.error(`Failed to load image for ${selectedPlant}`)}
                  />
                ) : (
                  <div style={{ fontSize: '4rem' }}>{plantInfo[selectedPlant].image}</div>
                )}
                <div>
                  <h1 style={styles.pageTitle}>{selectedPlant}</h1>
                  <p style={{ color: '#bfdbfe' }}>{plantInfo[selectedPlant].description}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentPage('dashboard');
                  handleResetForm();
                }}
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                <Home size={20} />
              </button>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={{ marginTop: '32px' }}>
              <div style={{ ...styles.grid, ...styles.gridCols3, marginBottom: '32px' }}>
                <div>
                  <label style={styles.label}>
                    <Calendar size={16} />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    <Droplets size={16} />
                    pH Level
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.ph}
                    onChange={(e) => setFormData(prev => ({...prev, ph: e.target.value}))}
                    style={styles.input}
                    placeholder={`Optimal: ${plantInfo[selectedPlant].optimalPH}`}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    <TrendingUp size={16} />
                    TDS (ppm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.tds}
                    onChange={(e) => setFormData(prev => ({...prev, tds: e.target.value}))}
                    style={styles.input}
                    placeholder={`Optimal: ${plantInfo[selectedPlant].optimalTDS}`}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    <TrendingUp size={16} />
                    Temperature (Â°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData(prev => ({...prev, temperature: e.target.value}))}
                    style={styles.input}
                    placeholder={`Optimal: ${plantInfo[selectedPlant].optimalTemperature}`}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  type="button"
                  onClick={handleSubmit}
                  style={styles.submitButton}
                >
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  style={styles.resetButton}
                >
                  Reset Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'analytics') {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.flexBetween}>
              <h1 style={styles.pageTitle}>
                <BarChart3 size={32} />
                Analytics Dashboard
              </h1>
              <button
                onClick={() => setCurrentPage('dashboard')}
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                <Home size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={styles.label}>
                Analyze trends over the past
                <input
                  type="number"
                  min="1"
                  value={pastDays}
                  onChange={(e) => setPastDays(Math.max(1, parseInt(e.target.value) || 7))}
                  style={{ ...styles.input, width: '80px', marginLeft: '8px', marginRight: '8px' }}
                />
                days
              </label>
            </div>

            {getChartData('ph').length === 0 ? (
              <div style={styles.error}>No data available for analytics. Please add entries from the dashboard.</div>
            ) : (
              <div style={{ ...styles.grid, ...styles.gridCols2 }}>
                <div style={styles.chartContainer}>
                  <h2 style={styles.chartTitle}>
                    <Droplets size={24} color="#60a5fa" />
                    pH Trends
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData('ph')}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" domain={[0, 14]} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="Bok choy" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Chili" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Purple basil" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Thai basil" stroke="#059669" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Lemon basil" stroke="#eab308" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ color: '#bfdbfe', marginTop: '16px', fontSize: '0.9rem' }}>
                    <strong>Significance:</strong> pH affects nutrient availability in hydroponics. Most plants thrive within a pH range of 5.5â��7.0. Values too low (acidic) can cause nutrient lockout, while values too high (alkaline) may reduce micronutrient uptake. Optimal ranges vary by plant (e.g., Bok choy: 5.5â��6.5, Chili: 6.0â��6.8).
                  </div>
                  <div style={{ color: '#bfdbfe', marginTop: '8px', fontSize: '0.9rem' }}>
                    <strong>Trend (past {pastDays} days):</strong> {getTrendAnalysis('ph', pastDays).trend} (Change: {getTrendAnalysis('ph', pastDays).slope}). {getTrendAnalysis('ph', pastDays).rangeStatus}
                  </div>
                </div>

                <div style={styles.chartContainer}>
                  <h2 style={styles.chartTitle}>
                    <TrendingUp size={24} color="#34d399" />
                    TDS Trends
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData('tds')}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" domain={[0, 'auto']} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="Bok choy" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Chili" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Purple basil" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Thai basil" stroke="#059669" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Lemon basil" stroke="#eab308" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ color: '#bfdbfe', marginTop: '16px', fontSize: '0.9rem' }}>
                    <strong>Significance:</strong> TDS (Total Dissolved Solids) measures nutrient concentration in ppm. Higher TDS supports vigorous growth for nutrient-hungry plants like Chili (1000â��1750 ppm), while lower TDS suits herbs like basil (500â��900 ppm). Excessive TDS can cause nutrient burn, while too low TDS may lead to deficiencies.
                  </div>
                  <div style={{ color: '#bfdbfe', marginTop: '8px', fontSize: '0.9rem' }}>
                    <strong>Trend (past {pastDays} days):</strong> {getTrendAnalysis('tds', pastDays).trend} (Change: {getTrendAnalysis('tds', pastDays).slope}). {getTrendAnalysis('tds', pastDays).rangeStatus}
                  </div>
                </div>

                <div style={styles.chartContainer}>
                  <h2 style={styles.chartTitle}>
                    <TrendingUp size={24} color="#f59e0b" />
                    Temperature Trends
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData('temperature')}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" domain={[0, 'auto']} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="Bok choy" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Chili" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Purple basil" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Thai basil" stroke="#059669" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Lemon basil" stroke="#eab308" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ color: '#bfdbfe', marginTop: '16px', fontSize: '0.9rem' }}>
                    <strong>Significance:</strong> Temperature affects plant metabolism and nutrient uptake. Most hydroponic plants prefer 18â��26Â°C. Higher temperatures (e.g., Chili: 21â��29Â°C) can boost growth if nutrients are balanced, but excessive heat stresses plants. Low temperatures slow growth and nutrient absorption.
                  </div>
                  <div style={{ color: '#bfdbfe', marginTop: '8px', fontSize: '0.9rem' }}>
                    <strong>Trend (past {pastDays} days):</strong> {getTrendAnalysis('temperature', pastDays).trend} (Change: {getTrendAnalysis('temperature', pastDays).slope}). {getTrendAnalysis('temperature', pastDays).rangeStatus}
                  </div>
                </div>
              </div>
            )}

            <div style={{ ...styles.grid, ...styles.gridCols3, marginTop: '32px' }}>
              {Object.keys(plantData).map(plantName => {
                const entries = plantData[plantName];
                const avgPH = entries.length > 0 ? (entries.reduce((sum, entry) => sum + entry.ph, 0) / entries.length).toFixed(1) : 'N/A';
                const avgTDS = entries.length > 0 ? (entries.reduce((sum, entry) => sum + entry.tds, 0) / entries.length).toFixed(1) : 'N/A';
                const avgTemperature = entries.length > 0 ? (entries.reduce((sum, entry) => sum + entry.temperature, 0) / entries.length).toFixed(1) : 'N/A';
                
                return (
                  <div key={plantName} style={{ ...styles.statsCard, background: plantInfo[plantName].color }}>
                    <div style={styles.statsTitle}>
                      <span style={styles.statsIcon}>
                        {isImagePath(plantInfo[plantName].image) ? (
                          <img
                            src={plantInfo[plantName].image}
                            alt={plantName}
                            style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          plantInfo[plantName].image
                        )}
                      </span>
                      {plantName}
                    </div>
                    <div>
                      <div style={styles.statItem}>
                        <span>Entries:</span>
                        <span style={{ fontWeight: '600' }}>{entries.length}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span>Avg pH:</span>
                        <span style={{ fontWeight: '600' }}>{avgPH}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span>Avg TDS:</span>
                        <span style={{ fontWeight: '600' }}>{avgTDS}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span>Avg Temperature:</span>
                        <span style={{ fontWeight: '600' }}>{avgTemperature}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={styles.title}>HydroMonitor</h1>
          <p style={styles.subtitle}>Advanced Hydroponic Plant Monitoring System</p>
        </div>

        <div style={styles.card}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.flexCenter}>
            <button
              onClick={() => setCurrentPage('dashboard')}
              style={{
                ...styles.button,
                ...(currentPage === 'dashboard' ? styles.activeButton : styles.primaryButton)
              }}
            >
              <Home size={16} />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('analytics')}
              style={{
                ...styles.button,
                ...(currentPage === 'analytics' ? styles.activeButton : styles.primaryButton)
              }}
            >
              <BarChart3 size={16} />
              Analytics
            </button>
            <button
              onClick={() => setCurrentPage('monitoring')}
              style={{
                ...styles.button,
                ...(currentPage === 'monitoring' ? styles.activeButton : styles.primaryButton)
              }}
            >
              <BarChart3 size={16} />
              Monitoring
            </button>
            <button
              onClick={exportToCSV}
              style={{ ...styles.button, ...styles.greenButton }}
            >
              <Download size={16} />
              Export CSV
            </button>
            <div>
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                onChange={importFromCSV}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => csvInputRef.current?.click()}
                style={{ ...styles.button, ...styles.purpleButton }}
              >
                <Upload size={16} />
                Import CSV
              </button>
            </div>
          </div>

          <div style={{ ...styles.grid, ...styles.gridCols3 }}>
            {Object.keys(plantInfo).map(plantName => (
              <div
                key={plantName}
                onClick={() => {
                  setSelectedPlant(plantName);
                  setCurrentPage('entry');
                  setError('');
                }}
                style={{
                  ...styles.plantCard,
                  background: plantInfo[plantName].color
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isImagePath(plantInfo[plantName].image) ? (
                  <img
                    src={plantInfo[plantName].image}
                    alt={plantName}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}
                    onError={() => console.error(`Failed to load image for ${plantName}`)}
                  />
                ) : (
                  <div style={styles.plantEmoji}>{plantInfo[plantName].image}</div>
                )}
                <h2 style={styles.plantName}>{plantName}</h2>
                <p style={styles.plantDescription}>{plantInfo[plantName].description}</p>
                
                <div style={styles.plantStats}>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                    <p style={{ margin: '4px 0' }}><strong>Optimal pH:</strong> {plantInfo[plantName].optimalPH}</p>
                    <p style={{ margin: '4px 0' }}><strong>Optimal TDS:</strong> {plantInfo[plantName].optimalTDS}</p>
                    <p style={{ margin: '4px 0' }}><strong>Optimal Temperature:</strong> {plantInfo[plantName].optimalTemperature}</p>
                    <p style={{ margin: '4px 0' }}><strong>Entries:</strong> {plantData[plantName].length}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Leaf size={20} style={{ marginRight: '8px' }} />
                  <span style={{ fontWeight: '600' }}>Click to Monitor</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {Object.values(plantData).some(data => data.length > 0) && (
          <div style={{ ...styles.card, marginTop: '32px' }}>
            <h2 style={{ ...styles.chartTitle, textAlign: 'center', marginBottom: '24px' }}>Recent Entries</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <th style={styles.th}>Plant</th>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Timestamp</th>
                    <th style={styles.th}>Temperature</th>
                    <th style={styles.th}>pH</th>
                    <th style={styles.th}>TDS</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(plantData)
                    .flatMap(plantName => 
                      plantData[plantName].map(entry => ({ ...entry, plantName }))
                    )
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(0, 5)
                    .map(entry => (
                      <tr key={entry.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <td style={{ ...styles.td, display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: '8px' }}>
                            {isImagePath(plantInfo[entry.plantName].image) ? (
                              <img
                                src={plantInfo[entry.plantName].image}
                                alt={entry.plantName}
                                style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                            ) : (
                              <span style={{ fontSize: '2rem' }}>{plantInfo[entry.plantName].image}</span>
                            )}
                          </span>
                          {entry.plantName}
                        </td>
                        <td style={styles.td}>{entry.id}</td>
                        <td style={styles.td}>{entry.timestamp}</td>
                        <td style={styles.td}>{entry.temperature}</td>
                        <td style={styles.td}>{entry.ph}</td>
                        <td style={styles.td}>{entry.tds}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div
          style={{
            ...styles.videoContainer,
            ...(isVideoMaximized ? styles.videoMaximized : styles.videoMinimized)
          }}
          onClick={() => setIsVideoMaximized(prev => !prev)}
        >
          <video
            style={styles.video}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="./assets/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default HydroMonitor;
