
const WeatherRadarModule = () => {
    return (
      <div className="bg-gray-800 p-4 rounded-md">
        <h3 className="text-xl mb-2">Weather Radar</h3>
        <iframe
          src="https://www.rainviewer.com/map.html?loc=48.0082,17.5392,6.283809968989212&oFa=0&oC=0&oU=0&oCS=1&oF=0&oAP=0&c=3&o=83&lm=1&layer=radar&mlayer=0&sm=1&sn=1&hu=false"
          width="100%"
          height="500"
          frameBorder="0"
          className="rounded-md"
          allowFullScreen
          title="Weather Radar"
        ></iframe>
      </div>
    );
  };