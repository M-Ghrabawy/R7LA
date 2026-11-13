import type { ArtifactInput, SourcedStatement } from "@/lib/schema";
import { nasaImage } from "./sources";

const s = (text: string, sourceIds: string[]): SourcedStatement => ({
  text,
  sourceIds,
  status: "verified",
});

const image = nasaImage;

export const rawRelics: ArtifactInput[] = [
  {
    id: "apollo-11-lunar-module",
    name: "Apollo 11 Lunar Module Eagle — Descent Stage",
    shortName: "Eagle Descent Stage",
    mission: "Apollo 11",
    missionShort: "Apollo 11",
    destination: "Moon",
    category: "Crewed lunar module",
    physicalStatus: "present",
    operationalStatus: "decommissioned",
    landingDate: "1969-07-20",
    endDate: "1969-07-21",
    coordinates: {
      latitude: 0.67416,
      longitude: 23.47314,
      label: "Tranquility Base, Mare Tranquillitatis",
      precision: "exact",
      sourceIds: ["nssdc-apollo-sites"],
    },
    actualLifetime: {
      value: 21.6,
      unit: "hours",
      label: "Crewed surface stay",
      approximate: true,
    },
    lifetimeBasis: "Time spent on the lunar surface by the crew",
    description:
      "The descent stage of Eagle carried Neil Armstrong and Buzz Aldrin to the Sea of Tranquility, served as their base for the first crewed lunar landing, and was left behind when the ascent stage departed. It is the physical anchor of Tranquility Base and one of the most historically significant human-made objects on another world.",
    purpose: [
      s("Deliver two astronauts from lunar orbit to the surface and act as the crew's habitat and equipment platform during the stay.", [
        "nasa-apollo-11",
        "nssdc-apollo-11",
      ]),
      s("Carry the Early Apollo Scientific Experiments Package, cameras, tools, and consumables used during the single surface EVA.", [
        "nssdc-apollo-11",
        "nasa-alsj",
      ]),
    ],
    operationalHistory: [
      s("Eagle landed at 20:17 UTC on 20 July 1969. Armstrong and Aldrin spent about 21.5 hours on the surface before the ascent stage lifted off.", [
        "nssdc-apollo-11",
        "nssdc-apollo-landings",
      ]),
      s("The descent stage remained at Tranquility Base; the ascent stage returned to lunar orbit and was later deliberately impacted into the Moon.", [
        "nasa-alsj",
        "nssdc-apollo-11",
      ]),
    ],
    scientificLegacy: [
      s("The site preserves the first human footsteps on another world and the hardware that supported the first sample-return mission from the Moon.", [
        "nasa-apollo-11",
        "nasa-alsj",
      ]),
      s("Modern orbital imagery resolves the descent stage and surrounding experiment package, making Tranquility Base a benchmark for lunar surface archaeology.", [
        "nssdc-apollo-sites",
      ]),
    ],
    originalFunction:
      "Crewed lunar landing vehicle, surface habitat, and equipment platform.",
    currentCondition:
      "The descent stage remains on the lunar surface. It is unpowered and was never intended to return to Earth.",
    images: [
      image(
        "as11-40-5927",
        "Apollo 11 Lunar Module Eagle standing on the lunar surface while Buzz Aldrin prepares to deploy experiments.",
      ),
      image(
        "as11-40-5917",
        "Close view of an Apollo 11 Lunar Module footpad and surface sensing probe on the Moon.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "a11-launch",
        date: "1969-07-16",
        dateLabel: "16 JUL 1969",
        type: "launch",
        title: "Apollo 11 launches",
        summary:
          "A Saturn V carrying Armstrong, Collins, and Aldrin departs Kennedy Space Center.",
        sourceIds: ["nasa-apollo-11", "nssdc-apollo-11"],
        significance: "primary",
      },
      {
        id: "a11-landing",
        date: "1969-07-20",
        dateLabel: "20 JUL 1969",
        type: "landing",
        title: "Eagle lands at Tranquility Base",
        summary:
          "The Lunar Module touches down in Mare Tranquillitatis at 20:17 UTC.",
        sourceIds: ["nssdc-apollo-11", "nssdc-apollo-sites"],
        significance: "primary",
      },
      {
        id: "a11-eva",
        date: "1969-07-21",
        dateLabel: "21 JUL 1969",
        type: "deployment",
        title: "First lunar surface EVA",
        summary:
          "Armstrong and Aldrin deploy experiments, collect samples, and leave the descent stage behind.",
        sourceIds: ["nasa-apollo-11", "nasa-alsj"],
        significance: "primary",
      },
      {
        id: "a11-ascent",
        date: "1969-07-21",
        dateLabel: "21 JUL 1969",
        type: "end",
        title: "Ascent stage departs",
        summary:
          "The ascent stage lifts off, leaving the descent stage as the permanent surface record of the landing.",
        sourceIds: ["nssdc-apollo-11", "nasa-alsj"],
        significance: "primary",
      },
      {
        id: "a11-splashdown",
        date: "1969-07-24",
        dateLabel: "24 JUL 1969",
        type: "legacy",
        title: "Crew returns to Earth",
        summary:
          "Columbia splashes down in the Pacific, completing the first crewed lunar landing mission.",
        sourceIds: ["nasa-apollo-11", "nssdc-apollo-11"],
      },
    ],
    claims: [
      {
        id: "a11-lm-claim-1",
        assertion:
          "Eagle's descent stage remains at Tranquility Base while its ascent stage left the surface.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nssdc-apollo-11", "nasa-alsj"],
      },
      {
        id: "a11-lm-claim-2",
        assertion:
          "Apollo 11 landed in Mare Tranquillitatis on 20 July 1969 at 20:17 UTC.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nssdc-apollo-11", "nssdc-apollo-sites"],
      },
      {
        id: "a11-lm-claim-3",
        assertion:
          "The descent stage supported the first crewed lunar surface stay and the deployment of the early Apollo experiments.",
        status: "verified",
        category: "historical",
        sourceIds: ["nasa-apollo-11", "nasa-alsj"],
      },
      {
        id: "a11-lm-claim-4",
        assertion:
          "A future mission could recover the descent stage for museum display without damaging the site.",
        status: "hypothetical",
        category: "engineering",
        sourceIds: ["nasa-alsj"],
        note: "No approved recovery mission exists. Any intervention would need to respect the site's historical protection.",
      },
    ],
    sourceIds: [
      "nasa-apollo-11",
      "nssdc-apollo-11",
      "nssdc-apollo-sites",
      "nssdc-apollo-landings",
      "nasa-alsj",
      "nasa-image-as11-40-5927",
      "nasa-image-as11-40-5917",
    ],
    legacy: {
      dimensions: {
        scientific: 82,
        mission: 100,
        historical: 100,
        longevity: 32,
        continued: 48,
      },
      rationales: {
        scientific:
          "Supported the first crewed landing and the first returned lunar samples, though its own instrument payload was limited.",
        mission:
          "The descent stage was indispensable to the first human landing on another world.",
        historical:
          "Tranquility Base is the founding archaeological site of human presence beyond Earth.",
        longevity:
          "It has remained physically present for more than half a century but has no active function.",
        continued:
          "Its value is primarily heritage and in-situ archaeology rather than ongoing science.",
      },
    },
    featured: true,
  },
  {
    id: "apollo-11-laser-ranging-retroreflector",
    name: "Apollo 11 Laser Ranging Retroreflector",
    shortName: "Apollo 11 LRRR",
    mission: "Apollo 11",
    missionShort: "Apollo 11",
    destination: "Moon",
    category: "Passive scientific instrument",
    physicalStatus: "present",
    operationalStatus: "passive-operational",
    landingDate: "1969-07-21",
    coordinates: {
      latitude: 0.67345,
      longitude: 23.47307,
      label: "Tranquility Base, Mare Tranquillitatis",
      precision: "exact",
      sourceIds: ["nssdc-apollo-sites"],
    },
    actualLifetime: {
      value: 57.3,
      unit: "years",
      label: "Still a passive laser target",
      approximate: true,
      ongoing: true,
    },
    lifetimeBasis: "Duration since deployment; no powered lifetime limit",
    description:
      "A compact array of fused-silica corner-cube prisms deployed beside Eagle. It requires no power and reflects laser pulses back to Earth, allowing observatories to measure the Earth-Moon distance with extraordinary precision. It is one of the oldest human-made instruments still returning scientific data from the lunar surface.",
    purpose: [
      s("Provide a passive optical target for Earth-based lunar laser ranging.", [
        "nssdc-apollo-11",
        "ilrs-lunar-ranging",
      ]),
      s("Support precise measurements of the Earth-Moon distance and tests of gravitational physics.", [
        "ilrs-lunar-ranging",
        "nasa-apollo-11",
      ]),
    ],
    operationalHistory: [
      s("The retroreflector was deployed during the Apollo 11 surface EVA in July 1969 as part of the Early Apollo Scientific Experiments Package.", [
        "nasa-apollo-11",
        "nssdc-apollo-11",
      ]),
      s("Lunar laser ranging stations have continued to target Apollo-era retroreflectors, including the Apollo 11 array, decades after the mission.", [
        "ilrs-lunar-ranging",
      ]),
    ],
    scientificLegacy: [
      s("Lunar laser ranging constrains the lunar orbit, the Moon's interior, and aspects of general relativity.", [
        "ilrs-lunar-ranging",
        "nasa-apollo-11",
      ]),
      s("The Apollo arrays established a multi-generational geodetic experiment that still links observatories on Earth to hardware on the Moon.", [
        "ilrs-lunar-ranging",
      ]),
    ],
    originalFunction:
      "Passive corner-cube retroreflector for Earth-based laser ranging.",
    currentCondition:
      "Physically present. The array is passive and remains detectable, with return strength lower than the later Apollo arrays.",
    images: [
      image(
        "6900959",
        "Buzz Aldrin walking on the Moon with the Apollo 11 experiment packages, including the laser ranging retroreflector.",
      ),
      image(
        "6900957",
        "Apollo 11 Early Apollo Scientific Experiments Package on the lunar surface, with the retroreflector at right.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "a11-lrrr-landing",
        date: "1969-07-20",
        dateLabel: "20 JUL 1969",
        type: "landing",
        title: "Eagle lands with the experiment package",
        summary:
          "The retroreflector arrives at Tranquility Base stowed in the Lunar Module.",
        sourceIds: ["nasa-apollo-11", "nssdc-apollo-11"],
        significance: "primary",
      },
      {
        id: "a11-lrrr-deploy",
        date: "1969-07-21",
        dateLabel: "21 JUL 1969",
        type: "deployment",
        title: "Retroreflector deployed",
        summary:
          "The array is placed on the lunar surface during the EVA.",
        sourceIds: ["nasa-apollo-11", "nssdc-apollo-11"],
        significance: "primary",
      },
      {
        id: "a11-lrrr-ranging",
        date: "1969-08-01",
        dateLabel: "1969",
        type: "discovery",
        title: "Laser ranging begins",
        summary:
          "Earth-based stations begin ranging to the newly deployed Apollo arrays.",
        sourceIds: ["ilrs-lunar-ranging"],
      },
      {
        id: "a11-lrrr-legacy",
        date: "2026-01-01",
        dateLabel: "PRESENT",
        type: "legacy",
        title: "A continuing experiment",
        summary:
          "Apollo-era arrays remain part of the international lunar laser ranging network.",
        sourceIds: ["ilrs-lunar-ranging"],
      },
    ],
    claims: [
      {
        id: "a11-lrrr-claim-1",
        assertion:
          "The Apollo 11 retroreflector is a passive instrument that needs no electrical power on the Moon.",
        status: "verified",
        category: "engineering",
        sourceIds: ["nssdc-apollo-11", "ilrs-lunar-ranging"],
      },
      {
        id: "a11-lrrr-claim-2",
        assertion:
          "Lunar laser ranging to Apollo-era retroreflectors has produced precise measurements of the Earth-Moon distance.",
        status: "verified",
        category: "scientific",
        sourceIds: ["ilrs-lunar-ranging"],
      },
      {
        id: "a11-lrrr-claim-3",
        assertion:
          "Apollo 11's array can still be used for ranging, although it returns less light than the later arrays.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["ilrs-lunar-ranging"],
        note: "Return strength varies with atmospheric conditions and station capability.",
      },
    ],
    sourceIds: [
      "nasa-apollo-11",
      "nssdc-apollo-11",
      "nssdc-apollo-sites",
      "ilrs-lunar-ranging",
      "nasa-image-6900959",
      "nasa-image-6900957",
    ],
    legacy: {
      dimensions: {
        scientific: 98,
        mission: 94,
        historical: 98,
        longevity: 100,
        continued: 96,
      },
      rationales: {
        scientific:
          "A precision geodetic instrument that supports fundamental physics and lunar science.",
        mission:
          "A small experiment with an outsized record of continuous scientific return.",
        historical:
          "One of the first scientific instruments placed on the Moon by humans.",
        longevity:
          "Has remained usable for more than five decades without power or maintenance.",
        continued:
          "Still part of lunar laser ranging campaigns, though later arrays are stronger targets.",
      },
    },
    featured: true,
  },
  {
    id: "apollo-12-lunar-module",
    name: "Apollo 12 Lunar Module Intrepid — Descent Stage",
    shortName: "Intrepid Descent Stage",
    mission: "Apollo 12",
    missionShort: "Apollo 12",
    destination: "Moon",
    category: "Crewed lunar module",
    physicalStatus: "present",
    operationalStatus: "decommissioned",
    landingDate: "1969-11-19",
    endDate: "1969-11-24",
    coordinates: {
      latitude: -3.0128,
      longitude: -23.4219,
      label: "Oceanus Procellarum, near Surveyor Crater",
      precision: "exact",
      sourceIds: ["nssdc-apollo-sites"],
    },
    actualLifetime: {
      value: 31.6,
      unit: "hours",
      label: "Crewed surface stay",
      approximate: true,
    },
    lifetimeBasis: "Time spent on the lunar surface by the crew",
    description:
      "The descent stage of Intrepid supported the second crewed lunar landing and a precision touchdown near the dormant Surveyor 3 spacecraft. Apollo 12 demonstrated pinpoint landing and field geology while leaving another permanent descent-stage assembly in Oceanus Procellarum.",
    purpose: [
      s("Deliver Charles Conrad and Alan Bean to a precise landing site in Oceanus Procellarum.", [
        "nasa-apollo-12",
        "nssdc-apollo-12",
      ]),
      s("Support two surface EVAs focused on geology and the inspection of Surveyor 3.", [
        "nasa-apollo-12",
        "nasa-alsj",
      ]),
    ],
    operationalHistory: [
      s("Intrepid landed on 19 November 1969 after a mission launched during a thunderstorm.", [
        "nasa-apollo-12",
        "nssdc-apollo-12",
      ]),
      s("Conrad and Bean conducted two moonwalks, deployed an Apollo Lunar Surface Experiments Package, and visited Surveyor 3 before returning to orbit.", [
        "nasa-apollo-12",
        "nasa-alsj",
      ]),
    ],
    scientificLegacy: [
      s("Apollo 12 proved that crews could land near a preselected target and conduct coordinated field investigations.", [
        "nasa-apollo-12",
        "nssdc-apollo-12",
      ]),
      s("The mission returned samples from a second lunar site and demonstrated the value of visiting older robotic hardware.", [
        "nasa-apollo-12",
      ]),
    ],
    originalFunction:
      "Crewed lunar landing vehicle, surface habitat, and experiment platform.",
    currentCondition:
      "The descent stage remains at its landing site, unpowered and physically exposed to the lunar environment.",
    images: [
      image(
        "as12-47-6913",
        "Apollo 12 astronaut Charles Conrad works at the Lunar Module during the Oceanus Procellarum mission.",
      ),
      image(
        "as12-46-6726",
        "Apollo 12 Lunar Module ladder and landing gear on the Moon.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "a12-launch",
        date: "1969-11-14",
        dateLabel: "14 NOV 1969",
        type: "launch",
        title: "Apollo 12 launches",
        summary:
          "The second crewed lunar landing mission departs Kennedy Space Center.",
        sourceIds: ["nasa-apollo-12", "nssdc-apollo-12"],
        significance: "primary",
      },
      {
        id: "a12-landing",
        date: "1969-11-19",
        dateLabel: "19 NOV 1969",
        type: "landing",
        title: "Intrepid lands in Oceanus Procellarum",
        summary:
          "Conrad and Bean touch down within walking distance of Surveyor 3.",
        sourceIds: ["nasa-apollo-12", "nssdc-apollo-sites"],
        significance: "primary",
      },
      {
        id: "a12-eva",
        date: "1969-11-19",
        dateLabel: "19-20 NOV 1969",
        type: "discovery",
        title: "Surveyor 3 visited",
        summary:
          "The crew examines and samples parts of the robotic lander during two EVAs.",
        sourceIds: ["nasa-apollo-12", "nasa-alsj"],
        significance: "primary",
      },
      {
        id: "a12-return",
        date: "1969-11-24",
        dateLabel: "24 NOV 1969",
        type: "legacy",
        title: "Crew returns to Earth",
        summary:
          "The mission ends with a Pacific splashdown; the descent stage remains on the Moon.",
        sourceIds: ["nasa-apollo-12", "nssdc-apollo-12"],
      },
    ],
    claims: [
      {
        id: "a12-lm-claim-1",
        assertion:
          "Apollo 12 landed near Surveyor 3, allowing the crew to inspect a spacecraft that had been on the Moon since 1967.",
        status: "verified",
        category: "historical",
        sourceIds: ["nasa-apollo-12", "nasa-alsj"],
      },
      {
        id: "a12-lm-claim-2",
        assertion:
          "The Intrepid descent stage remains on the lunar surface after the crew departed.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nssdc-apollo-12", "nssdc-apollo-sites"],
      },
      {
        id: "a12-lm-claim-3",
        assertion:
          "Apollo 12's precision landing was a major step toward targeted lunar exploration.",
        status: "interpretation",
        category: "historical",
        sourceIds: ["nasa-apollo-12", "nssdc-apollo-12"],
      },
    ],
    sourceIds: [
      "nasa-apollo-12",
      "nssdc-apollo-12",
      "nssdc-apollo-sites",
      "nssdc-apollo-landings",
      "nasa-alsj",
      "nasa-image-as12-47-6913",
      "nasa-image-as12-46-6726",
    ],
    legacy: {
      dimensions: {
        scientific: 87,
        mission: 90,
        historical: 90,
        longevity: 32,
        continued: 44,
      },
      rationales: {
        scientific:
          "Returned samples and examined Surveyor 3, adding a second lunar field site to the Apollo record.",
        mission:
          "Demonstrated precision landing and two coordinated surface EVAs.",
        historical:
          "The first mission to visit another spacecraft on the Moon.",
        longevity:
          "Present for more than five decades, with no active systems.",
        continued:
          "Primarily a heritage and archaeological site; its experiments were not designed for indefinite operation.",
      },
    },
  },
  {
    id: "apollo-15-lunar-roving-vehicle",
    name: "Apollo 15 Lunar Roving Vehicle",
    shortName: "Apollo 15 LRV",
    mission: "Apollo 15",
    missionShort: "Apollo 15",
    destination: "Moon",
    category: "Crewed surface vehicle",
    physicalStatus: "present",
    operationalStatus: "decommissioned",
    landingDate: "1971-07-30",
    endDate: "1971-08-02",
    coordinates: {
      latitude: 26.13239,
      longitude: 3.6333,
      label: "Hadley-Apennine, near the Falcon landing site",
      precision: "approximate",
      sourceIds: ["nssdc-apollo-sites"],
    },
    plannedLifetime: {
      value: 3,
      unit: "days",
      label: "Three EVA days",
    },
    actualLifetime: {
      value: 3,
      unit: "days",
      label: "Used across three EVAs",
    },
    lifetimeBasis: "Surface mission duration",
    description:
      "The first Lunar Roving Vehicle carried David Scott and James Irwin across the Hadley-Apennine region, extending the range and scientific productivity of Apollo surface work. The rover was left near the landing site after the third EVA, making it one of the most recognizable vehicles beyond Earth.",
    purpose: [
      s("Extend astronaut mobility and enable geological traverses far from the Lunar Module.", [
        "nasa-apollo-15",
        "nssdc-apollo-15",
      ]),
      s("Carry tools, samples, cameras, and communications equipment across the Hadley-Apennine terrain.", [
        "nasa-apollo-15",
        "nasa-alsj",
      ]),
    ],
    operationalHistory: [
      s("The rover was deployed during the Apollo 15 mission in July 1971 and used across three surface EVAs.", [
        "nasa-apollo-15",
        "nssdc-apollo-15",
      ]),
      s("Apollo 15's traverses covered about 27.9 kilometers, including excursions to Hadley Rille and the Apennine front.", [
        "nssdc-apollo-landings",
        "nasa-alsj",
      ]),
    ],
    scientificLegacy: [
      s("The LRV transformed lunar fieldwork by allowing crews to sample diverse geological units and return a larger, more representative collection.", [
        "nasa-apollo-15",
        "nasa-alsj",
      ]),
      s("The Apollo 15 rover established the design and operational pattern for the final two crewed lunar missions.", [
        "nasa-apollo-15",
      ]),
    ],
    originalFunction:
      "Battery-powered crewed rover for lunar surface exploration.",
    currentCondition:
      "The rover remains on the Moon near the Apollo 15 landing site. It is unpowered and was not intended to be recovered.",
    images: [
      image(
        "as15-86-11603",
        "Apollo 15 astronaut James Irwin working at the Lunar Roving Vehicle with Mount Hadley in the background.",
      ),
      image(
        "as15-086-11600",
        "Apollo 15 Lunar Module Falcon and Lunar Roving Vehicle on the lunar surface.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "a15-launch",
        date: "1971-07-26",
        dateLabel: "26 JUL 1971",
        type: "launch",
        title: "Apollo 15 launches",
        summary:
          "The first J-mission carries a Lunar Roving Vehicle and expanded scientific payload.",
        sourceIds: ["nasa-apollo-15", "nssdc-apollo-15"],
        significance: "primary",
      },
      {
        id: "a15-landing",
        date: "1971-07-30",
        dateLabel: "30 JUL 1971",
        type: "landing",
        title: "Falcon lands at Hadley-Apennine",
        summary:
          "The crew arrives at a site selected for its complex geology.",
        sourceIds: ["nasa-apollo-15", "nssdc-apollo-sites"],
        significance: "primary",
      },
      {
        id: "a15-eva1",
        date: "1971-07-31",
        dateLabel: "31 JUL 1971",
        type: "deployment",
        title: "LRV enters service",
        summary:
          "The rover supports the first of three extended geological traverses.",
        sourceIds: ["nasa-apollo-15", "nasa-alsj"],
        significance: "primary",
      },
      {
        id: "a15-end",
        date: "1971-08-02",
        dateLabel: "02 AUG 1971",
        type: "end",
        title: "Final EVA ends",
        summary:
          "The rover is parked as the crew prepares to leave; it remains on the surface.",
        sourceIds: ["nasa-apollo-15", "nasa-alsj"],
      },
      {
        id: "a15-return",
        date: "1971-08-07",
        dateLabel: "07 AUG 1971",
        type: "legacy",
        title: "Mission ends",
        summary:
          "Apollo 15 returns to Earth with a substantially larger sample collection.",
        sourceIds: ["nasa-apollo-15", "nssdc-apollo-15"],
      },
    ],
    claims: [
      {
        id: "a15-lrv-claim-1",
        assertion:
          "The Apollo 15 LRV was the first crewed vehicle driven on the Moon.",
        status: "verified",
        category: "historical",
        sourceIds: ["nasa-apollo-15", "nssdc-apollo-15"],
      },
      {
        id: "a15-lrv-claim-2",
        assertion:
          "Apollo 15's surface traverses covered about 27.9 kilometers.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nssdc-apollo-landings", "nasa-alsj"],
      },
      {
        id: "a15-lrv-claim-3",
        assertion:
          "The rover remains near the Hadley-Apennine landing site.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nssdc-apollo-sites", "nasa-alsj"],
      },
    ],
    sourceIds: [
      "nasa-apollo-15",
      "nssdc-apollo-15",
      "nssdc-apollo-sites",
      "nssdc-apollo-landings",
      "nasa-alsj",
      "nasa-image-as15-86-11603",
      "nasa-image-as15-086-11600",
    ],
    legacy: {
      dimensions: {
        scientific: 95,
        mission: 94,
        historical: 98,
        longevity: 42,
        continued: 38,
      },
      rationales: {
        scientific:
          "Enabled extended geological traverses and a much richer sample collection.",
        mission:
          "Central to the success of the first extended J-mission.",
        historical:
          "The first crewed rover driven on another world.",
        longevity:
          "Left on the Moon after a three-day surface mission.",
        continued:
          "No active function; its value is historical and archaeological.",
      },
    },
    featured: true,
  },
  {
    id: "apollo-17-lunar-module",
    name: "Apollo 17 Lunar Module Challenger — Descent Stage",
    shortName: "Challenger Descent Stage",
    mission: "Apollo 17",
    missionShort: "Apollo 17",
    destination: "Moon",
    category: "Crewed lunar module",
    physicalStatus: "present",
    operationalStatus: "decommissioned",
    landingDate: "1972-12-11",
    endDate: "1972-12-14",
    coordinates: {
      latitude: 20.1911,
      longitude: 30.7723,
      label: "Taurus-Littrow valley",
      precision: "exact",
      sourceIds: ["nssdc-apollo-sites"],
    },
    actualLifetime: {
      value: 75,
      unit: "hours",
      label: "Crewed surface stay",
      approximate: true,
    },
    lifetimeBasis: "Time spent on the lunar surface by the crew",
    description:
      "Challenger's descent stage supported the final Apollo lunar landing in the Taurus-Littrow valley, a site selected for its combination of ancient highland material and young volcanic features. It remains on the Moon as the base of the last crewed lunar outpost of the Apollo era.",
    purpose: [
      s("Land Eugene Cernan and Harrison Schmitt in the geologically diverse Taurus-Littrow valley.", [
        "nasa-apollo-17",
        "nssdc-apollo-17",
      ]),
      s("Serve as the crew habitat and platform for three EVAs and the Lunar Roving Vehicle.", [
        "nasa-apollo-17",
        "nasa-alsj",
      ]),
    ],
    operationalHistory: [
      s("Challenger landed on 11 December 1972 with the only geologist to walk on the Moon.", [
        "nasa-apollo-17",
        "nssdc-apollo-17",
      ]),
      s("The crew completed three EVAs and returned 110.5 kilograms of samples before the ascent stage departed on 14 December.", [
        "nssdc-apollo-landings",
        "nasa-alsj",
      ]),
    ],
    scientificLegacy: [
      s("Apollo 17 returned the largest Apollo sample collection and documented volcanic and highland geology in the Taurus-Littrow region.", [
        "nasa-apollo-17",
        "nssdc-apollo-landings",
      ]),
      s("The site remains the final crewed lunar landing site and a key target for orbital archaeology.", [
        "nasa-apollo-17",
        "nssdc-apollo-sites",
      ]),
    ],
    originalFunction:
      "Crewed lunar landing vehicle, surface habitat, and equipment platform.",
    currentCondition:
      "The descent stage remains at Taurus-Littrow. The ascent stage was deliberately impacted into the Moon after the crew returned to orbit.",
    images: [
      image(
        "PIA12920",
        "Lunar Reconnaissance Orbiter image of the Apollo 17 Challenger descent stage at Taurus-Littrow.",
      ),
      image(
        "S72-55421",
        "Apollo 17 Lunar Module ascent stage lifting off from the Moon, leaving the descent stage behind.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "a17-launch",
        date: "1972-12-07",
        dateLabel: "07 DEC 1972",
        type: "launch",
        title: "Apollo 17 launches",
        summary:
          "The final Apollo lunar landing mission begins with a night launch.",
        sourceIds: ["nasa-apollo-17", "nssdc-apollo-17"],
        significance: "primary",
      },
      {
        id: "a17-landing",
        date: "1972-12-11",
        dateLabel: "11 DEC 1972",
        type: "landing",
        title: "Challenger lands at Taurus-Littrow",
        summary:
          "Cernan and Schmitt set down in a valley selected for its geological contrast.",
        sourceIds: ["nasa-apollo-17", "nssdc-apollo-sites"],
        significance: "primary",
      },
      {
        id: "a17-eva",
        date: "1972-12-12",
        dateLabel: "12-14 DEC 1972",
        type: "discovery",
        title: "Three EVAs",
        summary:
          "The crew explores the valley, deploys experiments, and drives the LRV.",
        sourceIds: ["nasa-apollo-17", "nasa-alsj"],
        significance: "primary",
      },
      {
        id: "a17-ascent",
        date: "1972-12-14",
        dateLabel: "14 DEC 1972",
        type: "end",
        title: "Ascent stage departs",
        summary:
          "The descent stage is left behind as the last crewed Apollo ascent begins.",
        sourceIds: ["nasa-apollo-17", "nasa-alsj"],
      },
      {
        id: "a17-splashdown",
        date: "1972-12-19",
        dateLabel: "19 DEC 1972",
        type: "legacy",
        title: "Final Apollo lunar mission ends",
        summary:
          "The crew splashes down, closing the first era of human lunar exploration.",
        sourceIds: ["nasa-apollo-17", "nssdc-apollo-17"],
      },
    ],
    claims: [
      {
        id: "a17-lm-claim-1",
        assertion:
          "Apollo 17 was the final crewed landing of the Apollo program.",
        status: "verified",
        category: "historical",
        sourceIds: ["nasa-apollo-17", "nssdc-apollo-17"],
      },
      {
        id: "a17-lm-claim-2",
        assertion:
          "Challenger's descent stage remains at Taurus-Littrow after the ascent stage departed.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nssdc-apollo-sites", "nasa-alsj"],
      },
      {
        id: "a17-lm-claim-3",
        assertion:
          "The Apollo 17 crew returned the largest sample collection of the Apollo program.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nssdc-apollo-landings", "nasa-apollo-17"],
      },
    ],
    sourceIds: [
      "nasa-apollo-17",
      "nssdc-apollo-17",
      "nssdc-apollo-sites",
      "nssdc-apollo-landings",
      "nasa-alsj",
      "nasa-image-pia12920",
      "nasa-image-s72-55421",
    ],
    legacy: {
      dimensions: {
        scientific: 98,
        mission: 98,
        historical: 100,
        longevity: 35,
        continued: 48,
      },
      rationales: {
        scientific:
          "Returned the largest Apollo sample collection and studied a uniquely complex landing site.",
        mission:
          "A highly productive final Apollo mission with three EVAs and a trained geologist on the surface.",
        historical:
          "The last crewed landing on the Moon in the Apollo era.",
        longevity:
          "The descent stage has remained physically present since 1972.",
        continued:
          "Primarily a protected heritage site and a target for orbital archaeology.",
      },
    },
    featured: true,
  },
  {
    id: "lunokhod-1",
    name: "Lunokhod 1",
    shortName: "Lunokhod 1",
    mission: "Luna 17",
    missionShort: "Luna 17",
    destination: "Moon",
    category: "Robotic lunar rover",
    physicalStatus: "present",
    operationalStatus: "decommissioned",
    landingDate: "1970-11-17",
    endDate: "1971-10-04",
    coordinates: {
      latitude: 38.315,
      longitude: -35.008,
      label: "Mare Imbrium, near Promontorium Heraclides",
      precision: "exact",
      sourceIds: ["nasa-lroc-lunokhod"],
    },
    plannedLifetime: {
      value: 90,
      unit: "days",
      label: "Planned design life",
    },
    actualLifetime: {
      value: 322,
      unit: "days",
      label: "Operational lifetime",
    },
    lifetimeBasis: "Rover operations after landing",
    description:
      "Lunokhod 1 was the first robotic rover to explore another world. Delivered by the Soviet Luna 17 lander, the eight-wheeled vehicle was driven by a five-person team on Earth, returned thousands of images, analyzed the lunar soil, and demonstrated long-duration robotic exploration of the Moon.",
    purpose: [
      s("Demonstrate remotely operated roving and conduct scientific reconnaissance across Mare Imbrium.", [
        "nssdc-soviet-lunar",
        "nasa-lroc-lunokhod",
      ]),
      s("Return television imagery, soil measurements, and laser-ranging data from the lunar surface.", [
        "nasa-lroc-lunokhod",
        "nasa-lunokhod-photojournal",
      ]),
    ],
    operationalHistory: [
      s("Luna 17 landed on 17 November 1970 and Lunokhod 1 rolled onto the surface the same day.", [
        "nssdc-soviet-lunar",
        "nasa-lroc-lunokhod",
      ]),
      s("The rover operated for 322 Earth days across eleven lunar day-night cycles, traveling about 10.5 kilometers.", [
        "nasa-lroc-lunokhod",
        "nasa-lunokhod-photojournal",
      ]),
      s("Controllers lost contact after the lunar night that began in September 1971; operations officially ceased on 4 October 1971.", [
        "nasa-lroc-lunokhod",
        "nssdc-soviet-lunar",
      ]),
    ],
    scientificLegacy: [
      s("Lunokhod 1 proved that long-duration teleoperated rovers could work on another planetary body.", [
        "nasa-lroc-lunokhod",
        "nssdc-soviet-lunar",
      ]),
      s("Its retroreflector was later located and ranged after the rover was rediscovered in LRO imagery in 2010.", [
        "nasa-lroc-lunokhod",
        "ilrs-lunar-ranging",
      ]),
    ],
    originalFunction:
      "Solar-powered teleoperated rover carrying cameras and a scientific instrument suite.",
    currentCondition:
      "The rover and its Luna 17 lander remain at the Mare Imbrium site. The rover is inactive and was located in Lunar Reconnaissance Orbiter imagery.",
    images: [
      image(
        "PIA12967",
        "Lunar Reconnaissance Orbiter image showing the Luna 17 lander and tracks left by Lunokhod 1 on the Moon.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "lun1-launch",
        date: "1970-11-10",
        dateLabel: "10 NOV 1970",
        type: "launch",
        title: "Luna 17 launches",
        summary:
          "The Soviet mission begins its journey to Mare Imbrium.",
        sourceIds: ["nssdc-soviet-lunar"],
        significance: "primary",
      },
      {
        id: "lun1-landing",
        date: "1970-11-17",
        dateLabel: "17 NOV 1970",
        type: "landing",
        title: "Luna 17 lands",
        summary:
          "The lander touches down and prepares its ramps for the rover.",
        sourceIds: ["nssdc-soviet-lunar", "nasa-lroc-lunokhod"],
        significance: "primary",
      },
      {
        id: "lun1-rollout",
        date: "1970-11-17",
        dateLabel: "17 NOV 1970",
        type: "deployment",
        title: "Lunokhod 1 rolls onto the Moon",
        summary:
          "The first robotic rover begins operations beyond Earth.",
        sourceIds: ["nasa-lroc-lunokhod", "nasa-lunokhod-photojournal"],
        significance: "primary",
      },
      {
        id: "lun1-last-contact",
        date: "1971-09-14",
        dateLabel: "14 SEP 1971",
        type: "loss",
        title: "Final communications session",
        summary:
          "Contact is lost as the rover enters the lunar night.",
        sourceIds: ["nasa-lroc-lunokhod"],
        significance: "primary",
      },
      {
        id: "lun1-end",
        date: "1971-10-04",
        dateLabel: "04 OCT 1971",
        type: "end",
        title: "Operations cease",
        summary:
          "The mission is formally ended after unsuccessful attempts to reestablish contact.",
        sourceIds: ["nasa-lroc-lunokhod", "nssdc-soviet-lunar"],
      },
      {
        id: "lun1-found",
        date: "2010-03-17",
        dateLabel: "17 MAR 2010",
        type: "legacy",
        title: "Rover rediscovered in LRO imagery",
        summary:
          "Lunar Reconnaissance Orbiter images reveal the rover's final parking place.",
        sourceIds: ["nasa-lroc-lunokhod", "nasa-lunokhod-photojournal"],
        significance: "primary",
      },
    ],
    claims: [
      {
        id: "lun1-claim-1",
        assertion:
          "Lunokhod 1 was the first robotic rover to operate on another world.",
        status: "verified",
        category: "historical",
        sourceIds: ["nssdc-soviet-lunar", "nasa-lunokhod-photojournal"],
      },
      {
        id: "lun1-claim-2",
        assertion:
          "Lunokhod 1 operated for 322 Earth days, far beyond its planned 90-day design life.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-lroc-lunokhod", "nssdc-soviet-lunar"],
      },
      {
        id: "lun1-claim-3",
        assertion:
          "The rover was rediscovered in Lunar Reconnaissance Orbiter images in 2010.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-lroc-lunokhod", "nasa-lunokhod-photojournal"],
      },
    ],
    sourceIds: [
      "nssdc-soviet-lunar",
      "nasa-lroc-lunokhod",
      "nasa-lunokhod-photojournal",
      "ilrs-lunar-ranging",
      "nasa-image-pia12967",
    ],
    legacy: {
      dimensions: {
        scientific: 88,
        mission: 92,
        historical: 97,
        longevity: 96,
        continued: 88,
      },
      rationales: {
        scientific:
          "Returned extensive imagery, soil measurements, and a laser-ranging target from Mare Imbrium.",
        mission:
          "A landmark Soviet mission and the first successful planetary rover.",
        historical:
          "The first wheeled vehicle to explore another world.",
        longevity:
          "Operated for 322 days, more than three times its planned design life.",
        continued:
          "Its retroreflector remains usable for laser ranging, linking the mission to current lunar science.",
      },
    },
    featured: true,
  },
  {
    id: "surveyor-3",
    name: "Surveyor 3",
    shortName: "Surveyor 3",
    mission: "Surveyor 3",
    missionShort: "Surveyor 3",
    destination: "Moon",
    category: "Robotic lunar lander",
    physicalStatus: "present",
    operationalStatus: "decommissioned",
    landingDate: "1967-04-20",
    endDate: "1967-05-04",
    coordinates: {
      latitude: 2.94,
      longitude: -23.34,
      label: "Oceanus Procellarum, inside a 200 m crater",
      precision: "approximate",
      sourceIds: ["nssdc-surveyor-3"],
    },
    plannedLifetime: {
      value: 30,
      unit: "days",
      label: "Nominal surface mission",
      approximate: true,
    },
    actualLifetime: {
      value: 14,
      unit: "days",
      label: "Operated through one lunar day",
    },
    lifetimeBasis: "Surface operations after landing",
    description:
      "Surveyor 3 was the third NASA spacecraft to soft-land on the Moon and the first to land inside a crater. Its television camera and soil-mechanics sampler studied the lunar surface until the first lunar night. Two and a half years later, Apollo 12 astronauts visited it, removed components, and returned them to Earth for study.",
    purpose: [
      s("Demonstrate lunar soft-landing technology and characterize the lunar surface for Apollo.", [
        "nasa-surveyor-3",
        "nssdc-surveyor-3",
      ]),
      s("Use a television camera and soil mechanics surface sampler to study the regolith inside a crater.", [
        "nasa-surveyor-3",
        "nssdc-surveyor-3",
      ]),
    ],
    operationalHistory: [
      s("Surveyor 3 landed on 20 April 1967 in Oceanus Procellarum and operated through the end of the lunar day.", [
        "nasa-surveyor-3",
        "nssdc-surveyor-3",
      ]),
      s("The spacecraft was shut down for lunar night and did not revive, ending operations on 4 May 1967.", [
        "nssdc-surveyor-3",
        "nasa-surveyor-3",
      ]),
      s("Apollo 12 astronauts visited Surveyor 3 in November 1969 and returned selected parts to Earth.", [
        "nasa-apollo-12",
        "nasa-alsj",
      ]),
    ],
    scientificLegacy: [
      s("Surveyor 3 helped confirm that lunar soil could support a crewed lander and informed Apollo landing design.", [
        "nasa-surveyor-3",
        "nssdc-surveyor-3",
      ]),
      s("The Apollo 12 visit made Surveyor 3 the first spacecraft on another world to be inspected by humans and sampled for return.", [
        "nasa-apollo-12",
        "nasa-alsj",
      ]),
    ],
    originalFunction:
      "Robotic lunar soft lander with television and soil-mechanics instruments.",
    currentCondition:
      "The lander remains in its crater. Some components were removed by Apollo 12 astronauts and returned to Earth.",
    images: [
      image(
        "as12-48-7121",
        "Surveyor 3 spacecraft resting in its crater on the Moon, photographed during Apollo 12.",
      ),
      image(
        "AS12-48-7133",
        "Apollo 12 Lunar Module in the background and Surveyor 3 in the foreground on the lunar surface.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "s3-launch",
        date: "1967-04-17",
        dateLabel: "17 APR 1967",
        type: "launch",
        title: "Surveyor 3 launches",
        summary:
          "The third Surveyor mission begins its journey to Oceanus Procellarum.",
        sourceIds: ["nssdc-surveyor-3", "nasa-surveyor-3"],
      },
      {
        id: "s3-landing",
        date: "1967-04-20",
        dateLabel: "20 APR 1967",
        type: "landing",
        title: "Surveyor 3 lands in a crater",
        summary:
          "The spacecraft touches down on a sloping crater wall.",
        sourceIds: ["nssdc-surveyor-3", "nasa-surveyor-3"],
        significance: "primary",
      },
      {
        id: "s3-science",
        date: "1967-04-21",
        dateLabel: "APR 1967",
        type: "discovery",
        title: "Surface investigations",
        summary:
          "The camera and soil sampler return data on the lunar regolith.",
        sourceIds: ["nasa-surveyor-3", "nssdc-surveyor-3"],
      },
      {
        id: "s3-shutdown",
        date: "1967-05-04",
        dateLabel: "04 MAY 1967",
        type: "end",
        title: "Operations end",
        summary:
          "The lander is shut down for lunar night and does not revive.",
        sourceIds: ["nssdc-surveyor-3", "nasa-surveyor-3"],
      },
      {
        id: "s3-visit",
        date: "1969-11-20",
        dateLabel: "20 NOV 1969",
        type: "legacy",
        title: "Apollo 12 visits Surveyor 3",
        summary:
          "Astronauts inspect the lander and return components to Earth.",
        sourceIds: ["nasa-apollo-12", "nasa-alsj"],
        significance: "primary",
      },
    ],
    claims: [
      {
        id: "s3-claim-1",
        assertion:
          "Surveyor 3 landed in Oceanus Procellarum on 20 April 1967.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nssdc-surveyor-3", "nasa-surveyor-3"],
      },
      {
        id: "s3-claim-2",
        assertion:
          "Apollo 12 astronauts visited Surveyor 3 and returned selected parts to Earth.",
        status: "verified",
        category: "historical",
        sourceIds: ["nasa-apollo-12", "nasa-alsj"],
      },
      {
        id: "s3-claim-3",
        assertion:
          "Surveyor 3 helped validate the lunar surface conditions expected by Apollo crews.",
        status: "interpretation",
        category: "scientific",
        sourceIds: ["nasa-surveyor-3", "nssdc-surveyor-3"],
      },
    ],
    sourceIds: [
      "nasa-surveyor-3",
      "nssdc-surveyor-3",
      "nasa-apollo-12",
      "nasa-alsj",
      "nasa-image-as12-48-7121",
      "nasa-image-as12-48-7133",
    ],
    legacy: {
      dimensions: {
        scientific: 86,
        mission: 90,
        historical: 93,
        longevity: 55,
        continued: 65,
      },
      rationales: {
        scientific:
          "Characterized the lunar regolith and demonstrated soil mechanics on the surface.",
        mission:
          "Reduced uncertainty for Apollo landing design and operations.",
        historical:
          "The first spacecraft visited by humans on another world.",
        longevity:
          "Operated for one lunar day and has remained physically present since 1967.",
        continued:
          "Its returned components and site remain valuable for materials and heritage research.",
      },
    },
  },
  {
    id: "sojourner",
    name: "Sojourner",
    shortName: "Sojourner",
    mission: "Mars Pathfinder",
    missionShort: "Pathfinder",
    destination: "Mars",
    category: "Robotic Mars rover",
    physicalStatus: "present-unverified",
    operationalStatus: "inactive",
    landingDate: "1997-07-04",
    endDate: "1997-09-27",
    coordinates: {
      latitude: 19.13,
      longitude: -33.22,
      label: "Ares Vallis, Chryse Planitia region",
      precision: "landing-ellipse",
      sourceIds: ["nssdc-mars-pathfinder", "nasa-mars-pathfinder"],
    },
    plannedLifetime: {
      value: 7,
      unit: "sols",
      label: "Planned rover demonstration",
    },
    actualLifetime: {
      value: 83,
      unit: "sols",
      label: "Operational lifetime",
    },
    lifetimeBasis: "Rover operations after deployment",
    description:
      "Sojourner was the first rover to operate on Mars. A small, six-wheeled technology demonstrator, it was deployed from the Mars Pathfinder lander in 1997, analyzed rocks and soil, and proved that mobile robotic field geology was practical on another planet.",
    purpose: [
      s("Demonstrate a low-cost Mars lander, airbag landing system, and microrover.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
      s("Use an alpha proton X-ray spectrometer and imaging to study rocks and soil around the lander.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
    ],
    operationalHistory: [
      s("Pathfinder landed in Ares Vallis on 4 July 1997 and Sojourner rolled onto the surface the following day.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
      s("Sojourner operated for 83 sols, far longer than its seven-sol planned demonstration.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
      s("The last transmission from the landed system was received on 27 September 1997.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
    ],
    scientificLegacy: [
      s("Sojourner established the operational model for later Mars rovers and returned close-up analyses of Martian rocks and soil.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
      s("The Pathfinder mission demonstrated airbag landing and low-cost planetary exploration.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
    ],
    originalFunction:
      "Microrover technology demonstrator and mobile geology platform.",
    currentCondition:
      "The rover and lander are believed to remain in the Ares Vallis region, but the exact final rover position has not been directly imaged since contact was lost.",
    images: [
      image(
        "PIA01551",
        "Sojourner rover deployed on the Martian surface beside the Mars Pathfinder lander.",
      ),
      image(
        "PIA01121",
        "View from Sojourner showing the Pathfinder lander and its ramps on Mars.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "soj-launch",
        date: "1996-12-04",
        dateLabel: "04 DEC 1996",
        type: "launch",
        title: "Mars Pathfinder launches",
        summary:
          "The spacecraft begins its journey to Ares Vallis.",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
      },
      {
        id: "soj-landing",
        date: "1997-07-04",
        dateLabel: "04 JUL 1997",
        type: "landing",
        title: "Pathfinder lands on Mars",
        summary:
          "Airbags cushion the lander's touchdown in Ares Vallis.",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
        significance: "primary",
      },
      {
        id: "soj-deploy",
        date: "1997-07-05",
        dateLabel: "05 JUL 1997",
        type: "deployment",
        title: "Sojourner rolls onto Mars",
        summary:
          "The first Mars rover begins mobile operations.",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
        significance: "primary",
      },
      {
        id: "soj-lost",
        date: "1997-09-27",
        dateLabel: "27 SEP 1997",
        type: "loss",
        title: "Last contact",
        summary:
          "The landed system falls silent after 83 sols of operations.",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
      },
      {
        id: "soj-legacy",
        date: "1998-03-10",
        dateLabel: "10 MAR 1998",
        type: "end",
        title: "Pathfinder mission ends",
        summary:
          "NASA concludes the mission after months of unsuccessful contact attempts.",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
      },
    ],
    claims: [
      {
        id: "soj-claim-1",
        assertion:
          "Sojourner was the first rover to operate on Mars.",
        status: "verified",
        category: "historical",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
      },
      {
        id: "soj-claim-2",
        assertion:
          "Sojourner operated for 83 sols, far beyond its planned seven-sol demonstration.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
      },
      {
        id: "soj-claim-3",
        assertion:
          "The final position of Sojourner has not been directly confirmed by later orbital imaging.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
        note: "The landed system's location is known only approximately.",
      },
    ],
    sourceIds: [
      "nasa-mars-pathfinder",
      "nssdc-mars-pathfinder",
      "nasa-image-pia01551",
      "nasa-image-pia01121",
    ],
    legacy: {
      dimensions: {
        scientific: 84,
        mission: 88,
        historical: 99,
        longevity: 91,
        continued: 56,
      },
      rationales: {
        scientific:
          "Returned close-up rock and soil measurements and demonstrated mobile field geology.",
        mission:
          "A low-cost technology demonstration that exceeded its planned rover lifetime.",
        historical:
          "The first rover on Mars and a template for Spirit, Opportunity, Curiosity, and Perseverance.",
        longevity:
          "Operated for 83 sols against a seven-sol plan.",
        continued:
          "Its lessons continue in rover design, but the hardware is no longer active.",
      },
    },
    featured: true,
  },
  {
    id: "spirit",
    name: "Spirit",
    shortName: "Spirit",
    mission: "Mars Exploration Rover A",
    missionShort: "MER-A",
    destination: "Mars",
    category: "Robotic Mars rover",
    physicalStatus: "present-unverified",
    operationalStatus: "inactive",
    landingDate: "2004-01-04",
    endDate: "2011-05-25",
    coordinates: {
      latitude: -14.5718,
      longitude: 175.4785,
      label: "Gusev Crater, landing region",
      precision: "landing-ellipse",
      sourceIds: ["nssdc-spirit", "nasa-mer-spirit"],
    },
    plannedLifetime: {
      value: 90,
      unit: "sols",
      label: "Primary mission",
    },
    actualLifetime: {
      value: 2208,
      unit: "sols",
      label: "Last contact",
      approximate: true,
    },
    lifetimeBasis: "Rover operations after landing",
    description:
      "Spirit was one of two identical Mars Exploration Rovers designed for a 90-sol mission. Instead, it operated for more than six years, climbed Husband Hill, found evidence of ancient water-altered rocks, survived Martian winters, and became trapped in soft soil before contact was lost.",
    purpose: [
      s("Search for evidence of past water activity and habitable environments in Gusev Crater.", [
        "nasa-mer-spirit",
        "nssdc-spirit",
      ]),
      s("Study the geology, atmosphere, and surface processes of Mars with a mobile field geologist.", [
        "nasa-mer-spirit",
        "nssdc-spirit",
      ]),
    ],
    operationalHistory: [
      s("Spirit landed in Gusev Crater on 4 January 2004 and began a mission planned for 90 sols.", [
        "nasa-mer-spirit",
        "nssdc-spirit",
      ]),
      s("The rover climbed Husband Hill, explored Home Plate, and returned evidence of water-altered minerals.", [
        "nasa-mer-spirit",
      ]),
      s("Spirit became embedded in soft soil in 2009; the last contact was received on 22 March 2010, and NASA ended the mission in 2011.", [
        "nasa-mer-spirit",
        "nssdc-spirit",
      ]),
    ],
    scientificLegacy: [
      s("Spirit found strong evidence that ancient Mars had water and environments capable of altering rocks.", [
        "nasa-mer-spirit",
      ]),
      s("The rover demonstrated the value of long-lived, mobile science platforms and helped shape the Mars Exploration Program.", [
        "nasa-mer-spirit",
        "nssdc-spirit",
      ]),
    ],
    originalFunction:
      "Mobile geological field laboratory with panoramic cameras and spectrometers.",
    currentCondition:
      "The rover is believed to remain in Gusev Crater, stationary after becoming embedded in soil. It is inactive and has not communicated since 2010.",
    images: [
      image(
        "PIA05120",
        "Orbital view of the terrain around Spirit's landing site in Gusev Crater.",
      ),
      image(
        "PIA07410",
        "Spirit panoramic view from Cumberland Ridge on Mars, showing Husband Hill.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "spirit-launch",
        date: "2003-06-10",
        dateLabel: "10 JUN 2003",
        type: "launch",
        title: "Spirit launches",
        summary:
          "MER-A begins its journey to Gusev Crater.",
        sourceIds: ["nasa-mer-spirit", "nssdc-spirit"],
      },
      {
        id: "spirit-landing",
        date: "2004-01-04",
        dateLabel: "04 JAN 2004",
        type: "landing",
        title: "Spirit lands",
        summary:
          "The rover arrives in Gusev Crater for a 90-sol primary mission.",
        sourceIds: ["nasa-mer-spirit", "nssdc-spirit"],
        significance: "primary",
      },
      {
        id: "spirit-husband",
        date: "2005-08-01",
        dateLabel: "2005",
        type: "discovery",
        title: "Husband Hill summit",
        summary:
          "Spirit reaches the summit after a long climb and surveys the surrounding terrain.",
        sourceIds: ["nasa-mer-spirit"],
        significance: "primary",
      },
      {
        id: "spirit-stuck",
        date: "2009-05-01",
        dateLabel: "MAY 2009",
        type: "loss",
        title: "Spirit becomes embedded",
        summary:
          "The rover's wheels sink into soft soil at Troy.",
        sourceIds: ["nasa-mer-spirit"],
      },
      {
        id: "spirit-last",
        date: "2010-03-22",
        dateLabel: "22 MAR 2010",
        type: "loss",
        title: "Last contact",
        summary:
          "The rover falls silent after more than 2,200 sols.",
        sourceIds: ["nasa-mer-spirit", "nssdc-spirit"],
        significance: "primary",
      },
      {
        id: "spirit-end",
        date: "2011-05-25",
        dateLabel: "25 MAY 2011",
        type: "end",
        title: "Mission declared complete",
        summary:
          "NASA ends recovery efforts after repeated attempts to contact the rover.",
        sourceIds: ["nasa-mer-spirit", "nssdc-spirit"],
      },
    ],
    claims: [
      {
        id: "spirit-claim-1",
        assertion:
          "Spirit operated for more than 2,200 sols despite a 90-sol primary mission.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-mer-spirit", "nssdc-spirit"],
      },
      {
        id: "spirit-claim-2",
        assertion:
          "Spirit found evidence for ancient water-altered environments in Gusev Crater.",
        status: "interpretation",
        category: "scientific",
        sourceIds: ["nasa-mer-spirit"],
      },
      {
        id: "spirit-claim-3",
        assertion:
          "The rover is believed to remain in Gusev Crater after contact was lost.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-mer-spirit", "nssdc-spirit"],
      },
    ],
    sourceIds: [
      "nasa-mer-spirit",
      "nssdc-spirit",
      "nasa-image-pia05120",
      "nasa-image-pia07410",
    ],
    legacy: {
      dimensions: {
        scientific: 96,
        mission: 94,
        historical: 97,
        longevity: 99,
        continued: 74,
      },
      rationales: {
        scientific:
          "Produced strong evidence for ancient water and habitable conditions in Gusev Crater.",
        mission:
          "An extended mission that far exceeded its design life and objectives.",
        historical:
          "Part of the twin-rover generation that transformed Mars exploration.",
        longevity:
          "Operated for 2,208 sols against a 90-sol plan.",
        continued:
          "Its data remain in active scientific use, but the hardware is inactive.",
      },
    },
    featured: true,
  },
  {
    id: "opportunity",
    name: "Opportunity",
    shortName: "Opportunity",
    mission: "Mars Exploration Rover B",
    missionShort: "MER-B",
    destination: "Mars",
    category: "Robotic Mars rover",
    physicalStatus: "present-unverified",
    operationalStatus: "inactive",
    landingDate: "2004-01-25",
    endDate: "2019-02-13",
    coordinates: {
      latitude: -1.9462,
      longitude: -5.5266,
      label: "Meridiani Planum, near Endeavour Crater",
      precision: "landing-ellipse",
      sourceIds: ["nssdc-opportunity", "nasa-mer-opportunity"],
    },
    plannedLifetime: {
      value: 90,
      unit: "sols",
      label: "Primary mission",
    },
    actualLifetime: {
      value: 5111,
      unit: "sols",
      label: "Last contact",
      approximate: true,
    },
    lifetimeBasis: "Rover operations after landing",
    description:
      "Opportunity turned a 90-sol rover mission into a 14-year exploration of Meridiani Planum. It found evidence of ancient water, explored Victoria and Endeavour craters, drove farther than any other rover on another world, and finally fell silent after a planet-wide dust storm.",
    purpose: [
      s("Investigate sedimentary rocks and ancient environmental conditions at Meridiani Planum.", [
        "nasa-mer-opportunity",
        "nssdc-opportunity",
      ]),
      s("Search for evidence of past water and assess the habitability of the landing region.", [
        "nasa-mer-opportunity",
        "nssdc-opportunity",
      ]),
    ],
    operationalHistory: [
      s("Opportunity landed on 25 January 2004 and completed a primary mission planned for 90 sols.", [
        "nasa-mer-opportunity",
        "nssdc-opportunity",
      ]),
      s("The rover explored Victoria Crater and Endeavour Crater, traveling more than 45 kilometers over its mission.", [
        "nasa-mer-opportunity",
      ]),
      s("A global dust storm cut solar power in 2018; the last contact was received on 10 June 2018, and NASA declared the mission complete on 13 February 2019.", [
        "nasa-mer-opportunity",
        "nssdc-opportunity",
      ]),
    ],
    scientificLegacy: [
      s("Opportunity found mineral and sedimentary evidence of ancient water at Meridiani Planum.", [
        "nasa-mer-opportunity",
      ]),
      s("Its long traverse produced a regional geological record and set a distance record for driving on another world.", [
        "nasa-mer-opportunity",
      ]),
    ],
    originalFunction:
      "Mobile geological field laboratory with panoramic cameras and spectrometers.",
    currentCondition:
      "The rover is believed to remain in Perseverance Valley on the western rim of Endeavour Crater. It is inactive and has not communicated since June 2018.",
    images: [
      image(
        "PIA17759",
        "Self-portrait of the Opportunity rover on Mars, assembled from images taken in January 2014.",
      ),
      image(
        "PIA21708",
        "Opportunity view of Orion Crater on the western rim of Endeavour Crater.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "opp-launch",
        date: "2003-07-07",
        dateLabel: "07 JUL 2003",
        type: "launch",
        title: "Opportunity launches",
        summary:
          "MER-B begins its journey to Meridiani Planum.",
        sourceIds: ["nasa-mer-opportunity", "nssdc-opportunity"],
      },
      {
        id: "opp-landing",
        date: "2004-01-25",
        dateLabel: "25 JAN 2004",
        type: "landing",
        title: "Opportunity lands",
        summary:
          "The rover arrives in Meridiani Planum for a 90-sol mission.",
        sourceIds: ["nasa-mer-opportunity", "nssdc-opportunity"],
        significance: "primary",
      },
      {
        id: "opp-victoria",
        date: "2006-09-01",
        dateLabel: "2006",
        type: "discovery",
        title: "Victoria Crater reached",
        summary:
          "Opportunity begins a detailed investigation of Victoria Crater.",
        sourceIds: ["nasa-mer-opportunity"],
        significance: "primary",
      },
      {
        id: "opp-endeavour",
        date: "2011-08-01",
        dateLabel: "2011",
        type: "discovery",
        title: "Endeavour Crater reached",
        summary:
          "The rover arrives at a much older crater with water-altered rocks.",
        sourceIds: ["nasa-mer-opportunity"],
        significance: "primary",
      },
      {
        id: "opp-storm",
        date: "2018-06-10",
        dateLabel: "10 JUN 2018",
        type: "loss",
        title: "Dust storm silences Opportunity",
        summary:
          "The last contact is received as a global dust storm blocks sunlight.",
        sourceIds: ["nasa-mer-opportunity", "nssdc-opportunity"],
        significance: "primary",
      },
      {
        id: "opp-end",
        date: "2019-02-13",
        dateLabel: "13 FEB 2019",
        type: "end",
        title: "Mission ends",
        summary:
          "NASA declares the mission complete after unsuccessful recovery attempts.",
        sourceIds: ["nasa-mer-opportunity", "nssdc-opportunity"],
      },
    ],
    claims: [
      {
        id: "opp-claim-1",
        assertion:
          "Opportunity operated for 5,111 sols, far beyond its 90-sol primary mission.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-mer-opportunity", "nssdc-opportunity"],
      },
      {
        id: "opp-claim-2",
        assertion:
          "Opportunity found evidence of ancient water at Meridiani Planum.",
        status: "interpretation",
        category: "scientific",
        sourceIds: ["nasa-mer-opportunity"],
      },
      {
        id: "opp-claim-3",
        assertion:
          "Opportunity drove more than 45 kilometers on Mars, a record for a rover on another world.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-mer-opportunity"],
      },
    ],
    sourceIds: [
      "nasa-mer-opportunity",
      "nssdc-opportunity",
      "nasa-image-pia17759",
      "nasa-image-pia21708",
    ],
    legacy: {
      dimensions: {
        scientific: 99,
        mission: 98,
        historical: 99,
        longevity: 100,
        continued: 80,
      },
      rationales: {
        scientific:
          "Produced a long baseline of geological and environmental observations across Meridiani Planum.",
        mission:
          "A 90-sol mission extended into a 14-year regional exploration.",
        historical:
          "One of the most successful planetary rovers ever flown.",
        longevity:
          "Operated for 5,111 sols, the longest Mars rover mission before Perseverance's extended operations.",
        continued:
          "The mission's data remain a valuable archive; the rover itself is inactive.",
      },
    },
    featured: true,
  },
  {
    id: "curiosity",
    name: "Curiosity",
    shortName: "Curiosity",
    mission: "Mars Science Laboratory",
    missionShort: "MSL",
    destination: "Mars",
    category: "Robotic Mars rover",
    physicalStatus: "present",
    operationalStatus: "active",
    landingDate: "2012-08-06",
    coordinates: {
      latitude: -4.5895,
      longitude: 137.4417,
      label: "Gale Crater, Aeolis Palus",
      precision: "approximate",
      sourceIds: ["nssdc-curiosity", "nasa-msl-curiosity"],
    },
    plannedLifetime: {
      value: 687,
      unit: "days",
      label: "One Mars year prime mission",
      approximate: true,
    },
    actualLifetime: {
      value: 14.3,
      unit: "years",
      label: "Ongoing operations",
      approximate: true,
      ongoing: true,
    },
    lifetimeBasis: "Rover operations since landing",
    description:
      "Curiosity is a car-sized mobile laboratory investigating whether Gale Crater once offered conditions suitable for microbial life. It discovered ancient lake deposits, organic molecules, and a record of changing habitability while continuing to climb the lower slopes of Mount Sharp.",
    purpose: [
      s("Assess the past and present habitability of Gale Crater and Mount Sharp.", [
        "nasa-msl-curiosity",
        "nssdc-curiosity",
      ]),
      s("Analyze rocks, soils, and the Martian atmosphere with a suite of laboratory instruments.", [
        "nasa-msl-curiosity",
        "nssdc-curiosity",
      ]),
    ],
    operationalHistory: [
      s("Curiosity landed in Gale Crater on 6 August 2012 using the sky crane system.", [
        "nasa-msl-curiosity",
        "nssdc-curiosity",
      ]),
      s("The rover found ancient lake deposits and organic molecules, and has continued exploring the lower slopes of Mount Sharp.", [
        "nasa-msl-curiosity",
      ]),
    ],
    scientificLegacy: [
      s("Curiosity established that Gale Crater once hosted long-lived lakes with conditions potentially suitable for life.", [
        "nasa-msl-curiosity",
      ]),
      s("Its instrument suite and long traverse continue to produce a detailed record of Martian climate and habitability.", [
        "nasa-msl-curiosity",
      ]),
    ],
    originalFunction:
      "Car-sized mobile science laboratory with a drill, spectrometers, and environmental sensors.",
    currentCondition:
      "Operationally active. The rover continues to explore Gale Crater and Mount Sharp under an extended mission.",
    images: [
      image(
        "PIA26310",
        "Selfie of the Curiosity rover captured with its navigation camera in Gale Crater in February 2024.",
      ),
      image(
        "PIA17068",
        "Curiosity rover drilling into the Cumberland rock target on Mars.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "cur-launch",
        date: "2011-11-26",
        dateLabel: "26 NOV 2011",
        type: "launch",
        title: "Curiosity launches",
        summary:
          "The Mars Science Laboratory begins its journey to Gale Crater.",
        sourceIds: ["nasa-msl-curiosity", "nssdc-curiosity"],
      },
      {
        id: "cur-landing",
        date: "2012-08-06",
        dateLabel: "06 AUG 2012",
        type: "landing",
        title: "Sky crane touchdown",
        summary:
          "Curiosity lands safely in Gale Crater.",
        sourceIds: ["nasa-msl-curiosity", "nssdc-curiosity"],
        significance: "primary",
      },
      {
        id: "cur-drill",
        date: "2013-02-08",
        dateLabel: "08 FEB 2013",
        type: "discovery",
        title: "First drilled rock sample",
        summary:
          "The rover confirms the drill and sample-handling system on Mars.",
        sourceIds: ["nasa-msl-curiosity"],
        significance: "primary",
      },
      {
        id: "cur-organics",
        date: "2018-06-07",
        dateLabel: "07 JUN 2018",
        type: "discovery",
        title: "Organic molecules detected",
        summary:
          "Curiosity finds complex organic material preserved in ancient lake deposits.",
        sourceIds: ["nasa-msl-curiosity"],
        significance: "primary",
      },
      {
        id: "cur-ongoing",
        date: "2026-01-01",
        dateLabel: "PRESENT",
        type: "legacy",
        title: "Extended mission continues",
        summary:
          "Curiosity remains operational, far beyond its prime mission.",
        sourceIds: ["nasa-msl-curiosity", "nssdc-curiosity"],
      },
    ],
    claims: [
      {
        id: "cur-claim-1",
        assertion:
          "Curiosity is currently operational and continues its extended mission in Gale Crater.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-msl-curiosity"],
      },
      {
        id: "cur-claim-2",
        assertion:
          "Curiosity has found evidence of ancient lakes and organic molecules in Gale Crater.",
        status: "interpretation",
        category: "scientific",
        sourceIds: ["nasa-msl-curiosity"],
      },
      {
        id: "cur-claim-3",
        assertion:
          "Curiosity has far exceeded its one-Mars-year prime mission.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-msl-curiosity", "nssdc-curiosity"],
      },
    ],
    sourceIds: [
      "nasa-msl-curiosity",
      "nssdc-curiosity",
      "nasa-image-pia26310",
      "nasa-image-pia17068",
    ],
    legacy: {
      dimensions: {
        scientific: 99,
        mission: 98,
        historical: 98,
        longevity: 97,
        continued: 100,
      },
      rationales: {
        scientific:
          "Established a detailed record of ancient habitability and organic chemistry in Gale Crater.",
        mission:
          "A flagship Mars Science Laboratory mission that has surpassed its prime objectives.",
        historical:
          "A major step in the search for past habitable environments on Mars.",
        longevity:
          "Has operated for more than a decade since a one-Mars-year prime mission.",
        continued:
          "Still active and producing new scientific results.",
      },
    },
    featured: true,
  },
  {
    id: "perseverance",
    name: "Perseverance",
    shortName: "Perseverance",
    mission: "Mars 2020",
    missionShort: "Mars 2020",
    destination: "Mars",
    category: "Robotic Mars rover",
    physicalStatus: "present",
    operationalStatus: "active",
    landingDate: "2021-02-18",
    coordinates: {
      latitude: 18.4447,
      longitude: 77.4508,
      label: "Jezero Crater, Octavia E. Butler Landing",
      precision: "approximate",
      sourceIds: ["nssdc-perseverance", "nasa-mars-2020"],
    },
    plannedLifetime: {
      value: 687,
      unit: "days",
      label: "One Mars year prime mission",
      approximate: true,
    },
    actualLifetime: {
      value: 5.7,
      unit: "years",
      label: "Ongoing operations",
      approximate: true,
      ongoing: true,
    },
    lifetimeBasis: "Rover operations since landing",
    description:
      "Perseverance is exploring Jezero Crater, an ancient lake basin, while collecting samples for possible future return to Earth. It carries instruments for astrobiology and geology, demonstrated oxygen production on Mars, and supported the first powered flight on another planet.",
    purpose: [
      s("Explore Jezero Crater and characterize ancient habitable environments.", [
        "nasa-mars-2020",
        "nssdc-perseverance",
      ]),
      s("Collect and cache rock and regolith samples for potential Mars Sample Return.", [
        "nasa-mars-2020",
        "nssdc-perseverance",
      ]),
    ],
    operationalHistory: [
      s("Perseverance landed in Jezero Crater on 18 February 2021.", [
        "nasa-mars-2020",
        "nssdc-perseverance",
      ]),
      s("The rover began caching samples in 2021 and has explored the delta and ancient river deposits around Jezero.", [
        "nasa-mars-2020",
      ]),
      s("The Ingenuity helicopter, carried by Perseverance, achieved the first powered flight on another planet in April 2021.", [
        "nasa-mars-2020",
      ]),
    ],
    scientificLegacy: [
      s("Perseverance is building a sample collection that could one day be returned to Earth for laboratory analysis.", [
        "nasa-mars-2020",
      ]),
      s("The mission is testing technologies for future human exploration, including oxygen production from the Martian atmosphere.", [
        "nasa-mars-2020",
      ]),
    ],
    originalFunction:
      "Mobile astrobiology laboratory, sample-caching rover, and technology demonstration platform.",
    currentCondition:
      "Operationally active. The rover continues to explore Jezero Crater and cache samples.",
    images: [
      image(
        "PIA24542",
        "Perseverance selfie with the Ingenuity helicopter on Mars.",
      ),
      image(
        "PIA26344",
        "Perseverance selfie beside the Cheyava Falls rock target in Jezero Crater.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "pers-launch",
        date: "2020-07-30",
        dateLabel: "30 JUL 2020",
        type: "launch",
        title: "Perseverance launches",
        summary:
          "The Mars 2020 mission begins its journey to Jezero Crater.",
        sourceIds: ["nasa-mars-2020", "nssdc-perseverance"],
      },
      {
        id: "pers-landing",
        date: "2021-02-18",
        dateLabel: "18 FEB 2021",
        type: "landing",
        title: "Jezero Crater touchdown",
        summary:
          "Perseverance lands in an ancient lake basin.",
        sourceIds: ["nasa-mars-2020", "nssdc-perseverance"],
        significance: "primary",
      },
      {
        id: "pers-ingenuity",
        date: "2021-04-19",
        dateLabel: "19 APR 2021",
        type: "record",
        title: "First flight on another planet",
        summary:
          "Ingenuity performs a powered controlled flight in the Martian atmosphere.",
        sourceIds: ["nasa-mars-2020"],
        significance: "primary",
      },
      {
        id: "pers-sample",
        date: "2021-09-06",
        dateLabel: "06 SEP 2021",
        type: "discovery",
        title: "First sample cached",
        summary:
          "The rover collects its first rock core for potential return to Earth.",
        sourceIds: ["nasa-mars-2020"],
        significance: "primary",
      },
      {
        id: "pers-ongoing",
        date: "2026-01-01",
        dateLabel: "PRESENT",
        type: "legacy",
        title: "Extended mission continues",
        summary:
          "Perseverance remains active in Jezero Crater.",
        sourceIds: ["nasa-mars-2020", "nssdc-perseverance"],
      },
    ],
    claims: [
      {
        id: "pers-claim-1",
        assertion:
          "Perseverance is currently operational in Jezero Crater.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-mars-2020"],
      },
      {
        id: "pers-claim-2",
        assertion:
          "Perseverance has collected rock cores for a potential Mars sample return campaign.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-mars-2020"],
      },
      {
        id: "pers-claim-3",
        assertion:
          "Jezero Crater contains ancient lake and river deposits relevant to past habitability.",
        status: "interpretation",
        category: "scientific",
        sourceIds: ["nasa-mars-2020"],
      },
    ],
    sourceIds: [
      "nasa-mars-2020",
      "nssdc-perseverance",
      "nasa-image-pia24542",
      "nasa-image-pia26344",
    ],
    legacy: {
      dimensions: {
        scientific: 98,
        mission: 99,
        historical: 99,
        longevity: 94,
        continued: 100,
      },
      rationales: {
        scientific:
          "A sample-caching astrobiology mission in an ancient lake basin with high potential for future analysis.",
        mission:
          "A flagship Mars mission combining science, sample caching, and technology demonstrations.",
        historical:
          "The first mission to cache samples for potential return and to fly a helicopter on another planet.",
        longevity:
          "Has operated for more than five years with ongoing extensions.",
        continued:
          "Still active and continuing to build the sample archive.",
      },
    },
    featured: true,
  },
  {
    id: "mars-pathfinder",
    name: "Mars Pathfinder Lander",
    shortName: "Pathfinder Lander",
    mission: "Mars Pathfinder",
    missionShort: "Pathfinder",
    destination: "Mars",
    category: "Robotic Mars lander",
    physicalStatus: "present-unverified",
    operationalStatus: "inactive",
    landingDate: "1997-07-04",
    endDate: "1998-03-10",
    coordinates: {
      latitude: 19.13,
      longitude: -33.22,
      label: "Ares Vallis, Chryse Planitia region",
      precision: "landing-ellipse",
      sourceIds: ["nssdc-mars-pathfinder", "nasa-mars-pathfinder"],
    },
    plannedLifetime: {
      value: 30,
      unit: "sols",
      label: "Planned lander mission",
      approximate: true,
    },
    actualLifetime: {
      value: 83,
      unit: "sols",
      label: "Operational lifetime",
    },
    lifetimeBasis: "Lander operations after touchdown",
    description:
      "The Mars Pathfinder lander delivered Sojourner to Ares Vallis and returned atmospheric, meteorological, and imaging data from the surface. Its airbag landing system and low-cost architecture reshaped NASA's approach to Mars exploration.",
    purpose: [
      s("Demonstrate a low-cost Mars landing architecture using airbags and a lander with a deployed rover.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
      s("Study the atmosphere, weather, rocks, and soil at Ares Vallis.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
    ],
    operationalHistory: [
      s("Pathfinder landed on 4 July 1997 and deployed Sojourner the next day.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
      s("The lander returned atmospheric and meteorological data for 83 sols, exceeding its planned 30-sol mission.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
      s("The last transmission was received on 27 September 1997; the mission was concluded in March 1998.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
    ],
    scientificLegacy: [
      s("Pathfinder demonstrated a new low-cost landing system and returned a valuable atmospheric and surface data set.", [
        "nasa-mars-pathfinder",
        "nssdc-mars-pathfinder",
      ]),
      s("The mission established the lander-rover architecture that later Mars missions refined.", [
        "nasa-mars-pathfinder",
      ]),
    ],
    originalFunction:
      "Robotic Mars lander, weather station, and base for the Sojourner rover.",
    currentCondition:
      "The lander is believed to remain in Ares Vallis. It is inactive and has not communicated since 1997.",
    images: [
      image(
        "PIA00621",
        "Mars Pathfinder color mosaic showing the Sojourner rover, ramps, and surrounding terrain.",
      ),
      image(
        "PIA00613",
        "Pathfinder ramps and deflated airbags on the Martian surface.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "pf-launch",
        date: "1996-12-04",
        dateLabel: "04 DEC 1996",
        type: "launch",
        title: "Pathfinder launches",
        summary:
          "A low-cost Mars mission begins its journey to Ares Vallis.",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
      },
      {
        id: "pf-landing",
        date: "1997-07-04",
        dateLabel: "04 JUL 1997",
        type: "landing",
        title: "Airbag landing",
        summary:
          "Pathfinder bounces to a stop and opens its petals in Ares Vallis.",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
        significance: "primary",
      },
      {
        id: "pf-rover",
        date: "1997-07-05",
        dateLabel: "05 JUL 1997",
        type: "deployment",
        title: "Sojourner deployed",
        summary:
          "The first Mars rover begins surface operations.",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
        significance: "primary",
      },
      {
        id: "pf-lost",
        date: "1997-09-27",
        dateLabel: "27 SEP 1997",
        type: "loss",
        title: "Last contact",
        summary:
          "The lander falls silent after 83 sols.",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
        significance: "primary",
      },
      {
        id: "pf-end",
        date: "1998-03-10",
        dateLabel: "10 MAR 1998",
        type: "end",
        title: "Mission ends",
        summary:
          "NASA concludes Pathfinder after unsuccessful recovery attempts.",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
      },
    ],
    claims: [
      {
        id: "pf-claim-1",
        assertion:
          "Mars Pathfinder landed using an airbag system and deployed the first Mars rover.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
      },
      {
        id: "pf-claim-2",
        assertion:
          "The lander operated for 83 sols against a planned mission of about 30 sols.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
      },
      {
        id: "pf-claim-3",
        assertion:
          "Pathfinder's low-cost architecture influenced subsequent Mars missions.",
        status: "interpretation",
        category: "historical",
        sourceIds: ["nasa-mars-pathfinder"],
      },
    ],
    sourceIds: [
      "nasa-mars-pathfinder",
      "nssdc-mars-pathfinder",
      "nasa-image-pia00621",
      "nasa-image-pia00613",
    ],
    legacy: {
      dimensions: {
        scientific: 88,
        mission: 92,
        historical: 96,
        longevity: 88,
        continued: 60,
      },
      rationales: {
        scientific:
          "Returned atmospheric and geological measurements from Ares Vallis and supported the first Mars rover.",
        mission:
          "Demonstrated a low-cost landing architecture and exceeded its planned lifetime.",
        historical:
          "The first successful Mars rover mission and a turning point for NASA Mars exploration.",
        longevity:
          "Operated for 83 sols against a roughly 30-sol plan.",
        continued:
          "The hardware is inactive, but the mission's data and engineering lessons remain valuable.",
      },
    },
  },
  {
    id: "viking-1",
    name: "Viking 1 Lander",
    shortName: "Viking 1 Lander",
    mission: "Viking 1",
    missionShort: "Viking 1",
    destination: "Mars",
    category: "Robotic Mars lander",
    physicalStatus: "present-unverified",
    operationalStatus: "inactive",
    landingDate: "1976-07-20",
    endDate: "1982-11-11",
    coordinates: {
      latitude: 22.6977,
      longitude: -48.2223,
      label: "Chryse Planitia, near Mutch Memorial Station",
      precision: "landing-ellipse",
      sourceIds: ["nssdc-viking-1", "nasa-viking-1"],
    },
    plannedLifetime: {
      value: 90,
      unit: "sols",
      label: "Planned surface mission",
      approximate: true,
    },
    actualLifetime: {
      value: 2305,
      unit: "days",
      label: "Operational lifetime",
      approximate: true,
    },
    lifetimeBasis: "Lander operations after touchdown",
    description:
      "Viking 1 was the first spacecraft to successfully land on Mars and complete its primary mission. Its lander returned the first color images from the Martian surface, ran biology experiments, monitored weather, and operated for more than six years, becoming one of the longest-lived Mars surface missions of the twentieth century.",
    purpose: [
      s("Conduct the first successful soft landing and long-duration surface investigation on Mars.", [
        "nasa-viking-1",
        "nssdc-viking-1",
      ]),
      s("Search for signs of life, characterize the atmosphere, and return images and weather data.", [
        "nasa-viking-1",
        "nssdc-viking-1",
      ]),
    ],
    operationalHistory: [
      s("Viking 1 landed in Chryse Planitia on 20 July 1976, seven years to the day after Apollo 11 landed on the Moon.", [
        "nasa-viking-1",
        "nssdc-viking-1",
      ]),
      s("The lander returned images, weather data, and results from biology experiments over an extended mission.", [
        "nasa-viking-1",
        "nssdc-viking-1",
      ]),
      s("The last contact with Viking 1 was on 11 November 1982, after more than 2,300 days on the surface.", [
        "nasa-viking-1",
        "nssdc-viking-1",
      ]),
    ],
    scientificLegacy: [
      s("Viking 1 produced the first color images from the Martian surface and established a long baseline of weather observations.", [
        "nasa-viking-1",
        "nssdc-viking-1",
      ]),
      s("Its biology experiments framed decades of debate about possible Martian life and the need for better sample analysis.", [
        "nasa-viking-1",
      ]),
    ],
    originalFunction:
      "Robotic Mars lander with imaging, meteorology, seismology, and biology experiments.",
    currentCondition:
      "The lander is believed to remain in Chryse Planitia. It is inactive and has not communicated since 1982.",
    images: [
      image(
        "PIA00563",
        "First color image from Viking Lander 1 showing the Martian surface.",
      ),
      image(
        "PIA00564",
        "Viking Lander 1 view of the Martian surface in vivid color.",
      ),
    ],
    models: [],
    timeline: [
      {
        id: "vik-launch",
        date: "1975-08-20",
        dateLabel: "20 AUG 1975",
        type: "launch",
        title: "Viking 1 launches",
        summary:
          "The first Viking spacecraft begins its journey to Mars.",
        sourceIds: ["nasa-viking-1", "nssdc-viking-1"],
      },
      {
        id: "vik-landing",
        date: "1976-07-20",
        dateLabel: "20 JUL 1976",
        type: "landing",
        title: "Viking 1 lands",
        summary:
          "The lander touches down in Chryse Planitia.",
        sourceIds: ["nasa-viking-1", "nssdc-viking-1"],
        significance: "primary",
      },
      {
        id: "vik-biology",
        date: "1976-07-28",
        dateLabel: "1976",
        type: "discovery",
        title: "Biology experiments begin",
        summary:
          "The lander conducts the first direct experiments searching for Martian life.",
        sourceIds: ["nasa-viking-1", "nssdc-viking-1"],
        significance: "primary",
      },
      {
        id: "vik-extended",
        date: "1980-01-01",
        dateLabel: "1980s",
        type: "record",
        title: "Years of weather data",
        summary:
          "Viking 1 continues returning meteorological and imaging data far beyond its prime mission.",
        sourceIds: ["nasa-viking-1", "nssdc-viking-1"],
      },
      {
        id: "vik-end",
        date: "1982-11-11",
        dateLabel: "11 NOV 1982",
        type: "end",
        title: "Last contact",
        summary:
          "The lander falls silent after more than six years on Mars.",
        sourceIds: ["nasa-viking-1", "nssdc-viking-1"],
        significance: "primary",
      },
    ],
    claims: [
      {
        id: "vik-claim-1",
        assertion:
          "Viking 1 was the first spacecraft to successfully land on Mars and complete its primary mission.",
        status: "verified",
        category: "historical",
        sourceIds: ["nasa-viking-1", "nssdc-viking-1"],
      },
      {
        id: "vik-claim-2",
        assertion:
          "Viking 1 operated for more than 2,300 days on the Martian surface.",
        status: "verified",
        category: "mission-record",
        sourceIds: ["nasa-viking-1", "nssdc-viking-1"],
      },
      {
        id: "vik-claim-3",
        assertion:
          "Viking 1 returned the first color image from the Martian surface.",
        status: "verified",
        category: "imagery",
        sourceIds: ["nasa-viking-1", "nasa-image-pia00563"],
      },
    ],
    sourceIds: [
      "nasa-viking-1",
      "nssdc-viking-1",
      "nasa-image-pia00563",
      "nasa-image-pia00564",
    ],
    legacy: {
      dimensions: {
        scientific: 97,
        mission: 99,
        historical: 100,
        longevity: 100,
        continued: 82,
      },
      rationales: {
        scientific:
          "First long-duration Mars surface laboratory and first direct life-detection experiments on the planet.",
        mission:
          "The first fully successful Mars landing mission.",
        historical:
          "The first color images and first successful soft landing on Mars.",
        longevity:
          "Operated for more than 2,300 days against a roughly 90-sol plan.",
        continued:
          "Its data remain a baseline for Martian climate and biology, though the lander is inactive.",
      },
    },
    featured: true,
  },
];
