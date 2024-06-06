const { useState, useEffect } = React;

const ClockModule = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
      const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-GB', options);
    };

    const formatZuluTime = (date) => {
      return date.toISOString().substring(11, 16) + ' Z';
    };

    return (
      <div className="bg-gray-800 p-4 rounded-md text-center">
        <h2 className="text-4xl">{formatTime(time)}</h2>
        <h3 className="text-xl">({formatZuluTime(time)})</h3>
        <p className="text-lg">{formatDate(time)}</p>
      </div>
    );
  };