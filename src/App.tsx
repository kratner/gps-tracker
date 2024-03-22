import { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const handlePositionChange = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setCoordinates({ latitude, longitude });
    };

    const watchId = navigator.geolocation.watchPosition(
      handlePositionChange,
      (error) => {
        console.error('Error getting location:', error);
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const copyToClipboard = () => {
    if (coordinates) {
      const { latitude, longitude } = coordinates;
      navigator.clipboard.writeText(`${latitude},${longitude}`);
    }
  };

  return (
    <div className="App">
      <h1>GPS Tracker</h1>
      {coordinates ? (
        <div>
          <p>Latitude: {coordinates.latitude}</p>
          <p>Longitude: {coordinates.longitude}</p>
          <button onClick={copyToClipboard} type='button'>Copy to Clipboard</button>
        </div>
      ) : (
        <p>Fetching coordinates...</p>
      )}
    </div>
  );
};

export default App;
