

const PublicTransportModule = ({ stationId }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-md">
      <iframe
        src={`https://imhd.sk/ba/online-zastavkova-tabula?st=${stationId}`}
        width="100%"
        height="500"
        frameBorder="0"
        className="rounded-md iframe-public-transport"
        allowFullScreen
        title="Public transport"
      ></iframe>
      <style>
        {`
          @media (max-width: 1024px) {
            .iframe-public-transport {
              height: 300px; /* Height for tablets */
            }
          }

          @media (max-width: 768px) {
            .iframe-public-transport {
              height: 200px; /* Height for small tablets and large phones */
            }
          }

          @media (max-width: 480px) {
            .iframe-public-transport {
              height: 200px; /* Height for small phones */
            }
          }
        `}
      </style>
    </div>
    
  );
};
