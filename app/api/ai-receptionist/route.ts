import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import { TREATMENTS, PRICING_CATEGORIES, INITIAL_CLINIC_SETTINGS } from '@/lib/clinicData';

const CLINIC_KNOWLEDGE = `
Tu es l'Assistante Virtuelle & Concierge de Luxe officielle de "GH Clinic — Cabinet Médico-Esthétique Dr. Ghaouat Sarra" située à Khemis Miliana (Wilaya d'Aïn Defla, Algérie).

INFORMATIONS CLÉS SUR LA CLINIQUE :
- Nom : GH Clinic (Cabinet médico-esthétique Dr. Ghaouat Sarra)
- Médecin Fondatrice : Dr. Ghaouat Sarra (Médecin esthétique et laseriste certifiée)
- Ville & Localisation : Centre-ville de Khemis Miliana, Wilaya d'Aïn Defla, Algérie. (Accessible facilement depuis Alger, Blida, Chlef, Médéa).
- Téléphone & WhatsApp : +213 550 12 34 56
- Horaires d'ouverture : Du Samedi au Jeudi, de 09h00 à 18h00. (Fermé le Vendredi).
- Instagram : @gh_clinic10 | Facebook : Drsarraghaouat

SOINS PROPOSÉS ET TARIFS DE RÉFÉRENCE (en Dinars Algériens - DZD) :
1. Épilation Laser Médicale (Dernière génération triple onde Alexandrite/Diode indolore avec cryo-refroidissement -5°C) :
   - Corps complet femme : 18 000 DZD / séance (Forfait 6 séances : 90 000 DZD)
   - Demi-jambes + Maillot + Aisselles : 11 000 DZD / séance
   - Aisselles : 2 500 DZD | Maillot intégral : 4 500 DZD | Visage complet : 3 500 DZD
2. Injections de Toxine Botulique (Botox) :
   - 3 Zones (Front + Ride du Lion + Pattes d'oie) : 28 000 DZD
   - 1 zone isolée : 15 000 DZD | Baby Botox : 20 000 DZD | Masséters (Bruxisme) : 26 000 DZD
3. Comblement Acide Hyaluronique (Fillers haut de gamme Juvéderm/Teosyal) :
   - Lèvres Russian Lips / Hydratation : 28 000 DZD / seringue 1ml
   - Sillons nasogéniens & Plis d'amertume : 29 000 DZD
   - Pommettes / Jawline contouring : 30 000 DZD | Cernes creux : 32 000 DZD
4. Soin Hydrafacial MD Médical :
   - Formule Signature (Nettoyage vortex, extraction comédons, infusion sérums) : 9 500 DZD
   - Formule Deluxe avec Booster anti-âge + Luminothérapie LED : 13 500 DZD
5. PRP (Plasma Riche en Plaquettes) :
   - Visage (Vampire Facial éclat/fermeté) : 14 000 DZD (Pack 3 séances : 36 000 DZD)
   - Cheveux (Anti-chute & repousse capillaire) : 13 000 DZD
6. Skinboosters (Profhilo / Restylane Vital) :
   - Profhilo 2ml (Visage ou Cou) : 25 000 DZD
7. Microneedling Médical :
   - Séance avec cocktails vitaminés (Cicatrices acné & pores) : 7 500 DZD
8. Peelings Chimiques Médicaux :
   - Peeling Éclat & Anti-Teint terne : 7 000 DZD | Peeling Dépigmentant Mélasma : 11 000 DZD

RÈGLES D'OR ET DÉONTOLOGIE MÉDICALE :
1. Ton & Style : Chaleureux, haut de gamme, extrêmement poli, raffiné et rassurant (style clinique de luxe suisse/dubaïote).
2. Langue : Réponds avec élégance dans la langue utilisée par la patiente (Français par défaut, ou Arabe algérien/Derja/Arabe classique si elle s'exprime en arabe, ou Anglais).
3. NON-DIAGNOSTIC & SÉCURITÉ : Ne pose JAMAIS de diagnostic médical définitif et ne prescris JAMAIS de médicaments. Rappelle systématiquement avec bienveillance que seul Dr. Ghaouat Sarra peut poser une indication médicale personnalisée lors d'une consultation au cabinet.
4. OBJECTIF DE CONVERSION : Encourage toujours poliment la patiente à prendre rendez-vous pour une consultation d'évaluation avec Dr. Sarra, ou propose de bloquer un créneau directement via le bouton de réservation en ligne ou par WhatsApp au +213 550 12 34 56.
5. Sois concise, claire et percutante (2 à 4 phrases bien aérées, avec puces si nécessaire).
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    let replyText = '';

    // Check if Gemini API key exists
    if (process.env.GEMINI_API_KEY) {
      const ai = getGeminiClient();

      // Format conversation contents
      const formattedContents = [
        ...conversationHistory.slice(-6).map((item: { role: string; content: string }) => ({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.content }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction: CLINIC_KNOWLEDGE,
          temperature: 0.7,
        },
      });

      replyText = response.text || "Je suis ravie de vous renseigner. N'hésitez pas à réserver une consultation avec Dr. Ghaouat Sarra à Khemis Miliana pour un examen personnalisé.";
    } else {
      // Graceful fallback if API key is not yet set
      const lower = message.toLowerCase();
      if (lower.includes('prix') || lower.includes('tarif') || lower.includes('combien')) {
        replyText = "Chez GH Clinic, nos tarifs sont transparents : Épilation laser corps complet à partir de 18 000 DZD, Hydrafacial MD à 9 500 DZD, Botox 3 zones à 28 000 DZD, et Fillers lèvres à 28 000 DZD. Souhaitez-vous planifier une consultation d'évaluation avec Dr. Ghaouat Sarra ?";
      } else if (lower.includes('laser') || lower.includes('épilation')) {
        replyText = "Notre cabinet utilise des lasers médicaux de pointe triple onde avec système de refroidissement cryogénique à -5°C pour une séance rapide et sans douleur. Le Dr. Ghaouat Sarra adapte les réglages à votre phototype. Voulez-vous réserver votre créneau ?";
      } else if (lower.includes('botox') || lower.includes('ride')) {
        replyText = "Dr. Ghaouat Sarra réalise les injections de Botox avec un dosage ultra précis pour estomper les rides du front, de la glabelle et des pattes d'oie tout en préservant la fraîcheur naturelle de vos expressions. Comptez 28 000 DZD pour le protocole 3 zones.";
      } else if (lower.includes('adresse') || lower.includes('où') || lower.includes('localisation') || lower.includes('khemis')) {
        replyText = "GH Clinic est située au centre-ville de Khemis Miliana (Wilaya d'Aïn Defla). Nous vous accueillons du Samedi au Jeudi de 09h00 à 18h00. Vous pouvez nous joindre directement au +213 550 12 34 56.";
      } else {
        replyText = "Bonjour et bienvenue chez GH Clinic ! Je suis l'assistante virtuelle de Dr. Ghaouat Sarra. Je peux vous renseigner sur nos soins (Laser, Botox, Fillers, Hydrafacial, PRP, Skinboosters), nos tarifs en DZD et vous aider à réserver votre rendez-vous à Khemis Miliana.";
      }
    }

    return NextResponse.json({
      reply: replyText,
      clinicPhone: INITIAL_CLINIC_SETTINGS.phone,
      whatsappUrl: `https://wa.me/${INITIAL_CLINIC_SETTINGS.whatsappPhone}?text=${encodeURIComponent("Bonjour Dr. Ghaouat, je souhaite me renseigner et prendre rendez-vous.")}`
    });
  } catch (error: unknown) {
    console.error('Error in AI Receptionist route:', error);
    return NextResponse.json(
      {
        reply: "Bonjour ! Dr. Ghaouat Sarra et notre équipe vous accueillent avec plaisir à Khemis Miliana pour sublimer votre beauté naturelle. Souhaitez-vous réserver une consultation ou connaître nos tarifs en Dinars ?",
      },
      { status: 200 }
    );
  }
}
