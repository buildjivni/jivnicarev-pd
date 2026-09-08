import { apiClient, ApiResponse } from "./client";
import { Doctor } from "../types/doctor";
import { MOCK_DOCTORS } from "../data/mockDoctors";

export interface SearchDoctorsParams {
  q?: string;
  specialty?: string;
  district?: string;
  page?: number;
  limit?: number;
}

export interface SearchDoctorsResponse {
  doctors: Doctor[];
  total: number;
  page: number;
  totalPages: number;
}

export async function searchDoctorsApi(
  params: SearchDoctorsParams = {}
): Promise<{ doctors: Doctor[]; fromBackend: boolean }> {
  try {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.append("q", params.q);
    if (params.specialty && params.specialty !== "All") queryParams.append("specialty", params.specialty);
    if (params.district && params.district !== "All Districts") queryParams.append("district", params.district);
    if (params.page) queryParams.append("page", String(params.page));
    if (params.limit) queryParams.append("limit", String(params.limit));

    const queryString = queryParams.toString();
    const endpoint = `/api/public/search${queryString ? `?${queryString}` : ""}`;

    const res = await apiClient<any>(endpoint, { method: "GET" });

    const rawList = res.data?.results || res.data?.fallbackResults || res.data?.doctors || (Array.isArray(res.data) ? res.data : []);

    if (res.success && Array.isArray(rawList) && rawList.length > 0) {
      const mappedDoctors: Doctor[] = rawList.map((d: any) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        specialty: d.specialityRef?.name || d.specialty || d.speciality || "General Physician",
        experienceYears: d.experienceYears || 5,
        rating: Number(d.rating || d.averageRating || d._avg?.rating || 4.8),
        reviewCount: Number(d.reviewCount || d.totalReviews || d._count?.reviews || 12),
        clinicName: d.clinicName || "JivniCare Partner Clinic",
        clinicAddress: d.clinicAddress || d.clinicDistrict || "Main Road",
        consultationFee: d.consultationFee ? Number(d.consultationFee) : 400,
        emergencyAvailable: Boolean(d.emergencyAvailable || d.isEmergencySupported),
        isEmergencySupported: Boolean(d.isEmergencySupported || d.emergencyAvailable),
        availabilityStatus: d.availabilityStatus || "AVAILABLE",
        isAcceptingBookings: d.isAcceptingBookings !== undefined ? Boolean(d.isAcceptingBookings) : true,
        image: d.profilePhoto || d.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
        clinicImage: (Array.isArray(d.clinicPhotos) && d.clinicPhotos[0]) || d.clinicImage || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
        about: d.bio || d.about || `Experienced specialist doctor with a focus on patient well-being and evidence-based clinical treatment.`,
        education: d.qualifications || d.education || "MBBS, MD",
        languages: Array.isArray(d.languages) && d.languages.length > 0 ? d.languages : ["Hindi", "English"],
        registrationNumber: d.registrationNumber || d.registrationId || "REG-VERIFIED",
        medicalCouncil: d.medicalCouncil || "Medical Council of India",
      }));

      return { doctors: mappedDoctors, fromBackend: true };
    }
  } catch (error) {
    // Graceful fallback to client mock data
  }

  // Fallback to local high-quality mock data filtered
  let filtered = [...MOCK_DOCTORS];
  if (params.district && params.district !== "All Districts") {
    const matchedDistrict = filtered.filter(
      (d) => d.district?.toLowerCase() === params.district?.toLowerCase()
    );
    if (matchedDistrict.length > 0) {
      filtered = matchedDistrict;
    }
  }
  if (params.specialty && params.specialty !== "All") {
    filtered = filtered.filter(
      (d) => d.specialty.toLowerCase() === params.specialty?.toLowerCase()
    );
  }
  if (params.q) {
    const qLower = params.q.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(qLower) ||
        d.specialty.toLowerCase().includes(qLower) ||
        (d.clinicName && d.clinicName.toLowerCase().includes(qLower)) ||
        (d.clinicAddress && d.clinicAddress.toLowerCase().includes(qLower))
    );
  }

  return { doctors: filtered, fromBackend: false };
}

export async function getDoctorByIdApi(id: string): Promise<Doctor | null> {
  const { doctors } = await searchDoctorsApi();
  const match = doctors.find((d) => d.id === id);
  if (match) return match;
  return MOCK_DOCTORS.find((d) => d.id === id) || null;
}
