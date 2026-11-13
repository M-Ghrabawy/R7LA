export type ExtendedObject = {
  id: string;
  name: string;
  mission: string;
  destination: "Moon" | "Mars" | "Ceres" | "Eros" | "Deep Space" | "Heliocentric";
  group: "Moon" | "Mars" | "Small bodies" | "Deep space";
  category: string;
  physicalStatus: string;
  operationalStatus: string;
  dateLabel: string;
  endLabel?: string;
  location: string;
  summary: string;
  significance: string;
  image: {
    src: string;
    alt: string;
    credit: string;
    kind: "photograph" | "artist-concept" | "data";
    sourceUrl: string;
    nasaId: string;
  };
  sources: Array<{ title: string; organization: string; url: string }>;
};

export const extendedCatalog: ExtendedObject[] = [
  {
    id: "apollo-12-alsep",
    name: "Apollo 12 ALSEP",
    mission: "Apollo 12",
    destination: "Moon",
    group: "Moon",
    category: "Lunar surface experiment network",
    physicalStatus: "Present on the lunar surface",
    operationalStatus: "Inactive / decommissioned",
    dateLabel: "Deployed 19–20 November 1969",
    endLabel: "Lunar ALSEP operations ended in 1977",
    location: "Oceanus Procellarum, near Surveyor Crater",
    summary:
      "The first full Apollo Lunar Surface Experiments Package was deployed by the Apollo 12 crew. Its central station and instruments formed part of a network that monitored the lunar environment long after the astronauts departed.",
    significance:
      "ALSEP turned the Moon into a long-duration scientific observatory. The instruments measured seismic activity, the lunar magnetic field, heat flow, and the extremely thin lunar atmosphere.",
    image: {
      src: "/nasa/as12-47-6919_ext_medium.jpg",
      alt: "Astronaut Alan Bean deploys components of the Apollo Lunar Surface Experiments Package during Apollo 12.",
      credit: "NASA / JSC",
      kind: "photograph",
      sourceUrl: "https://images.nasa.gov/details/as12-47-6919",
      nasaId: "as12-47-6919",
    },
    sources: [
      {
        title: "Apollo 12 Mission",
        organization: "NASA",
        url: "https://www.nasa.gov/mission/apollo-12/",
      },
      {
        title: "Apollo Lunar Surface Journal",
        organization: "NASA History",
        url: "https://www.nasa.gov/history/alsj-and-afj/",
      },
    ],
  },
  {
    id: "apollo-17-lrv",
    name: "Apollo 17 Lunar Roving Vehicle",
    mission: "Apollo 17",
    destination: "Moon",
    group: "Moon",
    category: "Crewed lunar rover",
    physicalStatus: "Present on the lunar surface",
    operationalStatus: "Inactive / decommissioned",
    dateLabel: "Used 11–14 December 1972",
    endLabel: "Left at Taurus-Littrow",
    location: "Taurus-Littrow valley",
    summary:
      "The third Lunar Roving Vehicle carried Eugene Cernan and Harrison Schmitt across the Taurus-Littrow valley during the final Apollo landing. It remains where the crew parked it.",
    significance:
      "Apollo 17 demonstrated the mature LRV operational model, supporting three EVAs and the largest Apollo sample collection. Its final parking place is part of the archaeological record of the last crewed Apollo site.",
    image: {
      src: "/nasa/as17-137-20979_ext_medium.jpg",
      alt: "Close-up of the Apollo 17 Lunar Roving Vehicle at the Taurus-Littrow landing site.",
      credit: "NASA / JSC",
      kind: "photograph",
      sourceUrl: "https://images.nasa.gov/details/as17-137-20979",
      nasaId: "as17-137-20979",
    },
    sources: [
      {
        title: "Apollo 17 Mission",
        organization: "NASA",
        url: "https://www.nasa.gov/mission/apollo-17/",
      },
      {
        title: "Apollo Landing Site Coordinates",
        organization: "NASA NSSDCA",
        url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html",
      },
    ],
  },
  {
    id: "surveyor-1",
    name: "Surveyor 1",
    mission: "Surveyor 1",
    destination: "Moon",
    group: "Moon",
    category: "Robotic lunar lander",
    physicalStatus: "Present on the lunar surface",
    operationalStatus: "Inactive / decommissioned",
    dateLabel: "Landed 2 June 1966",
    endLabel: "Last contact January 1967",
    location: "Oceanus Procellarum",
    summary:
      "Surveyor 1 was the first NASA spacecraft to achieve a controlled soft landing on the Moon. Its television images and soil-mechanics data helped prepare the way for Apollo.",
    significance:
      "The mission proved that the lunar surface could support a lander and returned the first close-up television images from the Moon. It opened the Surveyor series that tested landing sites for Apollo.",
    image: {
      src: "/nasa/PIA02976_ext_medium.jpg",
      alt: "The shadow of Surveyor 1 on the lunar surface, photographed from the lander.",
      credit: "NASA / JPL-Caltech",
      kind: "photograph",
      sourceUrl: "https://images.nasa.gov/details/PIA02976",
      nasaId: "PIA02976",
    },
    sources: [
      {
        title: "Surveyor 1 Mission",
        organization: "NASA",
        url: "https://science.nasa.gov/mission/surveyor-1/",
      },
      {
        title: "Surveyor Program",
        organization: "NASA",
        url: "https://science.nasa.gov/mission/surveyor-3/",
      },
    ],
  },
  {
    id: "viking-2-lander",
    name: "Viking 2 Lander",
    mission: "Viking 2",
    destination: "Mars",
    group: "Mars",
    category: "Robotic Mars lander",
    physicalStatus: "Present on the Martian surface",
    operationalStatus: "Inactive / decommissioned",
    dateLabel: "Landed 3 September 1976",
    endLabel: "Last contact 11 April 1980",
    location: "Utopia Planitia",
    summary:
      "Viking 2 was the second successful U.S. landing on Mars. Its lander returned color images, weather records, and biology experiment data from Utopia Planitia.",
    significance:
      "Together with Viking 1, Viking 2 established the first long-duration surface presence on Mars and produced a foundational atmospheric and imaging record.",
    image: {
      src: "/nasa/PIA00568_ext_orig.jpg",
      alt: "First color image from the Viking 2 landing site on Mars.",
      credit: "NASA / JPL-Caltech",
      kind: "photograph",
      sourceUrl: "https://images.nasa.gov/details/PIA00568",
      nasaId: "PIA00568",
    },
    sources: [
      {
        title: "Viking 2 Mission",
        organization: "NASA",
        url: "https://science.nasa.gov/mission/viking-2/",
      },
      {
        title: "Viking 1 Mission",
        organization: "NASA",
        url: "https://science.nasa.gov/mission/viking-1/",
      },
    ],
  },
  {
    id: "phoenix",
    name: "Phoenix Lander",
    mission: "Phoenix",
    destination: "Mars",
    group: "Mars",
    category: "Robotic Mars lander",
    physicalStatus: "Present on the Martian surface",
    operationalStatus: "Inactive / decommissioned",
    dateLabel: "Landed 25 May 2008",
    endLabel: "Last contact 2 November 2008",
    location: "Vastitas Borealis, northern polar region",
    summary:
      "Phoenix landed in the Martian arctic and used its robotic arm to uncover water ice beneath the surface. It also monitored polar weather and returned high-resolution stereo imagery.",
    significance:
      "Phoenix confirmed the presence of water ice at its landing site and expanded the record of Martian polar environments. Its hardware remains in the northern plains.",
    image: {
      src: "/nasa/KSC-07PD-1085_ext_medium.jpg",
      alt: "The Phoenix Mars Lander during pre-launch processing at Kennedy Space Center.",
      credit: "NASA / KSC",
      kind: "photograph",
      sourceUrl: "https://images.nasa.gov/details/KSC-07PD-1085",
      nasaId: "KSC-07PD-1085",
    },
    sources: [
      {
        title: "Phoenix Mission",
        organization: "NASA",
        url: "https://science.nasa.gov/mission/phoenix/",
      },
    ],
  },
  {
    id: "insight",
    name: "InSight Lander",
    mission: "InSight",
    destination: "Mars",
    group: "Mars",
    category: "Robotic Mars geophysics lander",
    physicalStatus: "Present on the Martian surface",
    operationalStatus: "Inactive / decommissioned",
    dateLabel: "Landed 26 November 2018",
    endLabel: "Mission ended 21 December 2022",
    location: "Elysium Planitia",
    summary:
      "InSight studied the interior of Mars with a seismometer and a heat-flow probe. It recorded marsquakes and helped map the planet's internal structure.",
    significance:
      "InSight produced the first direct seismic record of Mars and measured the planet's deep interior. Its final condition was shaped by dust accumulation on the solar arrays.",
    image: {
      src: "/nasa/PIA19811_ext_medium.jpg",
      alt: "Artist concept of the InSight lander deployed on the surface of Mars.",
      credit: "NASA / JPL-Caltech",
      kind: "artist-concept",
      sourceUrl: "https://images.nasa.gov/details/PIA19811",
      nasaId: "PIA19811",
    },
    sources: [
      {
        title: "InSight Mission",
        organization: "NASA",
        url: "https://science.nasa.gov/mission/insight/",
      },
    ],
  },
  {
    id: "ingenuity",
    name: "Ingenuity Mars Helicopter",
    mission: "Mars 2020",
    destination: "Mars",
    group: "Mars",
    category: "Martian rotorcraft",
    physicalStatus: "Present on the Martian surface",
    operationalStatus: "Inactive",
    dateLabel: "First flight 19 April 2021",
    endLabel: "Final flight 18 January 2024",
    location: "Jezero Crater region",
    summary:
      "Ingenuity became the first aircraft to achieve powered, controlled flight on another planet. It flew 72 times before rotor damage ended its flight operations.",
    significance:
      "The helicopter demonstrated aerial mobility in the Martian atmosphere and scouted terrain for Perseverance. It remains a stationary artifact in Jezero Crater.",
    image: {
      src: "/nasa/PIA23882_ext_medium.jpg",
      alt: "NASA's Ingenuity Mars Helicopter flight model.",
      credit: "NASA / JPL-Caltech",
      kind: "photograph",
      sourceUrl: "https://images.nasa.gov/details/PIA23882",
      nasaId: "PIA23882",
    },
    sources: [
      {
        title: "Mars 2020 Perseverance Mission",
        organization: "NASA",
        url: "https://science.nasa.gov/mission/mars-2020-perseverance/",
      },
    ],
  },
  {
    id: "dawn",
    name: "Dawn",
    mission: "Dawn",
    destination: "Ceres",
    group: "Small bodies",
    category: "Orbital spacecraft",
    physicalStatus: "Derelict in orbit around Ceres",
    operationalStatus: "Inactive / out of fuel",
    dateLabel: "Arrived at Ceres 6 March 2015",
    endLabel: "Mission ended 1 November 2018",
    location: "Ceres orbit",
    summary:
      "Dawn was the first spacecraft to orbit two extraterrestrial bodies, Vesta and Ceres. It mapped both worlds with ion propulsion and ended its mission in a stable orbit around Ceres after exhausting its hydrazine.",
    significance:
      "Dawn transformed understanding of the asteroid belt and dwarf planet Ceres, including its bright salt deposits and evidence of subsurface water. Its silent orbit is itself a long-term artifact of exploration.",
    image: {
      src: "/nasa/PIA12033_ext_medium.jpg",
      alt: "Artist concept of the Dawn spacecraft with Vesta and Ceres.",
      credit: "NASA / JPL-Caltech",
      kind: "artist-concept",
      sourceUrl: "https://images.nasa.gov/details/PIA12033",
      nasaId: "PIA12033",
    },
    sources: [
      {
        title: "Dawn Mission",
        organization: "NASA",
        url: "https://science.nasa.gov/mission/dawn/",
      },
    ],
  },
  {
    id: "near-shoemaker",
    name: "NEAR Shoemaker",
    mission: "NEAR Shoemaker",
    destination: "Eros",
    group: "Small bodies",
    category: "Asteroid orbiter and lander",
    physicalStatus: "At rest on 433 Eros",
    operationalStatus: "Inactive / decommissioned",
    dateLabel: "Landed 12 February 2001",
    endLabel: "Last contact 28 February 2001",
    location: "Surface of 433 Eros",
    summary:
      "NEAR Shoemaker was the first spacecraft to orbit and land on an asteroid. After a year of orbital mapping, it touched down on Eros and continued returning data from the surface.",
    significance:
      "The mission produced the first close-up global record of an asteroid and demonstrated that a spacecraft could be landed on a small body. It remains on Eros as a human-made object on another world.",
    image: {
      src: "/nasa/PIA02473_ext_orig.jpg",
      alt: "NEAR Shoemaker image data showing the global shape of asteroid Eros.",
      credit: "NASA / JPL-Caltech",
      kind: "data",
      sourceUrl: "https://images.nasa.gov/details/PIA02473",
      nasaId: "PIA02473",
    },
    sources: [
      {
        title: "NEAR Shoemaker Mission",
        organization: "NASA",
        url: "https://science.nasa.gov/mission/near-shoemaker/",
      },
    ],
  },
  {
    id: "pioneer-10",
    name: "Pioneer 10",
    mission: "Pioneer 10",
    destination: "Deep Space",
    group: "Deep space",
    category: "Interplanetary probe",
    physicalStatus: "Outbound in interstellar space",
    operationalStatus: "Inactive / no contact",
    dateLabel: "Launched 2 March 1972",
    endLabel: "Last contact 23 January 2003",
    location: "Escaping the Solar System",
    summary:
      "Pioneer 10 was the first spacecraft to cross the asteroid belt and fly past Jupiter. It continued outward after its planetary mission, carrying a plaque describing its makers.",
    significance:
      "Pioneer 10 established a trajectory out of the Solar System and returned the first close-up images of Jupiter. It is now a silent messenger moving through interstellar space.",
    image: {
      src: "/nasa/ARC-1972-AC72-2135_ext_medium.jpg",
      alt: "Pioneer 10 spacecraft at Cape Kennedy during launch preparations.",
      credit: "NASA / ARC",
      kind: "photograph",
      sourceUrl: "https://images.nasa.gov/details/ARC-1972-AC72-2135",
      nasaId: "ARC-1972-AC72-2135",
    },
    sources: [
      {
        title: "Pioneer 10 Mission",
        organization: "NASA",
        url: "https://science.nasa.gov/mission/pioneer-10/",
      },
    ],
  },
  {
    id: "pioneer-11",
    name: "Pioneer 11",
    mission: "Pioneer 11",
    destination: "Deep Space",
    group: "Deep space",
    category: "Interplanetary probe",
    physicalStatus: "Outbound in interstellar space",
    operationalStatus: "Inactive / no contact",
    dateLabel: "Launched 5 April 1973",
    endLabel: "Last contact 30 September 1995",
    location: "Escaping the Solar System",
    summary:
      "Pioneer 11 followed Pioneer 10 through the asteroid belt, flew past Jupiter, and became the first spacecraft to visit Saturn. It is now coasting outward with no active systems.",
    significance:
      "Pioneer 11 opened the outer Solar System to close observation and provided the first views of Saturn's rings from a spacecraft. It is a long-duration artifact of early deep-space exploration.",
    image: {
      src: "/nasa/ARC-1982-AC82-0178_ext_medium.jpg",
      alt: "Artist composite of the Pioneer spacecraft family.",
      credit: "NASA / ARC",
      kind: "artist-concept",
      sourceUrl: "https://images.nasa.gov/details/ARC-1982-AC82-0178",
      nasaId: "ARC-1982-AC82-0178",
    },
    sources: [
      {
        title: "Pioneer 11 Mission",
        organization: "NASA",
        url: "https://science.nasa.gov/mission/pioneer-11/",
      },
    ],
  },
  {
    id: "kepler",
    name: "Kepler Space Telescope",
    mission: "Kepler",
    destination: "Heliocentric",
    group: "Deep space",
    category: "Exoplanet observatory",
    physicalStatus: "Derelict in heliocentric orbit",
    operationalStatus: "Inactive / out of fuel",
    dateLabel: "Launched 7 March 2009",
    endLabel: "Mission ended 30 October 2018",
    location: "Earth-trailing heliocentric orbit",
    summary:
      "Kepler searched for planets beyond the Solar System by measuring tiny dips in starlight. It discovered thousands of candidate exoplanets and changed the statistical picture of planetary systems.",
    significance:
      "Kepler established that small, rocky planets are common and that many stars host planetary systems. The telescope now drifts in an Earth-trailing orbit, unpowered but still a trace of the mission.",
    image: {
      src: "/nasa/PIA15423_ext_small.jpg",
      alt: "Artist concept of the Spitzer, Planck, and Kepler space telescopes.",
      credit: "NASA / JPL-Caltech",
      kind: "artist-concept",
      sourceUrl: "https://images.nasa.gov/details/PIA15423",
      nasaId: "PIA15423",
    },
    sources: [
      {
        title: "Kepler Mission",
        organization: "NASA",
        url: "https://science.nasa.gov/mission/kepler/",
      },
    ],
  },
];

export const catalogGroups = [
  "Moon",
  "Mars",
  "Small bodies",
  "Deep space",
] as const;
