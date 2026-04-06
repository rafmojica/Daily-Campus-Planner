import React from 'react'
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

type Layout = {
  id: string
  title: string
  [key: string]: any
}

type Props = {
  layout: Layout | null
  onClose: () => void
}

export default function LayoutModal({ layout, onClose }: Props) {
  if (!layout) return null

  const details = Object.entries(layout).filter(([key]) => key !== 'id')

  return (
    <Modal animationType="slide" transparent visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{layout.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            {details.map(([key, value]) => (
              <View key={key} style={styles.row}>
                <Text style={styles.label}>{key}</Text>
                <Text style={styles.value}>
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    flex: 1,
  },
  close: {
    fontSize: 18,
    color: '#888',
    paddingLeft: 16,
  },
  body: {
    padding: 20,
    gap: 16,
  },
  row: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 15,
    color: '#111',
  },
})
