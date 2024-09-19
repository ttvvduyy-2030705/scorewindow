import colors from 'configuration/colors';
import {StyleSheet} from 'react-native';
import {responsiveDimension} from 'utils/helper';

const styles = StyleSheet.create({
  fullHeight: {
    height: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  configIPWrapper: {
    backgroundColor: colors.lightPrimary1,
    borderRadius: 10,
  },
  buttonTest: {
    backgroundColor: colors.yellow,
    paddingHorizontal: responsiveDimension(20),
    paddingVertical: responsiveDimension(10),
    marginRight: responsiveDimension(15),
  },
  buttonSaveConfig: {
    backgroundColor: colors.primary,
    paddingHorizontal: responsiveDimension(20),
    paddingVertical: responsiveDimension(10),
  },
  webcam: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.black,
  },
});

export default styles;
