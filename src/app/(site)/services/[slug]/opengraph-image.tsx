import { ImageResponse } from "next/og";
import { services, getService } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const generateStaticParams = () =>
  services.map((s) => ({ slug: s.slug }));

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const s = getService((await params).slug);

  const name = s?.name ?? "Procedure";
  const category = s?.category ?? "Plastic Surgery";
  const short = s?.short ?? "";

  const nameFontSize = name.length > 22 ? 68 : name.length > 16 ? 76 : 88;

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
        {/* Background radial glows — each is a single child so display:flex is fine */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(185,154,101,0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(23,61,50,0.6) 0%, transparent 70%)",
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
            flexDirection: "column",
            flex: 1,
            padding: "52px 72px 48px",
          }}
        >
          {/* Category label row */}
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
              {category}
            </span>
            <div style={{ width: "24px", height: "1px", background: "#b99a65", display: "flex" }} />
          </div>

          {/* Service name */}
          <div
            style={{
              fontSize: `${nameFontSize}px`,
              color: "#f7f4ed",
              fontWeight: 300,
              letterSpacing: "-2px",
              lineHeight: 1.05,
              marginBottom: "24px",
              display: "flex",
            }}
          >
            {name}
          </div>

          {/* Gold divider */}
          <div
            style={{
              width: "80px",
              height: "1px",
              background: "linear-gradient(90deg, #b99a65 0%, rgba(185,154,101,0.3) 100%)",
              marginBottom: "24px",
              display: "flex",
            }}
          />

          {/* Short description */}
          <div
            style={{
              fontSize: "22px",
              fontFamily: "Arial, sans-serif",
              color: "rgba(247,244,237,0.60)",
              lineHeight: 1.55,
              maxWidth: "760px",
              flex: 1,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {short.length > 120 ? short.slice(0, 118) + "…" : short}
          </div>

          {/* Assessment pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "16px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid rgba(185,154,101,0.3)",
                borderRadius: "999px",
                padding: "6px 16px",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                color: "rgba(247,244,237,0.70)",
              }}
            >
              <span style={{ color: "#b99a65", fontWeight: 600 }}>1:1 Plan</span>
              <span>Personalised clinical assessment &amp; tailored quotation</span>
            </div>
          </div>

          {/* Bottom branding row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(185,154,101,0.15)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontFamily: "Arial, sans-serif",
                  color: "#f7f4ed",
                  fontWeight: 600,
                  letterSpacing: "-0.3px",
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
                  letterSpacing: "0.5px",
                  display: "flex",
                }}
              >
                AIIMS-trained Plastic &amp; Aesthetic Surgeon · Across Delhi NCR · Gurgaon &amp; South Delhi
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
