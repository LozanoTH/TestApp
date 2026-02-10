import { StyleSheet, useColorScheme, View } from "react-native";
import { WebView } from "react-native-webview";
export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: getHtmlContent(isDark) }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: "#FFFFFF",
  },
  containerDark: {
    backgroundColor: "#0B0B0B",
  },
  webview: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
});

const getHtmlContent = (isDark: boolean) => `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        background: ${isDark ? "#0B0B0B" : "#FFFFFF"};
        color: ${isDark ? "#FFFFFF" : "#111111"};
        font-family: Arial, Helvetica, sans-serif;
      }
      .wrap {
        min-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .card {
        width: 90%;
        max-width: 360px;
        background: ${isDark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.9)"};
        border: 1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
        border-radius: 14px;
        padding: 20px;
        text-align: center;
      }
      h1 {
        font-size: 22px;
        margin: 0 0 8px;
      }
      p { margin: 0; opacity: 0.9; }
      button {
        margin-top: 12px;
        padding: 10px 14px;
        border-radius: 10px;
        border: none;
        background: ${isDark ? "#FFFFFF" : "#111111"};
        color: ${isDark ? "#111111" : "#FFFFFF"};
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <h1>Hola desde HTML</h1>
        <p>Esto se renderiza dentro del WebView.</p>
        <button>Boton HTML</button>
      </div>
    </div>
  </body>
</html>
`;
