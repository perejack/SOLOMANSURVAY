import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  TextInput,
  Clipboard,
  Alert
} from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { X, Shield, Check, AlertCircle, Copy, CheckCircle } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withSequence,
  Easing
} from 'react-native-reanimated';

// Get screen dimensions for responsive sizing
const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 360;

// Helper function for responsive font sizes
const getFontSize = (baseSize: number): number => {
  return isSmallScreen ? baseSize - 2 : baseSize;
};

// Helper function for responsive spacing
const getSpacing = (baseSpacing: number): number => {
  return isSmallScreen ? baseSpacing * 0.8 : baseSpacing;
};

interface AccountActivationModalProps {
  visible: boolean;
  onClose: () => void;
  onActivate: () => void;
  currentBalance: number;
}

export default function AccountActivationModal({ visible, onClose, onActivate, currentBalance }: AccountActivationModalProps) {
  const [paymentStep, setPaymentStep] = useState<'activation' | 'mpesa-payment' | 'transaction-code' | 'success'>('activation');
  const [transactionCode, setTransactionCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);

  // Validate transaction code
  useEffect(() => {
    setIsCodeValid(transactionCode.length >= 10);
  }, [transactionCode]);

  // Copy till number to clipboard
  const copyTillNumber = async () => {
    await Clipboard.setString('5619610');
    Alert.alert('Copied!', 'Till number copied to clipboard');
  };

  // Reset modal state when closing
  const handleClose = () => {
    setPaymentStep('activation');
    setTransactionCode('');
    setIsCodeValid(false);
    onClose();
  };

  // Handle successful activation
  const handleActivationSuccess = () => {
    setPaymentStep('success');
    setTimeout(() => {
      onActivate();
      handleClose();
    }, 2000);
  };
  
  // Animation values
  const modalScale = useSharedValue(0.9);
  const modalOpacity = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const benefitScale = useSharedValue(0.8);
  const benefitOpacity = useSharedValue(0);
  
  // Animated styles
  const modalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));
  
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${iconRotation.value}deg` }],
  }));
  
  // Animation for benefits
  const getBenefitAnimatedStyle = (index: number) => useAnimatedStyle(() => ({
    opacity: benefitOpacity.value,
    transform: [{ scale: benefitScale.value }],
  }));
  
  // Animation when modal becomes visible
  useEffect(() => {
    if (visible) {
      modalOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSpring(1, { damping: 15 });
      
      // Rotate shield icon
      iconRotation.value = withSequence(
        withTiming(360, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(0, { duration: 0 })
      );
      
      // Animate benefits one by one
      benefitOpacity.value = withTiming(1, { duration: 600 });
      benefitScale.value = withTiming(1, { duration: 600 });
    } else {
      modalOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withTiming(0.9, { duration: 200 });
      benefitOpacity.value = withTiming(0, { duration: 200 });
      benefitScale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible]);

  const renderContent = () => {
    switch (paymentStep) {
      case 'activation':
        return (
          <>
            <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
              <Shield size={60} color="#6397F7" />
            </Animated.View>
            
            <Text style={styles.title}>Activate Your Account</Text>
            
            <View style={styles.alertContainer}>
              <AlertCircle size={20} color={Colors.light.error} style={styles.alertIcon} />
              <Text style={styles.alertText}>Your account is inactive. Activate now to complete your withdrawal to M-Pesa.</Text>
            </View>
            
            <Animated.View style={[styles.benefitsContainer, getBenefitAnimatedStyle(0)]}>
              <Text style={styles.benefitsTitle}>Benefits of Activation:</Text>
              <View style={styles.benefitItem}>
                <Check size={20} color={Colors.light.success} />
                <Text style={styles.benefitText}>Access to premium surveys (250+ KSH)</Text>
              </View>
              <View style={styles.benefitItem}>
                <Check size={20} color={Colors.light.success} />
                <Text style={styles.benefitText}>Increased withdrawal limits</Text>
              </View>
              <View style={styles.benefitItem}>
                <Check size={20} color={Colors.light.success} />
                <Text style={styles.benefitText}>Improved account security</Text>
              </View>
            </Animated.View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.activateButton}
                onPress={() => setPaymentStep('mpesa-payment')}
              >
                <Text style={styles.activateButtonText}>Activate Account</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Not Now</Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 'mpesa-payment':
        return (
          <>
            <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
              <Shield size={60} color="#00C851" />
            </Animated.View>
            
            <Text style={styles.title}>Lipa Na M-Pesa Buy Goods</Text>
            
            <View style={styles.mpesaContainer}>
              <Text style={styles.mpesaInstructions}>
                Use M-Pesa Buy Goods to complete your account activation
              </Text>
              
              <View style={styles.tillContainer}>
                <Text style={styles.tillLabel}>Till Number:</Text>
                <View style={styles.tillNumberContainer}>
                  <Text style={styles.tillNumber}>5619610</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={copyTillNumber}>
                    <Copy size={20} color="#6397F7" />
                    <Text style={styles.copyText}>Tap to Copy</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Amount to Pay:</Text>
                <Text style={styles.amountText}>KSH 200</Text>
              </View>
              
              <Text style={styles.businessName}>TASKBAY TECH</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.activateButton}
                onPress={() => setPaymentStep('transaction-code')}
              >
                <Text style={styles.activateButtonText}>Proceed</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setPaymentStep('activation')}
              >
                <Text style={styles.cancelButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 'transaction-code':
        return (
          <>
            <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
              <Shield size={60} color="#FF9800" />
            </Animated.View>
            
            <Text style={styles.title}>Enter Transaction Code</Text>
            
            <View style={styles.codeContainer}>
              <Text style={styles.codeInstructions}>
                Please paste your M-Pesa transaction code below
              </Text>
              
              <TextInput
                style={styles.codeInput}
                value={transactionCode}
                onChangeText={setTransactionCode}
                placeholder="e.g. YOJGHBCCFFGH"
                placeholderTextColor={Colors.light.subtext}
                autoCapitalize="characters"
                maxLength={20}
              />
              
              {transactionCode.length > 0 && transactionCode.length < 10 && (
                <Text style={styles.errorText}>
                  Transaction code must be at least 10 characters
                </Text>
              )}
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.activateButton, !isCodeValid && styles.disabledButton]}
                onPress={handleActivationSuccess}
                disabled={!isCodeValid}
              >
                <Text style={[styles.activateButtonText, !isCodeValid && styles.disabledButtonText]}>
                  Finish
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setPaymentStep('mpesa-payment')}
              >
                <Text style={styles.cancelButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 'success':
        return (
          <>
            <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
              <CheckCircle size={60} color="#00C851" />
            </Animated.View>
            
            <Text style={styles.title}>Account Activated!</Text>
            
            <View style={styles.successContainer}>
              <Text style={styles.successText}>
                Your account has been successfully activated. You can now enjoy all premium features!
              </Text>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
              
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {renderContent()}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSpacing(Layout.insets.horizontal),
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.light.background,
    borderRadius: Layout.borderRadius.large,
    padding: getSpacing(Layout.spacing.l),
    alignItems: 'center',
    // Add shadow for better visibility
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: getSpacing(Layout.spacing.m),
    right: getSpacing(Layout.spacing.m),
    zIndex: 100,
    padding: getSpacing(Layout.spacing.xs),
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: getSpacing(Layout.spacing.xl),
    paddingBottom: getSpacing(Layout.spacing.xl),
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getSpacing(Layout.spacing.m),
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: getFontSize(24),
    color: Colors.light.text,
    marginBottom: getSpacing(Layout.spacing.m),
    textAlign: 'center',
  },
  alertContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: Layout.borderRadius.small,
    padding: getSpacing(Layout.spacing.m),
    marginBottom: getSpacing(Layout.spacing.m),
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.error,
    width: '100%',
  },
  alertIcon: {
    marginRight: getSpacing(Layout.spacing.s),
  },
  alertText: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontSize(14),
    color: Colors.light.text,
    flex: 1,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: getSpacing(Layout.spacing.l),
  },
  benefitsTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontSize(16),
    color: Colors.light.text,
    marginBottom: getSpacing(Layout.spacing.s),
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing(Layout.spacing.s),
  },
  benefitText: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontSize(14),
    color: Colors.light.subtext,
    marginLeft: getSpacing(Layout.spacing.s),
  },
  buttonContainer: {
    width: '100%',
  },
  activateButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: Layout.borderRadius.medium,
    padding: getSpacing(Layout.spacing.m),
    alignItems: 'center',
    marginBottom: getSpacing(Layout.spacing.m),
    // Add shadow for better visibility
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activateButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: getFontSize(16),
    color: '#FFF',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: Layout.borderRadius.medium,
    padding: getSpacing(Layout.spacing.s),
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontSize(16),
    color: Colors.light.subtext,
  },
  // M-Pesa payment styles
  mpesaContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 200, 81, 0.05)',
    borderRadius: Layout.borderRadius.medium,
    padding: getSpacing(Layout.spacing.m),
    marginBottom: getSpacing(Layout.spacing.l),
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 81, 0.2)',
  },
  mpesaInstructions: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontSize(14),
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: getSpacing(Layout.spacing.m),
  },
  tillContainer: {
    alignItems: 'center',
    marginBottom: getSpacing(Layout.spacing.m),
  },
  tillLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontSize(14),
    color: Colors.light.subtext,
    marginBottom: getSpacing(Layout.spacing.xs),
  },
  tillNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: Layout.borderRadius.small,
    padding: getSpacing(Layout.spacing.m),
    borderWidth: 2,
    borderColor: '#00C851',
    marginBottom: getSpacing(Layout.spacing.s),
  },
  tillNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: getFontSize(24),
    color: '#00C851',
    letterSpacing: 2,
    marginRight: getSpacing(Layout.spacing.m),
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 151, 247, 0.1)',
    borderRadius: Layout.borderRadius.small,
    padding: getSpacing(Layout.spacing.s),
  },
  copyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontSize(12),
    color: '#6397F7',
    marginLeft: getSpacing(Layout.spacing.xs),
  },
  businessName: {
    fontFamily: 'Poppins-Bold',
    fontSize: getFontSize(16),
    color: '#00C851',
    textAlign: 'center',
  },
  // Amount styles
  amountContainer: {
    alignItems: 'center',
    marginBottom: getSpacing(Layout.spacing.m),
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: Layout.borderRadius.small,
    padding: getSpacing(Layout.spacing.m),
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  amountLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontSize(14),
    color: Colors.light.subtext,
    marginBottom: getSpacing(Layout.spacing.xs),
  },
  amountText: {
    fontFamily: 'Poppins-Bold',
    fontSize: getFontSize(20),
    color: '#FF9800',
    letterSpacing: 1,
  },
  // Transaction code styles
  codeContainer: {
    width: '100%',
    marginBottom: getSpacing(Layout.spacing.l),
  },
  codeInstructions: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontSize(14),
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: getSpacing(Layout.spacing.m),
  },
  codeInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: Layout.borderRadius.medium,
    padding: getSpacing(Layout.spacing.m),
    fontFamily: 'Poppins-Medium',
    fontSize: getFontSize(16),
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
    textAlign: 'center',
    letterSpacing: 1,
  },
  errorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontSize(12),
    color: Colors.light.error,
    textAlign: 'center',
    marginTop: getSpacing(Layout.spacing.xs),
  },
  disabledButton: {
    backgroundColor: Colors.light.border,
  },
  disabledButtonText: {
    color: Colors.light.subtext,
  },
  // Success styles
  successContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 200, 81, 0.1)',
    borderRadius: Layout.borderRadius.medium,
    padding: getSpacing(Layout.spacing.m),
    marginBottom: getSpacing(Layout.spacing.l),
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 81, 0.3)',
  },
  successText: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontSize(14),
    color: Colors.light.text,
    textAlign: 'center',
    lineHeight: 22,
  },
});
