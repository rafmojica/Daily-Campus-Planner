import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
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
    <View style={styles.container}>
      <Text style={styles.heading}>Add a Friend</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter username"
        autoCapitalize="none"
        value={username}
        onChangeText={text => {
          setUsername(text)
          setError('')
          setSuccess('')
        }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleAddFriend} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Friend</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    color: '#111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    fontSize: 14,
  },
  success: {
    color: 'green',
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#003262',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
