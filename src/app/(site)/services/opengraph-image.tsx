import { ImageResponse } from "next/og";
import { categories } from "@/lib/content";

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
        {/* Background glow — single child only so no display:flex needed */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(185,154,101,0.07) 0%, transparent 70%)",
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
            padding: "52px 72px 48px",
            flexDirection: "column",
          }}
        >
          {/* Label row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "28px",
            }}
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
              All Procedures
            </span>
            <div style={{ width: "24px", height: "1px", background: "#b99a65", display: "flex" }} />
          </div>

          {/* Title — no br tag, two separate divs */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "88px",
                color: "#f7f4ed",
                fontWeight: 300,
                letterSpacing: "-3px",
                lineHeight: 1.0,
              }}
            >
              Procedures &amp;
            </div>
            <div
              style={{
                fontSize: "88px",
                color: "#f7f4ed",
                fontWeight: 300,
                letterSpacing: "-3px",
                lineHeight: 1.0,
              }}
            >
              Treatments
            </div>
          </div>

          {/* Gold line */}
          <div
            style={{
              width: "80px",
              height: "1px",
              background: "linear-gradient(90deg, #b99a65, transparent)",
              marginBottom: "28px",
              display: "flex",
            }}
          />

          {/* Category pills */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              flex: 1,
              alignContent: "flex-start",
            }}
          >
            {categories.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  border: "1px solid rgba(185,154,101,0.3)",
                  borderRadius: "999px",
                  padding: "6px 18px",
                  fontSize: "15px",
                  fontFamily: "Arial, sans-serif",
                  color: "rgba(247,244,237,0.65)",
                }}
              >
                {c}
              </div>
            ))}
          </div>

          {/* Bottom branding */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "24px",
              borderTop: "1px solid rgba(185,154,101,0.15)",
              marginTop: "16px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontFamily: "Arial, sans-serif",
                  color: "#f7f4ed",
                  fontWeight: 600,
                  display: "flex",
                }}
              >
                Dr. Sharmistha Bhattacharyya
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontFamily: "Arial, sans-serif",
                  color: "#b99a65",
                  display: "flex",
                }}
              >
                AIIMS-trained Plastic &amp; Aesthetic Surgeon · Across Delhi NCR · Gurgaon &amp; South Delhi
              </div>
            </div>
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
