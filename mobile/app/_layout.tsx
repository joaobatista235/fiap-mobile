import * as SplashScreen from "expo-splash-screen";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@/src/contexts/AuthContext";
import { useAuth } from "@/src/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

function Guard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    SplashScreen.hideAsync();

    const inAuth = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuth) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuth) {
      router.replace("/(app)");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Guard />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
