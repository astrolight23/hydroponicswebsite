import React, { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Camera, Upload, Download, TrendingUp, Droplets, Leaf, Home, BarChart3, Calendar, FileText, Plus } from 'lucide-react';

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
    ec: '',
    notes: '',
    images: []
  });
  const [error, setError] = useState('');
  const [isVideoMaximized, setIsVideoMaximized] = useState(false);

  const fileInputRef = useRef(null);
  const csvInputRef = useRef(null);

  const plantInfo = {
    'Bok choy': {
      image: '/assets/water-spinach.png',
      color: 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)',
      description: 'Nutrient-rich leafy green',
      optimalPH: '5.5-6.5',
      optimalEC: '1.8-2.4'
    },
    'Chili': {
      image: '/assets/chili-plant.png',
      color: 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)',
      description: 'Spicy pepper variety',
      optimalPH: '6.0-6.8',
      optimalEC: '2.0-3.5'
    },
    'Purple basil': {
      image: '/assets/purple-basil.png',
      color: 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)',
      description: 'Aromatic purple-leafed herb',
      optimalPH: '5.5-6.5',
      optimalEC: '1.0-1.6'
    },
    'Thai basil': {
      image: '/assets/thai-basil.png',
      color: 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)',
      description: 'Sweet and spicy Asian herb',
      optimalPH: '6.0-7.0',
      optimalEC: '1.2-1.8'
    },
    'Lemon basil': {
      image: '/assets/lemon-basil.png',
      color: 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)',
      description: 'Citrusy aromatic herb',
      optimalPH: '5.8-6.8',
      optimalEC: '1.0-1.5'
    }
  };

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
    textarea: {
      width: '100%',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      padding: '12px 16px',
      color: 'white',
      fontSize: '16px',
      minHeight: '96px',
      resize: 'vertical',
      fontFamily: 'inherit',
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
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
      gap: '16px',
      marginTop: '16px'
    },
    uploadedImage: {
      width: '100%',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '8px',
      border: '2px solid rgba(255, 255, 255, 0.3)'
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
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Maximum 5 images allowed per entry.');
      return;
    }
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
      setError('');
    });
  };

  const handleResetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      ph: '',
      ec: '',
      notes: '',
      images: []
    });
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!selectedPlant) {
      setError('Please select a plant.');
      return;
    }
    if (!formData.date || !formData.ph || !formData.ec) {
      setError('Please fill in all required fields (Date, pH, EC).');
      return;
    }
    if (isNaN(formData.ph) || formData.ph < 0 || formData.ph > 14) {
      setError('pH must be a number between 0 and 14.');
      return;
    }
    if (isNaN(formData.ec) || formData.ec < 0) {
      setError('EC must be a positive number.');
      return;
    }

    const newEntry = {
      ...formData,
      id: Date.now(),
      ph: parseFloat(formData.ph),
      ec: parseFloat(formData.ec),
      timestamp: new Date().toISOString()
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
          plant: plantName,
          date: entry.date,
          ph: entry.ph,
          ec: entry.ec,
          notes: entry.notes.replace(/"/g, '""'),
          imageCount: entry.images.length,
          timestamp: entry.timestamp
        });
      });
    });

    const csvData = [];
    csvData.push(['plant', 'date', 'ph', 'ec', 'notes', 'imageCount', 'timestamp']);
    allData.forEach(row => {
      csvData.push([row.plant, row.date, row.ph, row.ec, `"${row.notes}"`, row.imageCount, row.timestamp]);
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
        if (!headers.includes('plant') || !headers.includes('date') || !headers.includes('ph') || !headers.includes('ec')) {
          setError('Invalid CSV file: Required headers (plant, date, ph, ec) missing.');
          return;
        }

        const importedData = { 
          'Bok choy': [], 
          'Chili': [], 
          'Purple basil': [], 
          'Thai basil': [], 
          'Lemon basil': [] 
        };
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(val => val.trim().replace(/^"|"$/g, ''));
          if (values.length >= headers.length && values[0]) {
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            
            if (row.plant && importedData[row.plant]) {
              importedData[row.plant].push({
                id: Date.now() + Math.random(),
                date: row.date || new Date().toISOString().split('T')[0],
                ph: parseFloat(row.ph) || 0,
                ec: parseFloat(row.ec) || 0,
                notes: row.notes || '',
                images: [],
                timestamp: row.timestamp || new Date().toISOString()
              });
            }
          }
        }

        setPlantData(prev => ({
          'Bok choy': [...prev['Bok choy'], ...importedData['Bok choy']],
          'Chili': [...prev['Chili'], ...importedData['Chili']],
          'Purple basil': [...prev['Purple basil'], ...importedData['Purple basil']],
          'Thai basil': [...prev['Thai basil'], ...importedData['Thai basil']],
          'Lemon basil': [...prev['Lemon basil'], ...importedData['Lemon basil']]
        }));
        setError('CSV imported successfully!');
        if (csvInputRef.current) csvInputRef.current.value = '';
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
          ec: entry.ec,
          [plantName]: entry[dataType]
        });
      });
    });
    
    return chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

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
                    EC Value (mS/cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.ec}
                    onChange={(e) => setFormData(prev => ({...prev, ec: e.target.value}))}
                    style={styles.input}
                    placeholder={`Optimal: ${plantInfo[selectedPlant].optimalEC}`}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={styles.label}>
                  <Camera size={16} />
                  Photos
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      ...styles.button,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      color: 'white'
                    }}
                  >
                    <Plus size={16} />
                    Add Photos
                  </button>
                  {formData.images.length > 0 && (
                    <span style={{ color: '#bfdbfe' }}>{formData.images.length} photos selected</span>
                  )}
                </div>
                {formData.images.length > 0 && (
                  <div style={styles.imageGrid}>
                    {formData.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Upload ${idx + 1}`}
                        style={styles.uploadedImage}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={styles.label}>
                  <FileText size={16} />
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                  style={styles.textarea}
                  placeholder="Add any observations or notes..."
                />
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
                </div>

                <div style={styles.chartContainer}>
                  <h2 style={styles.chartTitle}>
                    <TrendingUp size={24} color="#34d399" />
                    EC Trends
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData('ec')}>
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
                </div>
              </div>
            )}

            <div style={{ ...styles.grid, ...styles.gridCols3, marginTop: '32px' }}>
              {Object.keys(plantData).map(plantName => {
                const entries = plantData[plantName];
                const avgPH = entries.length > 0 ? (entries.reduce((sum, entry) => sum + entry.ph, 0) / entries.length).toFixed(1) : 'N/A';
                const avgEC = entries.length > 0 ? (entries.reduce((sum, entry) => sum + entry.ec, 0) / entries.length).toFixed(1) : 'N/A';
                
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
                        <span>Avg EC:</span>
                        <span style={{ fontWeight: '600' }}>{avgEC}</span>
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
                    <p style={{ margin: '4px 0' }}><strong>Optimal EC:</strong> {plantInfo[plantName].optimalEC}</p>
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
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>pH</th>
                    <th style={styles.th}>EC</th>
                    <th style={styles.th}>Notes</th>
                    <th style={styles.th}>Photos</th>
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
                        <td style={styles.td}>{entry.date}</td>
                        <td style={styles.td}>{entry.ph}</td>
                        <td style={styles.td}>{entry.ec}</td>
                        <td style={styles.td}>{entry.notes.substring(0, 50)}{entry.notes.length > 50 ? '...' : ''}</td>
                        <td style={styles.td}>{entry.images.length} photos</td>
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