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

const FIELDS: { key: keyof Omit<Layout, 'id'>; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'morningStudy', label: 'Morning Study' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'afternoonStudy', label: 'Afternoon Study' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'nightActivity', label: 'Night Activity' },
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Your Day</Text>
      {FIELDS.map(({ key, label }) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
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
  },
  empty: {
    color: '#888',
    fontSize: 16,
  },
  container: {
    padding: 24,
    gap: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: '#111',
  },
})
