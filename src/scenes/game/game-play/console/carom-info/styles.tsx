import colors from 'configuration/colors';
import {StyleSheet} from 'react-native';
import {responsiveDimension} from 'utils/helper';

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderRightWidth: responsiveDimension(20),
    borderColor: colors.darkPurple,
    backgroundColor: colors.darkPurple,
  },
  totalTurnWrapper: {
    backgroundColor: colors.darkPurple,
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
    height: '100%',
  },
  currentTotalPoint: {
    marginBottom: responsiveDimension(3),
  },
  totalPointWrapper: {
    backgroundColor: colors.darkPurple,
  },
  totalPointText0: {
    marginBottom: responsiveDimension(-11),
  },
  totalPointText1: {
    marginTop: responsiveDimension(4),
    marginBottom: responsiveDimension(-11),
  },
  currentPointText: {
    marginBottom: responsiveDimension(-11),
  },
});

export default styles;
