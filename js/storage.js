import { APP_SHORT_NAME } from "../properties.js";
import { DEFAULT_SETTINGS } from "./app-default-settings.js";

const STORAGE = localStorage;
const appShortName = APP_SHORT_NAME;

export const removeStorage = () => {
  if (window.confirm('are you sure you want to remove all user data from this app ?')) {
    STORAGE.removeItem(`${appShortName}FirstTime`)
    STORAGE.removeItem(`${appShortName}User`);
    window.location = window.location;
  }
}

export const setStorage = () => {
  if (STORAGE.getItem(`${appShortName}FirstTime`) === null) {
    STORAGE.setItem(`${appShortName}FirstTime`, '0');

    /*
    catch = {
      mapId: string,
      fishId: string,
      fishLength: number,
      fishMass: number,
      notation: number,
      timestamp: Date.now()
    }
    */
    
    let userTMP = {
      currentCharacter: 0,
      currentRod: 1,
      catches: [],
      completedMaps: [],
      // Canne niveau 2
      /* completedMaps: [
        '01-01', '01-02', '01-03'
      ], */
      // Canne niveau 3
      /* completedMaps: [
        '01-01', '01-02', '01-03', '01-04',
        '02-01', '02-02', '02-03', '02-04',
        '03-01', '03-02', '03-03', 
      ], */
      /* completedMaps: [
        '01-01', '01-02', '01-03', '01-04',
        '02-01', '02-02', '02-03', '02-04',
        '03-01', '03-02', '03-03', '03-04',
        '04-01', '04-02', '04-03',
      ], */
      settings: DEFAULT_SETTINGS,
    };
    STORAGE.setItem(`${appShortName}User`, JSON.stringify(userTMP));
  }
}

export const getUser = () => {
  return JSON.parse(STORAGE.getItem(`${appShortName}User`));
}
export const setUser = (user) => {
  STORAGE.setItem(`${appShortName}User`, JSON.stringify(user));
}

/* ------------------------------------------------------------------------- */
export const getUserSetting = (id) => {
  let settingToReturn = '';
  const user = getUser();
  const settings = user.settings;
  settings.forEach(settingsGroups => {
    settingsGroups.settings.forEach(setting => {
      if (setting.id == id) {
        settingToReturn = setting;
      }
    });
  });
  return settingToReturn;
}