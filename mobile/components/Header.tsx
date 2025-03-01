import { StyleSheet, Text, View } from 'react-native';
import Logo from '../assets/headerLogo'

export default function Header() {
  return (
    <View style={styles.container}>
      <Logo/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#245FA1',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: 90,
    padding: 15,
    position: 'absolute',
    top: 0,
    flexDirection: 'row'
  },
});