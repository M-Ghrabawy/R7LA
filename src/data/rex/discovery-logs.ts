import type { RexLog } from "@/lib/story/schema";

export const discoveryLogs: RexLog[] = [
  {
    relicId: "apollo-11-lunar-module",
    opening:
      "I am standing at Tranquility Base. The first human footprints on another world lead toward this descent stage.",
    observations: [
      {
        text: "Eagle landed at 20:17 UTC on 20 July 1969. Its crew spent about 21.5 hours on the surface before the ascent stage departed.",
        sourceIds: ["nssdc-apollo-11", "nssdc-apollo-landings"],
      },
      {
        text: "The descent stage remains where it landed. The ascent stage returned to lunar orbit and was later deliberately impacted into the Moon.",
        sourceIds: ["nasa-alsj", "nssdc-apollo-sites"],
      },
    ],
    question:
      "The first landing site is also the first archaeological site. What should a future visitor protect first?",
    expression: "focused",
  },
  {
    relicId: "apollo-11-laser-ranging-retroreflector",
    opening:
      "This small array has no power source, no moving parts, and no way to call home. Yet Earth still speaks to it with light.",
    observations: [
      {
        text: "The retroreflector is a passive laser target deployed during the Apollo 11 surface EVA.",
        sourceIds: ["nasa-apollo-11", "nssdc-apollo-11"],
      },
      {
        text: "Lunar laser ranging to Apollo-era arrays supports precise measurements of the Earth-Moon distance.",
        sourceIds: ["ilrs-lunar-ranging"],
      },
    ],
    question:
      "Which is more remarkable: that it still works, or that its usefulness was not fully known when it was deployed?",
    expression: "content",
  },
  {
    relicId: "apollo-12-lunar-module",
    opening:
      "Intrepid landed within walking distance of a robot that had been waiting here since 1967.",
    observations: [
      {
        text: "Apollo 12 landed in Oceanus Procellarum on 19 November 1969, near Surveyor 3.",
        sourceIds: ["nasa-apollo-12", "nssdc-apollo-sites"],
      },
      {
        text: "The crew visited Surveyor 3, removed components, and returned them to Earth for study.",
        sourceIds: ["nasa-apollo-12", "nasa-alsj"],
      },
    ],
    question:
      "What does it mean to visit a machine that was designed to be alone?",
    expression: "curious",
  },
  {
    relicId: "apollo-15-lunar-roving-vehicle",
    opening:
      "The rover is parked in the dust at Hadley-Apennine, still pointed toward a landscape no road ever reached.",
    observations: [
      {
        text: "Apollo 15's surface traverses covered about 27.9 kilometers across three EVAs.",
        sourceIds: ["nssdc-apollo-landings", "nasa-alsj"],
      },
      {
        text: "The Lunar Roving Vehicle extended astronaut mobility and enabled a broader geological sample collection.",
        sourceIds: ["nasa-apollo-15"],
      },
    ],
    question:
      "Mobility changed what the crew could learn. Did it also change what they chose to leave behind?",
    expression: "focused",
  },
  {
    relicId: "apollo-17-lunar-module",
    opening:
      "Challenger is the last crewed Apollo descent stage. When its ascent stage left, the Moon became an archive of an unfinished era.",
    observations: [
      {
        text: "Apollo 17 landed in Taurus-Littrow on 11 December 1972 and completed three surface EVAs.",
        sourceIds: ["nasa-apollo-17", "nssdc-apollo-sites"],
      },
      {
        text: "The crew returned the largest Apollo sample collection, 110.5 kilograms.",
        sourceIds: ["nssdc-apollo-landings"],
      },
    ],
    question:
      "The last landing site is not the end of exploration. It is a bookmark.",
    expression: "concerned",
  },
  {
    relicId: "lunokhod-1",
    opening:
      "A Soviet rover rests in Mare Imbrium, found again only after four decades of silence.",
    observations: [
      {
        text: "Lunokhod 1 was the first robotic rover to operate on another world.",
        sourceIds: ["nssdc-soviet-lunar", "nasa-lunokhod-photojournal"],
      },
      {
        text: "It operated for 322 Earth days, more than three times its planned 90-day design life.",
        sourceIds: ["nasa-lroc-lunokhod"],
      },
    ],
    question:
      "Its operators could not see it directly. What does that make a machine that moves beyond its controllers' sight?",
    expression: "curious",
  },
  {
    relicId: "surveyor-3",
    opening:
      "Surveyor 3 was photographed twice: once by itself, and once by astronauts who walked up to it.",
    observations: [
      {
        text: "Surveyor 3 landed in Oceanus Procellarum on 20 April 1967 and operated through the lunar day.",
        sourceIds: ["nasa-surveyor-3", "nssdc-surveyor-3"],
      },
      {
        text: "Apollo 12 astronauts inspected the lander in 1969 and returned selected parts to Earth.",
        sourceIds: ["nasa-apollo-12", "nasa-alsj"],
      },
    ],
    question:
      "The first spacecraft visited by humans on another world was already old when they arrived.",
    expression: "content",
  },
  {
    relicId: "sojourner",
    opening:
      "Sojourner was a technology demonstration. It became the first rover to leave tracks on Mars.",
    observations: [
      {
        text: "Sojourner operated for 83 sols, far beyond its seven-sol planned demonstration.",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
      },
      {
        text: "Mars Pathfinder's airbag landing and microrover architecture shaped later Mars missions.",
        sourceIds: ["nasa-mars-pathfinder"],
      },
    ],
    question:
      "A demonstration can become a beginning. Which machine here owes something to Sojourner?",
    expression: "excited",
  },
  {
    relicId: "spirit",
    opening:
      "Spirit was designed for 90 sols. It kept working for more than six years.",
    observations: [
      {
        text: "Spirit landed in Gusev Crater on 4 January 2004 and operated for 2,208 sols.",
        sourceIds: ["nasa-mer-spirit", "nssdc-spirit"],
      },
      {
        text: "The rover found evidence of ancient water-altered environments before becoming embedded in soft soil in 2009.",
        sourceIds: ["nasa-mer-spirit"],
      },
    ],
    question:
      "When a mission ends by becoming stuck, is the machine lost, or has it become part of the landscape?",
    expression: "concerned",
  },
  {
    relicId: "opportunity",
    opening:
      "This machine was designed to survive approximately 90 Martian days. It continued exploring for more than 14 Earth years.",
    observations: [
      {
        text: "Opportunity operated for 5,111 sols and drove more than 45 kilometers across Meridiani Planum.",
        sourceIds: ["nasa-mer-opportunity", "nssdc-opportunity"],
      },
      {
        text: "Its final communication reached Earth on 10 June 2018, during a planet-wide dust storm.",
        sourceIds: ["nasa-mer-opportunity"],
      },
    ],
    question:
      "I wonder how many of its discoveries will still be studied centuries from now.",
    expression: "focused",
  },
  {
    relicId: "curiosity",
    opening:
      "Curiosity is still awake. Its records are not a ruin; they are an active stream of observations.",
    observations: [
      {
        text: "Curiosity landed in Gale Crater on 6 August 2012 and remains operational.",
        sourceIds: ["nasa-msl-curiosity"],
      },
      {
        text: "The rover has found evidence of ancient lake environments and organic molecules.",
        sourceIds: ["nasa-msl-curiosity"],
      },
    ],
    question:
      "An active relic complicates the word ‘relic.’ When does an object become history?",
    expression: "curious",
  },
  {
    relicId: "perseverance",
    opening:
      "Perseverance is collecting pieces of Mars for a future that has not yet arrived.",
    observations: [
      {
        text: "Perseverance landed in Jezero Crater on 18 February 2021 and is collecting samples for potential return to Earth.",
        sourceIds: ["nasa-mars-2020"],
      },
      {
        text: "The rover carried Ingenuity, which achieved the first powered flight on another planet.",
        sourceIds: ["nasa-mars-2020"],
      },
    ],
    question:
      "A sample cache is a message addressed to a generation that may not exist yet.",
    expression: "content",
  },
  {
    relicId: "mars-pathfinder",
    opening:
      "The lander is silent, but its airbag-scarred site still marks the place where a low-cost mission changed Mars exploration.",
    observations: [
      {
        text: "Pathfinder landed on 4 July 1997 and deployed Sojourner the following day.",
        sourceIds: ["nasa-mars-pathfinder", "nssdc-mars-pathfinder"],
      },
      {
        text: "The lander operated for 83 sols against a planned mission of about 30 sols.",
        sourceIds: ["nasa-mars-pathfinder"],
      },
    ],
    question:
      "Does a machine have to survive to be remembered?",
    expression: "focused",
  },
  {
    relicId: "viking-1",
    opening:
      "Viking 1 made the first successful landing on Mars. For a time, its camera was our only human-made witness on the surface.",
    observations: [
      {
        text: "Viking 1 landed in Chryse Planitia on 20 July 1976.",
        sourceIds: ["nasa-viking-1", "nssdc-viking-1"],
      },
      {
        text: "The lander operated for more than 2,300 days, returning images, weather data, and biology experiment results.",
        sourceIds: ["nasa-viking-1"],
      },
    ],
    question:
      "The first image from the surface of Mars was made by a machine that will never leave it.",
    expression: "content",
  },
];

export const discoveryLogsByRelic = new Map(
  discoveryLogs.map((log) => [log.relicId, log]),
);
