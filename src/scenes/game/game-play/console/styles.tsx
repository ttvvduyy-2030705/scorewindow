import colors from 'configuration/colors';
import {StyleSheet} from 'react-native';
import {responsiveDimension} from 'utils/helper';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 30,
  },
  icon: {
    width: responsiveDimension(32),
    height: responsiveDimension(32),
  },
  buttonSound: {
    padding: responsiveDimension(15),
  },
  button: {
    flex: 1,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingVertical: responsiveDimension(10),
    borderColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButton: {
    backgroundColor: colors.lightYellow,
    borderWidth: 0,
    borderRadius: 20,
  },
  stopButton: {
    backgroundColor: colors.lightRed,
    borderWidth: 0,
    borderRadius: 20,
  },
  marginTop: {
    marginTop: responsiveDimension(20),
  },
  marginVertical: {
    marginVertical: responsiveDimension(20),
  },
  buttonGiveMoreTime: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grayBlue,
    borderRadius: 20,
  },
});

export default styles;
