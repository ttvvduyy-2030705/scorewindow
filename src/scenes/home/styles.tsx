import colors from 'configuration/colors';
import globalStyles from 'configuration/styles';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: StyleSheet.flatten([
    globalStyles.flex.flex1,
    globalStyles.padding.padding20,
    globalStyles.justify.justify_between,
  ]),
  button: StyleSheet.flatten([
    globalStyles.flex.flex1,
    // globalStyles.padding.paddingVertical30,
    globalStyles.padding.paddingLeft30,
    // globalStyles.align.alignItems_center,
    globalStyles.justify.justify_center,
    globalStyles.margin.marginVertical20,
    {borderRadius: 20, backgroundColor: colors.primary, width: '30%'},
  ]),
  image: StyleSheet.flatten([
    globalStyles.margin.marginRight20,
    {
      width: 40,
      height: 40,
    },
  ]),
  buttonHistory: StyleSheet.flatten([
    globalStyles.padding.paddingHorizontal20,
    globalStyles.padding.paddingVertical15,
    {
      borderRadius: 20,
      backgroundColor: colors.lightPrimary1,
    },
  ]),
});

export default styles;
