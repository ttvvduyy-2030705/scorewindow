import React from 'react';
import {View, Text} from 'react-native';

const RealApp = require('./App').default;

export default function App() {
  return (
    <View style={{flex: 1, backgroundColor: '#111'}}>
      <RealApp />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          zIndex: 999999,
          backgroundColor: 'rgba(180,0,0,0.92)',
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 8,
        }}>
        <Text style={{color: '#fff', fontSize: 16, fontWeight: '700'}}>
          WINDOWS WRAPPER ACTIVE
        </Text>
        <Text style={{color: '#fff', fontSize: 13, marginTop: 4}}>
          App.windows.tsx đang chạy, màn trắng là từ App.tsx bên trong
        </Text>
      </View>
    </View>
  );
}