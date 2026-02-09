import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

type Rating = {
  rate: number;
  count: number;
};

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  // Filter modal state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tempCategory, setTempCategory] = useState<string>("All");
  const [tempPriceRange, setTempPriceRange] = useState<string>("All");
  const [tempRating, setTempRating] = useState<number>(0);

  // Applied filters
  const [priceRange, setPriceRange] = useState<string>("All");
  const [minRating, setMinRating] = useState<number>(0);

  // Sort state
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<string>("relevance");

  // Animation
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setFilteredProducts(data);

        const uniqueCategories = [
          "All",
          ...Array.from(new Set(data.map((item) => item.category))),
        ];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  // Animate empty state
  useEffect(() => {
    if (filteredProducts.length === 0 && !loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [filteredProducts, loading]);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Price range filter
    if (priceRange !== "All") {
      const [min, max] = priceRange.split("-").map(Number);
      if (max) {
        result = result.filter((item) => item.price >= min && item.price <= max);
      } else {
        result = result.filter((item) => item.price >= min);
      }
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter((item) => item.rating.rate >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "popularity":
        result.sort((a, b) => b.rating.count - a.rating.count);
        break;
    }

    setFilteredProducts(result);
  }, [selectedCategory, priceRange, minRating, sortBy, products]);

  const applyFilters = () => {
    setSelectedCategory(tempCategory);
    setPriceRange(tempPriceRange);
    setMinRating(tempRating);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setTempCategory("All");
    setTempPriceRange("All");
    setTempRating(0);
    setSelectedCategory("All");
    setPriceRange("All");
    setMinRating(0);
    setFilterModalVisible(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (priceRange !== "All") count++;
    if (minRating > 0) count++;
    return count;
  };

  const priceRanges = [
    { label: "All Prices", value: "All" },
    { label: "Under ₹50", value: "0-50" },
    { label: "₹50 - ₹100", value: "50-100" },
    { label: "₹100 - ₹200", value: "100-200" },
    { label: "₹200 - ₹500", value: "200-500" },
    { label: "Above ₹500", value: "500-99999" },
  ];

  const ratings = [
    { label: "All Ratings", value: 0 },
    { label: "4★ & above", value: 4 },
    { label: "3★ & above", value: 3 },
    { label: "2★ & above", value: 2 },
  ];

  const sortOptions = [
    { label: "Relevance", value: "relevance" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Customer Rating", value: "rating" },
    { label: "Popularity", value: "popularity" },
  ];

  const getPriceRangeLabel = (value: string) => {
    const range = priceRanges.find((r) => r.value === value);
    return range ? range.label : value;
  };

  const EmptyState = () => (
    <Animated.View
      style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <View style={styles.emptyCircle1} />
        <View style={styles.emptyCircle2} />
      </View>
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptySubtitle}>
        We couldnt find any products matching your filters.
      </Text>
      <Text style={styles.emptyHint}>Try adjusting your search criteria</Text>
      <TouchableOpacity style={styles.emptyButton} onPress={clearFilters}>
        <Text style={styles.emptyButtonText}>Clear All Filters</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Top Filter Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSortModalVisible(true)}
        >
          <Text style={styles.filterIcon}>⇅</Text>
          <Text style={styles.filterButtonText}>Sort</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setTempCategory(selectedCategory);
            setTempPriceRange(priceRange);
            setTempRating(minRating);
            setFilterModalVisible(true);
          }}
        >
          <Text style={styles.filterIcon}>⚙</Text>
          <Text style={styles.filterButtonText}>Filter</Text>
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {getActiveFilterCount()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.resultCount}>
          <Text style={styles.resultCountText}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
          </Text>
        </View>
      </View>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activeFiltersRow}
          contentContainerStyle={styles.activeFiltersContent}
        >
          {selectedCategory !== "All" && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText} numberOfLines={1}>
                {selectedCategory}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedCategory("All")}
                style={styles.removeFilterButton}
              >
                <Text style={styles.removeFilterText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          {priceRange !== "All" && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText} numberOfLines={1}>
                {getPriceRangeLabel(priceRange)}
              </Text>
              <TouchableOpacity
                onPress={() => setPriceRange("All")}
                style={styles.removeFilterButton}
              >
                <Text style={styles.removeFilterText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          {minRating > 0 && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText} numberOfLines={1}>
                {minRating}★ & above
              </Text>
              <TouchableOpacity
                onPress={() => setMinRating(0)}
                style={styles.removeFilterButton}
              >
                <Text style={styles.removeFilterText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={clearFilters}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* PRODUCT LIST */}
      {loading ? (
        <FlatList
          data={[0, 1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={{ padding: 10 }}
          renderItem={() => (
            <View style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonLineWide} />
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonLineShort} />
            </View>
          )}
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text numberOfLines={2} style={styles.title}>
                {item.title}
              </Text>
              <View style={styles.rowBetween}>
                <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
                <View style={styles.ratingPill}>
                  <Text style={styles.ratingText}>⭐ {item.rating.rate}</Text>
                  <Text style={styles.ratingCount}>({item.rating.count})</Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Category:</Text>
                <Text style={styles.metaValue}>{item.category}</Text>
              </View>
              <Text numberOfLines={2} style={styles.descPreview}>
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* FILTER MODAL */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Category Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>CATEGORY</Text>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.filterOption}
                    onPress={() => setTempCategory(cat)}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        tempCategory === cat && styles.radioOuterActive,
                      ]}
                    >
                      {tempCategory === cat && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.filterOptionText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Price Range Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>PRICE RANGE</Text>
                {priceRanges.map((range) => (
                  <TouchableOpacity
                    key={range.value}
                    style={styles.filterOption}
                    onPress={() => setTempPriceRange(range.value)}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        tempPriceRange === range.value &&
                          styles.radioOuterActive,
                      ]}
                    >
                      {tempPriceRange === range.value && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.filterOptionText}>{range.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Rating Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>CUSTOMER RATING</Text>
                {ratings.map((rating) => (
                  <TouchableOpacity
                    key={rating.value}
                    style={styles.filterOption}
                    onPress={() => setTempRating(rating.value)}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        tempRating === rating.value && styles.radioOuterActive,
                      ]}
                    >
                      {tempRating === rating.value && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.filterOptionText}>{rating.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>CLEAR ALL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>APPLY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SORT MODAL */}
      <Modal
        visible={sortModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sortModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.sortOption}
                onPress={() => {
                  setSortBy(option.value);
                  setSortModalVisible(false);
                }}
              >
                <View
                  style={[
                    styles.radioOuter,
                    sortBy === option.value && styles.radioOuterActive,
                  ]}
                >
                  {sortBy === option.value && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.filterOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  topBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    gap: 6,
    position: "relative",
  },
  filterIcon: {
    fontSize: 16,
    color: "#374151",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  filterBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  filterBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  resultCount: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  resultCountText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeFiltersRow: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    maxHeight: 60,
  },
  activeFiltersContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
    alignItems: "center",
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    borderRadius: 18,
    paddingLeft: 12,
    paddingRight: 18,
    paddingVertical: 2,
    gap: 8,
    maxWidth: 150,
  },
  activeFilterText: {
    fontSize: 12,
    color: "#1E40AF",
    fontWeight: "800",
    flexShrink: 1,
    lineHeight: 25,
    marginBottom:2,
  },
  removeFilterButton: {
    width: 20,
    height: 20,
    borderRadius: 8,
    backgroundColor: "#1E40AF",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  removeFilterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  clearAllText: {
    fontSize: 12,
   
    color: "#EF4444",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    height: 140,
    resizeMode: "contain",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  title: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14,
    color: "#111827",
    lineHeight: 20,
  },
  price: {
    marginTop: 6,
    fontWeight: "800",
    fontSize: 18,
    color: "#111827",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: "#C2410C",
    fontWeight: "600",
    fontSize: 12,
  },
  ratingCount: {
    color: "#9A3412",
    marginLeft: 4,
    fontSize: 11,
  },
  metaRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  metaLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    marginRight: 6,
  },
  metaValue: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "500",
    flexShrink: 1,
  },
  descPreview: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 18,
  },
  skeletonCard: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
  skeletonImage: {
    height: 140,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  skeletonLineWide: {
    height: 14,
    marginTop: 12,
    borderRadius: 7,
    backgroundColor: "#E5E7EB",
  },
  skeletonLine: {
    height: 12,
    marginTop: 8,
    width: "70%",
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  skeletonLineShort: {
    height: 12,
    marginTop: 8,
    width: "45%",
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 64,
    zIndex: 1,
  },
  emptyCircle1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#DBEAFE",
    opacity: 0.4,
  },
  emptyCircle2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#BFDBFE",
    opacity: 0.2,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 6,
  },
  emptyHint: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  sortModalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  modalClose: {
    fontSize: 24,
    color: "#6B7280",
    fontWeight: "300",
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterActive: {
    borderColor: "#2563EB",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});