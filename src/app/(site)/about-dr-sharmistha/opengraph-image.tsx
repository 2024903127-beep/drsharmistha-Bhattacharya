import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f2b23",
          fontFamily: "Georgia, 'Times New Roman', serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(185,154,101,0.08) 0%, transparent 65%)",
            display: "flex",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, #b99a65 30%, #c8ab78 50%, #b99a65 70%, transparent 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            padding: "52px 72px 48px",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}
          >
            <div style={{ width: "24px", height: "1px", background: "#b99a65", display: "flex" }} />
            <span
              style={{
                fontSize: "13px",
                fontFamily: "Arial, sans-serif",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "#b99a65",
                fontWeight: 600,
              }}
            >
              Meet the Surgeon
            </span>
            <div style={{ width: "24px", height: "1px", background: "#b99a65", display: "flex" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "24px" }}>
            <div style={{ fontSize: "88px", color: "#f7f4ed", fontWeight: 300, letterSpacing: "-2.5px", lineHeight: 1.0 }}>
              About Dr.
            </div>
            <div style={{ fontSize: "88px", color: "#f7f4ed", fontWeight: 300, letterSpacing: "-2.5px", lineHeight: 1.0 }}>
              Sharmistha
            </div>
          </div>
          <div style={{ width: "80px", height: "1px", background: "linear-gradient(90deg, #b99a65, transparent)", marginBottom: "24px", display: "flex" }} />
          <div
            style={{
              fontSize: "24px",
              fontFamily: "Arial, sans-serif",
              color: "rgba(247,244,237,0.60)",
              lineHeight: 1.5,
              flex: 1,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            MS (Surgery), MCh (Plastic Surgery) — AIIMS New Delhi. 10+ years serving across Delhi NCR — Gurgaon, South Delhi &amp; Faridabad.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "20px",
              borderTop: "1px solid rgba(185,154,101,0.15)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ fontSize: "18px", fontFamily: "Arial, sans-serif", color: "#f7f4ed", fontWeight: 600, display: "flex" }}>
                Dr. Sharmistha Bhattacharyya
              </div>
              <div style={{ fontSize: "14px", fontFamily: "Arial, sans-serif", color: "#b99a65", display: "flex" }}>
                Plastic &amp; Aesthetic Surgeon · drsharmisthabhattacharyya.com
              </div>
            </div>
            <div
              style={{
                width: "72px", height: "72px", borderRadius: "50%",
                border: "1px solid rgba(185,154,101,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#b99a65", fontSize: "32px", fontFamily: "Georgia, serif",
                background: "rgba(185,154,101,0.06)",
              }}
            >
              S
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%", height: "2px",
            background: "linear-gradient(90deg, transparent 0%, #b99a65 30%, #c8ab78 50%, #b99a65 70%, transparent 100%)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
