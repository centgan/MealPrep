import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

let monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

const storeValue = async (value, key) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    // await AsyncStorage.setItem('Age', value);
  } catch (e) {
    console.log(e);
  }
};

const getValue = async text => {
  try {
    const value = await AsyncStorage.getItem(text);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log(e);
  }
};

const calories = (age, height, weight, activity, maintain) => {
  let b = weight * 6.3 + 66;
  let m = height * 12.9 + b;
  let bmr = age * 6.8 - m;

  if (activity.toUpperCase().indexOf('SEDENTARY') >= 0) {
    bmr *= 1.2;
  } else if (activity.toUpperCase().indexOf('LIGHT') >= 0) {
    bmr *= 1.375;
  } else if (activity.toUpperCase().indexOf('MODERATE') >= 0) {
    bmr *= 1.55;
  } else if (activity.toUpperCase().indexOf('INTENSE') >= 0) {
    bmr *= 1.75;
  } else if (activity.toUpperCase().indexOf('EXTREME') >= 0) {
    bmr *= 1.9;
  }

  switch (maintain) {
    case 0:
      break;
    case -1:
      bmr += 500;
      break;
    case 1:
      bmr -= 500;
      break;
  }

  return Math.round((bmr *= -1));
};

function sum(day) {
  let total = 0;
  Object.keys(day).forEach(function (key) {
    // console.log(day[key]);
    if (key !== 'date') {
      if (typeof day[key][0] === 'object') {
        total += day[key][0][1] * day[key].length;
      } else {
        total += day[key][1];
      }
    }
  });
  return total;
}

const planner = async cals => {
  const dataString = await require('../Data/db.json');
  const Breakfast = dataString.breakfast;
  const Entree = dataString.entree;
  const Dessert = dataString.dessert;
  const Snack = dataString.snack;

  const overflow = await AsyncStorage.getItem('overflow');
  const overFlow = JSON.parse(overflow);
  // console.log(overFlow);

  let day = {};
  let month = [];
  let All = await AsyncStorage.getItem('plan');
  let all = JSON.parse(All);
  console.log(all, 'this is first');

  let breakfastFood;
  let lunchFood;
  let dinnerFood;
  let dessertFood;
  let snackFood;

  const d = new Date();
  let year = d.getFullYear();
  let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 4 === 0) {
    months[1] = 29;
  } else {
    months[1] = 28;
  }
  // add one where only runs at midnight of the new month or whenever the calories change
  let monthNum = d.getMonth();
  for (let i = 0; i <= months[monthNum] - d.getDate(); i++) {
    let breakfastOver = overFlow.breakfast;
    let lunchOver = overFlow.lunch;
    let dinnerOver = overFlow.dinner;
    let dessertOver = overFlow.dessert;
    let snackOver = overFlow.snack;
    day = {};

    let dayNum = d.getDate() + i;
    day.date = dayNum;

    // breakfast random generator
    if (breakfastOver.length === 0) {
      breakfastFood = Breakfast[Math.floor(Math.random() * Breakfast.length)];
      for (let k = 0; k < parseInt(breakfastFood.servings, 10); k++) {
        breakfastOver.push([
          breakfastFood.meal,
          parseInt(breakfastFood.macros.calories.split(/([0-9]+)/)[1], 10),
        ]);
      }
    }
    if (breakfastOver[breakfastOver.length - 1][1] < 50) {
      let addList = [];
      let number;
      if (breakfastOver.length >= 11) {
        number = 11;
      } else {
        number = breakfastOver.length;
      }
      for (let j = 0; j < number; j++) {
        let additional = breakfastOver.pop();
        addList.push(additional);
      }
      day.breakfast = addList;
    } else if (breakfastOver[breakfastOver.length - 1][1] < 100) {
      let addList = [];
      let number;
      if (breakfastOver.length >= 4) {
        number = 4;
      } else {
        number = breakfastOver.length;
      }
      for (let j = 0; j < number; j++) {
        let additional = breakfastOver.pop();
        addList.push(additional);
      }
      day.breakfast = addList;
    } else if (breakfastOver[breakfastOver.length - 1][1] < 200) {
      let addList = [];
      let number;
      if (breakfastOver.length >= 2) {
        number = 2;
      } else {
        number = breakfastOver.length;
      }
      for (let j = 0; j < number; j++) {
        let additional = breakfastOver.pop();
        addList.push(additional);
      }
      day.breakfast = addList;
    } else {
      day.breakfast = breakfastOver.pop();
    }

    // lunch generator
    if (lunchOver.length === 0) {
      lunchFood = Entree[Math.floor(Math.random() * Entree.length)];
      for (let k = 0; k < parseInt(lunchFood.servings, 10); k++) {
        lunchOver.push([
          lunchFood.meal,
          parseInt(lunchFood.macros.calories.split(/([0-9]+)/)[1], 10),
        ]);
      }
    }
    if (lunchOver[lunchOver.length - 1][1] < 200) {
      let addList = [];
      let number;
      if (lunchOver.length >= 2) {
        number = 2;
      } else {
        number = lunchOver.length;
      }
      for (let j = 0; j < number; j++) {
        let additional = lunchOver.pop();
        addList.push(additional);
      }
      day.lunch = addList;
    } else {
      day.lunch = lunchOver.pop();
    }

    // dinner generator
    if (dinnerOver.length === 0) {
      dinnerFood = Entree[Math.floor(Math.random() * Entree.length)];
      while (dinnerFood === lunchFood) {
        dinnerFood = Entree[Math.floor(Math.random() * Entree.length)];
      }
      for (let j = 0; j < parseInt(dinnerFood.servings, 10); j++) {
        dinnerOver.push([
          dinnerFood.meal,
          parseInt(dinnerFood.macros.calories.split(/([0-9]+)/)[1], 10),
        ]);
      }
    }

    // multiplier for additional food
    let multiplier = 1;
    let total = sum(day);

    let s = cals - total;
    let su = dinnerOver[0][1];
    let product = Math.floor(s / su);
    if (product > 1) {
      multiplier = product;
    }

    let addList = [];
    let number;
    if (dinnerOver.length >= multiplier) {
      number = multiplier;
    } else {
      number = dinnerOver.length;
    }
    for (let j = 0; j < number; j++) {
      let additional = dinnerOver.pop();
      addList.push(additional);
    }
    day.dinner = addList;

    total = sum(day);

    s = cals - total;
    multiplier = 1;

    if (dessertOver.length === 0) {
      dessertFood = Dessert[Math.floor(Math.random() * Dessert.length)];
      for (let k = 0; k < parseInt(dessertFood.servings, 10); k++) {
        dessertOver.push([
          dessertFood.meal,
          parseInt(dessertFood.macros.calories.split(/([0-9]+)/)[1], 10),
        ]);
      }
    }
    su = dessertOver[0][1];
    product = Math.floor(s / su);
    if (product > 1) {
      multiplier = product;
    }
    addList = [];
    if (dessertOver.length >= multiplier) {
      number = multiplier;
    } else {
      number = dessertOver.length;
    }
    for (let j = 0; j < number; j++) {
      let additional = dessertOver.pop();
      addList.push(additional);
    }
    day.dessert = addList;

    total = sum(day);

    s = cals - total;

    if (snackOver.length === 0) {
      snackFood = Snack[Math.floor(Math.random() * Snack.length)];
      for (let k = 0; k < parseInt(snackFood.servings, 10); k++) {
        snackOver.push([
          snackFood.meal,
          parseInt(snackFood.macros.calories.split(/([0-9]+)/)[1], 10),
        ]);
      }
    }

    su = snackOver[0][1];
    product = Math.floor(s / su);
    if (product > 1) {
      multiplier = product;
    } else {
      multiplier = 1;
    }
    addList = [];
    if (snackOver.length >= multiplier) {
      number = multiplier;
    } else {
      number = snackOver.length;
    }
    for (let j = 0; j < number; j++) {
      let additional = snackOver.pop();
      addList.push(additional);
    }
    day.snack = addList;
    day.total = sum(day);
    month.push(day);

    overFlow.breakfast = breakfastOver;
    overFlow.lunch = lunchOver;
    overFlow.dinner = dinnerOver;
    overFlow.dessert = dessertOver;
    overFlow.snack = snackOver;

    // const overflow = await AsyncStorage.getItem('overflow');
    // let testover = JSON.parse(overflow);
    // console.log(testover);
    // await storeValue(first, 'overflow');
    // console.log('fin');
    await storeValue(overFlow, 'overflow');
    // console.log(day);
  }
  let monthName = monthNames[monthNum];
  if (!('2022' in all)) {
    all[year] = {};
  }
  all[year][monthName] = month;

  await storeValue(all, 'plan');
  console.log(all);
  // all[2022][monthName] = month;
  // console.log(all);
  // await fs.writeFile(
  //   '../Data/planner.json',
  //   JSON.stringify(month, null, 4),
  //   err => {
  //     if (err) {
  //       console.log(err);
  //     }
  //   },
  // );
};

const getStart = () => {
  return 2;
};

const calendarPress = async datePressed => {
  let All = await AsyncStorage.getItem('plan');
  let all = JSON.parse(All);

  let dashFormat = datePressed.dateString;
  let yearFormat = datePressed.year;
  let monthFormat = monthNames[datePressed.month - 1];
  let dayFormat = datePressed.day;
  console.log(dashFormat, yearFormat, monthFormat, dayFormat);
  let index;

  console.log(all[yearFormat][monthFormat]);
  for (let i = 0; i < all[yearFormat][monthFormat].length; i++) {
    if (dayFormat === all[yearFormat][monthFormat][i].date) {
      index = i;
    }
  }
  console.log(index);
};

const CalendarPage = () => {
  const [Age, setAge] = useState('');
  const [Height, setHeight] = useState('');
  const [Weight, setWeight] = useState('');
  const [Activity, setActivity] = useState('');

  useEffect(() => {
    const get = async () => {
      const age = await AsyncStorage.getItem('Age');
      const height = await AsyncStorage.getItem('Height');
      const weight = await AsyncStorage.getItem('Weight');
      const activity = await AsyncStorage.getItem('Activity');
      const maintain = await AsyncStorage.getItem('Maintain');

      setAge(age);
      setHeight(height);
      setWeight(weight);
      setActivity(activity);

      let cals = calories(
        age,
        height,
        weight,
        activity,
        parseInt(maintain, 10),
      );
      // console.log(
      //   calories(age, height, weight, activity, parseInt(maintain, 10)),
      // );

      // run planner and cals once a month
      planner(2500);
    };
    get();
  }, []);
  return (
    <View style={styles.parent}>
      <CalendarList
        // Callback which gets executed when visible months change in scroll view. Default = undefined
        // onVisibleMonthsChange={months => {
        //   console.log('now these months are visible', months);
        // }}
        onDayPress={day => {
          calendarPress(day);
        }}
        // // Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange={getStart()}
        // Max amount of months allowed to scroll to the future. Default = 50
        futureScrollRange={0}
        // Enable or disable scrolling of calendar list
        scrollEnabled={true}
        // Enable horizontal scrolling, default = false
        horizontal={true}
        // Enable paging on horizontal, default = false
        pagingEnabled={true}
        // Set custom calendarWidth.
        calendarWidth={375}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    marginTop: 10,
  },
});

export default CalendarPage;
