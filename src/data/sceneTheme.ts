export function getSceneTheme(light: boolean) {
  return light
    ? {
        agents: "#006b73",
        systems: "#b52362",
        data: "#586900",
        surface: "#e8f3f3",
        ink: "#183238",
        guide: "#799297",
      }
    : {
        agents: "#43f5da",
        systems: "#ff609f",
        data: "#d6f65a",
        surface: "#07191f",
        ink: "#c3e5e7",
        guide: "#3e6973",
      };
}
