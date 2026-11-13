import type { ImageAsset, Source } from "@/lib/schema";

const ACCESSED = "2026-11-13";

export const manualSources: Source[] = [
  {
    id: "nasa-apollo-11",
    title: "Apollo 11 Mission",
    organization: "NASA",
    url: "https://www.nasa.gov/mission/apollo-11/",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nasa-apollo-12",
    title: "Apollo 12 Mission",
    organization: "NASA",
    url: "https://www.nasa.gov/mission/apollo-12/",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nasa-apollo-15",
    title: "Apollo 15 Mission",
    organization: "NASA",
    url: "https://www.nasa.gov/mission/apollo-15/",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nasa-apollo-17",
    title: "Apollo 17 Mission",
    organization: "NASA",
    url: "https://www.nasa.gov/mission/apollo-17/",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-apollo-11",
    title: "Apollo 11 Mission Information",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11info.html",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-apollo-12",
    title: "Apollo 12 Mission Information",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo12info.html",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-apollo-15",
    title: "Apollo 15 Mission Information",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo15info.html",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-apollo-17",
    title: "Apollo 17 Mission Information",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo17info.html",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-apollo-sites",
    title: "Apollo Landing Site Coordinates",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html",
    category: "coordinate",
    accessed: ACCESSED,
    note: "Coordinates derived from Lunar Reconnaissance Orbiter images in the DE421 Mean Earth/Polar Axis frame.",
  },
  {
    id: "nssdc-apollo-landings",
    title: "Apollo Lunar Landings (1969-1972)",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apolloland.html",
    category: "historical",
    accessed: ACCESSED,
  },
  {
    id: "nasa-alsj",
    title: "Apollo Lunar Surface Journal",
    organization: "NASA History Office",
    url: "https://www.nasa.gov/history/alsj-and-afj/",
    category: "historical",
    accessed: ACCESSED,
  },
  {
    id: "ilrs-lunar-ranging",
    title: "International Laser Ranging Service",
    organization: "NASA Goddard Space Flight Center",
    url: "https://ilrs.gsfc.nasa.gov/network/site_information/index.html",
    category: "technical",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-soviet-lunar",
    title: "Soviet Missions to the Moon",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/lunarussr.html",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nasa-lroc-lunokhod",
    title: "Lunokhod 1 Revisited",
    organization: "NASA / LROC",
    url: "https://www.lroc.im-ldi.com/images/402",
    category: "coordinate",
    accessed: ACCESSED,
    note: "Final rover location and traverse summary from Lunar Reconnaissance Orbiter Camera imagery.",
  },
  {
    id: "nasa-lunokhod-photojournal",
    title: "Soviet Union Lunar Rovers",
    organization: "NASA",
    url: "https://science.nasa.gov/photojournal/soviet-union-lunar-rovers/",
    category: "imagery",
    accessed: ACCESSED,
  },
  {
    id: "nasa-surveyor-3",
    title: "Surveyor 3 Mission",
    organization: "NASA",
    url: "https://science.nasa.gov/mission/surveyor-3/",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-surveyor-3",
    title: "Surveyor 3 Spacecraft Record",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nasa-mars-pathfinder",
    title: "Mars Pathfinder Mission",
    organization: "NASA",
    url: "https://science.nasa.gov/mission/mars-pathfinder/",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-mars-pathfinder",
    title: "Mars Pathfinder Spacecraft Record",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nasa-mer-spirit",
    title: "Mars Exploration Rover Spirit",
    organization: "NASA",
    url: "https://science.nasa.gov/mission/mer-spirit/",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-spirit",
    title: "Mars Exploration Rover A Spacecraft Record",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nasa-mer-opportunity",
    title: "Mars Exploration Rover Opportunity",
    organization: "NASA",
    url: "https://science.nasa.gov/mission/mer-opportunity/",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-opportunity",
    title: "Mars Exploration Rover B Spacecraft Record",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nasa-msl-curiosity",
    title: "Mars Science Laboratory Curiosity",
    organization: "NASA",
    url: "https://science.nasa.gov/mission/msl-curiosity/",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-curiosity",
    title: "Mars Science Laboratory Spacecraft Record",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-040A",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nasa-mars-2020",
    title: "Mars 2020 Perseverance",
    organization: "NASA",
    url: "https://science.nasa.gov/mission/mars-2020-perseverance/",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-perseverance",
    title: "Mars 2020 Spacecraft Record",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052A",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nasa-viking-1",
    title: "Viking 1 Mission",
    organization: "NASA",
    url: "https://science.nasa.gov/mission/viking-1/",
    category: "mission",
    accessed: ACCESSED,
  },
  {
    id: "nssdc-viking-1",
    title: "Viking 1 Lander Spacecraft Record",
    organization: "NASA NSSDCA",
    url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C",
    category: "mission",
    accessed: ACCESSED,
  },
];

type ImageRecord = {
  nasaId: string;
  src: string;
  title: string;
  credit: string;
};

export const nasaImageRecords: ImageRecord[] = [
  {
    nasaId: "as11-40-5927",
    src: "/nasa/as11-40-5927.jpg",
    title: "Apollo 11 Lunar Module on the lunar surface",
    credit: "NASA / JSC",
  },
  {
    nasaId: "as11-40-5917",
    src: "/nasa/as11-40-5917.jpg",
    title: "Apollo 11 Lunar Module footpad",
    credit: "NASA / JSC",
  },
  {
    nasaId: "6900959",
    src: "/nasa/6900959.jpg",
    title: "Apollo 11 EASEP deployment",
    credit: "NASA / MSFC",
  },
  {
    nasaId: "6900957",
    src: "/nasa/6900957.jpg",
    title: "Apollo 11 EASEP experiments on the Moon",
    credit: "NASA / MSFC",
  },
  {
    nasaId: "as12-47-6913",
    src: "/nasa/as12-47-6913.jpg",
    title: "Apollo 12 Lunar Module equipment transfer",
    credit: "NASA / JSC",
  },
  {
    nasaId: "as12-46-6726",
    src: "/nasa/as12-46-6726.jpg",
    title: "Apollo 12 Lunar Module ladder",
    credit: "NASA / JSC",
  },
  {
    nasaId: "as15-86-11603",
    src: "/nasa/as15-86-11603.jpg",
    title: "Apollo 15 Lunar Roving Vehicle at Hadley-Apennine",
    credit: "NASA / JSC",
  },
  {
    nasaId: "as15-086-11600",
    src: "/nasa/as15-086-11600.jpg",
    title: "Apollo 15 Lunar Module and Lunar Roving Vehicle",
    credit: "NASA / JSC",
  },
  {
    nasaId: "PIA12920",
    src: "/nasa/PIA12920_small.jpg",
    title: "LRO view of the Apollo 17 landing site",
    credit: "NASA / JPL-Caltech / GSFC / ASU",
  },
  {
    nasaId: "S72-55421",
    src: "/nasa/S72-55421.jpg",
    title: "Apollo 17 Lunar Module ascent stage liftoff",
    credit: "NASA / JSC",
  },
  {
    nasaId: "PIA12967",
    src: "/nasa/PIA12967_small.jpg",
    title: "LRO view of Luna 17 and Lunokhod 1",
    credit: "NASA / JPL-Caltech / GSFC / ASU",
  },
  {
    nasaId: "as12-48-7121",
    src: "/nasa/as12-48-7121.jpg",
    title: "Surveyor 3 in its crater",
    credit: "NASA / JSC",
  },
  {
    nasaId: "AS12-48-7133",
    src: "/nasa/AS12-48-7133.jpg",
    title: "Apollo 12 Lunar Module and Surveyor 3",
    credit: "NASA / JSC",
  },
  {
    nasaId: "PIA01551",
    src: "/nasa/PIA01551_orig.jpg",
    title: "Sojourner rover newly deployed",
    credit: "NASA / JPL-Caltech",
  },
  {
    nasaId: "PIA01121",
    src: "/nasa/PIA01121_orig.jpg",
    title: "Sojourner view of the Pathfinder lander",
    credit: "NASA / JPL-Caltech",
  },
  {
    nasaId: "PIA05120",
    src: "/nasa/PIA05120.jpg",
    title: "Orbital view of the Spirit landing site",
    credit: "NASA / JPL-Caltech / MSSS",
  },
  {
    nasaId: "PIA07410",
    src: "/nasa/PIA07410.jpg",
    title: "Spirit 360-degree view on Sol 409",
    credit: "NASA / JPL-Caltech",
  },
  {
    nasaId: "PIA21708",
    src: "/nasa/PIA21708.jpg",
    title: "Opportunity view of Orion Crater",
    credit: "NASA / JPL-Caltech / Cornell / ASU",
  },
  {
    nasaId: "PIA21706",
    src: "/nasa/PIA21706.jpg",
    title: "Opportunity stereo view of Orion Crater",
    credit: "NASA / JPL-Caltech / Cornell / ASU",
  },
  {
    nasaId: "PIA17759",
    src: "/nasa/PIA17759_medium.jpg",
    title: "Opportunity self-portrait, January 2014",
    credit: "NASA / JPL-Caltech / Cornell / ASU / MSSS",
  },
  {
    nasaId: "PIA26310",
    src: "/nasa/PIA26310_medium.jpg",
    title: "Curiosity Navcam selfie, February 2024",
    credit: "NASA / JPL-Caltech / MSSS",
  },
  {
    nasaId: "PIA00621",
    src: "/nasa/PIA00621_small.jpg",
    title: "Pathfinder color mosaic of Sojourner and terrain",
    credit: "NASA / JPL-Caltech",
  },
  {
    nasaId: "PIA00613",
    src: "/nasa/PIA00613_small.jpg",
    title: "Pathfinder ramps and deflated airbags on Mars",
    credit: "NASA / JPL-Caltech",
  },
  {
    nasaId: "PIA17068",
    src: "/nasa/PIA17068_small.jpg",
    title: "Curiosity drilling at Cumberland",
    credit: "NASA / JPL-Caltech",
  },
  {
    nasaId: "PIA14253",
    src: "/nasa/PIA14253.jpg",
    title: "Curiosity rover turret during testing",
    credit: "NASA / JPL-Caltech",
  },
  {
    nasaId: "PIA24542",
    src: "/nasa/PIA24542.jpg",
    title: "Perseverance selfie with Ingenuity",
    credit: "NASA / JPL-Caltech / MSSS",
  },
  {
    nasaId: "PIA26344",
    src: "/nasa/PIA26344.jpg",
    title: "Perseverance selfie at Cheyava Falls",
    credit: "NASA / JPL-Caltech / MSSS",
  },
  {
    nasaId: "PIA00782",
    src: "/nasa/PIA00782_small.jpg",
    title: "Mars Pathfinder 360-degree panorama",
    credit: "NASA / JPL-Caltech",
  },
  {
    nasaId: "PIA00995",
    src: "/nasa/PIA00995_small.jpg",
    title: "Twin Peaks from the Pathfinder landing site",
    credit: "NASA / JPL-Caltech",
  },
  {
    nasaId: "PIA00563",
    src: "/nasa/PIA00563_orig.jpg",
    title: "First color image from Viking Lander 1",
    credit: "NASA / JPL-Caltech",
  },
  {
    nasaId: "PIA00564",
    src: "/nasa/PIA00564_orig.jpg",
    title: "Viking Lander 1 surface scene",
    credit: "NASA / JPL-Caltech",
  },
];

function sourceIdForImage(nasaId: string) {
  return `nasa-image-${nasaId.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export const imageSources: Source[] = nasaImageRecords.map((image) => ({
  id: sourceIdForImage(image.nasaId),
  title: `${image.title} (${image.nasaId})`,
  organization: image.credit,
  url: `https://images.nasa.gov/details/${encodeURIComponent(image.nasaId)}`,
  category: "imagery",
  accessed: ACCESSED,
  note: "NASA Image and Video Library record. NASA media usage guidelines apply.",
}));

const recordsByNasaId = new Map(
  nasaImageRecords.map((image) => [image.nasaId, image]),
);

export function nasaImage(
  nasaId: string,
  alt: string,
  title?: string,
): ImageAsset {
  const record = recordsByNasaId.get(nasaId);
  if (!record) {
    throw new Error(`Unknown NASA image: ${nasaId}`);
  }
  return {
    id: `image-${nasaId.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    kind: "image",
    title: title ?? record.title,
    src: record.src,
    alt,
    credit: record.credit,
    nasaId,
    sourceId: sourceIdForImage(nasaId),
    license: "public-domain",
    generated: false,
  };
}

export const sources: Source[] = [...manualSources, ...imageSources];

export const sourceMap = new Map(sources.map((source) => [source.id, source]));
