import React, { useEffect, useState } from 'react'
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { collection, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase/firebaseConfig'
import LayoutCard from '../components/LayoutCard'
import LayoutModal from '../components/LayoutModal'

type Layout = {
  id: string
  title: string
  [key: string]: any
}

export default function MyLayoutsScreen() {
  const [layouts, setLayouts] = useState<Layout[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Layout | null>(null)

  useEffect(() => {
    async function fetchLayouts() {
      const uid = auth.currentUser?.uid
      if (!uid) return
      const snap = await getDocs(collection(db, 'users', uid, 'layouts'))
      setLayouts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Layout)))
      setLoading(false)
    }
    fetchLayouts()
  }, [])

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#003262" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {layouts.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>No layouts yet.</Text>
        </View>
      ) : (
        <FlatList
          data={layouts}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <LayoutCard title={item.title} onPress={() => setSelected(item)} />
          )}
        />
      )}

      <LayoutModal layout={selected} onClose={() => setSelected(null)} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f4f8',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  empty: {
    color: '#888',
    fontSize: 16,
  },
})
