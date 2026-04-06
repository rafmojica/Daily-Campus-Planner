import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'
import { auth, db } from '../firebase/firebaseConfig'

export default function AddFriendScreen() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleAddFriend() {
    setError('')
    setSuccess('')

    const trimmed = username.trim()
    if (!trimmed) {
      setError('Please enter a username.')
      return
    }

    const currentUid = auth.currentUser?.uid
    if (!currentUid) return

    setLoading(true)
    try {
      const q = query(collection(db, 'users'), where('username', '==', trimmed))
      const snap = await getDocs(q)

      if (snap.empty) {
        setError('No user found with that username.')
        return
      }

      const friendDoc = snap.docs[0]
      const friendUid = friendDoc.id

      if (friendUid === currentUid) {
        setError("You can't add yourself.")
        return
      }

      await Promise.all([
        updateDoc(doc(db, 'users', currentUid), { friends: arrayUnion(friendUid) }),
        updateDoc(doc(db, 'users', friendUid), { friends: arrayUnion(currentUid) }),
      ])

      setSuccess(`${trimmed} added as a friend!`)
      setUsername('')
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add a Friend</Text>
        <Text style={styles.headerSubtitle}>Connect with your campus crew</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>👤  Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          value={username}
          onChangeText={text => {
            setUsername(text)
            setError('')
            setSuccess('')
          }}
        />
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}

      {success ? (
        <View style={styles.successBox}>
          <Text style={styles.success}>{success}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleAddFriend} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Friend</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f4f8',
    padding: 16,
    gap: 16,
    flexGrow: 1,
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
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#003262',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#dde3ef',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#f8f9fc',
  },
  errorBox: {
    backgroundColor: '#fff0f0',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fcc',
  },
  error: {
    color: '#c0392b',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  successBox: {
    backgroundColor: '#f0fff4',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#b2dfdb',
  },
  success: {
    color: '#1a7f4b',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#003262',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#003262',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
})
