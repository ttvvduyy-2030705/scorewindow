import {StyleSheet} from 'react-native';
import colors from 'configuration/colors';
import {responsiveDimension, responsiveFontSize} from 'utils/helper';

const styles = StyleSheet.create({
  configIPWrapper: {
    backgroundColor: colors.lightPrimary1,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  input: {
    fontSize: responsiveFontSize(12),
    marginHorizontal: responsiveDimension(8),
  },
  buttonSaveConfig: {
    backgroundColor: colors.primary,
    paddingHorizontal: responsiveDimension(20),
    paddingVertical: responsiveDimension(10),
  },
});

export default styles;
