// src/lib/lebanon-locations.ts
// Constant mapping of Lebanese Governorates to their respective Districts (Qadaa)

export const LEBANON_LOCATIONS = {
  Beirut: ["Beirut"],
  "Mount Lebanon": [
    "Baabda",
    "Matn",
    "Chouf",
    "Aley",
    "Keserwan",
    "Jbeil"
  ],
  North: [
    "Tripoli",
    "Miniyeh-Danniyeh",
    "Zgharta",
    "Bsharri",
    "Koura",
    "Batroun"
  ],
  Akkar: ["Akkar"],
  Beqaa: [
    "Zahle",
    "West Beqaa",
    "Rashaya"
  ],
  "Baalbek-Hermel": [
    "Baalbek",
    "Hermel"
  ],
  South: [
    "Sidon",
    "Jezzine",
    "Tyre"
  ],
  Nabatieh: [
    "Nabatieh",
    "Marjeyoun",
    "Hasbaya",
    "Bint Jbeil"
  ]
} as const;

export type Governorate = keyof typeof LEBANON_LOCATIONS;
export type District<G extends Governorate> = (typeof LEBANON_LOCATIONS)[G][number];
