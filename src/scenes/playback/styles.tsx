import colors from 'configuration/colors';
import {StyleSheet} from 'react-native';
import {responsiveDimension} from 'utils/helper';

const styles = StyleSheet.create({
  buttonBack: {
    paddingHorizontal: responsiveDimension(45),
    paddingVertical: responsiveDimension(15),
    marginTop: responsiveDimension(15),
    borderRadius: 10,
    backgroundColor: colors.yellow,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: responsiveDimension(45),
    paddingVertical: responsiveDimension(15),
    marginBottom: responsiveDimension(15),
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: colors.statusBar,
  },
  webcamContainer: {
    backgroundColor: colors.black,
  },
  webcam: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
  },
  fullWidth: {
    width: '100%',
  },
  iconBack: {
    width: responsiveDimension(16),
    height: responsiveDimension(16),
    marginRight: responsiveDimension(5),
  },
});

export default styles;
