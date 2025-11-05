export const COLORS = {
  primary: "#021024",
  secondary: "#052659",
  accent: "#548383",
  light: "#7DA0CA",
  lightest: "#C1E8FF",

  // Status colors
  pendente: "#FFA500",
  comprovado: "#4169E1",
  concluido: "#22C55E",
  recusado: "#EF4444",

  // UI colors
  background: "#021024",
  card: "rgba(84, 131, 131, 0.15)",
  cardBorder: "rgba(193, 232, 255, 0.2)",
  text: "#FFFFFF",
  textSecondary: "#C1E8FF",
  overlay: "rgba(2, 16, 36, 0.8)",
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Pendente":
      return COLORS.pendente;
    case "Comprovado":
      return COLORS.comprovado;
    case "Concluído":
      return COLORS.concluido;
    case "Recusado":
      return COLORS.recusado;
    default:
      return COLORS.textSecondary;
  }
};
