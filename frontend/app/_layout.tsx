// Layout raiz do app
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useOrcamentoStore } from "../src/store/orcamentoStore";

export default function RootLayout() {
  const carregarOrcamentos = useOrcamentoStore(
    (state) => state.carregarOrcamentos
  );

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#021024",
          },
          headerTintColor: "#C1E8FF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="detalhes/[id]"
          options={{
            title: "Detalhes do Orçamento",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="relatorio-faturamento"
          options={{
            title: "Relatório de Faturamento",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="relatorio-performance"
          options={{
            title: "Relatório de Performance",
            presentation: "modal",
          }}
        />
      </Stack>
    </>
  );
}
