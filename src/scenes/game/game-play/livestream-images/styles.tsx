import {StyleSheet} from 'react-native';
import colors from 'configuration/colors';
import {responsiveDimension} from 'utils/helper';

const styles = StyleSheet.create({
  matchInfo: {
    position: 'absolute',
    bottom: responsiveDimension(-512),
    width: '150%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
    overflow: 'hidden',
  },
  matchBackground: {
    backgroundColor: colors.error,
    height: 50,
    borderRadius: 8,
  },
  matchRace: {
    height: '100%',
  },
  matchPointText: {
    marginTop: -7,
  },
  image: {
    width: responsiveDimension(256),
    height: responsiveDimension(128),
    marginRight: responsiveDimension(10),
  },
  absolute: {
    position: 'absolute',
    bottom: responsiveDimension(-512),
  },
  emptyView: {
    width: responsiveDimension(256),
    height: responsiveDimension(128),
  },
  imageTurnLeft: {
    width: responsiveDimension(24),
    height: responsiveDimension(24),
    tintColor: colors.white,
  },
  imageTurnRight: {
    width: responsiveDimension(24),
    height: responsiveDimension(24),
    transform: [{rotate: '180deg'}],
    tintColor: colors.white,
  },
  empty: {
    width: responsiveDimension(24),
    height: responsiveDimension(24),
  },
  whiteBlock: {
    height: 50,
    width: 26,
    backgroundColor: colors.white,
    marginRight: -10,
  },
  blackBlock: {
    height: 50,
    width: 16,
    backgroundColor: colors.overlay,
  },
});

export default styles;
