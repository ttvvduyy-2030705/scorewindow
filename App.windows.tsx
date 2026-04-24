import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';

const disabledModules = [
  'Android/iOS camera: react-native-vision-camera',
  'UVC Android native camera view',
  'YouTube native live Android engine',
  'BLE remote Android flow',
  'Android storage permission',
  'Mobile Google Sign-In native module',
  'Realm mobile bootstrap until Windows storage is verified',
];

const App = (): React.JSX.Element => {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Text style={styles.brand}>APLUS SCORE</Text>
        <Text style={styles.badge}>Windows Native Build</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Billiards Grade - Windows</Text>

        <Text style={styles.description}>
          Bản Windows đã được tách khỏi entry mobile để tránh crash do native
          module Android/iOS. Đây là màn hình bootstrap ổn định trước khi đưa
          dần gameplay/cấu hình vào Windows bằng các adapter riêng.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Các module đang tắt trên Windows</Text>
          {disabledModules.map(item => (
            <Text key={item} style={styles.item}>
              • {item}
            </Text>
          ))}
        </View>

        <View style={styles.row}>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Windows app ready</Text>
          </Pressable>
        </View>

        <Text style={styles.note}>
          Bước tiếp theo: đưa màn Home/Game Settings/Game Play vào Windows từng
          phần, nhưng mọi camera/live/replay/native mobile phải đi qua file
          .windows.ts/.windows.tsx.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#080808',
  },
  header: {
    height: 72,
    paddingHorizontal: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#2A1012',
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  badge: {
    color: '#FF3844',
    fontSize: 14,
    fontWeight: '800',
  },
  content: {
    padding: 32,
    gap: 22,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '900',
  },
  description: {
    color: '#D8D8D8',
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 900,
  },
  card: {
    maxWidth: 900,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#3A171A',
    backgroundColor: '#151515',
    padding: 24,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 16,
  },
  item: {
    color: '#EAEAEA',
    fontSize: 16,
    lineHeight: 26,
  },
  row: {
    flexDirection: 'row',
  },
  primaryButton: {
    minHeight: 52,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: '#B5121B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  note: {
    color: '#9A9A9A',
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 900,
  },
});

export default App;