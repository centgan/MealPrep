import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CalendarList, Calendar} from 'react-native-calendars';

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
    case '0':
      break;
    case '-1':
      bmr += 500;
      break;
    case '+1':
      bmr -= 500;
      break;
  }

  return Math.round((bmr *= -1));
};

// 0 is calories 1 is carbs 2 is fat and 3 is protein
function sum(day, which) {
  let total = 0;
  let calc;
  switch (which) {
    case 0:
      calc = 'cals';
      break;
    case 1:
      calc = 'carbs';
      break;
    case 2:
      calc = 'fat';
      break;
    case 3:
      calc = 'protein';
      break;
  }
  Object.keys(day).forEach(function (key) {
    // console.log(key);
    if (
      key !== 'date' &&
      key !== 'id' &&
      key !== 'totalCals' &&
      key !== 'totalCarbs' &&
      key !== 'totalFat' &&
      key !== 'totalProtein'
    ) {
      for (let i of day[key]) {
        total += i[calc] * i.multi;
      }
    }
  });
  return total;
}

function placing(Food, number) {
  let place = {};

  place.id = 0;
  place.meal = Food[0];
  place.cals = Food[1];
  place.carbs = Food[2];
  place.fat = Food[3];
  place.protein = Food[4];
  place.multi = number;

  return place;
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
  // console.log(all, 'this is first');

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

    day.date = d.getDate() + i;

    // breakfast random generator
    if (breakfastOver.length === 0) {
      breakfastFood = Breakfast[Math.floor(Math.random() * Breakfast.length)];
      for (let k = 0; k < parseInt(breakfastFood.servings, 10); k++) {
        breakfastOver.push([
          breakfastFood.meal,
          parseInt(breakfastFood.macros.calories.split(/([0-9]+)/)[1], 10),
          parseInt(breakfastFood.macros.carbs.split('g')[0], 10),
          parseInt(breakfastFood.macros.fat.split('g')[0], 10),
          parseInt(breakfastFood.macros.protein.split('g')[0], 10),
        ]);
      }
      breakfastFood = breakfastOver[0];
    } else {
      breakfastFood = breakfastOver[0];
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
        breakfastOver.pop();
      }
      addList.push(placing(breakfastFood, number));
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
        breakfastOver.pop();
      }
      addList.push(placing(breakfastFood, number));
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
        breakfastOver.pop();
      }
      addList.push(placing(breakfastFood, number));
      day.breakfast = addList;
    } else {
      let addList = [];
      breakfastOver.pop();
      addList.push(placing(breakfastFood, 1));
      day.breakfast = addList;
    }

    // lunch generator
    if (lunchOver.length === 0) {
      lunchFood = Entree[Math.floor(Math.random() * Entree.length)];
      for (let k = 0; k < parseInt(lunchFood.servings, 10); k++) {
        lunchOver.push([
          lunchFood.meal,
          parseInt(lunchFood.macros.calories.split(/([0-9]+)/)[1], 10),
          parseInt(lunchFood.macros.carbs.split('g')[0], 10),
          parseInt(lunchFood.macros.fat.split('g')[0], 10),
          parseInt(lunchFood.macros.protein.split('g')[0], 10),
        ]);
      }
      lunchFood = lunchOver[0];
    } else {
      lunchFood = lunchOver[0];
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
        lunchOver.pop();
      }
      addList.push(placing(lunchFood, number));
      day.lunch = addList;
    } else {
      let addList = [];
      lunchOver.pop();
      addList.push(placing(lunchFood, 1));
      day.lunch = addList;
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
          parseInt(dinnerFood.macros.carbs.split('g')[0], 10),
          parseInt(dinnerFood.macros.fat.split('g')[0], 10),
          parseInt(dinnerFood.macros.protein.split('g')[0], 10),
        ]);
      }
      dinnerFood = dinnerOver[0];
    } else {
      dinnerFood = dinnerOver[0];
    }

    // multiplier for additional food
    let multiplier = 1;
    let total = sum(day, 0);

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
      dinnerOver.pop();
    }
    addList.push(placing(dinnerFood, number));
    day.dinner = addList;

    total = sum(day, 0);

    s = cals - total;
    multiplier = 1;

    if (dessertOver.length === 0) {
      dessertFood = Dessert[Math.floor(Math.random() * Dessert.length)];
      for (let k = 0; k < parseInt(dessertFood.servings, 10); k++) {
        dessertOver.push([
          dessertFood.meal,
          parseInt(dessertFood.macros.calories.split(/([0-9]+)/)[1], 10),
          parseInt(dessertFood.macros.carbs.split('g')[0], 10),
          parseInt(dessertFood.macros.fat.split('g')[0], 10),
          parseInt(dessertFood.macros.protein.split('g')[0], 10),
        ]);
      }
      dessertFood = dessertOver[0];
    } else {
      dessertFood = dessertOver[0];
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
      dessertOver.pop();
    }
    addList.push(placing(dessertFood, number));
    day.dessert = addList;

    total = sum(day, 0);

    s = cals - total;

    if (snackOver.length === 0) {
      snackFood = Snack[Math.floor(Math.random() * Snack.length)];
      for (let k = 0; k < parseInt(snackFood.servings, 10); k++) {
        snackOver.push([
          snackFood.meal,
          parseInt(snackFood.macros.calories.split(/([0-9]+)/)[1], 10),
          parseInt(snackFood.macros.carbs.split('g')[0], 10),
          parseInt(snackFood.macros.fat.split('g')[0], 10),
          parseInt(snackFood.macros.protein.split('g')[0], 10),
        ]);
      }
      snackFood = snackOver[0];
    } else {
      snackFood = snackOver[0];
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
      snackOver.pop();
    }
    addList.push(placing(snackFood, number));

    day.snack = addList;
    let totCar = sum(day, 1);
    let totFat = sum(day, 2);
    let totPro = sum(day, 3);
    day.totalCals = sum(day, 0);
    day.totalCarbs = totCar;
    day.totalFat = totFat;
    day.totalProtein = totPro;

    month.push(day);

    overFlow.breakfast = breakfastOver;
    overFlow.lunch = lunchOver;
    overFlow.dinner = dinnerOver;
    overFlow.dessert = dessertOver;
    overFlow.snack = snackOver;

    await storeValue(overFlow, 'overflow');
  }
  let monthName = monthNames[monthNum];
  if (!(year in all)) {
    all[year] = {};
  }
  all[year][monthName] = month;

  await storeValue(all, 'plan');
};

const CalendarPage = ({navigation}) => {
  const [Show, setShow] = useState(false);
  const [ShowDay, setShowDay] = useState({});
  const [DayData, setDayData] = useState('');
  const [Index, setIndex] = useState(0);
  const [MultiBreak, setMultiBreak] = useState('');
  const [MultiLunch, setMultiLunch] = useState('');
  const [MultiDinner, setMultiDinner] = useState('');
  const [MultiDessert, setMultiDessert] = useState('');
  const [MultiSnack, setMultiSnack] = useState('');
  // 0 is showing food 1 is showing reflection for that day
  const [Reflect, setReflect] = useState(0);
  const TopSame = () => {
    return (
      <View>
        <View style={styles.row}>
          <View style={styles.top}>
            <Text style={styles.topText}>Calories:</Text>
            <Text style={styles.numberText}>{DayData.totalCals}</Text>
          </View>
          <View style={styles.top}>
            <Text style={styles.topText}>Carbs: </Text>
            <Text style={styles.numberText}>{DayData.totalCarbs}g</Text>
          </View>
          <View style={styles.top}>
            <Text style={styles.topText}>Fats: </Text>
            <Text style={styles.numberText}>{DayData.totalFat}g</Text>
          </View>
          <View style={styles.top}>
            <Text style={styles.topText}>Protein: </Text>
            <Text style={styles.numberText}>{DayData.totalProtein}g</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.Multiple}>
            <Text style={styles.otherTop}>Multi</Text>
          </View>
          <View style={styles.Meal}>
            <Text style={styles.otherTop}>Meal</Text>
          </View>
          <View style={styles.Multiple}>
            <Text style={styles.otherTop}>Cals</Text>
          </View>
          <View style={styles.Multiple}>
            <Text style={styles.otherTop}>Carb</Text>
          </View>
          <View style={styles.Multiple}>
            <Text style={styles.otherTop}>Fat</Text>
          </View>
          <View style={styles.Multiple}>
            <Text style={styles.otherTop}>Pro</Text>
          </View>
        </View>
      </View>
    );
  };

  const d = new Date();
  //month to start renders
  // start month is september
  const getStart = () => {
    return 12;
  };

  useEffect(() => {
    const get = async () => {
      const age = await AsyncStorage.getItem('Age');
      const height = await AsyncStorage.getItem('Height');
      const weight = await AsyncStorage.getItem('Weight');
      const activity = await AsyncStorage.getItem('Activity');
      const maintain = await AsyncStorage.getItem('Maintain');
      let allData = await AsyncStorage.getItem('plan');
      allData = JSON.parse(allData);
      setShow(false);
      setReflect(0);

      let cals = calories(
        age,
        height,
        weight,
        activity,
        parseInt(maintain, 10),
      );

      console.log(cals);
      let year = d.getFullYear();
      let month = d.getMonth();
      if (!(year in allData)) {
        planner(cals);
      } else {
        if (!(monthNames[month] in allData[year])) {
          planner(cals);
        }
      }
    };
    get();
  }, []);

  //repeated things
  const repetition = item => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.row}
        onPress={() => {
          navigation.navigate('IndividualScreen', {
            title: item.meal,
          });
        }}>
        <View style={styles.MultipleWide}>
          <Text style={styles.TextMain}>{item.multi}</Text>
          {/*<TouchableOpacity style={styles.check} />*/}
        </View>
        <View style={styles.MealWide}>
          <Text style={styles.TextMain}>{item.meal}</Text>
        </View>
        <View style={styles.MultipleWide}>
          <Text style={styles.TextMain}>{item.cals}</Text>
        </View>
        <View style={styles.MultipleWide}>
          <Text style={styles.TextMain}>{item.carbs}</Text>
        </View>
        <View style={styles.MultipleWide}>
          <Text style={styles.TextMain}>{item.fat}</Text>
        </View>
        <View style={styles.MultipleWide}>
          <Text style={styles.TextMain}>{item.protein}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const calendarPress = async datePressed => {
    let All = await AsyncStorage.getItem('plan');
    let all = JSON.parse(All);

    let yearFormat = datePressed.year;
    let monthFormat = monthNames[datePressed.month - 1];
    let dayFormat = datePressed.day;
    // console.log(dashFormat, yearFormat, monthFormat, dayFormat);
    let index;

    // console.log(all[yearFormat][monthFormat]);
    for (let i = 0; i < all[yearFormat][monthFormat].length; i++) {
      if (dayFormat === all[yearFormat][monthFormat][i].date) {
        index = i;
      }
    }
    setShow(true);

    // console.log(all[yearFormat][monthFormat][index]);
    setIndex(index);
    setDayData(all[yearFormat][monthFormat][index]);
    // showing(all[yearFormat][monthFormat][index]);
    // console.log(index);
  };

  const get = async text => {
    try {
      const value = await AsyncStorage.getItem(text);
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const store = async value => {
    try {
      await AsyncStorage.setItem('plan', value);
    } catch (e) {
      console.log(e);
    }
  };

  const setMulti = (text, storage) => {
    switch (storage) {
      case 'breakfast':
        setMultiBreak(text);
        break;
      case 'lunch':
        setMultiLunch(text);
        break;
      case 'dinner':
        setMultiDinner(text);
        break;
      case 'dessert':
        setMultiDessert(text);
        break;
      case 'snack':
        setMultiSnack(text);
        break;
    }
  };
  const updateEdit = async (text, date, id, update) => {
    let w;
    await get('plan')
      .then(value => value)
      .then(data => {
        w = data;
      })
      .catch(err => console.log(err));
    w = JSON.parse(w);
    let year = d.getFullYear();
    let month = monthNames[d.getMonth()];
    // console.log(w[year][month]);

    // let index;
    // for (let i = 0; i < w[year][month].length; i++) {
    //   if (date === w[year][month][i].date) {
    //     index = i;
    //     // break;
    //   }
    // }
    let same = w[year][month][Index];
    w[year][month][Index][update][id].multi = text;
    same.totalCals = sum(same, 0);
    same.totalCarbs = sum(same, 1);
    same.totalFat = sum(same, 2);
    same.totalProtein = sum(same, 3);
    // w[year][month].map(item => {
    //   if (date === item.date) {
    //     item[update][id].multi = text;
    //     console.log(item[update][id], 'this got');
    //   }
    // });
    // console.log(item[update][id]);

    // console.log(w[year][month][2]);
    await store(JSON.stringify(w));
    setMulti(text, update);
  };
  // 0 is food 1 is reflection 2 is editing
  const topPressed = () => {
    // let reflection = await AsyncStorage.getItem('Reflect');
    // reflection = JSON.parse(reflection);
    if (Reflect === 0) {
      return (
        <ScrollView>
          {TopSame()}
          <View style={styles.titles}>
            <Text style={styles.textTitle}>Breakfast</Text>
          </View>
          {DayData.breakfast.map(item => {
            return repetition(item);
          })}

          <View style={styles.titles}>
            <Text style={styles.textTitle}>Lunch</Text>
          </View>
          {DayData.lunch.map(item => {
            return repetition(item);
          })}

          <View style={styles.titles}>
            <Text style={styles.textTitle}>Dinner</Text>
          </View>
          {DayData.dinner.map(item => {
            return repetition(item);
          })}

          <View style={styles.titles}>
            <Text style={styles.textTitle}>Dessert</Text>
          </View>
          {DayData.dessert.map(item => {
            return repetition(item);
          })}

          <View style={styles.titles}>
            <Text style={styles.textTitle}>Snacks</Text>
          </View>
          {DayData.snack.map(item => {
            return repetition(item);
          })}
        </ScrollView>
      );
    } else if (Reflect === 1) {
      return (
        <View>
          <View>
            <Text style={styles.textDate}>
              {d.getDate()}/{d.getMonth() + 1}/{d.getFullYear()}
            </Text>
          </View>
          <ScrollView>
            <Text style={styles.textReflect}>hello</Text>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <ScrollView>
          {TopSame()}

          <View style={styles.titles}>
            <Text style={styles.textTitle}>Breakfast</Text>
          </View>
          {DayData.breakfast.map(item => {
            return (
              <View key={item.id} style={styles.row}>
                <View style={styles.MultipleWide}>
                  <TextInput
                    style={styles.TextMain}
                    value={MultiBreak}
                    onChangeText={text =>
                      updateEdit(text, DayData.date, item.id, 'breakfast')
                    }
                    keyboardType={'numeric'}
                  />
                </View>
                <View style={styles.MealWide}>
                  <Text style={styles.TextMain}>{item.meal}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.cals}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.carbs}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.fat}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.protein}</Text>
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              console.log(Index);
              navigation.navigate('AddPage', {
                title: 'Editing Breakfast',
                update: 'breakfast',
                num: DayData.breakfast.length,
                date: DayData.date,
                index: Index,
              });
            }}>
            <Text style={styles.addText}>Click to add/subtract food</Text>
          </TouchableOpacity>
          <View style={styles.titles}>
            <Text style={styles.textTitle}>Lunch</Text>
          </View>
          {DayData.lunch.map(item => {
            return (
              <View key={item.id} style={styles.row}>
                <View style={styles.MultipleWide}>
                  <TextInput
                    style={styles.TextMain}
                    value={MultiLunch}
                    onChangeText={text =>
                      updateEdit(text, DayData.date, item.id, 'lunch')
                    }
                    keyboardType={'numeric'}
                  />
                </View>
                <View style={styles.MealWide}>
                  <Text style={styles.TextMain}>{item.meal}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.cals}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.carbs}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.fat}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.protein}</Text>
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              console.log(Index);
              navigation.navigate('AddPage', {
                title: 'Editing Lunch',
                update: 'lunch',
                num: DayData.lunch.length,
                date: DayData.date,
                index: Index,
              });
            }}>
            <Text style={styles.addText}>Click to add/subtract food</Text>
          </TouchableOpacity>
          <View style={styles.titles}>
            <Text style={styles.textTitle}>Dinner</Text>
          </View>
          {DayData.dinner.map(item => {
            return (
              <View key={item.id} style={styles.row}>
                <View style={styles.MultipleWide}>
                  <TextInput
                    style={styles.TextMain}
                    value={MultiDinner}
                    onChangeText={text =>
                      updateEdit(text, DayData.date, item.id, 'dinner')
                    }
                    keyboardType={'numeric'}
                  />
                </View>
                <View style={styles.MealWide}>
                  <Text style={styles.TextMain}>{item.meal}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.cals}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.carbs}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.fat}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.protein}</Text>
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              console.log(Index);
              navigation.navigate('AddPage', {
                title: 'Editing Dinner',
                update: 'dinner',
                num: DayData.dinner.length,
                date: DayData.date,
                index: Index,
              });
            }}>
            <Text style={styles.addText}>Click to add/subtract food</Text>
          </TouchableOpacity>
          <View style={styles.titles}>
            <Text style={styles.textTitle}>Dessert</Text>
          </View>
          {DayData.dessert.map(item => {
            return (
              <View key={item.id} style={styles.row}>
                <View style={styles.MultipleWide}>
                  <TextInput
                    style={styles.TextMain}
                    value={MultiDessert}
                    onChangeText={text =>
                      updateEdit(text, DayData.date, item.id, 'dessert')
                    }
                    keyboardType={'numeric'}
                  />
                </View>
                <View style={styles.MealWide}>
                  <Text style={styles.TextMain}>{item.meal}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.cals}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.carbs}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.fat}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.protein}</Text>
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              console.log(Index);
              navigation.navigate('AddPage', {
                title: 'Editing Dessert',
                update: 'dessert',
                num: DayData.dessert.length,
                date: DayData.date,
                index: Index,
              });
            }}>
            <Text style={styles.addText}>Click to add/subtract food</Text>
          </TouchableOpacity>
          <View style={styles.titles}>
            <Text style={styles.textTitle}>Snacks</Text>
          </View>
          {DayData.snack.map(item => {
            return (
              <View key={item.id} style={styles.row}>
                <View style={styles.MultipleWide}>
                  <TextInput
                    style={styles.TextMain}
                    value={MultiSnack}
                    onChangeText={text =>
                      updateEdit(text, DayData.date, item.id, 'snack')
                    }
                    keyboardType={'numeric'}
                  />
                </View>
                <View style={styles.MealWide}>
                  <Text style={styles.TextMain}>{item.meal}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.cals}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.carbs}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.fat}</Text>
                </View>
                <View style={styles.MultipleWide}>
                  <Text style={styles.TextMain}>{item.protein}</Text>
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              console.log(Index);
              navigation.navigate('AddPage', {
                title: 'Editing Snack',
                update: 'snack',
                num: DayData.snack.length,
                date: DayData.date,
                index: Index,
              });
            }}>
            <Text style={styles.addText}>Click to add/subtract food</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }
  };

  const showing = () => {
    if (typeof DayData !== 'undefined' && DayData !== '') {
      // console.log(DayData, 'sum weird');
      // Object.keys(DayData).forEach(function (key) {
      //   console.log(key + ' ' + DayData[key]);
      // });
      return (
        <View style={styles.scroll}>
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.showDiff}
              onPress={() => setReflect(0)}>
              <Text style={styles.buttonText}>Food</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.showDiff}
              onPress={() => setReflect(1)}>
              <Text style={styles.buttonText}>Reflection</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.showDiff}
              onPress={() => setReflect(2)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          {topPressed()}
        </View>
      );
    }
  };

  return (
    <View style={styles.parent}>
      <CalendarList
        markedDates={ShowDay}
        // Callback which gets executed when visible months change in scroll view. Default = undefined
        // onVisibleMonthsChange={months => {
        //   console.log('now these months are visible', months);
        // }}
        onDayPress={day => {
          let dayFormat = day.dateString;
          let place = {};
          place[dayFormat] = {selected: true};
          setShowDay(place);
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
      {Show ? showing() : null}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    marginTop: 10,
    backgroundColor: '#037971',
    // marginBottom: 100,
  },
  topRow: {
    marginHorizontal: 30,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  showDiff: {
    height: 30,
    width: 100,
    backgroundColor: '#03B5AA',
    borderRadius: 16,
    justifyContent: 'center',
  },
  row: {
    marginTop: 10,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  top: {
    width: 80,
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 4,
  },
  topText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
  },
  numberText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonText: {
    color: '#007AFF',
    textAlign: 'center',
  },
  scroll: {
    height: 240,
  },
  each: {
    height: 110,
    width: 110,
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    paddingHorizontal: 5,
    overflow: 'hidden',
  },
  otherTop: {
    fontSize: 12,
    textAlign: 'center',
  },
  Multiple: {
    width: 30,
    height: 20,
    justifyContent: 'center',
  },
  Meal: {
    width: 150,
    height: 20,
    justifyContent: 'center',
  },
  MultipleWide: {
    width: 30,
    height: 60,
    backgroundColor: '#03B5AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MealWide: {
    width: 150,
    height: 60,
    backgroundColor: '#03B5AA',
    justifyContent: 'center',
  },
  TextMain: {
    textAlign: 'center',
  },
  titles: {
    marginTop: 10,
    marginLeft: 15,
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textDate: {
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  textReflect: {
    fontSize: 16,
    marginHorizontal: 30,
    marginTop: 10,
  },
  check: {
    marginTop: 5,
    justifyContent: 'center',
    height: 15,
    width: 15,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'gold',
  },
  button: {
    marginTop: 10,
    marginHorizontal: 15,
    width: 350,
    height: 20,
    justifyContent: 'center',
    backgroundColor: '#03B5AA',
    borderRadius: 8,
    shadowOffset: {
      width: -5,
      height: 5,
    },
    shadowOpacity: 1,
  },
  addText: {
    color: '#198367',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CalendarPage;
