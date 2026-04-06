import React from 'react'
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

const FIELD_LABELS: Record<string, { label: string; icon: string }> = {
  morningStudy: { label: 'Morning Study', icon: '☀️' },
  lunch: { label: 'Lunch', icon: '🍽️' },
  afternoonStudy: { label: 'Afternoon Study', icon: '📚' },
  dinner: { label: 'Dinner', icon: '🌙' },
  nightActivity: { label: 'Night Activity', icon: '✨' },
}

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

  const details = Object.entries(layout).filter(
    ([key]) => key !== 'id' && key !== 'title' && key !== 'friendUsername'
  )

  return (
    <Modal animationType="slide" transparent visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>{layout.title}</Text>
              {layout.friendUsername ? (
                <Text style={styles.subtitle}>by {layout.friendUsername}</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            {details.map(([key, value]) => {
              const meta = FIELD_LABELS[key]
              return (
                <View key={key} style={styles.card}>
                  <Text style={styles.label}>
                    {meta ? `${meta.icon}  ${meta.label}` : key}
                  </Text>
                  <Text style={styles.value}>
                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                  </Text>
                </View>
              )
            })}
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
    backgroundColor: '#f2f4f8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#003262',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: '#a8c0dd',
  },
  closeButton: {
    paddingLeft: 16,
  },
  close: {
    fontSize: 18,
    color: '#a8c0dd',
  },
  body: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
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
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003262',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
})
