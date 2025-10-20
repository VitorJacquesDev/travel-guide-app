import { collection, doc, setDoc, GeoPoint } from 'firebase/firestore';
import { db } from '../../core/config/firebase';
import { Category, PriceRange } from '../../domain/models/PointOfInterest';

/**
 * Sample points of interest data for development
 */
const samplePoints = [
  {
    id: 'cristo-redentor',
    name: 'Cristo Redentor',
    description: 'Estátua icônica do Rio de Janeiro, uma das Sete Maravilhas do Mundo Moderno.',
    category: 'monument' as Category,
    rating: 4.7,
    priceRange: 'medium' as PriceRange,
    location: new GeoPoint(-22.9519, -43.2105),
    address: 'Parque Nacional da Tijuca - Alto da Boa Vista',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'Brasil',
    imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800',
    openingHours: {
      monday: { open: '08:00', close: '19:00' },
      tuesday: { open: '08:00', close: '19:00' },
      wednesday: { open: '08:00', close: '19:00' },
      thursday: { open: '08:00', close: '19:00' },
      friday: { open: '08:00', close: '19:00' },
      saturday: { open: '08:00', close: '19:00' },
      sunday: { open: '08:00', close: '19:00' },
    },
    amenities: ['parking', 'restroom', 'gift_shop'],
    tags: ['iconic', 'religious', 'panoramic_view', 'must_visit'],
  },
  {
    id: 'pao-de-acucar',
    name: 'Pão de Açúcar',
    description: 'Morro com vista panorâmica da cidade do Rio de Janeiro, acessível por bondinho.',
    category: 'nature' as Category,
    rating: 4.6,
    priceRange: 'medium' as PriceRange,
    location: new GeoPoint(-22.9485, -43.1654),
    address: 'Av. Pasteur, 520 - Urca',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'Brasil',
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',
    openingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '08:00', close: '20:00' },
      sunday: { open: '08:00', close: '20:00' },
    },
    amenities: ['cable_car', 'restaurant', 'gift_shop'],
    tags: ['panoramic_view', 'cable_car', 'sunset', 'romantic'],
  },
  {
    id: 'museu-do-amanha',
    name: 'Museu do Amanhã',
    description: 'Museu de ciências aplicadas que explora as possibilidades para os próximos 50 anos.',
    category: 'museum' as Category,
    rating: 4.4,
    priceRange: 'low' as PriceRange,
    location: new GeoPoint(-22.8955, -43.1784),
    address: 'Praça Mauá, 1 - Centro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'Brasil',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    openingHours: {
      monday: { open: '10:00', close: '18:00' },
      tuesday: { open: '10:00', close: '18:00' },
      wednesday: { open: '10:00', close: '18:00' },
      thursday: { open: '10:00', close: '18:00' },
      friday: { open: '10:00', close: '18:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: '10:00', close: '18:00' },
    },
    amenities: ['wifi', 'cafe', 'accessibility', 'parking'],
    tags: ['science', 'interactive', 'family_friendly', 'educational'],
  },
  {
    id: 'teatro-amazonas',
    name: 'Teatro Amazonas',
    description: 'Teatro histórico de Manaus, símbolo da época áurea da borracha na Amazônia.',
    category: 'cultural' as Category,
    rating: 4.5,
    priceRange: 'low' as PriceRange,
    location: new GeoPoint(-3.1305, -60.0238),
    address: 'Largo de São Sebastião, s/n - Centro',
    city: 'Manaus',
    state: 'AM',
    country: 'Brasil',
    imageUrl: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800',
    openingHours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '09:00', close: '17:00' },
    },
    amenities: ['guided_tours', 'gift_shop', 'accessibility'],
    tags: ['historic', 'architecture', 'opera', 'cultural'],
  },
  {
    id: 'pelourinho',
    name: 'Pelourinho',
    description: 'Centro histórico de Salvador, Patrimônio Mundial da UNESCO com arquitetura colonial.',
    category: 'historic' as Category,
    rating: 4.3,
    priceRange: 'free' as PriceRange,
    location: new GeoPoint(-12.9714, -38.5124),
    address: 'Pelourinho - Centro Histórico',
    city: 'Salvador',
    state: 'BA',
    country: 'Brasil',
    imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800',
    openingHours: {
      monday: { open: '24h', close: '24h' },
      tuesday: { open: '24h', close: '24h' },
      wednesday: { open: '24h', close: '24h' },
      thursday: { open: '24h', close: '24h' },
      friday: { open: '24h', close: '24h' },
      saturday: { open: '24h', close: '24h' },
      sunday: { open: '24h', close: '24h' },
    },
    amenities: ['restaurants', 'shops', 'live_music'],
    tags: ['unesco', 'colonial', 'colorful', 'music', 'capoeira'],
  },
  {
    id: 'cataratas-do-iguacu',
    name: 'Cataratas do Iguaçu',
    description: 'Conjunto de quedas d\'água na fronteira entre Brasil e Argentina, Patrimônio Mundial da UNESCO.',
    category: 'nature' as Category,
    rating: 4.8,
    priceRange: 'medium' as PriceRange,
    location: new GeoPoint(-25.6953, -54.4367),
    address: 'Parque Nacional do Iguaçu',
    city: 'Foz do Iguaçu',
    state: 'PR',
    country: 'Brasil',
    imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800',
    openingHours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '09:00', close: '17:00' },
    },
    amenities: ['trails', 'visitor_center', 'restaurant', 'parking'],
    tags: ['unesco', 'waterfalls', 'nature', 'hiking', 'photography'],
  },
];

/**
 * Seed the Firestore database with sample points of interest
 */
export async function seedPointsOfInterest(): Promise<void> {
  try {
    console.log('Starting to seed points of interest...');
    
    const pointsRef = collection(db, 'points_of_interest');
    
    for (const point of samplePoints) {
      const docRef = doc(pointsRef, point.id);
      await setDoc(docRef, {
        ...point,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log(`Seeded point: ${point.name}`);
    }
    
    console.log('Successfully seeded all points of interest!');
  } catch (error) {
    console.error('Error seeding points of interest:', error);
    throw error;
  }
}

/**
 * Development utility to seed data
 * Call this function in development to populate the database
 */
export async function runSeeder(): Promise<void> {
  if (__DEV__) {
    try {
      await seedPointsOfInterest();
    } catch (error) {
      console.error('Seeding failed:', error);
    }
  }
}