import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchCampaigns } from "../lib/sanityQueries";

function CampaignsPage() {
  const location = useLocation();
  const [embedUrl, setEmbedUrl] = useState("/dell-storage-landing-page.html");
  const [title, setTitle] = useState("Dell Storage Campaign");

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    fetchCampaigns().then(({ items, error }) => {
      if (error || !items?.[0]?.embedUrl) return;
      setEmbedUrl(items[0].embedUrl);
      setTitle(items[0].title || "Campaign");
    });
  }, [location]);

  return (
    <div className="w-full h-screen" style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0"
        style={{ width: '100%', height: '100vh', border: 'none' }}
      />
    </div>
  );
}

export default CampaignsPage;