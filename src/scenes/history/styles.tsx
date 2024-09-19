import colors from 'configuration/colors';
import {StyleSheet} from 'react-native';
import {responsiveDimension} from 'utils/helper';

const styles = StyleSheet.create({
  item: {
    borderRadius: 10,
  },
  player: {
    borderRadius: 10,
  },
  buttonRewWatch: {
    backgroundColor: colors.lightPrimary1,
    paddingHorizontal: responsiveDimension(30),
    paddingVertical: responsiveDimension(10),
    borderRadius: 10,
  },
});

export default styles;
