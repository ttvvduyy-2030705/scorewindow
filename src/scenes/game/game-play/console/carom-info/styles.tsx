import colors from 'configuration/colors';
import {StyleSheet} from 'react-native';
import {responsiveDimension} from 'utils/helper';

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    // aspectRatio: 1.542,
    // alignSelf: 'center',
  },
  totalPointWrapper: {
    backgroundColor: colors.lightBlack,
  },
  turnImage: {
    width: responsiveDimension(24),
    height: responsiveDimension(24),
    tintColor: colors.red,
    marginHorizontal: responsiveDimension(10),
  },
  empty: {
    width: responsiveDimension(24),
    height: responsiveDimension(24),
    marginHorizontal: responsiveDimension(10),
  },
  countdownContainer: {},
  linearWrapper: {
    flex: 1,
    height: 40,
    borderRadius: 16,
    overflow: 'hidden',
  },
  linear: {
    position: 'absolute',
    backgroundColor: colors.white,
    height: 40,
    width: '100%',
  },
});

export default styles;
