import React, { useRef, useEffect } from "react";

function ClientsCards() {
  const clients = [
    { name: "Aditya Birla", img: "/clients/adityabirla.webp" },
    { name: "Agic Bricks", img: "/clients/agicbricks.webp" },
    { name: "Airtel", img: "/clients/airtel.webp" },
    { name: "Apollo", img: "/clients/apollo.webp" },
    { name: "Bharti infratel", img: "/clients/bhartiinfratel.webp" },
    { name: "CDAC", img: "/clients/cdac.webp" },
    { name: "Dabur", img: "/clients/dabur.webp" },
    { name: "Dakin", img: "/clients/dakin.webp" },
    { name: "Eicher", img: "/clients/eicher.webp" },
    { name: "Ericsson", img: "/clients/ericsson.webp" },
    { name: "Evalue Serve", img: "/clients/evalueserve.webp" },
    { name: "Gaar", img: "/clients/gaar.webp" },
    { name: "Grant Thornton", img: "/clients/grantthornton.webp" },
    { name: "Hero", img: "/clients/hero.webp" },
    { name: "Ienergizer", img: "/clients/ienergizer.webp" },
    { name: "Industower", img: "/clients/industower.webp" },
    { name: "Inter Globe", img: "/clients/internglobe.webp" },
    { name: "Irctc", img: "/clients/irctc.webp" },
    { name: "Jindal Steel", img: "/clients/jindal steel.webp" },
    { name: "Jindal Saw", img: "/clients/jindalsaw.webp" },
    { name: "Jk Cement", img: "/clients/jkcementltd.webp" },
    { name: "Jk paper", img: "/clients/jkpaperltd.webp" },
    { name: "Jubilant", img: "/clients/jubilant.webp" },
    { name: "Mahindra Comviva", img: "/clients/mahindracomviva.webp" },
    { name: "Nokia", img: "/clients/nokia.webp" },
    { name: "NSE", img: "/clients/nse.webp" },
    { name: "Nxtra", img: "/clients/nxtradata.webp" },
    { name: "PhonePe", img: "/clients/phonepe.webp" },
    { name: "Relaxo", img: "/clients/relaxo.webp" },
    { name: "Tata", img: "/clients/tata.webp" },
    { name: "Vodafone", img: "/clients/vodafone.webp" },
    { name: "yamaha", img: "/clients/yamaha.webp" },
    { name: "RJ CORP", img: "/clients/rjcorp.webp" },

  ];

  // Duplicate for infinite scroll
  const sliderClients = [...clients, ...clients];
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    let animationFrame;
    let scrollAmount = 0;

    function animate() {
      if (slider) {
        scrollAmount += 1; // speed
        if (scrollAmount >= slider.scrollWidth / 2) {
          scrollAmount = 0;
        }
        slider.scrollLeft = scrollAmount;
      }
      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="w-full bg-gray-50 py-6 px-6 flex justify-center" id="clients">
      <div className="max-w-6xl w-full">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-red-600 mb-4">Clients</h2>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="relative w-full overflow-x-hidden"
          style={{ height: "160px" }}
        >
          <div
            className="flex flex-row gap-4 items-center" // reduced gap
            style={{ width: "max-content", minWidth: "100%" }}
          >
            {sliderClients.map((client, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center min-w-[140px] h-[140px]" // uniform size
              >
                <img
                  src={client.img}
                  alt={client.name}
                  className="h-[100px] w-[100px] object-contain" // fixed logo size
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientsCards;
