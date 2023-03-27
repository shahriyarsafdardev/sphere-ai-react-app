/* eslint-disable no-else-return */

export const seasonOrder: { [index: string]: number } = {
  winter: 4,
  spring: 3,
  summer: 2,
  fall: 1
};

export const comparatorFuntion = (intake1: string, intake2: string) => {
  if (intake1 === 'Waitlist') {
    return -1;
  }
  if (intake2 === 'Waitlist') {
    return 1;
  }
  if (intake1 === 'TBD') {
    return -1;
  }
  if (intake2 === 'TBD') {
    return 1;
  }
  return new Date(intake2) > new Date(intake1) ? 1 : -1;
};

export const sortByIntake = (intakeCategories: string[]) =>
  intakeCategories.sort(comparatorFuntion);
