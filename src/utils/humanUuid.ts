import colors from 'vuetify/util/colors'

const MUI_BASE_COLORS = [
  'red',
  'pink',
  'purple',
  'deepPurple',
  'indigo',
  'blue',
  'lightBlue',
  'cyan',
  'teal',
  'green',
  'lightGreen',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deepOrange',
]

// prettier-ignore
const MUI_COLOR_SHADES = [
  "base",
  "lighten4",
  "lighten2",
  "darken1",
]

const MUI_ANIMALS = [
  { name: 'Bat', icon: 'bat', code: 'F0B5F' },
  { name: 'Bee', icon: 'bee', code: 'F0FA1' },
  { name: 'Bird', icon: 'bird', code: 'F15C6' },
  { name: 'Bug', icon: 'bug', code: 'F00E4' },
  { name: 'Butterfly', icon: 'butterfly', code: 'F1589' },
  { name: 'Cat', icon: 'cat', code: 'F011B' },
  { name: 'Dog', icon: 'dog', code: 'F0A43' },
  { name: 'Dolphin', icon: 'dolphin', code: 'F18B4' },
  { name: 'Duck', icon: 'duck', code: 'F01E5' },
  { name: 'Elephant', icon: 'elephant', code: 'F07C6' },
  { name: 'Fish', icon: 'fish', code: 'F023A' },
  { name: 'Horse', icon: 'horse-variant', code: 'F15C1' },
  { name: 'Owl', icon: 'owl', code: 'F03D2' },
  { name: 'Penguin', icon: 'penguin', code: 'F0EC0' },
  { name: 'Rabbit', icon: 'rabbit-variant', code: 'F1A61' },
  { name: 'Snail', icon: 'snail', code: 'F1677' },
]

const APPEARANCE_ADJECTIVES = [
  'Adorable',
  'Beautiful',
  'Charming',
  'Dazzling',
  'Elegant',
  'Enchanting',
  'Exquisite',
  'Graceful',
  'Handsome',
  'Luminous',
  'Majestic',
  'Radiant',
  'Sparkling',
  'Stunning',
  'Vibrant',
  'Youthful',
]

const PERSONALITY_ADJECTIVES = [
  'Adventurous',
  'Compassionate',
  'Confident',
  'Creative',
  'Determined',
  'Empathetic',
  'Enthusiastic',
  'Forgiving',
  'Generous',
  'Honest',
  'Humorous',
  'Intelligent',
  'Kind',
  'Optimistic',
  'Patient',
  'Reliable',
]

const SIZE_ADJECTIVES = [
  'Compact',
  'Dainty',
  'Delicate',
  'Diminutive',
  'Expansive',
  'Grand',
  'Immense',
  'Large',
  'Miniature',
  'Petite',
  'Small',
  'Spacious',
  'Substantial',
  'Tiny',
  'Vast',
  'Wide',
]

const getUuidValue = (uuid: string, index: number, length: number = 1): number => {
  return Number.parseInt(uuid.substring(index, index + length), 16)
}

let uuidIndex = 0

const colorIdx = uuidIndex++
const shadeIdx = uuidIndex++
export const getUuidColor = (uuid: string) => {
  const color = MUI_BASE_COLORS[getUuidValue(uuid, colorIdx)]
  const shade = MUI_COLOR_SHADES[Math.floor(getUuidValue(uuid, shadeIdx) / MUI_COLOR_SHADES.length)]
  return (colors as any)[color][shade]
}

const iconIdx = uuidIndex++
export const getUuidIcon = (uuid: string) => {
  return MUI_ANIMALS[getUuidValue(uuid, iconIdx)]
}

const appearanceAdjectiveIdx = uuidIndex++
const getAppearanceAdjective = (uuid: string) => {
  return APPEARANCE_ADJECTIVES[getUuidValue(uuid, appearanceAdjectiveIdx)]
}

const personalityAdjectiveIdx = uuidIndex++
const getPersonalityAdjective = (uuid: string) => {
  return PERSONALITY_ADJECTIVES[getUuidValue(uuid, personalityAdjectiveIdx)]
}

const sizeAdjectiveIdx = uuidIndex++
const getSizeAdjective = (uuid: string) => {
  return SIZE_ADJECTIVES[getUuidValue(uuid, sizeAdjectiveIdx)]
}

export const getUuidName = (uuid: string) => {
  const adj1 = getPersonalityAdjective(uuid)
  const adj2 = getSizeAdjective(uuid)
  const adj3 = getAppearanceAdjective(uuid)
  return `${adj1} ${adj2} ${adj3} ${getUuidIcon(uuid).name}`
}
