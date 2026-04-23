import React from 'react';
import {ScrollView, Text, View} from 'react-native';

type BoundaryState = {
  errorText: string | null;
};

class ErrorBoundary extends React.Component<
  {children: React.ReactNode},
  BoundaryState
> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = {errorText: null};
  }

  componentDidCatch(error: unknown) {
    const text =
      error instanceof Error
        ? `${error.name}: ${error.message}\n\n${error.stack ?? ''}`
        : String(error);

    console.error('WINDOWS_RENDER_ERROR', error);
    this.setState({errorText: text});
  }

  render() {
    if (this.state.errorText) {
      return (
        <ScrollView
          style={{flex: 1, backgroundColor: '#111'}}
          contentContainerStyle={{padding: 24}}>
          <Text style={{color: '#fff', fontSize: 28, fontWeight: '700'}}>
            WINDOWS RENDER ERROR
          </Text>
          <Text
            selectable
            style={{color: '#ff6b6b', fontSize: 14, marginTop: 16}}>
            {this.state.errorText}
          </Text>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  try {
    const RealApp = require('./App').default;

    return (
      <ErrorBoundary>
        <RealApp />
      </ErrorBoundary>
    );
  } catch (error) {
    const text =
      error instanceof Error
        ? `${error.name}: ${error.message}\n\n${error.stack ?? ''}`
        : String(error);

    console.error('WINDOWS_LOAD_ERROR', error);

    return (
      <ScrollView
        style={{flex: 1, backgroundColor: '#111'}}
        contentContainerStyle={{padding: 24}}>
        <Text style={{color: '#fff', fontSize: 28, fontWeight: '700'}}>
          WINDOWS LOAD ERROR
        </Text>
        <Text selectable style={{color: '#00ff88', fontSize: 16, marginTop: 8}}>
          App.windows.tsx loaded successfully
        </Text>
        <Text
          selectable
          style={{color: '#ff6b6b', fontSize: 14, marginTop: 16}}>
          {text}
        </Text>
      </ScrollView>
    );
  }
}