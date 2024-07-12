import {dims} from 'configuration';
import colors from 'configuration/colors';
import {StyleSheet} from 'react-native';

const COUNTDOWN_WIDTH = dims.screenWidth * 0.93;

const styles = StyleSheet.create({
  countdownWrapper: {
    width: COUNTDOWN_WIDTH,
    height: '30%',
    overflow: 'hidden',
  },
  countdownLinear: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  countdown: {
    backgroundColor: colors.lightGray3,
    position: 'absolute',
    top: 0,
    height: '100%',
    width: COUNTDOWN_WIDTH,
  },
});

export {COUNTDOWN_WIDTH};
export default styles;
