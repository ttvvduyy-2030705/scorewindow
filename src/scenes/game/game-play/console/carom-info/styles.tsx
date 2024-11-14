import colors from 'configuration/colors';
import {StyleSheet} from 'react-native';
import {responsiveDimension} from 'utils/helper';

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    // aspectRatio: 1.542,
    // alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    marginTop: responsiveDimension(40),
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
    overflow: 'hidden',
    marginHorizontal: responsiveDimension(15),
  },
  linear: {
    position: 'absolute',
    backgroundColor: colors.white,
    height: 40,
    width: '100%',
  },
  countdownWrapper: {
    backgroundColor: colors.error,
    height: '100%',
  },
  currentTotalPoint: {
    marginBottom: responsiveDimension(3),
  },
});

export default styles;
