import type { AtlasFocus } from "@/data/atlas";
export default function AtlasPoster({ focus }: { focus: AtlasFocus }) {
  const colors = { agents: "#c6a0ff", systems: "#7ce8ef", data: "#f2ba77" };
  return (
    <svg
      className="atlas-poster"
      viewBox="0 0 620 410"
      role="img"
      aria-label="Systems Atlas: agents, backend systems, and data connected around an AI product."
    >
      <defs>
        <radialGradient id="atlas-halo">
          <stop stopColor={colors[focus]} stopOpacity=".15" />
          <stop offset="1" stopColor={colors[focus]} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="310" cy="210" r="190" fill="url(#atlas-halo)" />
      <g fill="none" stroke="#434663">
        <ellipse
          cx="310"
          cy="233"
          rx="239"
          ry="106"
          transform="rotate(-16 310 233)"
        />
        <ellipse
          cx="310"
          cy="200"
          rx="130"
          ry="166"
          transform="rotate(42 310 200)"
        />
        <ellipse
          cx="310"
          cy="217"
          rx="207"
          ry="86"
          transform="rotate(24 310 217)"
        />
      </g>
      <g strokeWidth="2" fill="none">
        <path
          d="M146 157Q240 95 310 210"
          stroke={focus === "agents" ? colors.agents : "#454052"}
        />
        <path
          d="M474 170Q395 112 310 210"
          stroke={focus === "systems" ? colors.systems : "#344952"}
        />
        <path
          d="M343 328Q374 249 310 210"
          stroke={focus === "data" ? colors.data : "#514533"}
        />
      </g>
      <g fill="#141827">
        <path
          d="M310 149L369 183V247L310 280L251 247V183Z"
          stroke={colors[focus]}
          strokeWidth="2"
        />
        <path
          d="M251 183L310 217L369 183M310 217V280M310 149V217"
          stroke={colors[focus]}
          strokeOpacity=".5"
        />
      </g>
      <g
        fill="#d5d9ed"
        fontFamily="monospace"
        fontSize="13"
        textAnchor="middle"
      >
        <circle
          cx="146"
          cy="157"
          r="29"
          fill="#251e3e"
          stroke={colors.agents}
        />
        <text x="146" y="162" fill={colors.agents}>
          AI
        </text>
        <text x="146" y="209">
          AGENTS
        </text>
        <rect
          x="443"
          y="140"
          width="62"
          height="62"
          rx="12"
          fill="#122d35"
          stroke={colors.systems}
        />
        <text x="474" y="176" fill={colors.systems}>
          Go
        </text>
        <text x="474" y="224">
          SYSTEMS
        </text>
        <ellipse
          cx="343"
          cy="340"
          rx="34"
          ry="17"
          fill="#30261e"
          stroke={colors.data}
        />
        <path d="M309 315V340M377 315V340" stroke={colors.data} />
        <ellipse
          cx="343"
          cy="315"
          rx="34"
          ry="17"
          fill="#30261e"
          stroke={colors.data}
        />
        <text x="343" y="384">
          DATA
        </text>
      </g>
      <g fill={colors[focus]}>
        <circle cx="247" cy="132" r="4" />
        <circle cx="409" cy="139" r="4" />
        <circle cx="362" cy="283" r="4" />
      </g>
    </svg>
  );
}
