import { Section } from '../../types';
import { hero } from './hero';
import { invitation } from './invitation';
import { gallery } from './gallery';
import { coupleStory } from './couple-story';
import { calendar } from './calendar';

export const sections: Section[] = [
  invitation,
  calendar,
  coupleStory,
  gallery,
];

export { hero }; 