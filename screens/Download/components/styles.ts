import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    marginVertical: 6,
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
    margin: 8,
  },
  textContainer: {
    flex: 1,
    marginTop: 8,
    marginRight: 20,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  labelContainer: {
    marginTop: 16,
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    width: 100,
  },
  labelText: {
    color: 'white',
  },
  progressBar: {
    marginTop: 20,
  },
});

export default styles;
