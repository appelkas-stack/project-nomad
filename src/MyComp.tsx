import { AbsoluteFill } from "remotion";

export const MyComp: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#e94560",
          fontFamily: "sans-serif",
          fontSize: 80,
        }}
      >
        Hello from Remotion!
      </h1>
    </AbsoluteFill>
  );
};
