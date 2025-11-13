import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TermsSection {
  title: string;
  content: string | string[];
}

interface TermsContentProps {
  sections?: TermsSection[];
  onAccept: () => void;
  showAcceptButton?: boolean;
}

const DEFAULT_SECTIONS: TermsSection[] = [
  {
    title: 'Compliance with Laws',
    content: 'All users (drivers and riders) must comply with the traffic rules and the Land Transport Regulations set by the Ministry of Transport in Qatar.',
  },
  {
    title: 'Account',
    content: [
      '• Users must provide accurate information when registering.',
      '• Accounts are personal and cannot be shared.',
    ],
  },
  {
    title: '3. Safety',
    content: [
      '• Vehicles must be licensed, roadworthy, and registered under an authorized limousine company.',
      '• Drivers must hold a valid Qatari driving license and be fit to drive.',
    ],
  },
  {
    title: '4. Fares & Payment',
    content: [
      '• Fares are calculated according to the approved tariff by the Ministry of Transport.',
      '• Payments can be made through the app or in cash (where available).',
    ],
  },
  {
    title: '5. Conduct',
    content: [
      '• Users must treat each other with respect and avoid any harmful behavior.',
      '• The app may not be used for any unlawful purposes.',
    ],
  },
  {
    title: '6. Liability',
    content: [
      '• The company is not liable for delays or events beyond its control (traffic, force majeure, etc.).',
      '• Passengers are covered by insurance as required by law.',
    ],
  },
  {
    title: '7. Changes',
    content: [
      '• The company is not liable for delays or events beyond its control (traffic, force majeure, etc.).',
      '• Passengers are covered by insurance as required by law.',
    ],
  },
];

export default function TermsContent({ 
  sections = DEFAULT_SECTIONS, 
  onAccept,
  showAcceptButton = true 
}: TermsContentProps) {
  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <Text key={index} style={styles.contentText}>
          {item}
        </Text>
      ));
    }
    return (
      <Text style={styles.contentText}>
        {content}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      {sections.map((section, index) => (
        <View key={index}>
          <Text style={[styles.sectionTitle, index > 0 && styles.sectionTitleMargin]}>
            {section.title}
          </Text>
          {renderContent(section.content)}
        </View>
      ))}

      {showAcceptButton && (
        <TouchableOpacity 
          style={styles.acceptButton} 
          onPress={onAccept}
        >
          <Text style={styles.acceptButtonText}>
            Accept & Continue
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomPadding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  sectionTitleMargin: {
    marginTop: 16,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  acceptButton: {
    backgroundColor: '#3853A4',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 96,
  },
});