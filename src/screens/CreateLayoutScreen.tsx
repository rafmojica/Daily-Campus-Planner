import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

const OPTIONS: Record<string, string[]> = {
  morningStudy: [
    "Stacks/Doe",
    "Grimes/Kresge",
    "VLSB",
    "Haas",
    "East Asian Library",
    "Home",
    "Café",
    "Outside",
  ],
  lunch: [
    "Café 3",
    "Crossroads",
    "Foothill",
    "Clark Kerr",
    "Browns",
    "MLK",
    "Mezzo",
    "Chipotle",
    "Cheese & Stuff",
    "Everytable",
    "Off Campus",
    "Home",
    "Skip",
  ],
  afternoonStudy: [
    "Stacks/Doe",
    "Grimes/Kresge",
    "VLSB",
    "Haas",
    "East Asian Library",
    "Home",
    "Café",
    "Outside",
  ],
  dinner: [
    "Café 3",
    "Crossroads",
    "Foothill",
    "Clark Kerr",
    "Mezzo",
    "Chipotle",
    "Off Campus",
    "Home",
    "Skip",
  ],
  nightActivity: ["Study", "Relax", "Exercise", "Social", "Sleep Early"],
};

const LABELS: Record<string, string> = {
  morningStudy: "Morning Study",
  lunch: "Lunch",
  afternoonStudy: "Afternoon Study",
  dinner: "Dinner",
  nightActivity: "Night Activity",
};

const SECTION_ICONS: Record<string, string> = {
  morningStudy: "☀️",
  lunch: "🍽️",
  afternoonStudy: "📚",
  dinner: "🌙",
  nightActivity: "✨",
};

type Selections = Record<string, string>;

function OptionSelector({
  field,
  selected,
  onSelect,
}: {
  field: string;
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>
        {SECTION_ICONS[field]}{"  "}{LABELS[field]}
      </Text>
      <View style={styles.options}>
        {OPTIONS[field].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.chip, selected === option && styles.chipSelected]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.chipText,
                selected === option && styles.chipTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function CreateLayoutScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [selections, setSelections] = useState<Selections>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function select(field: string, value: string) {
    setSelections((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setError("");
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    const missing = Object.keys(OPTIONS).find((f) => !selections[f]);
    if (missing) {
      setError(`Please select a ${LABELS[missing].toLowerCase()}.`);
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    setSaving(true);
    try {
      await addDoc(collection(db, "users", uid, "layouts"), {
        title: title.trim(),
        morningStudy: selections.morningStudy,
        lunch: selections.lunch,
        afternoonStudy: selections.afternoonStudy,
        dinner: selections.dinner,
        nightActivity: selections.nightActivity,
      });
      navigation.navigate("My Layouts" as never);
    } catch (e: any) {
      setError(e.message ?? "Failed to save layout.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Layout</Text>
        <Text style={styles.headerSubtitle}>Design your ideal campus day</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>📝  Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Productive Tuesday"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {Object.keys(OPTIONS).map((field) => (
        <OptionSelector
          key={field}
          field={field}
          selected={selections[field] ?? ""}
          onSelect={(value) => select(field, value)}
        />
      ))}

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Layout</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    paddingBottom: 56,
    backgroundColor: "#f2f4f8",
  },
  header: {
    backgroundColor: "#003262",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#a8c0dd",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#003262",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#dde3ef",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#f8f9fc",
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#dde3ef",
    backgroundColor: "#f2f4f8",
  },
  chipSelected: {
    backgroundColor: "#003262",
    borderColor: "#003262",
  },
  chipText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  errorBox: {
    backgroundColor: "#fff0f0",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#fcc",
  },
  error: {
    color: "#c0392b",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#003262",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#003262",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
