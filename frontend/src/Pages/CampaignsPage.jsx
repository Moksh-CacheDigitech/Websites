import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function CampaignsPage() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="w-full h-screen" style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src="/dell-storage-landing-page.html"
        title="Dell Storage Campaign"
        className="w-full h-full border-0"
        style={{ width: '100%', height: '100vh', border: 'none' }}
      />
    </div>
  );
}

export default CampaignsPage;