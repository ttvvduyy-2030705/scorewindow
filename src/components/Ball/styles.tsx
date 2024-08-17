import colors from 'configuration/colors';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    elevation: 5,
  },
  smallContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    elevation: 5,
  },
  ball: {
    backgroundColor: colors.white,
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  smallBall: {
    backgroundColor: colors.white,
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  cutWrapper: {
    backgroundColor: colors.white,
    height: 12,
    width: '100%',
  },
  smallCutWrapper: {
    backgroundColor: colors.white,
    height: 6,
    width: '100%',
  },
});

export default styles;
