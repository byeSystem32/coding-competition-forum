export const TEAM_COLORS = [
  "#FF6B6B", // Coral
  "#4ECDC4", // Teal
  "#45B7D1", // Sky Blue
  "#96CEB4", // Sage
  "#FFEAA7", // Yellow
  "#DDA0DD", // Plum
  "#F39C12", // Orange
  "#82E0AA", // Emerald
  "#85C1E9", // Light Blue
  "#F1948A", // Salmon
  "#BB8FCE", // Lavender
  "#73C6B6", // Mint
  "#E8DAEF", // Pale Purple
  "#F5B041", // Amber
  "#76D7C4", // Aquamarine
  "#F0B27A", // Peach
];

// Assign a deterministic-but-random color to a team name
export function getTeamColor(teamName: string, usedColors: string[]): string {
  // First check if this team already has a color
  // If all colors are used, start cycling with slight variation
  const available = TEAM_COLORS.filter((c) => !usedColors.includes(c));

  if (available.length > 0) {
    // Pick a "random" color based on team name hash
    let hash = 0;
    for (let i = 0; i < teamName.length; i++) {
      hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % available.length;
    return available[index];
  }

  // Fallback: cycle through colors
  const index = usedColors.length % TEAM_COLORS.length;
  return TEAM_COLORS[index];
}
