import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function Welcome() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={styles.backgroundGradient}
      />

      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🛍️</Text>
          </View>
          <Text style={styles.logo}>Product App</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.card}>
          {/* Decorative circles in background */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          
          {/* Main emoji container with glow effect */}
          <View style={styles.emojiWrapper}>
            <View style={styles.emojiGlow} />
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>🛍️</Text>
            </View>
          </View>
          
          {/* Floating particles */}
          <View style={styles.particle1}>
            <View style={styles.particleDot} />
          </View>
          <View style={styles.particle2}>
            <View style={styles.particleDot} />
          </View>
          <View style={styles.particle3}>
            <View style={styles.particleDot} />
          </View>
          
          {/* Sparkle icons */}
          <Text style={styles.sparkle1}>✨</Text>
          <Text style={styles.sparkle2}>✨</Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => router.replace("/")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#00d2ff", "#3a7bd5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f3460",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  
  // Top Section Styles
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logoIcon: {
    fontSize: 22,
  },
  logo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1.2,
  },
  
  // Content Section
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: -20,
  },
  card: {
    width: width - 60,
    height: 380,
    backgroundColor: "#667eea",
    borderRadius: 30,
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
    overflow: 'hidden',
  },
  
  // Decorative circles
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -30,
    left: -30,
  },
  
  // Emoji wrapper and glow
  emojiWrapper: {
    position: 'relative',
    zIndex: 10,
  },
  emojiGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.3)',
    top: -20,
    left: -20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 5,
  },
  emojiContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  emoji: {
    fontSize: 100,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  
  // Floating particles
  particle1: {
    position: 'absolute',
    top: 80,
    left: 40,
  },
  particle2: {
    position: 'absolute',
    top: 120,
    right: 50,
  },
  particle3: {
    position: 'absolute',
    bottom: 100,
    left: 60,
  },
  particleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  // Sparkles
  sparkle1: {
    position: 'absolute',
    top: 60,
    right: 70,
    fontSize: 24,
    opacity: 0.8,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 80,
    right: 40,
    fontSize: 20,
    opacity: 0.7,
  },
  
  // Bottom Section
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  getStartedButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#00d2ff",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
});