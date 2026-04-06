import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { collection, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase/firebaseConfig'

type Layout = {
  id: string
  title: string
  morningStudy: string
  lunch: string
  afternoonStudy: string
  dinner: string
  nightActivity: string
}

const FIELDS: { key: keyof Omit<Layout, 'id'>; label: string; icon: string }[] = [
  { key: 'morningStudy', label: 'Morning Study', icon: '☀️' },
  { key: 'lunch', label: 'Lunch', icon: '🍽️' },
  { key: 'afternoonStudy', label: 'Afternoon Study', icon: '📚' },
  { key: 'dinner', label: 'Dinner', icon: '🌙' },
  { key: 'nightActivity', label: 'Night Activity', icon: '✨' },
]

export default function PickDayScreen() {
  const [layout, setLayout] = useState<Layout | null>(null)
  const [loading, setLoading] = useState(true)
  const [empty, setEmpty] = useState(false)

  useEffect(() => {
    async function pickRandom() {
      const uid = auth.currentUser?.uid
      if (!uid) return

      const snap = await getDocs(collection(db, 'users', uid, 'layouts'))

      if (snap.empty) {
        setEmpty(true)
        setLoading(false)
        return
      }

      const random = snap.docs[Math.floor(Math.random() * snap.docs.length)]
      setLayout({ id: random.id, ...random.data() } as Layout)
      setLoading(false)
    }

    pickRandom()
  }, [])

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#003262" />
      </View>
    )
  }

  if (empty) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>No layouts yet. Create one first!</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Day</Text>
        <Text style={styles.headerSubtitle}>{layout?.title}</Text>
      </View>

      {FIELDS.map(({ key, label, icon }) => (
        <View key={key} style={styles.card}>
          <Text style={styles.cardLabel}>{icon}{"  "}{label}</Text>
          <Text style={styles.value}>{layout?.[key]}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f4f8',
  },
  empty: {
    color: '#888',
    fontSize: 16,
  },
  container: {
    backgroundColor: '#f2f4f8',
    padding: 16,
    gap: 16,
    paddingBottom: 48,
  },
  header: {
    backgroundColor: '#003262',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#a8c0dd',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003262',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 17,
    color: '#111',
    fontWeight: '500',
  },
})
