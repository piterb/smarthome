const PublicTransportModule = ({ stationId }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-md">
      <iframe
        src={`https://imhd.sk/ba/online-zastavkova-tabula?st=${stationId}`}
        width="100%"
        height="500"
        frameBorder="0"
        className="rounded-md"
        allowFullScreen
        title="Public transport"
      ></iframe>
    </div>
  );
};
