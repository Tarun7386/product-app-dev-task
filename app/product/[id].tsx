
import { useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push("⭐");
      } else if (i === fullStars && hasHalfStar) {
        stars.push("⭐");
      } else {
        stars.push("☆");
      }
    }
    return stars.join(" ");
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Product Details" }} />
        <ScrollView contentContainerStyle={styles.container}>
          <SkeletonLoader />
        </ScrollView>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Stack.Screen options={{ title: "Error" }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {error || "Product not found"}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProduct}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: product.category.charAt(0).toUpperCase() + product.category.slice(1),
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#111827",
        }} 
      />
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Product Image Card */}
          <View style={styles.imageCard}>
            <Image 
              source={{ uri: product.image }} 
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {product.category.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Product Title */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Price & Rating Section */}
          <View style={styles.priceRatingContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Rating</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingStars}>
                  {renderStars(product.rating.rate)}
                </Text>
                <Text style={styles.ratingText}>
                  {product.rating.rate.toFixed(1)}
                </Text>
              </View>
              <Text style={styles.ratingCount}>
                {product.rating.count.toLocaleString()} reviews
              </Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Product Details Section */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Product ID</Text>
              <Text style={styles.detailValue}>#{product.id}</Text>
            </View>
            
            <View style={styles.detailDivider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Text>
            </View>
            
            <View style={styles.detailDivider} />
            
            
          </View>

          {/* Action Buttons */}
          
        </Animated.View>
      </ScrollView>
    </>
  );
}

// Skeleton Loader Component
function SkeletonLoader() {
  const [pulseAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <>
      <Animated.View style={[styles.skeletonImage, { opacity: pulseAnim }]} />
      <Animated.View style={[styles.skeletonLineWide, { opacity: pulseAnim }]} />
      <Animated.View style={[styles.skeletonPriceRating, { opacity: pulseAnim }]} />
      <Animated.View style={[styles.skeletonSection, { opacity: pulseAnim }]} />
      <Animated.View style={[styles.skeletonSection, { opacity: pulseAnim }]} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#F9FAFB",
  },
  imageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },
  image: {
    height: 300,
    width: "100%",
  },
  categoryBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 32,
    marginBottom: 16,
  },
  priceRatingContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
    color: "#10B981",
  },
  divider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  ratingContainer: {
    flex: 1,
  },
  ratingLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingStars: {
    fontSize: 14,
    marginRight: 6,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  ratingCount: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
    fontWeight: "400",
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  detailDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
  },
  actionContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  secondaryButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#F9FAFB",
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  skeletonImage: {
    height: 300,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginBottom: 20,
  },
  skeletonLineWide: {
    height: 32,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  skeletonPriceRating: {
    height: 100,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginBottom: 20,
  },
  skeletonSection: {
    height: 120,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
});