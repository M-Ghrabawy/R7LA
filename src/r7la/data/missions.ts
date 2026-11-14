export type MissionCategory = 'moon' | 'mars' | 'deep-space';

export type AnimationCue =
  | 'blueprint'
  | 'liftoff'
  | 'cruise'
  | 'orbit'
  | 'landing'
  | 'deployment'
  | 'roving'
  | 'flight'
  | 'ascent'
  | 'dormant';

export type TerrainProfile =
  | 'crater-plain'
  | 'rille-ridge'
  | 'crater-rim'
  | 'flood-plain'
  | 'flat-dust'
  | 'none';

export interface SurfaceCoords {
  latDeg: number; // + North, - South
  lonDeg: number; // + East, - West
  siteName: string;
}

export interface MissionStage {
  id: string;
  sceneNumber: number;
  label: string;
  date: string;
  title: string;
  narration: string;
  durationSec: number;
  visualCue: AnimationCue;
}

export interface MissionSpec {
  label: string;
  value: string;
}

export interface SolarSystemPlacement {
  parentBody: 'moon' | 'mars' | 'ceres' | 'eros' | 'outer' | 'earth-trailing';
  /** Surface lat/lon pinning for Moon and Mars targets */
  surfaceCoords?: SurfaceCoords;
  /** Orbital distance (if deep space independent body) */
  orbitRadius?: number;
  /** Initial orbital angle in radians */
  orbitAngle?: number;
  /** Orbital inclination in radians */
  orbitInclination?: number;
}

export interface MissionArtifact {
  id: string;
  name: string;
  shortName: string;
  category: MissionCategory;
  categoryLabel: string;
  missionType: string;
  launchDate: string;
  endDate: string;
  destination: string;
  environmentType: 'moon' | 'mars' | 'asteroid-ceres' | 'asteroid-eros' | 'deep-space';
  terrainProfile: TerrainProfile;
  summary: string;
  specs: MissionSpec[];
  stages: MissionStage[];
  audioPath: string;
  glbPath: string;
  placement: SolarSystemPlacement;
}

export const MISSIONS: MissionArtifact[] = [
  {
    id: 'apollo-lunar-modules',
    name: 'Apollo Lunar Modules',
    shortName: 'Apollo LM',
    category: 'moon',
    categoryLabel: 'The Moon',
    missionType: 'Crewed Lunar Lander',
    launchDate: 'July 16, 1969',
    endDate: 'July 22, 1969',
    destination: 'Mare Tranquillitatis, Moon (0.67416° N, 23.47314° E)',
    environmentType: 'moon',
    terrainProfile: 'crater-plain',
    summary:
      'The two-stage spacecraft that carried astronauts to the lunar surface. Their octagonal descent stages—beginning with Apollo 11’s Eagle—remained behind on the Moon as launch pads.',
    specs: [
      { label: 'Launch Vehicle', value: 'Saturn 5 · Cape Canaveral' },
      { label: 'Surface Stay', value: '21 hours, 36 minutes (Apollo 11)' },
      { label: 'Samples Returned', value: '21.55 kg lunar rock & soil' },
      { label: 'Spacecraft Mass', value: '15,103 kg (Eagle)' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: '1969 Engineering Architecture',
        title: 'Two-Stage Lunar Lander Architecture',
        narration:
          'Weighing 15,103 kilograms, Apollo 11’s Lunar Module Eagle paired an octagonal gold-foil descent stage—housing four splayed landing legs and a throttleable descent engine—with a pressurized crew ascent stage.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'July 16, 1969',
        title: 'Saturn 5 Launch from Cape Canaveral',
        narration:
          'Stowed inside the Saturn 5 adapter, Eagle lifted off from Cape Canaveral on July 16, 1969 alongside the Command Service Module Columbia, embarking on the historic first crewed lunar landing mission.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: 'July 17 – 20, 1969',
        title: 'Lunar Orbit & Undocking',
        narration:
          'After entering lunar orbit, Commander Neil Armstrong and Lunar Module Pilot Buzz Aldrin entered Eagle and separated from Columbia on July 20, leaving Command Module Pilot Michael Collins orbiting overhead.',
        durationSec: 7,
        visualCue: 'orbit',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'July 20, 1969 · 20:17 UT',
        title: '756.3-Second Descent to Tranquility Base',
        narration:
          'Firing its descent engine for 756.3 seconds, Eagle navigated past boulder-strewn terrain and touched down in the Sea of Tranquility at 20:17 UT on July 20, 1969.',
        durationSec: 8,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'First Steps',
        date: 'July 20 – 21, 1969',
        title: 'First Human Footsteps on the Moon',
        narration:
          'Descending the ladder on Eagle’s forward leg, Armstrong and Aldrin became the first humans to walk on the Moon, deploying the Early Apollo Scientific Experiments Package and solar wind collector.',
        durationSec: 8,
        visualCue: 'deployment',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Samples',
        date: 'July 21, 1969',
        title: '21.55 Kilograms of Lunar Rock & Soil',
        narration:
          'During their extravehicular excursion across Tranquility Base, the crew documented the lunar regolith and sealed 21.55 kilograms of lunar rock and soil samples inside the ascent stage cabin.',
        durationSec: 7,
        visualCue: 'deployment',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'July 21 – 22, 1969',
        title: 'Ascent Ignition & Descent Stage Launch Pad',
        narration:
          'After 21 hours and 36 minutes on the surface, Eagle’s ascent stage fired its 15,000-newton engine at 17:54 UT, leaving the octagonal descent stage anchored permanently at Tranquility Base as a launch pad.',
        durationSec: 8,
        visualCue: 'ascent',
      },
    ],
    audioPath: '/audio/echo/apollo-lunar-modules.mp3',
    glbPath: '/models/artifacts/apollo-lunar-modules.glb',
    placement: {
      parentBody: 'moon',
      surfaceCoords: {
        latDeg: 0.67416,
        lonDeg: 23.47314,
        siteName: 'Mare Tranquillitatis',
      },
    },
  },
  {
    id: 'lunar-roving-vehicles',
    name: 'Apollo 15 Lunar Roving Vehicle',
    shortName: 'Apollo 15 LRV',
    category: 'moon',
    categoryLabel: 'The Moon',
    missionType: 'Electric Surface Rover',
    launchDate: 'July 26, 1971',
    endDate: 'August 2, 1971',
    destination: 'Mare Imbrium, Apennine Mountains (26.13239° N, 3.63330° E)',
    environmentType: 'moon',
    terrainProfile: 'rille-ridge',
    summary:
      'Three electric moon buggies driven by astronauts across Apollo 15, 16, and 17. First deployed with Apollo 15’s Falcon, the vehicles remain parked permanently on the Moon.',
    specs: [
      { label: 'Launch Vehicle', value: 'Saturn 5 · Cape Canaveral' },
      { label: 'Apollo 15 Traverse', value: '27.9 km across 3 EVAs' },
      { label: 'Operating Radius', value: 'Within 5 km of landing site' },
      { label: 'Samples Collected', value: '77.31 kg rock & soil' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: 'Electric Rover Architecture',
        title: 'Foldable Four-Wheel Electric Moon Buggy',
        narration:
          'Engineered with a lightweight tubular aluminum frame, four wire-mesh wheels, side-by-side crew seats, a T-bar hand controller, and an umbrella high-gain dish antenna, the LRV folded flat into the Lunar Module descent bay.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'July 26, 1971',
        title: 'Apollo 15 Saturn 5 Departure',
        narration:
          'Stowed inside Lunar Module Falcon, the first Lunar Roving Vehicle launched atop a Saturn 5 rocket from Cape Canaveral on July 26, 1971 with astronauts David Scott, Alfred Worden, and James Irwin.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: 'July 27 – 30, 1971',
        title: 'Approach to the Apennine Mountains',
        narration:
          'Entering lunar orbit aboard Endeavour, Scott and Irwin transferred into Falcon to descend toward the Mare Imbrium basin alongside the towering Apennine mountain range.',
        durationSec: 7,
        visualCue: 'orbit',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'July 30, 1971',
        title: 'Touchdown & Unloading at Hadley-Apennine',
        narration:
          'Falcon touched down safely near Hadley Rille on July 30, 1971. During the first moonwalk on July 31, the astronauts unfolded and lowered the electric LRV directly onto the dusty lunar regolith.',
        durationSec: 7,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'Traverse I',
        date: 'July 31 – Aug 1, 1971',
        title: 'Driving to Hadley Rille & Elbow Crater',
        narration:
          'Expanding exploration within a five-kilometer operating radius, Scott and Irwin drove across lunar slopes to examine Hadley Rille, Elbow Crater, and the base of the Apennines while broadcasting live TV.',
        durationSec: 8,
        visualCue: 'roving',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Traverse II',
        date: 'August 1 – 2, 1971',
        title: '27.9 Kilometers & 77.31 kg of Samples',
        narration:
          'Across three traverses totaling 27.9 kilometers—visiting Spur and Scarp Craters—the rover enabled the crew to collect 77.31 kilograms of ancient highland rock and soil.',
        durationSec: 8,
        visualCue: 'roving',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'August 2, 1971',
        title: 'Parked Permanently at Three Apollo Sites',
        narration:
          'After 66 hours and 55 minutes on the surface, Falcon lifted off on August 2, 1971. Like its two sister rovers from Apollo 16 and 17, the electric buggy remains parked permanently on the Moon.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/lunar-roving-vehicles.mp3',
    glbPath: '/models/artifacts/lunar-roving-vehicles.glb',
    placement: {
      parentBody: 'moon',
      surfaceCoords: {
        latDeg: 26.13239,
        lonDeg: 3.6333,
        siteName: 'Hadley-Apennine (Mare Imbrium)',
      },
    },
  },
  {
    id: 'alsep-packages',
    name: 'ALSEP & Retroreflectors',
    shortName: 'ALSEP / LRRR',
    category: 'moon',
    categoryLabel: 'The Moon',
    missionType: 'Surface Science Station',
    launchDate: 'November 14, 1969',
    endDate: 'September 30, 1977',
    destination: 'Oceanus Procellarum, Moon (3.0094° S, 23.4246° W)',
    environmentType: 'moon',
    terrainProfile: 'crater-plain',
    summary:
      'Apollo Lunar Surface Experiments Packages arrayed around a nuclear-powered central station. Emplaced by astronauts to transmit seismic, magnetic, and solar wind data long after departure.',
    specs: [
      { label: 'Power Source', value: 'SNAP-27 RTG (Plutonium-238, ~70 W)' },
      { label: 'Central Station', value: '25 kg · 58 cm helical antenna' },
      { label: 'Uplink / Downlink', value: '2119 MHz / 2278.5 MHz (Apollo 12)' },
      { label: 'Operations', value: 'Nov 19, 1969 – Sept 30, 1977' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: 'SNAP-27 & Instrument Array',
        title: 'Nuclear-Powered Autonomous Lunar Lab',
        narration:
          'Centered on a 25-kilogram command station with a 58-centimeter helical antenna, ALSEP drew continuous 70-watt electrical power from a plutonium-238 fueled SNAP-27 radioisotope thermoelectric generator.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'November 14, 1969',
        title: 'Apollo 12 Launch from Cape Canaveral',
        narration:
          'Carried inside the scientific equipment bay of Apollo 12’s Lunar Module Intrepid, the ALSEP station launched atop a Saturn 5 on November 14, 1969.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: 'November 15 – 18, 1969',
        title: 'Precision Trajectory to Oceanus Procellarum',
        narration:
          'Following a three-day translunar flight, Intrepid targeted a pinpoint landing site in Oceanus Procellarum, near the crater where Surveyor 3 had rested since 1967.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'November 19, 1969',
        title: 'Touchdown 180 Meters from Surveyor 3',
        narration:
          'On November 19, 1969, Intrepid touched down on Oceanus Procellarum roughly 180 meters from Surveyor 3, positioning the Apollo 12 crew to carry the ALSEP experiments across the plains.',
        durationSec: 7,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'Deployment',
        date: 'November 19, 1969',
        title: 'Emplacing Seismometer, Magnetometer & Solar Sensors',
        narration:
          'Astronauts fueled the finned SNAP-27 generator and linked the central station via flat ribbon cables to a passive seismometer, magnetometer, dust detector, and solar wind spectrometer.',
        durationSec: 8,
        visualCue: 'deployment',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Operations',
        date: '1969 – 1977',
        title: 'Recording the First Artificial Moonquake',
        narration:
          'Transmitting on 2278.5 MHz, the Apollo 12 ALSEP recorded seismic waves when Intrepid’s jettisoned ascent stage struck the Moon, forming part of a multi-site geophysical network.',
        durationSec: 8,
        visualCue: 'deployment',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'September 30, 1977',
        title: 'Nearly Eight Years of Continuous Data',
        narration:
          'Operating continuously through brutal lunar days and nights for nearly eight years, the Apollo 12 ALSEP and its sister arrays across the Moon were shut down on September 30, 1977.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/alsep-packages.mp3',
    glbPath: '/models/artifacts/alsep-packages.glb',
    placement: {
      parentBody: 'moon',
      surfaceCoords: {
        latDeg: -3.0094,
        lonDeg: -23.4246,
        siteName: 'Oceanus Procellarum (Apollo 12)',
      },
    },
  },
  {
    id: 'surveyor-landers',
    name: 'Surveyor 3',
    shortName: 'Surveyor 3',
    category: 'moon',
    categoryLabel: 'The Moon',
    missionType: 'Robotic Lunar Lander',
    launchDate: 'April 17, 1967',
    endDate: 'May 4, 1967',
    destination: 'Oceanus Procellarum, Moon (3° S, 23.41° W)',
    environmentType: 'moon',
    terrainProfile: 'crater-rim',
    summary:
      'Robotic probes sent in the 1960s to prove soft lunar landings were possible. Surveyor 3 tested soil bearing strength to confirm the Moon could support an Apollo Lunar Module.',
    specs: [
      { label: 'Launch Vehicle', value: 'Atlas Centaur · Launch Complex 36B' },
      { label: 'Spacecraft Mass', value: '997.9 kg (Surveyor-C)' },
      { label: 'TV Images', value: '6,326 surface pictures transmitted' },
      { label: 'Soil Strength', value: '~98 kPa (10 psi bearing strength)' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: '1960s Robotic Pathfinder',
        title: 'Open Tubular Truss & Surface Sampler',
        narration:
          'Built around an open triangular aluminum truss with three hinged legs and crushable footpads, the 997.9-kilogram Surveyor 3 carried a television camera, solar mast, planar antenna, and extendable soil scoop.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'April 17, 1967',
        title: 'Atlas Centaur Launch from Complex 36B',
        narration:
          'Designated Surveyor-C prior to launch, Surveyor 3 lifted off aboard an Atlas Centaur rocket from Cape Kennedy Launch Complex 36B on April 17, 1967.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: 'April 17 – 20, 1967',
        title: 'Direct Translunar Trajectory',
        narration:
          'Cruising directly toward Oceanus Procellarum over 65 hours, Surveyor 3 oriented its retro-rocket motor and Doppler radar system for an autonomous soft lunar descent.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'April 20, 1967',
        title: 'Two Bounces Inside a Lunar Crater',
        narration:
          'Reflective rocks confused Surveyor 3’s landing radar during final descent on April 20, 1967. Its vernier engines kept firing, causing the lander to bounce twice—up to 10 meters high—before settling inside a crater.',
        durationSec: 8,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'Imagery',
        date: 'April 20 – May 4, 1967',
        title: '6,326 Surface Photographs & Eclipse Views',
        narration:
          'Tilted on a 14-degree crater slope, Surveyor 3’s television camera returned 6,326 sharp surface images and even captured photographs of Earth eclipsing the Sun.',
        durationSec: 7,
        visualCue: 'deployment',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Soil Tests',
        date: 'April 21 – May 3, 1967',
        title: 'Digging Four Trenches & Confirming Apollo Safety',
        narration:
          'Its extendable surface sampler dug four trenches and ran bearing tests, measuring soil strength around 98 kilopascals—like wet sand—proving the regolith could safely support a crewed Apollo Lunar Module.',
        durationSec: 8,
        visualCue: 'deployment',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'May 4, 1967 · Revisited Nov 19, 1969',
        title: 'Lunar Silence & Apollo 12 Inspection',
        narration:
          'Contact ceased on May 4, 1967 after lunar sunset. Two and a half years later, on November 19, 1969, Apollo 12 astronauts Pete Conrad and Alan Bean walked down the crater slope to recover its camera and scoop.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/surveyor-landers.mp3',
    glbPath: '/models/artifacts/surveyor-landers.glb',
    placement: {
      parentBody: 'moon',
      surfaceCoords: {
        latDeg: -3.0,
        lonDeg: -23.41,
        siteName: 'Oceanus Procellarum (Surveyor Crater)',
      },
    },
  },
  {
    id: 'sojourner-rover',
    name: 'Sojourner',
    shortName: 'Sojourner',
    category: 'mars',
    categoryLabel: 'Mars',
    missionType: 'Mars Pathfinder Rover',
    launchDate: 'December 4, 1996',
    endDate: 'September 27, 1997',
    destination: 'Ares Vallis, Mars',
    environmentType: 'mars',
    terrainProfile: 'flood-plain',
    summary:
      'The first rover to operate on Mars, delivered in 1997 by the Mars Pathfinder lander inside a giant cocoon of airbags. Now permanently parked at Ares Vallis.',
    specs: [
      { label: 'Launch Vehicle', value: 'Delta II 7925 · Cape Canaveral' },
      { label: 'Rover Mass', value: '10.6 kg (23 lb) · 30 cm tall' },
      { label: 'Science Data', value: '550 rover images · 15+ rock analyses' },
      { label: 'Landing Method', value: 'Parachute & 15-bounce airbag system' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: 'Microrover Engineering',
        title: '10.6-Kilogram Six-Wheel Rocker-Bogie Rover',
        narration:
          'Standing only 30 centimeters tall and weighing 10.6 kilograms, Sojourner combined a top photovoltaic solar deck, gold-insulated warm electronics box, stereo front cameras, and six cleated rocker-bogie wheels.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'December 4, 1996',
        title: 'Delta II 7925 Launch to Mars',
        narration:
          'Tucked inside the Mars Pathfinder aeroshell, Sojourner launched aboard a Delta II 7925 rocket from Cape Canaveral on December 4, 1996.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: 'Dec 1996 – July 1997',
        title: 'Seven-Month Interplanetary Cruise',
        narration:
          'Pathfinder flew a direct seven-month trajectory toward Mars, aiming straight for Ares Vallis—an ancient, rock-strewn Martian flood plain.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'July 4, 1997',
        title: 'Parachute Entry & 15 Airbag Bounces',
        narration:
          'Entering the Martian atmosphere directly on July 4, 1997 without first entering orbit, Pathfinder deployed a parachute, fired retrorockets, and bounced 15 times inside giant inflated airbags before opening its petals.',
        durationSec: 8,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'Rollout',
        date: 'July 5, 1997',
        title: 'First Wheels on Martian Soil',
        narration:
          'On the night of July 5, 1997, Sojourner rolled down the lander’s rear ramp onto Mars, becoming the first robotic rover to traverse another planet.',
        durationSec: 7,
        visualCue: 'roving',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Science',
        date: 'July – Sept 1997',
        title: '550 Images & Over 15 Rock Chemistry Analyses',
        narration:
          'Operating for 83 days—far past its seven-day design life—Sojourner captured 550 images and pressed its rear Alpha Proton X-Ray Spectrometer against rocks like Barnacle Bill and Yogi for over 15 chemical analyses.',
        durationSec: 8,
        visualCue: 'roving',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'September 27, 1997',
        title: 'Parked Beside Carl Sagan Memorial Station',
        narration:
          'After returning 2.3 billion bits of imagery and weather evidence of a warmer, wetter ancient Mars, Pathfinder sent its final transmission on September 27, 1997, leaving Sojourner parked permanently at Ares Vallis.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/sojourner-rover.mp3',
    glbPath: '/models/artifacts/sojourner-rover.glb',
    placement: {
      parentBody: 'mars',
      surfaceCoords: {
        latDeg: 19.3,
        lonDeg: -33.5,
        siteName: 'Ares Vallis',
      },
    },
  },
  {
    id: 'spirit-opportunity',
    name: 'Spirit & Opportunity',
    shortName: 'Spirit & Opportunity',
    category: 'mars',
    categoryLabel: 'Mars',
    missionType: 'Mars Exploration Rovers',
    launchDate: 'January 3 & 24, 2004 (Landings)',
    endDate: '2010 / June 10, 2018',
    destination: 'Gusev Crater & Meridiani Planum, Mars',
    environmentType: 'mars',
    terrainProfile: 'crater-rim',
    summary:
      'Identical twin robot geologists that operated for years on opposite sides of Mars, confirming ancient standing water. Both are now inactive monuments to Mars exploration.',
    specs: [
      { label: 'Spirit Traverse', value: '4.8 miles (7.7 km) · 6-year lifespan' },
      { label: 'Opportunity Traverse', value: '28.06 miles (45.16 km) · 14+ years' },
      { label: 'Raw Imagery', value: '124,838 (Spirit) · 217,594 (Opportunity)' },
      { label: 'Key Finding', value: 'Confirmed ancient standing liquid water' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: 'Twin Robot Geologists',
        title: 'Solar-Powered Mars Exploration Rover Twins',
        narration:
          'Built as identical robotic field geologists, Spirit and Opportunity carried winged solar decks, panoramic camera masts, steerable high-gain dishes, six-wheel rocker-bogie suspensions, and articulated science arms.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: '2003 Mars Launch Window',
        title: 'Dual Launches Toward the Red Planet',
        narration:
          'Dispatched in 2003 to search the Martian rock record for clues of past water activity, the twin rovers embarked on separate trajectories toward opposite Martian hemispheres.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: '2003 – Jan 2004',
        title: 'Targeting Opposite Sides of Mars',
        narration:
          'Spirit targeted Gusev Crater—a suspected ancient lakebed—while Opportunity aimed halfway around the planet for the mineral-rich flatlands of Meridiani Planum.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'January 3 & 24, 2004',
        title: 'Airbag Touchdowns at Gusev & Meridiani',
        narration:
          'Protected by parachutes and airbag cocoons, Spirit bounced down into Gusev Crater on January 3, 2004, followed three weeks later by Opportunity rolling into a small crater on Meridiani Planum on January 24.',
        durationSec: 8,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'Water Proof',
        date: '2004 – 2010',
        title: 'Spirit Climbs Columbia Hills & Confirms Past Water',
        narration:
          'Designed originally for 90-day missions, Spirit drove 7.7 kilometers across Gusev Crater and the Columbia Hills, returning 124,838 raw images and uncovering mineral signatures of ancient water before finishing in 2010.',
        durationSec: 8,
        visualCue: 'roving',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Marathon',
        date: '2004 – 2018',
        title: 'Opportunity’s 45.16-Kilometer Marathon Across Craters',
        narration:
          'Opportunity explored Eagle, Endurance, Victoria, and Endeavour craters for over 14 years, driving 45.16 kilometers and returning 217,594 images that confirmed long-standing liquid water once existed on Mars.',
        durationSec: 8,
        visualCue: 'roving',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'June 10, 2018',
        title: 'Planetary Dust Storm & Enduring Monuments',
        narration:
          'On June 10, 2018, a planet-encircling dust storm starved Opportunity’s solar arrays of sunlight. Both Spirit and Opportunity now rest permanently as silent monuments across Mars.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/spirit-opportunity.mp3',
    glbPath: '/models/artifacts/spirit-opportunity.glb',
    placement: {
      parentBody: 'mars',
      surfaceCoords: {
        latDeg: -14.57,
        lonDeg: 175.47,
        siteName: 'Gusev Crater & Meridiani Planum',
      },
    },
  },
  {
    id: 'viking-1-2',
    name: 'Viking 1 & 2 Landers',
    shortName: 'Viking 1 & 2',
    category: 'mars',
    categoryLabel: 'Mars',
    missionType: 'Orbiter & Lander Pair',
    launchDate: 'August 20, 1975',
    endDate: 'November 11, 1982',
    destination: 'Chryse Planitia, Mars (22.483° N, 47.94° W)',
    environmentType: 'mars',
    terrainProfile: 'flood-plain',
    summary:
      'The first U.S. landers to successfully operate on Mars, touching down in 1976 to capture the first surface panoramas and analyze Martian soil. They remain where they landed.',
    specs: [
      { label: 'Launch Vehicle', value: 'Titan IIIE-Centaur · Complex 41' },
      { label: 'Lander Power', value: 'Two SNAP-19 RTGs' },
      { label: 'Orbiter & Lander Photos', value: '52,663 orbiter · 4,500 lander' },
      { label: 'Lander Mass', value: '978 kg (2,156 lb)' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: 'Orbiter & Lander System',
        title: 'Nuclear-Powered Biology & Imaging Lander',
        narration:
          'Weighing 978 kilograms, each hexagonal Viking lander carried twin SNAP-19 nuclear generators under protective wind covers, two facsimile cameras, an S-band high-gain dish, meteorology sensors, and a soil sampler boom.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'August 20, 1975',
        title: 'Titan IIIE-Centaur Launch from Complex 41',
        narration:
          'Viking 1 launched aboard a Titan IIIE-Centaur rocket from Cape Canaveral Launch Complex 41 on August 20, 1975, followed shortly by its twin Viking 2 spacecraft.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: 'June 19 – July 19, 1976',
        title: 'Mars Orbit Insertion & Landing Site Survey',
        narration:
          'Entering Mars orbit on June 19, 1976, the Viking 1 orbiter spent a month photographing Chryse Planitia to certify a safe, hazard-free landing site before releasing the lander.',
        durationSec: 7,
        visualCue: 'orbit',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'July 20, 1976',
        title: 'First Safe U.S. Landing on Mars',
        narration:
          'Separating from its orbiter and braking with aeroshell, parachute, and three terminal descent engines, Viking Lander 1 touched down safely on Chryse Planitia on July 20, 1976.',
        durationSec: 8,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'Panoramas',
        date: '1976 – 1982',
        title: 'First Surface Panoramas of Mars',
        narration:
          'Minutes after touchdown, Viking 1 transmitted the first clear surface photographs of Mars. Together, the Viking landers captured 4,500 surface images—including 300-degree color panoramas—while orbiters returned 52,663 photos.',
        durationSec: 8,
        visualCue: 'deployment',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Soil Lab',
        date: '1976 – 1980',
        title: 'Robotic Scoop Soil & Meteorology Experiments',
        narration:
          'Extending its remote collector boom into Martian regolith, Viking analyzed soil samples for organic compounds and sulfur while recording daily atmospheric pressure, wind speed, and seasonal temperature cycles.',
        durationSec: 8,
        visualCue: 'deployment',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'November 11, 1982',
        title: 'Thomas Mutch Memorial Station',
        narration:
          'Renamed the Thomas Mutch Memorial Station in January 1982, Viking Lander 1 operated for over six years until a faulty command from Earth ended contact on November 11, 1982, remaining exactly where it landed.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/viking-1-2.mp3',
    glbPath: '/models/artifacts/viking-1-2.glb',
    placement: {
      parentBody: 'mars',
      surfaceCoords: {
        latDeg: 22.483,
        lonDeg: -47.94,
        siteName: 'Chryse Planitia (Viking 1)',
      },
    },
  },
  {
    id: 'lunokhod-1',
    name: 'Lunokhod 1',
    shortName: 'Lunokhod 1',
    category: 'moon',
    categoryLabel: 'The Moon',
    missionType: 'Soviet Lunar Rover',
    launchDate: 'November 10, 1970',
    endDate: 'September 14, 1971',
    destination: 'Mare Imbrium, Moon (38.28° N, 35.00° W)',
    environmentType: 'moon',
    terrainProfile: 'crater-plain',
    summary:
      'The first remote-controlled rover to drive on another world. Delivered by Luna 17, Lunokhod 1 covered 10.5 kilometres across Mare Imbrium and returned more than 20,000 images before its final transmission in September 1971.',
    specs: [
      { label: 'Launch Vehicle', value: 'Proton-K / D · Baikonur' },
      { label: 'Rover Mass', value: '756 kg (1,667 lb)' },
      { label: 'Distance Driven', value: '10.54 km over 322 days' },
      { label: 'Science Return', value: '20,000+ images · 25 soil analyses' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: '1969–1970 Engineering',
        title: 'An Eight-Wheeled Bathtub With a Lid',
        narration:
          'Lunokhod 1 was a sealed, pressurised tub carried on eight independently driven wheels. A hinged lid covered a solar array on top, opened during the lunar day, and served as a radiator at night.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'November 10, 1970',
        title: 'Luna 17 Launches From Baikonur',
        narration:
          'Luna 17 lifted off on a Proton-K rocket on 10 November 1970, carrying the 756-kilogram Lunokhod 1 inside its descent stage.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: 'November 10 – 15, 1970',
        title: 'Four-Day Translunar Coast',
        narration:
          'The spacecraft coasted toward the Moon for four days before entering lunar orbit and preparing for a powered descent into Mare Imbrium.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'November 17, 1970',
        title: 'Touchdown in Mare Imbrium',
        narration:
          'Luna 17 landed at 38.28 degrees north and 35.0 degrees west on 17 November 1970. Two ramps deployed from the descent stage so the rover could roll onto the lunar surface.',
        durationSec: 8,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'Rollout',
        date: 'November 17, 1970',
        title: 'First Wheels on Another World',
        narration:
          'Lunokhod 1 rolled down its ramp and became the first rover to operate on another celestial body, driven by a five-person team on Earth using television images.',
        durationSec: 7,
        visualCue: 'deployment',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Science',
        date: '1970–1971',
        title: '10.5 Kilometres of Lunar Traverse',
        narration:
          'Across ten and a half lunar days the rover photographed the surface, measured soil mechanics, analysed regolith composition with X-ray spectrometry, and carried a French laser reflector.',
        durationSec: 8,
        visualCue: 'roving',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'September 14, 1971',
        title: 'Final Transmission From Luna 17',
        narration:
          'Lunokhod 1 sent its last transmission on 14 September 1971, after 322 days of operation. The rover remains in Mare Imbrium, still detectable by its laser reflector.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/lunokhod-1.mp3',
    glbPath: '/models/artifacts/lunokhod-1.glb',
    placement: {
      parentBody: 'moon',
      surfaceCoords: {
        latDeg: 38.28,
        lonDeg: -35.0,
        siteName: 'Mare Imbrium',
      },
    },
  },
  {
    id: 'curiosity',
    name: 'Curiosity',
    shortName: 'Curiosity',
    category: 'mars',
    categoryLabel: 'Mars',
    missionType: 'Mars Science Laboratory Rover',
    launchDate: 'November 26, 2011',
    endDate: 'Present',
    destination: 'Gale Crater, Mars (4.59° S, 137.44° E)',
    environmentType: 'mars',
    terrainProfile: 'crater-plain',
    summary:
      'A car-sized nuclear-powered laboratory lowered into Gale Crater by sky crane in 2012. Curiosity established that ancient Mars offered fresh water, essential chemical ingredients, and habitable conditions.',
    specs: [
      { label: 'Launch Vehicle', value: 'Atlas V 541 · Cape Canaveral' },
      { label: 'Rover Mass', value: '899 kg (1,982 lb)' },
      { label: 'Landing Site', value: 'Gale Crater · Aeolis Palus' },
      { label: 'Power Source', value: 'Radioisotope thermoelectric generator' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: '2004–2011 Engineering',
        title: 'A Laboratory on Six Wheels',
        narration:
          'Curiosity carries a drill, a laser spectrometer, an X-ray diffractometer, and a gas chromatograph inside a 899-kilogram chassis designed to operate for years on nuclear power.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'November 26, 2011',
        title: 'Atlas V 541 Departs Cape Canaveral',
        narration:
          'The Mars Science Laboratory spacecraft launched on 26 November 2011 aboard an Atlas V 541, the most powerful configuration used for a Mars mission at the time.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: 'November 2011 – August 2012',
        title: 'Nine Months to Gale Crater',
        narration:
          'During its interplanetary cruise the spacecraft checked its guidance, exercised the rover, and refined the entry target toward the floor of Gale Crater.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'August 6, 2012',
        title: 'Seven Minutes of Terror and a Sky Crane',
        narration:
          'After a heat-shield entry and parachute descent, Curiosity was lowered on cables from a rocket-powered sky crane and touched down at Aeolis Palus on 6 August 2012.',
        durationSec: 8,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'First Drive',
        date: 'August 22, 2012',
        title: 'Wheels Turn on Martian Soil',
        narration:
          'Curiosity drove for the first time on 22 August 2012, leaving its landing ellipse and beginning the climb toward the layered rocks of Mount Sharp.',
        durationSec: 7,
        visualCue: 'roving',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Science',
        date: '2013–2018',
        title: 'Ancient Lakes and Organic Molecules',
        narration:
          'At Yellowknife Bay the rover found clay minerals and a ancient lakebed with the chemical ingredients needed for life. Later analyses detected organic molecules preserved in Gale Crater rocks.',
        durationSec: 8,
        visualCue: 'roving',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'Present',
        title: 'Still Climbing Mount Sharp',
        narration:
          'Curiosity remains active in Gale Crater, climbing through progressively younger rock layers and extending a record of Martian habitability that began more than a decade ago.',
        durationSec: 8,
        visualCue: 'roving',
      },
    ],
    audioPath: '/audio/echo/curiosity.mp3',
    glbPath: '/models/artifacts/curiosity.glb',
    placement: {
      parentBody: 'mars',
      surfaceCoords: {
        latDeg: -4.59,
        lonDeg: 137.44,
        siteName: 'Gale Crater',
      },
    },
  },
  {
    id: 'perseverance',
    name: 'Perseverance',
    shortName: 'Perseverance',
    category: 'mars',
    categoryLabel: 'Mars',
    missionType: 'Mars 2020 Sample-Caching Rover',
    launchDate: 'July 30, 2020',
    endDate: 'Present',
    destination: 'Jezero Crater, Mars (18.44° N, 77.45° E)',
    environmentType: 'mars',
    terrainProfile: 'crater-plain',
    summary:
      'The Mars 2020 rover landed in Jezero Crater in 2021 to search for signs of ancient life, cache rock cores for future return, and deploy the Ingenuity helicopter on the first powered flight over another world.',
    specs: [
      { label: 'Launch Vehicle', value: 'Atlas V 541 · Cape Canaveral' },
      { label: 'Rover Mass', value: '1,025 kg (2,260 lb)' },
      { label: 'Landing Site', value: 'Jezero Crater · ancient river delta' },
      { label: 'Payload', value: '23 cameras · 2 microphones · 8 sample tubes' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: '2014–2020 Engineering',
        title: 'A Rover Built to Cache Samples',
        narration:
          'Perseverance inherited the Curiosity chassis and added a coring drill, a sample-handling carousel, and sealed titanium tubes intended to preserve Martian rock for return to Earth.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'July 30, 2020',
        title: 'Mars 2020 Leaves Earth',
        narration:
          'The spacecraft launched on 30 July 2020 aboard an Atlas V 541, beginning a seven-month journey to Jezero Crater during a narrow planetary launch window.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: 'July 2020 – February 2021',
        title: 'Seven Months to Jezero',
        narration:
          'During cruise the team rehearsed entry, descent, and landing while the spacecraft monitored its own health and tracked the position of Mars.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'February 18, 2021',
        title: 'Touchdown in Jezero Crater',
        narration:
          'Perseverance entered the Martian atmosphere at nearly 20,000 kilometres per hour and was lowered by sky crane onto the floor of Jezero Crater on 18 February 2021.',
        durationSec: 8,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'First Flight',
        date: 'April 19, 2021',
        title: 'Ingenuity Flies From the Martian Surface',
        narration:
          'The Ingenuity helicopter, carried beneath the rover, made the first powered flight on another planet. Perseverance recorded the flight and acted as its communications relay.',
        durationSec: 7,
        visualCue: 'flight',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Sampling',
        date: 'September 2021 onward',
        title: 'First Cored Rock in the Delta',
        narration:
          'The rover drilled and sealed its first rock cores in Jezero Crater, building a catalogue of samples from an ancient river delta and lakebed.',
        durationSec: 8,
        visualCue: 'roving',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'Present',
        title: 'A Depot Waiting for Return',
        narration:
          'Perseverance remains active in Jezero Crater, caching samples for a future Mars Sample Return campaign and continuing to explore the delta front.',
        durationSec: 8,
        visualCue: 'roving',
      },
    ],
    audioPath: '/audio/echo/perseverance.mp3',
    glbPath: '/models/artifacts/perseverance.glb',
    placement: {
      parentBody: 'mars',
      surfaceCoords: {
        latDeg: 18.44,
        lonDeg: 77.45,
        siteName: 'Jezero Crater',
      },
    },
  },
  {
    id: 'mars-pathfinder',
    name: 'Mars Pathfinder Lander',
    shortName: 'Pathfinder Lander',
    category: 'mars',
    categoryLabel: 'Mars',
    missionType: 'Mars Lander and Rover Carrier',
    launchDate: 'December 4, 1996',
    endDate: 'September 27, 1997',
    destination: 'Ares Vallis, Mars (19.13° N, 33.22° W)',
    environmentType: 'mars',
    terrainProfile: 'flood-plain',
    summary:
      'The tetrahedral lander that opened like a flower on Mars in 1997 and released Sojourner, the first rover on another planet. It returned weather data and images for 83 days from Ares Vallis.',
    specs: [
      { label: 'Launch Vehicle', value: 'Delta II 7925 · Cape Canaveral' },
      { label: 'Lander Mass', value: '264 kg (582 lb)' },
      { label: 'Landing Method', value: 'Parachute · retrorockets · airbags' },
      { label: 'Surface Lifetime', value: '83 days (designed for 30)' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: '1993–1996 Engineering',
        title: 'A Tetrahedral Lander That Opens Like a Flower',
        narration:
          'Pathfinder used four triangular petals folded around the lander body. Once on the surface the petals opened to right the spacecraft and expose the solar panels and rover ramp.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'December 4, 1996',
        title: 'Delta II Launches the First Discovery Mission',
        narration:
          'Mars Pathfinder lifted off on 4 December 1996 aboard a Delta II 7925, the first launch in NASA Discovery programme.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: 'December 1996 – July 1997',
        title: 'A Direct Seven-Month Trajectory',
        narration:
          'Unlike earlier Mars missions, Pathfinder flew directly to Mars without first entering orbit, aiming for the ancient flood plain of Ares Vallis.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'July 4, 1997',
        title: 'Airbags and Fifteen Bounces',
        narration:
          'The lander entered the atmosphere on 4 July 1997, deployed a parachute, fired retrorockets, and bounced across the surface inside inflated airbags before coming to rest.',
        durationSec: 8,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'Deployment',
        date: 'July 5, 1997',
        title: 'Petals Open at Ares Vallis',
        narration:
          'The four petals opened and stood the lander upright. Sojourner rolled down a rear ramp on 5 July 1997, becoming the first rover to operate on Mars.',
        durationSec: 7,
        visualCue: 'deployment',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Science',
        date: 'July – September 1997',
        title: 'Weather, Images, and Rock Chemistry',
        narration:
          'The lander returned panoramic images, atmospheric pressure and temperature records, and supported Sojourner as it analysed rocks around the landing site.',
        durationSec: 8,
        visualCue: 'roving',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'September 27, 1997',
        title: 'Carl Sagan Memorial Station Falls Silent',
        narration:
          'Pathfinder sent its final transmission on 27 September 1997, after 83 days of operation. The lander was later named the Carl Sagan Memorial Station and remains at Ares Vallis.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/mars-pathfinder.mp3',
    glbPath: '/models/artifacts/mars-pathfinder.glb',
    placement: {
      parentBody: 'mars',
      surfaceCoords: {
        latDeg: 19.13,
        lonDeg: -33.22,
        siteName: 'Ares Vallis',
      },
    },
  },
  {
    id: 'phoenix-insight',
    name: 'Phoenix & InSight Landers',
    shortName: 'Phoenix & InSight',
    category: 'mars',
    categoryLabel: 'Mars',
    missionType: 'Stationary Geophysical Landers',
    launchDate: 'May 5, 2018 (InSight)',
    endDate: 'December 15, 2022',
    destination: 'Elysium Planitia, Mars (4.5° N, 135.9° E)',
    environmentType: 'mars',
    terrainProfile: 'flat-dust',
    summary:
      'Stationary Mars landers sharing a proven spacecraft heritage: Phoenix dug for water ice, while InSight listened to marsquakes and Martian winds until losing solar power.',
    specs: [
      { label: 'Launch Vehicle', value: 'Atlas V-401 · Vandenberg AFB' },
      { label: 'Robotic Arm', value: '1.8 meters (5 ft 9 in) reach' },
      { label: 'Instruments', value: 'Seismometer & heat flow probe' },
      { label: 'End of Mission', value: 'December 15, 2022' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: 'Shared Phoenix Heritage',
        title: 'Tripod Deck & UltraFlex Circular Solar Wings',
        narration:
          'InSight inherited the proven three-legged lander design and twin fan-folded circular solar arrays of NASA’s Mars Phoenix lander, adding a 1.8-meter robotic arm, precision seismometer, and heat flow probe.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'May 5, 2018',
        title: 'Atlas V-401 Launch from Vandenberg',
        narration:
          'Launching from Vandenberg Air Force Base in California on May 5, 2018 aboard an Atlas V-401 rocket, InSight set out to study the deep interior of Mars.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: 'May – Nov 2018',
        title: 'Six-Month Cruise to Elysium Planitia',
        narration:
          'Across a six-month cruise, engineers monitored InSight’s trajectory toward Elysium Planitia—a broad, flat volcanic plain ideal for deploying sensitive geophysical instruments.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'November 26, 2018',
        title: 'Powered Touchdown on Elysium Planitia',
        narration:
          'On November 26, 2018, InSight braked through the thin Martian atmosphere and touched down gently on Elysium Planitia, unfurling its twin circular solar arrays to soak up Martian sunlight.',
        durationSec: 8,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'Deployment',
        date: 'Dec 2018 – Feb 2019',
        title: 'Robotic Arm Places Seismometer Directly on Soil',
        narration:
          'Using its 1.8-meter robotic arm, InSight became the first mission to lift a domed seismometer and heat flow probe off a lander deck and place them directly onto the Martian surface.',
        durationSec: 8,
        visualCue: 'deployment',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Marsquakes',
        date: '2018 – 2022',
        title: 'Listening to Marsquakes & Martian Winds',
        narration:
          'While Phoenix had previously dug trenches to confirm Martian water ice, InSight captured the haunting low rumble of Martian winds and measured seismic marsquakes to map Mars’ deep interior.',
        durationSec: 8,
        visualCue: 'deployment',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'December 15, 2022',
        title: 'Dust-Blanketed Arrays & Mission Conclusion',
        narration:
          'As fine Martian dust steadily accumulated on its twin circular solar wings, electrical power dropped below operational thresholds, ending InSight’s historic geophysical watch on December 15, 2022.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/phoenix-insight.mp3',
    glbPath: '/models/artifacts/phoenix-insight.glb',
    placement: {
      parentBody: 'mars',
      surfaceCoords: {
        latDeg: 4.5,
        lonDeg: 135.9,
        siteName: 'Elysium Planitia (InSight)',
      },
    },
  },
  {
    id: 'ingenuity-helicopter',
    name: 'Ingenuity',
    shortName: 'Ingenuity',
    category: 'mars',
    categoryLabel: 'Mars',
    missionType: 'Planetary Rotorcraft',
    launchDate: 'July 30, 2020',
    endDate: 'January 25, 2024',
    destination: 'Jezero Crater, Mars',
    environmentType: 'mars',
    terrainProfile: 'crater-rim',
    summary:
      'The first aircraft to achieve powered, controlled flight on another planet. After 72 historic flights across nearly three years, it sustained rotor damage and became a stationary artifact.',
    specs: [
      { label: 'Flights Completed', value: '72 flights · 128.8 flying minutes' },
      { label: 'Distance & Altitude', value: '17.0 km (10.5 mi) · max 24.0 m high' },
      { label: 'Mass & Rotor Span', value: '1.8 kg · ~1.2 m (4 ft) tip to tip' },
      { label: 'First / Last Flight', value: 'April 19, 2021 / Jan 18, 2024' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: '1.8 kg Mars Rotorcraft',
        title: 'Ultralight Coaxial Blades for Thin Martian Air',
        narration:
          'Weighing just 1.8 kilograms, Ingenuity combined a gold-insulated avionics cube, four splayed carbon-fiber legs, a top solar panel, and counter-rotating 1.2-meter carbon-fiber rotor blades engineered for Mars’ thin atmosphere.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'July 30, 2020',
        title: 'Riding Beneath Perseverance from Cape Canaveral',
        narration:
          'Folded neatly beneath the belly of the Perseverance rover, Ingenuity launched from Cape Canaveral on July 30, 2020 aboard an Atlas V rocket bound for Mars.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: 'July 2020 – Feb 2021',
        title: 'Protected Cruise Beneath Perseverance',
        narration:
          'Shielded inside the Mars 2020 entry capsule for nearly seven months, Ingenuity received periodic battery top-offs while flying toward Jezero Crater.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Landing',
        date: 'Feb 18 – April 3, 2021',
        title: 'Jezero Crater Touchdown & Belly Drop',
        narration:
          'Perseverance landed in Jezero Crater on February 18, 2021. In late March and early April, the rover unfolded Ingenuity vertically and dropped it gently onto the Martian surface.',
        durationSec: 7,
        visualCue: 'landing',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'First Flight',
        date: 'April 19, 2021',
        title: 'First Powered Flight on Another Planet',
        narration:
          'On April 19, 2021, Ingenuity spun its twin rotors and lifted off, hovering above Wright Brothers Field in Jezero Crater to achieve the first powered, controlled flight on another planet.',
        durationSec: 8,
        visualCue: 'flight',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: '72 Flights',
        date: '2021 – Jan 2024',
        title: '17 Kilometers & 128.8 Minutes as Aerial Scout',
        narration:
          'Originally planned as a five-flight technology demonstration, Ingenuity completed 72 flights—totaling 128.8 flying minutes, climbing as high as 24 meters, and covering 17 kilometers scouting ahead for Perseverance.',
        durationSec: 8,
        visualCue: 'flight',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'January 25, 2024',
        title: 'Rotor Damage & Stationary Aviation Pioneer',
        narration:
          'During its 72nd and final flight on January 18, 2024, Ingenuity sustained rotor damage upon landing. NASA officially concluded the mission on January 25, 2024, leaving it in Jezero Crater as an enduring pioneer.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/ingenuity-helicopter.mp3',
    glbPath: '/models/artifacts/ingenuity-helicopter.glb',
    placement: {
      parentBody: 'mars',
      surfaceCoords: {
        latDeg: 18.38,
        lonDeg: 77.58,
        siteName: 'Jezero Crater',
      },
    },
  },
  {
    id: 'dawn-spacecraft',
    name: 'Dawn',
    shortName: 'Dawn',
    category: 'deep-space',
    categoryLabel: 'Deep Space',
    missionType: 'Interplanetary Asteroid Orbiter',
    launchDate: 'September 27, 2007',
    endDate: 'Perpetual Orbit at Ceres',
    destination: 'Main Asteroid Belt (Vesta & Ceres)',
    environmentType: 'asteroid-ceres',
    terrainProfile: 'none',
    summary:
      'NASA’s first truly interplanetary spaceship, visiting giant asteroid Vesta and dwarf planet Ceres. Having run out of fuel, Dawn remains in a perpetual, unpowered orbit around Ceres.',
    specs: [
      { label: 'Launch Date', value: 'September 27, 2007' },
      { label: 'Primary Targets', value: 'Giant asteroid Vesta & dwarf planet Ceres' },
      { label: 'Key Findings', value: 'Gullies on Vesta · Core heating & organics on Ceres' },
      { label: 'Current State', value: 'Perpetual, unpowered orbit around Ceres' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: 'Ion-Propulsion Spaceship',
        title: 'Twin Solar Wings & Xenon Ion Propulsion',
        narration:
          'Engineered as NASA’s first truly interplanetary spaceship, Dawn paired an aluminum-composite bus and parabolic dish with massive twin solar wings powering three xenon ion thrusters.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'September 27, 2007',
        title: 'Launch Toward the Main Asteroid Belt',
        narration:
          'Dawn lifted off on September 27, 2007, beginning a long, efficient ion-propelled spiral outward toward the debris-strewn main asteroid belt between Mars and Jupiter.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: '2007 – 2011',
        title: 'Continuous Xenon Ion Acceleration',
        narration:
          'Firing a faint blue stream of ionized xenon gas for thousands of hours, Dawn gradually reshaped its solar orbit to match and enter orbit around two separate worlds.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Vesta',
        date: 'Extended Stay at Vesta',
        title: 'Orbiting Giant Protoplanet Vesta',
        narration:
          'Dawn entered orbit around giant asteroid Vesta, descending through nested mapping orbits to study a dry, rocky remnant from the dawn of the Solar System.',
        durationSec: 7,
        visualCue: 'orbit',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'Vesta Data',
        date: 'Vesta Reconnaissance',
        title: 'Revealing Vesta’s Interior & Surface Gullies',
        narration:
          'Mapping Vesta in unprecedented detail, Dawn revealed its iron core structure and discovered unexpected gullies carved into crater walls before firing its ion engine once more to depart.',
        durationSec: 8,
        visualCue: 'orbit',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Ceres',
        date: 'Extended Stay at Ceres',
        title: 'Organics, Rock & Core Heating on Dwarf Planet Ceres',
        narration:
          'Arriving to orbit dwarf planet Ceres, Dawn uncovered a complex world of rock, organic compounds, bright salt deposits, and evidence of past fluid flow driven by internal core heating.',
        durationSec: 8,
        visualCue: 'orbit',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'Perpetual Orbit',
        title: 'Unpowered Sentinel Circling Ceres',
        narration:
          'After completing the first mission to orbit two extraterrestrial bodies beyond the Earth-Moon system, Dawn exhausted its fuel and remains locked in a perpetual, unpowered orbit around Ceres.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/dawn-spacecraft.mp3',
    glbPath: '/models/artifacts/dawn-spacecraft.glb',
    placement: {
      parentBody: 'ceres',
      orbitRadius: 21.5,
      orbitAngle: 0.9,
      orbitInclination: 0.14,
    },
  },
  {
    id: 'near-shoemaker',
    name: 'NEAR Shoemaker',
    shortName: 'NEAR Shoemaker',
    category: 'deep-space',
    categoryLabel: 'Deep Space',
    missionType: 'Asteroid Orbiter & Lander',
    launchDate: 'February 17, 1996',
    endDate: 'February 28, 2001',
    destination: 'Asteroid 433 Eros (South of Himeros)',
    environmentType: 'asteroid-eros',
    terrainProfile: 'crater-rim',
    summary:
      'The first spacecraft to orbit an asteroid and the first to land on one. Though not designed as a lander, it survived touchdown on 433 Eros and still rests on its surface.',
    specs: [
      { label: 'Launch Vehicle', value: 'Delta 7925-8 · Launch Complex 17B' },
      { label: 'Spacecraft Mass', value: '805 kg (1,775 lb)' },
      { label: 'Science Return', value: '160,000 images · >70% Eros mapped' },
      { label: 'Touchdown Speed', value: '6.4 km/h (4 mph) on Feb 12, 2001' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: '805 kg Asteroid Orbiter',
        title: 'Gold-Blanketed Bus & Four Windmill Solar Wings',
        narration:
          'Weighing 805 kilograms, the Near Earth Asteroid Rendezvous spacecraft featured a gold-foil octagonal bus, a fixed 1.5-meter parabolic dish, four radial solar wings, and an X-ray/gamma-ray spectrometer.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'February 17, 1996',
        title: 'Delta 7925-8 Launch from Complex 17B',
        narration:
          'Launched on February 17, 1996 aboard a Delta 7925-8 rocket from Cape Canaveral Launch Complex 17B, NEAR became the first mission in NASA’s Discovery program.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Transit',
        date: '1997 – 1998',
        title: 'Asteroid 253 Mathilde Flyby & Earth Gravity Assist',
        narration:
          'En route to Eros, NEAR flew past asteroid 253 Mathilde in 1997 and swung past Earth for a gravity assist in 1998, bending its orbital plane to match its target.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Orbit',
        date: 'February 14, 2000',
        title: 'First Spacecraft Ever to Orbit an Asteroid',
        narration:
          'On February 14, 2000, NEAR fired its engines to enter orbit around 433 Eros—becoming the first human-made spacecraft in history to orbit an asteroid, and was renamed NEAR Shoemaker.',
        durationSec: 8,
        visualCue: 'orbit',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'Mapping',
        date: '2000 – 2001',
        title: '160,000 Images & Over 70% of Eros Mapped',
        narration:
          'Honoring geologist Eugene Shoemaker, the spacecraft swooped within kilometers of the peanut-shaped asteroid, capturing 160,000 images and mapping more than 70 percent of 433 Eros.',
        durationSec: 8,
        visualCue: 'orbit',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Touchdown',
        date: 'February 12, 2001',
        title: 'Controlled 4-mph Descent South of Himeros',
        narration:
          'Though never built with landing gear, engineers commanded NEAR Shoemaker to descend gently at just 6.4 kilometers per hour—4 miles per hour—making the first-ever landing on an asteroid south of Himeros.',
        durationSec: 8,
        visualCue: 'landing',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'February 28, 2001',
        title: 'Final Gamma-Ray Data in Minus 173°C Cold',
        narration:
          'Remarkably surviving touchdown intact, NEAR Shoemaker transmitted close-up gamma-ray spectrometer measurements for two more weeks until February 28, 2001, resting silently on 433 Eros at minus 173 degrees Celsius.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/near-shoemaker.mp3',
    glbPath: '/models/artifacts/near-shoemaker.glb',
    placement: {
      parentBody: 'eros',
      orbitRadius: 15.8,
      orbitAngle: 4.1,
      orbitInclination: 0.18,
    },
  },
  {
    id: 'pioneer-10-11',
    name: 'Pioneer 10 & 11',
    shortName: 'Pioneer 10 & 11',
    category: 'deep-space',
    categoryLabel: 'Deep Space',
    missionType: 'Outer Planets & Interstellar Probes',
    launchDate: 'March 2, 1972 (Pioneer 10)',
    endDate: 'January 23, 2003 (Last Signal)',
    destination: 'Outer Solar System (Beyond Neptune)',
    environmentType: 'deep-space',
    terrainProfile: 'none',
    summary:
      'Early deep-space probes that crossed the asteroid belt and explored the outer planets using all-nuclear electrical power. Carrying metal origin plaques, they now drift silently out of the solar system.',
    specs: [
      { label: 'Launch Vehicle', value: 'Atlas Centaur · Complex 36A' },
      { label: 'Power Source', value: 'Two SNAP-19 RTGs (~140 W at Jupiter)' },
      { label: 'Jupiter Closest Pass', value: 'Dec 4, 1973 · 130,354 km range' },
      { label: 'Last Signal Distance', value: '12.23 billion km (7.6 billion miles)' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: 'Deep-Space Nuclear Probe',
        title: '2.74-Meter Dish, SNAP-19 RTGs & Origin Plaque',
        narration:
          'Built around an iconic 2.74-meter parabolic dish, Pioneer 10 relied on all-nuclear electrical power from twin SNAP-19 RTGs on long truss booms and carried a gold-anodized aluminum plaque showing Earth’s cosmic address.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'March 2, 1972',
        title: 'Record 51,682 km/h Departure Speed',
        narration:
          'Launched aboard an Atlas Centaur from Launch Complex 36A on March 2, 1972, Pioneer 10 accelerated to 51,682 kilometers per hour—fastest human-made object to depart Earth at the time.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Belt Crossing',
        date: 'July 1972 – Feb 1973',
        title: 'First Spacecraft Across the Asteroid Belt',
        narration:
          'Becoming the first spacecraft to fly beyond Mars, Pioneer 10 entered the main asteroid belt in July 1972 and emerged unscathed in February 1973, proving outer-planet transit was survivable.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Jupiter',
        date: 'December 4, 1973',
        title: 'Closest Approach to Jupiter at 130,354 km',
        narration:
          'Braving intense radiation belts powered by 140 watts from its RTGs, Pioneer 10 swept just 130,354 kilometers above Jupiter’s cloud tops on December 4, 1973.',
        durationSec: 8,
        visualCue: 'orbit',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'Outer Giants',
        date: '1973 – 1979',
        title: 'First Close-Ups of Jupiter, Ganymede & Saturn',
        narration:
          'Pioneer 10 returned roughly 500 Jovian cloud images and the first close-ups of Ganymede, while its twin Pioneer 11 followed to become the first probe to explore Saturn up close.',
        durationSec: 8,
        visualCue: 'orbit',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Beyond Neptune',
        date: 'June 13, 1983',
        title: 'First Human-Made Object Beyond Neptune’s Orbit',
        narration:
          'Crossing Saturn’s orbit in 1976 and Uranus’s orbit in 1979, Pioneer 10 crossed Neptune’s orbital distance on June 13, 1983, charting the solar wind into the outer heliosphere.',
        durationSec: 8,
        visualCue: 'cruise',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'January 23, 2003',
        title: 'Final Whisper at 12.23 Billion Kilometers',
        narration:
          'Its plaque mapping Earth relative to 14 pulsars, Pioneer 10 transmitted its final faint signal on January 23, 2003 from 12.23 billion kilometers away, drifting silently outward toward Aldebaran.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/pioneer-10-11.mp3',
    glbPath: '/models/artifacts/pioneer-10-11.glb',
    placement: {
      parentBody: 'outer',
      orbitRadius: 43,
      orbitAngle: 5.2,
      orbitInclination: 0.08,
    },
  },
  {
    id: 'kepler-telescope',
    name: 'Kepler Space Telescope',
    shortName: 'Kepler / K2',
    category: 'deep-space',
    categoryLabel: 'Deep Space',
    missionType: 'Exoplanet Space Telescope',
    launchDate: 'March 6, 2009',
    endDate: 'October 30, 2018',
    destination: 'Heliocentric Earth-Trailing Orbit',
    environmentType: 'deep-space',
    terrainProfile: 'none',
    summary:
      'NASA’s first planet-hunting mission, revealing more planets than stars in our galaxy. After nine years and more than 2,600 exoplanet discoveries, it ran out of fuel and drifts in an Earth-trailing orbit.',
    specs: [
      { label: 'Optical System', value: '1-m aperture · 1.4-m primary mirror' },
      { label: 'Stars Surveyed', value: '150,000 (Cygnus) · >500,000 (with K2)' },
      { label: 'Discoveries', value: '>2,600 confirmed exoplanets' },
      { label: 'Retirement', value: 'October 30, 2018 · Safe orbit' },
    ],
    stages: [
      {
        id: 'design',
        sceneNumber: 1,
        label: 'Design',
        date: 'Exoplanet Photometer',
        title: '1-Meter Aperture & 1.4-Meter Primary Mirror',
        narration:
          'Built around a gold-foil telescope barrel, angled sunshield hood, 1.4-meter primary mirror, and saddle-mounted solar wings, Kepler was engineered to detect tiny brightness dips as distant planets crossed their stars.',
        durationSec: 7,
        visualCue: 'blueprint',
      },
      {
        id: 'liftoff',
        sceneNumber: 2,
        label: 'Liftoff',
        date: 'March 6, 2009',
        title: 'Launch Into Heliocentric Space',
        narration:
          'Launched on March 6, 2009, NASA’s first planet-hunting space telescope climbed away from Earth to escape glare and scattered light from our home planet.',
        durationSec: 7,
        visualCue: 'liftoff',
      },
      {
        id: 'cruise',
        sceneNumber: 3,
        label: 'Orbit',
        date: 'Spring 2009',
        title: 'Settling Into Earth-Trailing Heliocentric Orbit',
        narration:
          'Entering an Earth-trailing orbit around the Sun, Kepler gained an uninterrupted view of the sky, stabilizing its optical barrel toward a rich patch of the Milky Way.',
        durationSec: 7,
        visualCue: 'cruise',
      },
      {
        id: 'landing',
        sceneNumber: 4,
        label: 'Cygnus Watch',
        date: '2009 – 2013',
        title: 'Staring at 150,000 Stars in Cygnus',
        narration:
          'For four years, Kepler continuously monitored the brightness of 150,000 stars in the constellation Cygnus, catching fleeting planetary transits across distant suns.',
        durationSec: 8,
        visualCue: 'orbit',
      },
      {
        id: 'milestone-1',
        sceneNumber: 5,
        label: 'K2 Revival',
        date: 'May 2013 – 2018',
        title: 'Solar Photon Balance & 19 K2 Campaigns',
        narration:
          'When a second reaction wheel failed in May 2013, engineers balanced Kepler gently against solar photon pressure—launching the extended K2 mission across 19 campaigns along the ecliptic.',
        durationSec: 8,
        visualCue: 'orbit',
      },
      {
        id: 'milestone-2',
        sceneNumber: 6,
        label: 'Discoveries',
        date: 'Over 2,600 Exoplanets',
        title: 'Proving Planets Outnumber Stars in Our Galaxy',
        narration:
          'Surveying more than 500,000 stars across Kepler and K2, the telescope discovered over 2,600 exoplanets and revealed that 20 to 50 percent of visible stars likely host small, rocky worlds in habitable zones.',
        durationSec: 8,
        visualCue: 'orbit',
      },
      {
        id: 'final',
        sceneNumber: 7,
        label: 'Legacy',
        date: 'October 30, 2018',
        title: 'Retired in Safe Earth-Trailing Orbit',
        narration:
          'After nine revolutionary years in deep space, Kepler ran out of fuel and was retired on October 30, 2018, drifting peacefully in a safe Earth-trailing orbit around the Sun.',
        durationSec: 8,
        visualCue: 'dormant',
      },
    ],
    audioPath: '/audio/echo/kepler-telescope.mp3',
    glbPath: '/models/artifacts/kepler-telescope.glb',
    placement: {
      parentBody: 'earth-trailing',
      orbitRadius: 11.8,
      orbitAngle: 0.12,
    },
  },
];

export const MISSION_MAP = new Map<string, MissionArtifact>(
  MISSIONS.map((m) => [m.id, m])
);
