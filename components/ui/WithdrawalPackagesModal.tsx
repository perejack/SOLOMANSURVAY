import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Platform,
  TextInput,
  Clipboard,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { X, Check, Star, ArrowRight, Shield, Clock, Zap, Crown, Copy, CheckCircle } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
  interpolateColor
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Get screen dimensions for responsive sizing
const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 360;
const isNarrowScreen = width < 400;

// Helper functions for responsive design
const getFontSize = (baseSize: number): number => {
  if (isSmallScreen) return baseSize - 2;
  if (isNarrowScreen) return baseSize - 1;
  return baseSize;
};

const getSpacing = (baseSpacing: number): number => {
  if (isSmallScreen) return baseSpacing * 0.7;
  if (isNarrowScreen) return baseSpacing * 0.85;
  return baseSpacing;
};

interface WithdrawalPackagesModalProps {
  visible: boolean;
  onClose: () => void;
  onContinueBasic: () => void;
  onUpgradePremium: () => void;
  onUpgradeElite: () => void;
}

export default function WithdrawalPackagesModal({
  visible,
  onClose,
  onContinueBasic,
  onUpgradePremium,
  onUpgradeElite,
}: WithdrawalPackagesModalProps) {
  const router = useRouter();
  const [paymentStep, setPaymentStep] = useState<'packages' | 'mpesa-payment' | 'transaction-code' | 'success'>('packages');
  const [selectedPackage, setSelectedPackage] = useState<'premium' | 'elite' | null>(null);
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
    setPaymentStep('packages');
    setSelectedPackage(null);
    setTransactionCode('');
    setIsCodeValid(false);
    onClose();
  };

  // Handle successful package upgrade
  const handleUpgradeSuccess = () => {
    setPaymentStep('success');
    setTimeout(() => {
      if (selectedPackage === 'premium') {
        onUpgradePremium();
      } else if (selectedPackage === 'elite') {
        onUpgradeElite();
      }
      handleClose();
    }, 2000);
  };

  // Get package amount
  const getPackageAmount = () => {
    return selectedPackage === 'premium' ? '350' : '650';
  };
  
  // Animation values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const liteButtonScale = useSharedValue(1);
  const eliteButtonScale = useSharedValue(1);
  
  // Animated styles
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }]
  }));
  
  const liteButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: liteButtonScale.value }]
  }));
  
  const eliteButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: eliteButtonScale.value }]
  }));
  
  // Reset and run animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Entrance animations
      contentOpacity.value = withTiming(1, { duration: 400 });
      contentTranslateY.value = withSpring(0, { damping: 15 });
    } else {
      // Exit animations
      contentOpacity.value = withTiming(0, { duration: 300 });
      contentTranslateY.value = withTiming(50, { duration: 300 });
    }
  }, [visible]);
  
  // Button press animations
  const handlePremiumButtonPress = () => {
    liteButtonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    setSelectedPackage('premium');
    setPaymentStep('mpesa-payment');
  };
  
  const handleEliteButtonPress = () => {
    eliteButtonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    setSelectedPackage('elite');
    setPaymentStep('mpesa-payment');
  };

  const renderContent = () => {
    switch (paymentStep) {
      case 'packages':
        return (
          <>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={handleClose}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
              
              <Text style={styles.packagesTitle}>Choose Your Package</Text>
              <Text style={styles.packagesSubtitle}>
                Upgrade your account to withdraw your full balance and access premium features
              </Text>
            </View>
            
            <ScrollView 
              style={styles.packagesScrollView}
              contentContainerStyle={styles.packagesScrollContent}
              showsVerticalScrollIndicator={false}
            >
                {/* Premium Package */}
                <View style={[styles.packageCard, styles.premiumCard]}>
                  <LinearGradient
                    colors={['#5965DE', '#556CD6']}
                    style={styles.packageHeaderGradient}
                  >
                    <Text style={styles.packageName}>Premium Package</Text>
                    <View style={styles.packagePriceContainer}>
                      <Text style={styles.packageCurrency}>KES</Text>
                      <Text style={styles.packagePrice}>350</Text>
                      <Text style={styles.packagePeriod}>for life</Text>
                    </View>
                  </LinearGradient>
                  
                  <View style={styles.packageContent}>
                    {[
                      'Withdraw up to KES 10,000 at once',
                      'Activate your account permanently',
                      'Access to premium surveys (250 KSH each)',
                      'Access to exclusive offers',
                      'Priority customer support'
                    ].map((feature, index) => (
                      <View key={index} style={styles.packageFeatureItem}>
                        <View style={[styles.checkCircle, styles.premiumCheckCircle]}>
                          <Check size={16} color="#FFF" />
                        </View>
                        <Text style={styles.packageFeatureText}>{feature}</Text>
                      </View>
                    ))}
                    
                    <Animated.View style={liteButtonAnimatedStyle}>
                      <TouchableOpacity 
                        style={[styles.packageButton, styles.premiumButton]}
                        onPress={handlePremiumButtonPress}
                      >
                        <Text style={styles.packageButtonText}>Get Premium Package</Text>
                        <ArrowRight size={18} color="#FFF" />
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                </View>
                
                {/* Elite Package */}
                <View style={[styles.packageCard, styles.eliteCard]}>
                  <LinearGradient
                    colors={['#FF8326', '#FF6B00']}
                    style={styles.packageHeaderGradient}
                  >
                    <Text style={styles.packageName}>Elite Package</Text>
                    <View style={styles.eliteNameContainer}>
                      <View style={styles.eliteBadge}>
                        <Text style={styles.eliteBadgeText}>MOST POPULAR</Text>
                      </View>
                    </View>
                    <View style={styles.packagePriceContainer}>
                      <Text style={styles.packageCurrency}>KES</Text>
                      <Text style={styles.packagePrice}>650</Text>
                      <Text style={styles.packagePeriod}>for life</Text>
                    </View>
                  </LinearGradient>
                  
                  <View style={styles.packageContent}>
                    {[
                      'Withdraw UNLIMITED amounts at once',
                      'Activate your account permanently',
                      'Access to ALL premium surveys',
                      'Exclusive Elite-only surveys (500 KSH each)',
                      'VIP customer support',
                      'Receive double referral bonuses'
                    ].map((feature, index) => (
                      <View key={index} style={styles.packageFeatureItem}>
                        <View style={[styles.checkCircle, styles.eliteCheckCircle]}>
                          <Check size={16} color="#FFF" />
                        </View>
                        <Text style={styles.packageFeatureText}>{feature}</Text>
                      </View>
                    ))}
                    
                    <Animated.View style={eliteButtonAnimatedStyle}>
                      <TouchableOpacity 
                        style={[styles.packageButton, styles.eliteButton]}
                        onPress={handleEliteButtonPress}
                      >
                        <Text style={styles.packageButtonText}>Get Elite Package</Text>
                        <ArrowRight size={18} color="#FFF" />
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                </View>
                
                <View style={styles.orDivider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>
                
                <TouchableOpacity 
                  style={styles.continueBasicButton}
                  onPress={onContinueBasic}
                >
                  <Text style={styles.continueBasicText}>Continue with Basic Account</Text>
                </TouchableOpacity>
              </ScrollView>
          </>
        );

      case 'mpesa-payment':
        return (
          <>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={handleClose}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
              
              <Text style={styles.packagesTitle}>Lipa Na M-Pesa Buy Goods</Text>
            </View>
            
            <View style={styles.mpesaContainer}>
              <Text style={styles.mpesaInstructions}>
                Use M-Pesa Buy Goods to complete your {selectedPackage} package upgrade
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
                <Text style={styles.amountText}>KSH {getPackageAmount()}</Text>
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
                onPress={() => setPaymentStep('packages')}
              >
                <Text style={styles.cancelButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 'transaction-code':
        return (
          <>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={handleClose}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
              
              <Text style={styles.packagesTitle}>Enter Transaction Code</Text>
            </View>
            
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
                onPress={handleUpgradeSuccess}
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
            <View style={styles.modalHeader}>
              <Text style={styles.packagesTitle}>Package Upgraded!</Text>
            </View>
            
            <View style={styles.successContainer}>
              <CheckCircle size={60} color="#00C851" style={{alignSelf: 'center', marginBottom: 16}} />
              <Text style={styles.successText}>
                Your {selectedPackage} package has been successfully activated. You can now enjoy all premium features!
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
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContainer, contentAnimatedStyle]}>
              {renderContent()}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSpacing(16),
  },
  modalContainer: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  modalHeader: {
    padding: getSpacing(24),
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: getSpacing(16),
    right: getSpacing(16),
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Packages Selection styles
  packagesTitle: {
    fontSize: getFontSize(24),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: getSpacing(8),
    textAlign: 'center',
  },
  packagesSubtitle: {
    fontSize: getFontSize(16),
    color: '#6B7280',
    marginBottom: getSpacing(24),
    textAlign: 'center',
    lineHeight: 24,
  },
  packagesScrollView: {
    width: '100%',
    maxHeight: height * 0.7,
  },
  packagesScrollContent: {
    paddingHorizontal: getSpacing(24),
    paddingBottom: getSpacing(24),
  },
  packageCard: {
    width: '100%',
    borderRadius: 20,
    marginBottom: getSpacing(20),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  premiumCard: {
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  eliteCard: {
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 0, 0.2)',
  },
  packageHeaderGradient: {
    padding: getSpacing(20),
    alignItems: 'center',
  },
  packageName: {
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getSpacing(8),
  },
  eliteNameContainer: {
    alignItems: 'center',
  },
  eliteBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: getSpacing(10),
    paddingVertical: getSpacing(4),
    borderRadius: 12,
    marginTop: getSpacing(4),
  },
  eliteBadgeText: {
    fontSize: getFontSize(12),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  packagePriceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  packageCurrency: {
    fontSize: getFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    marginTop: getSpacing(6),
  },
  packagePrice: {
    fontSize: getFontSize(36),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: getSpacing(4),
  },
  packagePeriod: {
    fontSize: getFontSize(14),
    color: 'rgba(255, 255, 255, 0.8)',
    alignSelf: 'flex-end',
    marginBottom: getSpacing(6),
  },
  packageContent: {
    padding: getSpacing(20),
  },
  packageFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing(14),
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumCheckCircle: {
    backgroundColor: Colors.light.primary,
  },
  eliteCheckCircle: {
    backgroundColor: '#FF6B00',
  },
  packageFeatureText: {
    fontSize: getFontSize(15),
    color: '#4B5563',
    marginLeft: getSpacing(12),
    flex: 1,
  },
  packageButton: {
    borderRadius: 12,
    paddingVertical: getSpacing(14),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getSpacing(8),
  },
  premiumButton: {
    backgroundColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  eliteButton: {
    backgroundColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  packageButtonText: {
    fontSize: getFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: getSpacing(8),
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: getSpacing(16),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    fontSize: getFontSize(14),
    color: '#9CA3AF',
    marginHorizontal: getSpacing(12),
  },
  continueBasicButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: getSpacing(14),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  continueBasicText: {
    fontSize: getFontSize(15),
    color: '#6B7280',
  },
  // M-Pesa payment styles
  mpesaContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 200, 81, 0.05)',
    borderRadius: 20,
    padding: getSpacing(20),
    marginHorizontal: getSpacing(24),
    marginBottom: getSpacing(20),
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 81, 0.2)',
  },
  mpesaInstructions: {
    fontSize: getFontSize(14),
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: getSpacing(16),
    fontWeight: '500',
  },
  tillContainer: {
    alignItems: 'center',
    marginBottom: getSpacing(16),
  },
  tillLabel: {
    fontSize: getFontSize(14),
    color: '#6B7280',
    marginBottom: getSpacing(8),
    fontWeight: '500',
  },
  tillNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: getSpacing(16),
    borderWidth: 2,
    borderColor: '#00C851',
    marginBottom: getSpacing(12),
  },
  tillNumber: {
    fontSize: getFontSize(24),
    fontWeight: 'bold',
    color: '#00C851',
    letterSpacing: 2,
    marginRight: getSpacing(16),
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 151, 247, 0.1)',
    borderRadius: 8,
    padding: getSpacing(8),
  },
  copyText: {
    fontSize: getFontSize(12),
    color: '#6397F7',
    marginLeft: getSpacing(4),
    fontWeight: '500',
  },
  businessName: {
    fontSize: getFontSize(16),
    fontWeight: 'bold',
    color: '#00C851',
    textAlign: 'center',
  },
  // Amount styles
  amountContainer: {
    alignItems: 'center',
    marginBottom: getSpacing(16),
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 12,
    padding: getSpacing(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  amountLabel: {
    fontSize: getFontSize(14),
    color: '#6B7280',
    marginBottom: getSpacing(4),
    fontWeight: '500',
  },
  amountText: {
    fontSize: getFontSize(20),
    fontWeight: 'bold',
    color: '#FF9800',
    letterSpacing: 1,
  },
  // Button styles
  buttonContainer: {
    width: '100%',
    paddingHorizontal: getSpacing(24),
    paddingBottom: getSpacing(24),
  },
  activateButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: getSpacing(14),
    alignItems: 'center',
    marginBottom: getSpacing(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activateButtonText: {
    fontSize: getFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: getSpacing(10),
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: getFontSize(16),
    color: '#6B7280',
    fontWeight: '500',
  },
  // Transaction code styles
  codeContainer: {
    width: '100%',
    paddingHorizontal: getSpacing(24),
    marginBottom: getSpacing(20),
  },
  codeInstructions: {
    fontSize: getFontSize(14),
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: getSpacing(16),
    fontWeight: '500',
  },
  codeInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: getSpacing(16),
    fontSize: getFontSize(16),
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    fontWeight: '500',
  },
  errorText: {
    fontSize: getFontSize(12),
    color: '#EF4444',
    textAlign: 'center',
    marginTop: getSpacing(8),
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  // Success styles
  successContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 200, 81, 0.1)',
    borderRadius: 20,
    padding: getSpacing(24),
    marginHorizontal: getSpacing(24),
    marginBottom: getSpacing(24),
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 81, 0.3)',
    alignItems: 'center',
  },
  successText: {
    fontSize: getFontSize(14),
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
});
