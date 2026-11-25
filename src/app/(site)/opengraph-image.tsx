import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

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
        {/* Radial glow top-right */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "580px",
            height: "580px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(185,154,101,0.09) 0%, transparent 65%)",
            display: "flex",
          }}
        />
        {/* Radial glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-60px",
            width: "460px",
            height: "460px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(23,61,50,0.5) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top gold line */}
        <div
          style={{
            width: "100%",
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, #b99a65 30%, #c8ab78 50%, #b99a65 70%, transparent 100%)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            padding: "52px 72px 48px",
          }}
        >
          {/* Label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <div style={{ width: "28px", height: "1px", background: "#b99a65", display: "flex" }} />
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
              Plastic &amp; Aesthetic Surgery
            </span>
            <div style={{ width: "28px", height: "1px", background: "#b99a65", display: "flex" }} />
          </div>

          {/* Doctor name — two separate divs (no br tag) */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "8px" }}>
            <div
              style={{
                fontSize: "80px",
                color: "#f7f4ed",
                fontWeight: 300,
                letterSpacing: "-2.5px",
                lineHeight: 1.0,
              }}
            >
              Dr. Sharmistha
            </div>
            <div
              style={{
                fontSize: "80px",
                color: "#f7f4ed",
                fontWeight: 300,
                letterSpacing: "-2.5px",
                lineHeight: 1.0,
              }}
            >
              Bhattacharyya
            </div>
          </div>

          {/* Gold divider */}
          <div
            style={{
              width: "80px",
              height: "1px",
              background: "linear-gradient(90deg, #b99a65, transparent)",
              margin: "24px 0",
              display: "flex",
            }}
          />

          {/* Tagline */}
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
            AIIMS-trained Plastic &amp; Aesthetic Surgeon serving across Delhi NCR — Gurgaon &amp; South Delhi.
          </div>

          {/* Credential pills */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "28px",
              flexWrap: "wrap",
            }}
          >
            {["10+ Years Experience", "AIIMS Trained", "Natural Results", "120+ Reviews"].map((pill) => (
              <div
                key={pill}
                style={{
                  display: "flex",
                  border: "1px solid rgba(185,154,101,0.3)",
                  borderRadius: "999px",
                  padding: "5px 16px",
                  fontSize: "13px",
                  fontFamily: "Arial, sans-serif",
                  color: "rgba(247,244,237,0.60)",
                }}
              >
                {pill}
              </div>
            ))}
          </div>

          {/* Bottom branding row */}
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
              <div
                style={{
                  fontSize: "16px",
                  fontFamily: "Arial, sans-serif",
                  color: "#b99a65",
                  letterSpacing: "0.5px",
                  display: "flex",
                }}
              >
                Across Delhi NCR · Gurgaon (Golf Course Road) · South Delhi · Faridabad
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontFamily: "Arial, sans-serif",
                  color: "rgba(247,244,237,0.40)",
                  display: "flex",
                }}
              >
                drsharmisthabhattacharyya.com
              </div>
            </div>
            {/* S monogram */}
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                border: "1px solid rgba(185,154,101,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#b99a65",
                fontSize: "32px",
                fontFamily: "Georgia, serif",
                background: "rgba(185,154,101,0.06)",
              }}
            >
              S
            </div>
          </div>
        </div>

        {/* Bottom gold line */}
        <div
          style={{
            width: "100%",
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, #b99a65 30%, #c8ab78 50%, #b99a65 70%, transparent 100%)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
