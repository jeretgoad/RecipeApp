import { View, Text, Alert, ScrollView, Platform, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { authStyles } from '../../assets/styles/auth.styles';
import { Image } from "expo-image";
import { COLORS } from '../../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import VerifyEmail from './verify-email'; // Adjust the import path as necessary

const SignUp = () => {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) return Alert.alert("Error", "Please enter both email and password.");
    if(password.length < 6) return Alert.alert("Error", "Password must be at least 6 characters long.");
    if (!isLoaded) return;

    setLoading(true)

    try {
      await signUp.create({ emailAddress: email, password });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (error) {
      Alert.alert("Error", error.errors?.[0]?.message || "Sign up failed");
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };
    
    if(pendingVerification) return <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />;

    return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* IMAGE CONTAINER */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i2.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View> 

          <Text style={authStyles.title}>Create Account</Text>

          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput 
                style={authStyles.textInput}
                placeholder='Email'
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                keyboardType='email-address'
              />
            </View>

            {/* Password Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <TouchableOpacity style={authStyles.linkContainer} onPress={() => router.back()}>
              <Text style={authStyles.linkText}>
                Already have an account? <Text style={authStyles.link}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
};

export default SignUp;