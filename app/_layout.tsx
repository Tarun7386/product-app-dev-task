import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack
        initialRouteName="welcome"
        screenOptions={{
          
         
          headerStyle: { backgroundColor: "#121c31ff" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "#F6F7FB" ,
           

          },
        }}
      >
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ title: "Products" }} />
        <Stack.Screen
          name="product/[id]"
          options={{ title: "Product Details" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
