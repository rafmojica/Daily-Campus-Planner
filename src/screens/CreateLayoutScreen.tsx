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
  morningStudy: "Morning Study Location",
  lunch: "Lunch Location",
  afternoonStudy: "Afternoon Study Location",
  dinner: "Dinner Location",
  nightActivity: "Night Activity",
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
    <View style={styles.field}>
      <Text style={styles.label}>{LABELS[field]}</Text>
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Productive Tuesday"
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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.button}
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
    padding: 20,
    gap: 24,
    paddingBottom: 48,
  },
  field: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
  },
  chipSelected: {
    backgroundColor: "#003262",
    borderColor: "#003262",
  },
  chipText: {
    fontSize: 14,
    color: "#444",
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  error: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#003262",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
