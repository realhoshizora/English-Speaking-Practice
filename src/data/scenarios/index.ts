// To add a scenario: create a file like the others and add it to this list.
import type { Scenario } from '../../types';
import { askingATeacherForHelp } from './asking-a-teacher-for-help';
import { askingForDirections } from './asking-for-directions';
import { checkingIntoAHotel } from './checking-into-a-hotel';
import { introducingYourself } from './introducing-yourself';
import { makingPlans } from './making-plans';
import { meetingANewFriend } from './meeting-a-new-friend';
import { orderingCoffee } from './ordering-coffee';
import { orderingFood } from './ordering-food';
import { shoppingForClothes } from './shopping-for-clothes';
import { talkingAboutHobbies } from './talking-about-hobbies';

export const scenarios: Scenario[] = [
  introducingYourself,
  meetingANewFriend,
  orderingCoffee,
  orderingFood,
  shoppingForClothes,
  askingForDirections,
  talkingAboutHobbies,
  askingATeacherForHelp,
  makingPlans,
  checkingIntoAHotel,
];

export const scenarioIds = scenarios.map((s) => s.id);

export function getScenario(id: string | undefined): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
