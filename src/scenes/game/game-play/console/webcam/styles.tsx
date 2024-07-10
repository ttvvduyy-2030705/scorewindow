import {dims} from 'configuration';
import colors from 'configuration/colors';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: dims.screenHeight * 0.29,
  },
  video: {
    // height: dims.screenHeight * 0.3,
    backgroundColor: colors.black,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default styles;
