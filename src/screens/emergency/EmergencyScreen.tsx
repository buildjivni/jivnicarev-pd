import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PhoneCall,
  AlertTriangle,
  Heart,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Stethoscope,
  Activity,
  Baby,
  Navigation,
  Radio,
} from 'lucide-react-native';
import { Doctor } from '../../types/doctor';
import { MOCK_DOCTORS } from '../../data/mockDoctors';
import { usePatientLocationStore } from '../../store/usePatientLocationStore';
import { colors, radius, shadows } from '../../theme';

interface EmergencyScreenProps {
  onBookEmergencyDoctor: (doctor: Doctor) => void;
  onExploreAllDoctors?: () => void;
  onPressDoctor?: (doctor: Doctor) => void;
}

const EMERGENCY_TRIAGE_CONDITIONS = [
  {
    id: 'cardiac',
    title: 'Chest Pain / Heart',
    desc: 'Pressure, pain radiating to arm, cold sweat',
    icon: Heart,
    color: '#EF4444',
    bg: '#FEF2F2',
    action: 'Call 108 immediately. Keep patient sitting upright and calm.',
  },
  {
    id: 'breathing',
    title: 'Severe Breathlessness',
    desc: 'Gasping for breath, asthma attack, blue lips',
    icon: Activity,
    color: '#0284C7',
    bg: '#F0F9FF',
    action: 'Loosen tight clothes, administer inhaler if available, call 108.',
  },
  {
    id: 'trauma',
    title: 'Severe Bleeding / Accident',
    desc: 'Deep cuts, profuse bleeding, head injury',
    icon: AlertTriangle,
    color: '#D97706',
    bg: '#FFFBEB',
    action: 'Apply direct pressure with a clean cloth. Elevate injured limb.',
  },
  {
    id: 'pediatric',
    title: 'Infant High Fever / Fits',
    desc: 'Temperature >103°F, seizures, unresponsiveness',
    icon: Baby,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    action: 'Cool sponging with room-temp water. Do not wrap in blankets.',
  },
];

const NEARBY_EMERGENCY_HOSPITALS = [
  {
    id: 'hosp-1',
    name: 'Sadar District Hospital & Trauma Center',
    type: 'Govt. 24x7 Emergency',
    phone: '108',
    address: 'Court Road, Near Gandhi Chowk',
    distance: '1.4 km',
  },
  {
    id: 'hosp-2',
    name: 'Apex Critical Care & Multi-Specialty Hospital',
    type: 'Private ICU & Emergency',
    phone: '+91 94311 02934',
    address: 'Station Road, Opp. Railway Colony',
    distance: '2.8 km',
  },
];

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({
  onBookEmergencyDoctor,
  onPressDoctor,
}) => {
  const { selectedDistrict } = usePatientLocationStore();
  const [selectedTriage, setSelectedTriage] = useState<string>('cardiac');

  const emergencyDoctors = MOCK_DOCTORS.filter(
    (d) =>
      (d.emergencyAvailable || d.isEmergencySupported) &&
      (d.district || '').toLowerCase() === selectedDistrict.toLowerCase()
  );

  const handleDial = (number: string, title: string) => {
    Alert.alert(
      'Emergency Call: ' + title,
      'Are you sure you want to call ' + title + ' (' + number + ')?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          style: 'destructive',
          onPress: () => {
            Linking.openURL('tel:' + number).catch(() => {
              Alert.alert('Unable to place call', 'Please dial ' + number + ' directly.');
            });
          },
        },
      ]
    );
  };

  const activeTriageObj = EMERGENCY_TRIAGE_CONDITIONS.find(
    (c) => c.id === selectedTriage
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP CRITICAL ALERT HEADER */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.heroBadgeText}>24x7 EMERGENCY CARE & TRIAGE</Text>
          </View>
          <Text style={styles.heroTitle}>Immediate Medical Emergency?</Text>
          <Text style={styles.heroSubtitle}>
            If you are experiencing life-threatening symptoms, call national emergency response immediately.
          </Text>

          {/* Critical Call Buttons */}
          <View style={styles.actionPillsRow}>
            <TouchableOpacity
              style={styles.primaryAmbulanceBtn}
              activeOpacity={0.85}
              onPress={() => handleDial('108', 'Ambulance (108)')}
            >
              <PhoneCall size={20} color='#FFFFFF' />
              <View>
                <Text style={styles.ambulanceBtnTitle}>108 Ambulance</Text>
                <Text style={styles.ambulanceBtnSub}>Free Govt. Service</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryPoliceBtn}
              activeOpacity={0.85}
              onPress={() => handleDial('112', 'Emergency (112)')}
            >
              <AlertTriangle size={18} color='#991B1B' />
              <View>
                <Text style={styles.policeBtnTitle}>112 Emergency</Text>
                <Text style={styles.policeBtnSub}>National Helpline</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAST TRIAGE PROTOCOLS */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeading}>Fast Emergency Triage Guide</Text>
          <Text style={styles.sectionSubHeading}>
            Select symptom condition for immediate first-aid instructions
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.triagePillsScroll}
          >
            {EMERGENCY_TRIAGE_CONDITIONS.map((cond) => {
              const IconComp = cond.icon;
              const isSelected = selectedTriage === cond.id;
              return (
                <TouchableOpacity
                  key={cond.id}
                  style={[
                    styles.triageTabPill,
                    isSelected && { borderColor: cond.color, backgroundColor: cond.bg },
                  ]}
                  onPress={() => setSelectedTriage(cond.id)}
                  activeOpacity={0.8}
                >
                  <IconComp size={16} color={isSelected ? cond.color : '#64748B'} />
                  <Text
                    style={[
                      styles.triageTabTitle,
                      isSelected && { color: cond.color, fontWeight: '800' },
                    ]}
                  >
                    {cond.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {activeTriageObj && (
            <View
              style={[
                styles.triageAdviceCard,
                { borderColor: activeTriageObj.color, backgroundColor: activeTriageObj.bg },
              ]}
            >
              <View style={styles.triageAdviceHeader}>
                <ShieldCheck size={18} color={activeTriageObj.color} />
                <Text style={[styles.triageAdviceTitle, { color: activeTriageObj.color }]}>
                  Immediate First-Aid Protocol
                </Text>
              </View>
              <Text style={styles.triageAdviceDesc}>{activeTriageObj.desc}</Text>
              <Text style={styles.triageAdviceAction}>⚠️ {activeTriageObj.action}</Text>
            </View>
          )}
        </View>

        {/* EMERGENCY ON-CALL DOCTORS */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionHeading}>
                Emergency OPD Doctors ({selectedDistrict})
              </Text>
              <Text style={styles.sectionSubHeading}>
                Priority walk-in tokens with zero routine waiting
              </Text>
            </View>
            <View style={styles.liveOpdPill}>
              <Radio size={12} color='#059669' />
              <Text style={styles.liveOpdText}>Live Slots</Text>
            </View>
          </View>

          {emergencyDoctors.length > 0 ? (
            emergencyDoctors.map((doc) => (
              <View key={doc.id} style={styles.emergencyDoctorCard}>
                <View style={styles.docMainRow}>
                  <Image
                    source={{
                      uri:
                        doc.image ||
                        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
                    }}
                    style={styles.docAvatar}
                  />
                  <View style={styles.docInfoCol}>
                    <View style={styles.docNameBadgeRow}>
                      <Text style={styles.docName}>{doc.name}</Text>
                      <View style={styles.priorityPill}>
                        <Text style={styles.priorityPillText}>Emergency OPD</Text>
                      </View>
                    </View>
                    <Text style={styles.docSpecialty}>
                      {doc.specialty} • {doc.experienceYears}+ yrs exp
                    </Text>
                    <View style={styles.clinicAddressRow}>
                      <MapPin size={12} color='#64748B' />
                      <Text style={styles.clinicAddressText} numberOfLines={1}>
                        {doc.clinicName}, {doc.clinicAddress}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Card Actions */}
                <View style={styles.docCardActions}>
                  <TouchableOpacity
                    style={styles.viewProfileBtn}
                    onPress={() => (onPressDoctor ? onPressDoctor(doc) : onBookEmergencyDoctor(doc))}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewProfileText}>View Clinic</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bookPriorityBtn}
                    onPress={() => onBookEmergencyDoctor(doc)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.bookPriorityText}>Book Priority Token</Text>
                    <ArrowRight size={14} color='#FFFFFF' />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noDocCard}>
              <Stethoscope size={32} color='#94A3B8' />
              <Text style={styles.noDocTitle}>No Emergency OPD Listed</Text>
              <Text style={styles.noDocSub}>
                For critical emergencies in {selectedDistrict}, please call 108 or reach the nearest Sadar Hospital Trauma Center.
              </Text>
            </View>
          )}
        </View>

        {/* 24X7 TRAUMA CENTERS & HOSPITALS */}
        <View style={[styles.sectionBlock, { marginBottom: 40 }]}>
          <Text style={styles.sectionHeading}>24x7 Trauma Centers & Emergency Centers</Text>
          <Text style={styles.sectionSubHeading}>
            Hospitals with round-the-clock emergency casualty in {selectedDistrict}
          </Text>

          {NEARBY_EMERGENCY_HOSPITALS.map((hosp) => (
            <View key={hosp.id} style={styles.hospitalCard}>
              <View style={styles.hospHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hospName}>{hosp.name}</Text>
                  <Text style={styles.hospType}>{hosp.type}</Text>
                </View>
                <View style={styles.distancePill}>
                  <Text style={styles.distanceText}>{hosp.distance}</Text>
                </View>
              </View>

              <View style={styles.hospAddressRow}>
                <MapPin size={13} color='#64748B' />
                <Text style={styles.hospAddressText}>{hosp.address}</Text>
              </View>

              <View style={styles.hospActionsRow}>
                <TouchableOpacity
                  style={styles.hospCallBtn}
                  onPress={() => handleDial(hosp.phone, hosp.name)}
                  activeOpacity={0.8}
                >
                  <PhoneCall size={14} color='#0F172A' />
                  <Text style={styles.hospCallText}>Call Hospital</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.hospMapBtn}
                  onPress={() => {
                    const query = encodeURIComponent(hosp.name + ', ' + selectedDistrict);
                    Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + query);
                  }}
                  activeOpacity={0.8}
                >
                  <Navigation size={14} color='#0284C7' />
                  <Text style={styles.hospMapText}>Directions</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  heroBanner: {
    backgroundColor: '#DC2626',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 24,
    padding: 20,
    ...shadows.md,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 6,
    lineHeight: 18,
    fontWeight: '500',
  },
  actionPillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  primaryAmbulanceBtn: {
    flex: 1.2,
    backgroundColor: '#991B1B',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ambulanceBtnTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  ambulanceBtnSub: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  secondaryPoliceBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  policeBtnTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#991B1B',
  },
  policeBtnSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  sectionBlock: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  sectionSubHeading: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveOpdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  liveOpdText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  triagePillsScroll: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: 12,
  },
  triageTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  triageTabTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  triageAdviceCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  triageAdviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  triageAdviceTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  triageAdviceDesc: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 6,
  },
  triageAdviceAction: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '700',
    lineHeight: 18,
  },
  emergencyDoctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  docMainRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  docAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
  },
  docInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  docNameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  docName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  priorityPill: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  priorityPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  docSpecialty: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  clinicAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  clinicAddressText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  docCardActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  viewProfileBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewProfileText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  bookPriorityBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#DC2626',
  },
  bookPriorityText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  noDocCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noDocTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
  },
  noDocSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  hospitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  hospHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  hospName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  hospType: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    marginTop: 2,
  },
  distancePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  hospAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    marginBottom: 12,
  },
  hospAddressText: {
    fontSize: 12,
    color: '#64748B',
  },
  hospActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  hospCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  hospCallText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  hospMapBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  hospMapText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
});
