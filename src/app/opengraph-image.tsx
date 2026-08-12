import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "UNSW Bengaluru Club Portal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#231F20",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 72,
            height: 72,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFE600",
            fontSize: 28,
            fontWeight: 700,
            color: "#231F20",
            marginBottom: 40,
          }}
        >
          UB
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#FFE600" }}>
          UNSW Bengaluru
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "white" }}>
          Club Portal
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#F6F6F4", marginTop: 24 }}>
          Find your club. Apply in minutes. Run it properly.
        </div>
      </div>
    ),
    { ...size }
  );
}
