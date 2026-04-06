import React, { useEffect, useState } from 'react'
import { Modal, Pressable, TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './src/firebase/firebaseConfig'
import LoginScreen from './src/screens/LoginScreen'
import MyLayoutsScreen from './src/screens/MyLayoutsScreen'
import CreateLayoutScreen from './src/screens/CreateLayoutScreen'
import FriendsLayoutsScreen from './src/screens/FriendsLayoutsScreen'
import AddFriendScreen from './src/screens/AddFriendScreen'
import PickDayScreen from './src/screens/PickDayScreen'

const Tab = createBottomTabNavigator()

function ProfileButton({ username }: { username: string }) {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.avatar}>
        <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal transparent animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownName}>{username}</Text>
            <View style={styles.divider} />
            <TouchableOpacity onPress={() => { setVisible(false); signOut(auth) }}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        setUsername(snap.data()?.username ?? firebaseUser.email ?? '?')
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) return null

  if (!user) return <LoginScreen />

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerRight: () => <ProfileButton username={username} />,
        }}
      >
        <Tab.Screen name="My Layouts" component={MyLayoutsScreen} />
        <Tab.Screen name="Create Layout" component={CreateLayoutScreen} />
        <Tab.Screen name="Friends Layouts" component={FriendsLayoutsScreen} />
        <Tab.Screen name="Add Friend" component={AddFriendScreen} />
        <Tab.Screen name="Pick My Day" component={PickDayScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#003262',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 54,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    minWidth: 150,
  },
  dropdownName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  signOutText: {
    fontSize: 14,
    color: '#c0392b',
    paddingVertical: 6,
  },
})
