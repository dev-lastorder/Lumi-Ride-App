import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface Step {
  number: string;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

// Stepper Component
const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <View style={styles.stepperContainer}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep;
        
        return (
          <React.Fragment key={index}>
            {/* Step Circle and Label */}
            <View style={styles.stepWrapper}>
              {/* Circle Container with outer ring */}
              <View style={[
                styles.outerRing,
                isCompleted && styles.completedOuterRing,
                isActive && styles.activeOuterRing,
              ]}>
                <View style={[
                  styles.innerCircle,
                  isCompleted && styles.completedCircle,
                  isActive && styles.activeCircle,
                  isUpcoming && styles.upcomingCircle,
                ]}>
                  {isCompleted ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : (
                    <Text style={[
                      styles.numberText,
                      isActive ? styles.activeNumberText : styles.upcomingNumberText,
                    ]}>
                      {step.number}
                    </Text>
                  )}
                </View>
              </View>
              
              {/* Step Label */}
              <Text style={[
                styles.stepTitle,
                (isCompleted || isActive) ? styles.activeStepTitle : styles.upcomingStepTitle,
              ]}>
                {step.title}
              </Text>
            </View>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <View style={styles.lineWrapper}>
                <View style={[
                  styles.connectorLine,
                  stepNumber < currentStep ? styles.completedLine : styles.upcomingLine,
                ]} />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default Stepper;

interface Styles {
  stepperContainer: ViewStyle;
  stepWrapper: ViewStyle;
  outerRing: ViewStyle;
  completedOuterRing: ViewStyle;
  activeOuterRing: ViewStyle;
  innerCircle: ViewStyle;
  completedCircle: ViewStyle;
  activeCircle: ViewStyle;
  upcomingCircle: ViewStyle;
  numberText: TextStyle;
  activeNumberText: TextStyle;
  upcomingNumberText: TextStyle;
  checkmark: TextStyle;
  stepTitle: TextStyle;
  activeStepTitle: TextStyle;
  upcomingStepTitle: TextStyle;
  lineWrapper: ViewStyle;
  connectorLine: ViewStyle;
  completedLine: ViewStyle;
  upcomingLine: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  stepWrapper: {
    alignItems: 'center',
  },
  outerRing: {
    borderRadius: 50,
    padding: 4,
  },
  completedOuterRing: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  activeOuterRing: {
    backgroundColor: 'rgba(56, 83, 164, 0.15)',
  },
  innerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  activeCircle: {
    borderColor: '#3853A4',
    backgroundColor: '#FFFFFF',
  },
  upcomingCircle: {
    borderColor: '#D1D5DB',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  numberText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeNumberText: {
    color: '#374151',
  },
  upcomingNumberText: {
    color: '#9CA3AF',
  },
  checkmark: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepTitle: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    width: 90,
  },
  activeStepTitle: {
    color: '#111827',
  },
  upcomingStepTitle: {
    color: '#6B7280',
  },
  lineWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    marginBottom: 36,
  },
  connectorLine: {
    height: 3,
    width: 50,
    borderRadius: 2,
  },
  completedLine: {
    backgroundColor: '#3853A4',
  },
  upcomingLine: {
    backgroundColor: 'rgba(209, 213, 219, 0.5)',
  },
});