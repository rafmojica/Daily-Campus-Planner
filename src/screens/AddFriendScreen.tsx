import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function AddFriendScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Friend</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
})
