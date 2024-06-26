let cells = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16',
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16',
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16',
  'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16',
  'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13', 'E14', 'E15', 'E16',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16',
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14', 'H15', 'H16',
  'I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10', 'I11', 'I12', 'I13', 'I14', 'I15', 'I16',
  'J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10', 'J11', 'J12', 'J13', 'J14', 'J15', 'J16',
  'K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10', 'K11', 'K12', 'K13', 'K14', 'K15', 'K16',
  'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15', 'L16',
  'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16',
  'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10', 'N11', 'N12', 'N13', 'N14', 'N15', 'N16',
  'O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10', 'O11', 'O12', 'O13', 'O14', 'O15', 'O16',
  'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16',
];

export const MAPS = [
  // DÉBUTANT =====================================================================================
  
  { // EUROPE
    id: '01-01',
    img: '01-01',
    imgOver: '01-01-over',
    name: 'europe',
    spawnLine: 8,
    spawnColumn: 9,
    walkableCells: [
      'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16',
      'B1', 'B2', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16',
      'C1', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16',
      'D1', 'D8', 'D9', 'D10', 'D11', 'D12', 'D15', 'D16',
      'E1', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E15', 'E16',
      'F1', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F16',
      'G1', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G16',
      'H1', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 
      'I1', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10', 'I11', 'I12', 'I13', 'I14', 
      'J1', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10', 'J11', 'J12', 'J13', 'J14',
      'K1', 'K6', 'K7', 'K8', 'K9', 'K10', 'K11', 'K12', 'K13', 'K14', 
      'L1', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13',
      'M1', 'M16',
      'N1', 'N16',
      'O1', 'O2', 'O6', 'O7', 'O8', 'O9', 'O10', 'O11', 'O14', 'O15', 'O16',
      'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16',
    ],
    swimmableCells: [
      'B3', 'B4', 'B5', 'B6',
      'C2', 'C3', 'C4', 'C5', 'C6', 'C7',
      'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D13', 'D14',
      'E2', 'E3', 'E4', 'E5', 'E6', 'E13', 'E14',
      'F2', 'F3', 'F13', 'F14', 'F15',
      'G2', 'G3', 'G13', 'G14', 'G15',
      'H2', 'H3', 'H14', 'H15', 'H16',
      'I2', 'I3', 'I15', 'I16',
      'J2', 'J3', 'J4', 'J15', 'J16',
      'K2', 'K3', 'K4', 'K5', 'K15', 'K16',
      'L2', 'L3', 'L4', 'L5', 'L6', 'L14', 'L15', 'L16',
      'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15',
      'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10', 'N11', 'N12', 'N13', 'N14', 'N15',
      'O3', 'O4', 'O5', 'O12', 'O13'
    ],
    /* fishes: [
      {
        id: '01-01',
        img: '',
        commonName: 'poisson 01-01',
        scientificName: 'poisson 01-01',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ], */
    fishes: [
      {
        id: 'rutilusRutilus',
        img: '/01-01/fishes/rutilusRutilus',
        commonName: 'gardon',
        scientificName: 'rutilus rutilus',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
      {
        id: 'salmoTrutta',
        img: '/01-01/fishes/salmoTrutta',
        commonName: 'truite commune',
        scientificName: 'salmo trutta',
        minLength: 18,
        maxLength: 49,
        minMass: 100,
        maxMass: 3000,
      },
      {
        id: 'tincaTinca',
        img: '/01-01/fishes/tincaTinca',
        commonName: 'tanche',
        scientificName: 'tinca tinca',
        minLength: 27,
        maxLength: 65,
        minMass: 425,
        maxMass: 6822,
      },
      {
        id: 'percaFluviatilis',
        img: '/01-01/fishes/percaFluviatilis',
        commonName: 'perche',
        scientificName: 'perca fluviatilis',
        minLength: 15,
        maxLength: 50,
        minMass: 200,
        maxMass: 1982,
      },
      {
        id: 'gobioGobio',
        img: '/01-01/fishes/gobioGobio',
        commonName: 'goujon',
        scientificName: 'gobio gobio',
        minLength: 8,
        maxLength: 21,
        minMass: 20,
        maxMass: 40,
      },
      {
        id: 'cyprinusCarpio',
        img: '/01-01/fishes/cyprinusCarpio',
        commonName: 'carpe commune',
        scientificName: 'cyprinus carpio',
        minLength: 45,
        maxLength: 97,
        minMass: 8000,
        maxMass: 40000,
      },
      {
        id: 'sanderLucioperca',
        img: '/01-01/fishes/sanderLucioperca',
        commonName: 'sandre',
        scientificName: 'sander lucioperca',
        minLength: 60,
        maxLength: 125,
        minMass: 5000,
        maxMass: 20000,
      },
      {
        id: 'esoxLucius',
        img: '/01-01/fishes/esoxLucius',
        commonName: 'grand brochet',
        scientificName: 'esox lucius',
        minLength: 30,
        maxLength: 147,
        minMass: 2000,
        maxMass: 31000,
      },
      {
        id: 'silurusGlanis',
        img: '/01-01/fishes/silurusGlanis',
        commonName: 'silure glane',
        scientificName: 'silurus glanis',
        minLength: 120,
        maxLength: 285,
        minMass: 15000,
        maxMass: 140000,
      },
      {
        id: 'anguillaAnguilla',
        img: '/01-01/fishes/anguillaAnguilla',
        commonName: 'anguille commune',
        scientificName: 'anguilla anguilla',
        minLength: 40,
        maxLength: 140,
        minMass: 800,
        maxMass: 4000,
      },
    ],
  },
  { // AMÉRIQUE DU NORD
    id: '01-02',
    img: '01-02',
    name: 'amérique du nord',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '01-02',
        img: '',
        commonName: 'poisson 01-02',
        scientificName: 'poisson 01-02',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // MÉDITERANNEE
    id: '01-03',
    img: '01-03',
    name: 'côte méditerranéenne',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '01-03',
        img: '',
        commonName: 'poisson 01-03',
        scientificName: 'poisson 01-03',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // GRANDE BARRIÈRE DE CORAIL
    id: '01-04',
    img: '01-04',
    spawnLine: 2,
    spawnColumn: 3,
    name: 'grande barrière<br>de corail',
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '01-04',
        img: '',
        commonName: 'poisson 01-04',
        scientificName: 'poisson 01-04',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },

  // INTERMÉDIAIRE ================================================================================

  { // LAC TANGANYIKA
    id: '02-01',
    img: '02-01',
    name: 'lac tanganyika',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '02-01',
        img: '',
        commonName: 'poisson 02-01',
        scientificName: 'poisson 02-01',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // CARAÏBES
    id: '02-02',
    img: '02-02',
    name: 'caraïbes',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '02-02',
        img: '',
        commonName: 'poisson 02-02',
        scientificName: 'poisson 02-02',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // RIO PARANÀ
    id: '02-03',
    img: '02-03',
    name: 'rio paranà',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '02-03',
        img: '',
        commonName: 'poisson 02-03',
        scientificName: 'poisson 02-03',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // LAC BAÏKAL
    id: '02-04',
    img: '02-04',
    name: 'lac baïkal',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '02-04',
        img: '',
        commonName: 'poisson 02-04',
        scientificName: 'poisson 02-04',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
    /* fishes: [
      {
        id: 'gasterosteusAculeatus',
        img: '/01-03/fishes/gasterosteusAculeatus',
        commonName: 'épinoche',
        scientificName: 'gasterosteus aculeatus',
        minLength: 4,
        maxLength: 9,
        minMass: 1,
        maxMass: 7,
      },
      {
        id: 'lotaLota',
        img: '/01-03/fishes/lotaLota',
        commonName: 'lotte',
        scientificName: 'lota lota',
        minLength: 35,
        maxLength: 45,
        minMass: 350,
        maxMass: 600,
      },
    ], */
  },

  // AVANCÉ =======================================================================================

  { // PACIFIQUE SUD
    id: '03-01',
    img: '03-01',
    name: 'océan<br>pacifique sud',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '03-01',
        img: '',
        commonName: 'poisson 03-01',
        scientificName: 'poisson 03-01',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // CONGO
    id: '03-02',
    img: '03-02',
    name: 'congo',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '03-02',
        img: '',
        commonName: 'poisson 03-02',
        scientificName: 'poisson 03-02',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // OCÉAN INDIEN
    id: '03-03',
    img: '03-03',
    name: 'océan indien',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '03-03',
        img: '',
        commonName: 'poisson 03-03',
        scientificName: 'poisson 03-03',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // AMAZONE
    id: '03-04',
    img: '03-04',
    name: 'amazone',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '03-04',
        img: '',
        commonName: 'poisson 03-04',
        scientificName: 'poisson 03-04',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
    /* fishes: [
      {
        id: 'arapaimaGigas',
        img: '', // à faire ------------
        commonName: 'arapaïma',
        scientificName: 'arapaima gigas',
        minLength: 147,
        maxLength: 451,
        minMass: 78569,
        maxMass: 253685,
      },
      
      // PACUS ---------------------------------------------------------
      {
        id: 'piaractusBrachypomus',
        img: '', // à faire ------------
        commonName: 'pacu',
        scientificName: 'piaractus brachypomus',
        minLength: 54,
        maxLength: 89,
        minMass: 11000,
        maxMass: 25000,
      },
      {
        id: 'colossomaMacropomum',
        img: '', // à faire ------------
        commonName: 'tambaqui',
        scientificName: 'colossoma macropomum',
        minLength: 63,
        maxLength: 109,
        minMass: 19142,
        maxMass: 41253,
      },

      // PIRANHAS ---------------------------------------------------------
      {
        id: 'pygocentrusNattereri',
        img: '', // à faire ------------
        commonName: 'piranha à ventre rouge',
        scientificName: 'pygocentrus nattereri',
        minLength: 21,
        maxLength: 46,
        minMass: 1873,
        maxMass: 3818,
      },
      {
        id: 'pygocentrusPiraya',
        img: '', // à faire ------------
        commonName: 'piranha à queue noire',
        scientificName: 'pygocentrus piraya',
        minLength: 24,
        maxLength: 52,
        minMass: 2154,
        maxMass: 4686,
      },
    ], */
  },

  // EXPERT =======================================================================================

  { // ATLANTIQUE NORD
    id: '04-01',
    img: '04-01',
    name: 'océan<br>atlantique nord',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '04-01',
        img: '',
        commonName: 'poisson 04-01',
        scientificName: 'poisson 04-01',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // MEKONG
    id: '04-02',
    img: '04-02',
    name: 'mekong',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '04-02',
        img: '',
        commonName: 'poisson 04-02',
        scientificName: 'poisson 04-02',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // OCÉAN AUSTRAL
    id: '04-03',
    img: '04-03',
    name: 'océan austral',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '04-03',
        img: '',
        commonName: 'poisson 04-03',
        scientificName: 'poisson 04-03',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // FOSSE DES MARIANNES
    id: '04-04',
    img: '04-04',
    name: 'fosse des<br>mariannes',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '04-04',
        img: '',
        commonName: 'poisson 04-04',
        scientificName: 'poisson 04-04',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },

  // BONUS ========================================================================================

  { // LA CABANE DE M. WADE
    id: '05-01',
    img: '05-01',
    name: 'la cabane de<br>M. Wade',
    spawnLine: 3,
    spawnColumn: 7,
    walkableCells: [
      'B6', 'B7', 'B8', 'B9', 'B10', 'B11',
      'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12',
      'D3', 'D4', 'D5', 'D12', 'D13', 'D14',
      'E1', 'E2', 'E3', 'E14', 'E15', 'E16',
      'F1', 'F2', 'F15', 'F16',
      'G1', 'G16',
      'H1', 'H16',
      'I1', 'I16',
      'J1', 'J16',
      'K1', 'K2', 'K15', 'K16',
      'L1', 'L2', 'L3', 'L4', 'L13', 'L14', 'L15', 'L16',
      'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16',
      'N1', 'N2', 'N3', 'N4', 'N5', 'N12', 'N13', 'N14', 'N15', 'N16',
      'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P15', 'P16',
    ],
    swimmableCells: [
      'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 
      'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13', 
      'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 
      'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 
      'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14', 'H15', 
      'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10', 'I11', 'I12', 'I13', 'I14', 'I15', 
      'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10', 'J11', 'J12', 'J13', 'J14', 'J15', 
      'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10', 'K11', 'K12', 'K13', 'K14', 
      'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 
    ],
    fishes: [
      {
        id: '05-01',
        img: '',
        commonName: 'poisson 05-01',
        scientificName: 'poisson 05-01',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // LES TEMPS ANCIENS
    id: '05-02',
    img: '05-02',
    name: 'les temps<br>anciens',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: '05-02',
        img: '',
        commonName: 'poisson 05-02',
        scientificName: 'poisson 05-02',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },

  // EXTENSIONS ===================================================================================

  { // MER ROUGE
    id: 'ext-01',
    img: 'ext-01',
    name: 'mer rouge',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: 'ext-01',
        img: '',
        commonName: 'poisson ext-01',
        scientificName: 'poisson ext-01',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
  { // JAPON
    id: 'ext-02',
    img: 'ext-02',
    name: 'japon',
    spawnLine: 2,
    spawnColumn: 3,
    walkableCells: ['B3'],
    swimmableCells: [
      'A2', 'A3', 'A4',
      'B2', 'B4',
      'C2', 'C3', 'C4'
    ],
    fishes: [
      {
        id: 'ext-02',
        img: '',
        commonName: 'poisson ext-02',
        scientificName: 'poisson ext-02',
        minLength: 22,
        maxLength: 32,
        minMass: 250,
        maxMass: 600,
      },
    ],
  },
];