import { View, StyleSheet, Image } from 'react-native'
import Text from './Text'
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 5,
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoContainer: {
    marginLeft: 10,
    flexShrink: 1,
  },
  language: {
    backgroundColor: theme.colors.primary,
    color: 'white',
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
});

// Función para convertir números en formato "k"
const formatNumber = (value) => {
  return value >= 1000 ? (value / 1000).toFixed(1).replace('.0', '') + 'k' : value;
};

const RepositoryItem = ({ repository }) => {
  return (
    <View style={styles.container}>
      {/* Parte superior */}
      <View style={styles.topSection}>
        <Image source={{ uri: repository.ownerAvatarUrl }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text fontWeight="bold" fontSize="subheading">
            {repository.fullName}
          </Text>
          <Text color="textSecondary">{repository.description}</Text>
          <Text style={styles.language}>{repository.language}</Text>
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text fontWeight="bold" fontSize="subheading">
            {formatNumber(repository.stargazersCount)}
          </Text>
          <Text color="textSecondary">Stars</Text>
        </View>
        <View style={styles.statItem}>
          <Text fontWeight="bold" fontSize="subheading">
            {formatNumber(repository.forksCount)}
          </Text>
          <Text color="textSecondary">Forks</Text>
        </View>
        <View style={styles.statItem}>
          <Text fontWeight="bold" fontSize="subheading">
            {repository.reviewCount}
          </Text>
          <Text color="textSecondary">Reviews</Text>
        </View>
        <View style={styles.statItem}>
          <Text fontWeight="bold" fontSize="subheading">
            {repository.ratingAverage}
          </Text>
          <Text color="textSecondary">Rating</Text>
        </View>
      </View>
    </View>
  );
};

export default RepositoryItem;
