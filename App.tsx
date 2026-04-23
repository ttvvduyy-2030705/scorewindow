import React from 'react';
import {View, Text} from 'react-native';

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: '#fff', fontSize: 32, fontWeight: '700'}}>
        APP TSX OK
      </Text>
      <Text style={{color: '#00ff88', fontSize: 18, marginTop: 12}}>
        lỗi nằm trong app tree cũ
      </Text>
    </View>
  );
}