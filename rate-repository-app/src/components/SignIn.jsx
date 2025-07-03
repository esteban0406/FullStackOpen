import { View, TextInput, Button, StyleSheet, Text } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import useSignIn from '../hooks/useSignIn'
import AuthStorage from '../utils/authStorage'

const SignInForm = () => {
  const [signIn, { loading, error }] = useSignIn();

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#fff',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 12,
      borderRadius: 4,
      marginBottom: 10,
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
  })

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Requerido'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
  })

  const handleLogin = async (values) => {
    try {
      const response = await signIn(values);
      if (response.data.authenticate.accessToken) {
        const authStorage = new AuthStorage();
        await authStorage.setAccessToken(response.data.authenticate.accessToken);
        console.log('Login successful');
      } 
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={handleLogin}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="username"
            keyboardType="default"
            autoCapitalize="none"
            onChangeText={handleChange('username')}
            onBlur={handleBlur('username')}
            value={values.username}
          />
          {touched.username && errors.username && (
            <Text style={styles.error}>{errors.username}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
          />
          {touched.password && errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}

          <Button title="Iniciar sesión" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  )
}

export default SignInForm
