import React, { useEffect, useState } from 'react'
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase/firebaseConfig'
import LayoutModal from '../components/LayoutModal'

type FriendLayout = {
  id: string
  title: string
  friendUsername: string
  [key: string]: any
}

export default function FriendsLayoutsScreen() {
  const [layouts, setLayouts] = useState<FriendLayout[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<FriendLayout | null>(null)

  useEffect(() => {
    async function fetchFriendLayouts() {
      const uid = auth.currentUser?.uid
      if (!uid) return

      const currentUserSnap = await getDoc(doc(db, 'users', uid))
      const friendIds: string[] = currentUserSnap.data()?.friends ?? []

      const results: FriendLayout[] = []

      await Promise.all(
        friendIds.map(async (friendId) => {
          const friendSnap = await getDoc(doc(db, 'users', friendId))
          const friendUsername: string = friendSnap.data()?.username ?? 'Unknown'

          const layoutsSnap = await getDocs(collection(db, 'users', friendId, 'layouts'))
          layoutsSnap.docs.forEach(d => {
            results.push({ id: d.id, friendUsername, ...d.data() } as FriendLayout)
          })
        })
      )

      setLayouts(results)
      setLoading(false)
    }

    fetchFriendLayouts()
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
          <Text style={styles.empty}>No friend layouts yet.</Text>
        </View>
      ) : (
        <FlatList
          data={layouts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} onPress={() => setSelected(item)}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.friend}>— {item.friendUsername}</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    color: '#888',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 6,
  },
  title: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  friend: {
    fontSize: 16,
    color: '#888',
  },
})
