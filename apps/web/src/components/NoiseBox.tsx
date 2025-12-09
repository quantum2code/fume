function NoiseBox({ noiseSize = 0.008, randomSeed = 2312 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      id="noise-rect"
      className="w-full h-full"
    >
      <style>{`
  .rot {
    transform-origin: 50% 50%;
    transform-box: fill-box; /* important for SVG elements */
    animation: rot 7s ease-in-out infinite;
  }
  @keyframes rot {
    0% { transform: rotate(0deg) translate(0%, 0%); }
    50% { transform: rotate(160deg) translate(-20%, 30%); }
    100%  { transform: rotate(360deg) translate(0%, 0%); }
  }
`}</style>
      <filter id={"noise-filter"}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={noiseSize}
          numOctaves="1"
          stitchTiles="stitch"
          seed={randomSeed}
          result="noise"
        />
        <feComponentTransfer in="noise">
          <feFuncA type="linear" slope="3.5" intercept="-1" />
        </feComponentTransfer>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1
                  0 0 0 0 1
                  0 0 0 0 1
                  0 0 0 1 0.3"
        />
      </filter>

      <g className="rot">
        <circle
          r={"200"}
          cx={"50%"}
          cy={"50%"}
          filter={`url(#noise-filter)`}
        ></circle>
      </g>
    </svg>
  );
}

export default NoiseBox;