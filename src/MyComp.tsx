import { AbsoluteFill } from "remotion";

interface MyCompProps {
  text: string;
}

export const MyComp: React.FC<MyCompProps> = ({ text }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px",
      }}
    >
      <h1
        style={{
          color: "#e94560",
          fontFamily: "sans-serif",
          fontSize: 80,
          textAlign: "center",
          lineHeight: 1.3,
          wordBreak: "break-word",
        }}
      >
        {text}
      </h1>
    </AbsoluteFill>
  );
};
