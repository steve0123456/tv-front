import React, { useEffect, useState } from "react";
import Hls from "hls.js";

function Home() {
  const [channels, setChannels] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);

  // Fetch channels from backend
  useEffect(() => {
    fetch("https://tv-5ote.onrender.com/api/channels")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched channels:", data);
        setChannels(data);
      })
      .catch((err) => console.error("Error fetching channels:", err));
  }, []);

  // Play stream when selectedUrl changes
  useEffect(() => {
    if (selectedUrl) {
      const video = document.getElementById("videoPlayer");
      let hls;

      console.log("Loading stream:", selectedUrl);

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(selectedUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((err) =>
            console.error("Autoplay failed:", err)
          );
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = selectedUrl;
        video.play().catch((err) => console.error("Autoplay failed:", err));
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [selectedUrl]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
  {/* Sidebar */}
  <div
    style={{
      width: "250px",
      backgroundColor: "#1e1e2f",
      color: "#fff",
      padding: "20px",
      overflowY: "auto",
    }}
  >
    <h2 style={{ textAlign: "center" }}>📺 Channels</h2>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {channels.map((ch) => (
        <li key={ch.id} style={{ margin: "10px 0" }}>
          <button
            onClick={() => {
              console.log("Clicked channel:", ch);
              setSelectedUrl(ch.streamurl);
            }}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#3b3b5c",
              color: "#fff",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            ▶ {ch.name}
          </button>
        </li>
      ))}
    </ul>
  </div>

  {/* Main Video Player */}
  <div
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f4f4f9",
    }}
  >
    <video
      id="videoPlayer"
      controls
      autoPlay
      muted
      style={{ width: "80%", maxWidth: "900px", borderRadius: "12px" }}
    ></video>
  </div>
</div>
  );
}

export default Home;
