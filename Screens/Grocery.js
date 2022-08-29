import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
const d = new Date();
const db_full = require('../Data/db.json');

const storeValue = async (value, key) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const searching = (searchMeal, update) => {
  if (update === 'lunch' || update === 'dinner') {
    update = 'entree';
  }
  let current = db_full[update];
  let ingredients = null;
  for (let i = 0; i < current.length; i++) {
    if (current[i].meal === searchMeal) {
      ingredients = current[i].ingredients;
    }
  }
  if (ingredients === null) {
    ingredients = [];
  }
  return ingredients;
};

const load = (data, input, ingredients) => {
  switch (input) {
    case 0:
      data['week 1'] = data['week 1'].concat(ingredients);
      break;
    case 1:
      data['week 2'] = data['week 2'].concat(ingredients);
      break;
    case 2:
      data['week 3'] = data['week 3'].concat(ingredients);
      break;
    case 3:
      data['week 4'] = data['week 4'].concat(ingredients);
      break;
    case 4:
      data['week 5'] = data['week 5'].concat(ingredients);
      break;
  }
  return data;
};

const getAll = async () => {
  let weeks = {
    'week 1': [],
    'week 2': [],
    'week 3': [],
    'week 4': [],
    'week 5': [],
  };
  let preBreak,
    preLunch,
    preDinner,
    preSnack,
    preDessert = '';
  const all = await AsyncStorage.getItem('plan');
  const All = JSON.parse(all);

  let cur = All[d.getFullYear()][monthNames[d.getMonth()]];
  for (let i = 0; i < cur.length; i++) {
    let week = Math.floor(cur[i].date / 7);
    // console.log(cur[i]);
    Object.keys(cur[i]).forEach(function (item) {
      if (
        item !== 'date' &&
        item !== 'totalCals' &&
        item !== 'totalCarbs' &&
        item !== 'totalFat' &&
        item !== 'totalProtein'
      ) {
        switch (item) {
          case 'breakfast':
            if (cur[i][item].length !== 0) {
              if (cur[i][item][0].meal !== preBreak) {
                let ing = searching(cur[i][item][0].meal, item);
                weeks = load(weeks, week, ing);
              }
              preBreak = cur[i][item][0].meal;
            } else {
              preBreak = [];
            }
            break;
          case 'lunch':
            if (cur[i][item].length !== 0) {
              if (cur[i][item][0].meal !== preLunch) {
                let ing = searching(cur[i][item][0].meal, item);
                weeks = load(weeks, week, ing);
              }
              preLunch = cur[i][item][0].meal;
            } else {
              preLunch = [];
            }
            break;
          case 'dinner':
            if (cur[i][item].length !== 0) {
              if (cur[i][item][0].meal !== preDinner) {
                let ing = searching(cur[i][item][0].meal, item);
                weeks = load(weeks, week, ing);
              }
              preDinner = cur[i][item][0].meal;
            } else {
              preDinner = [];
            }
            break;
          case 'dessert':
            if (cur[i][item].length !== 0) {
              if (cur[i][item][0].meal !== preDessert) {
                let ing = searching(cur[i][item][0].meal, item);
                weeks = load(weeks, week, ing);
              }
              preDessert = cur[i][item][0].meal;
            } else {
              preDessert = [];
            }
            break;
          case 'snack':
            if (cur[i][item].length !== 0) {
              if (cur[i][item][0].meal !== preSnack) {
                let ing = searching(cur[i][item][0].meal, item);
                weeks = load(weeks, week, ing);
              }
              preSnack = cur[i][item][0].meal;
            } else {
              preSnack = [];
            }
            break;
        }
      }
    });
  }
  storeValue(weeks, 'grocery');
};

const GroceryPage = () => {
  const [weekOne, setWeekOne] = useState([]);
  const [weekTwo, setWeekTwo] = useState([]);
  const [weekThree, setWeekThree] = useState([]);
  const [weekFour, setWeekFour] = useState([]);
  const [weekFive, setWeekFive] = useState([]);

  useEffect(() => {
    const get = async () => {
      let allData = await AsyncStorage.getItem('plan');
      let place = await AsyncStorage.getItem('grocery');
      allData = JSON.parse(allData);
      place = JSON.parse(place);
      setWeekOne(place['week 1']);
      setWeekTwo(place['week 2']);
      setWeekThree(place['week 3']);
      setWeekFour(place['week 4']);
      setWeekFive(place['week 5']);

      let year = d.getFullYear();
      let month = d.getMonth();
      if (!(year in allData)) {
        getAll();
      } else {
        if (!(monthNames[month] in allData[year])) {
          getAll();
        }
      }
    };
    get();
  }, []);
  // console.log(Groceries);
  return (
    <View style={styles.parent}>
      <ScrollView>
        <Text style={styles.topText}>Grocery Reminder</Text>
        <View>
          <Text style={styles.lowerText}>Week 1</Text>
          {weekOne.map(item => {
            return <Text style={styles.listText}>{item}</Text>;
          })}
        </View>
        <View>
          <Text style={styles.lowerText}>Week 2</Text>
          {weekTwo.map(item => {
            return <Text style={styles.listText}>{item}</Text>;
          })}
        </View>
        <View>
          <Text style={styles.lowerText}>Week 3</Text>
          {weekThree.map(item => {
            return <Text style={styles.listText}>{item}</Text>;
          })}
        </View>
        <View>
          <Text style={styles.lowerText}>Week 4</Text>
          {weekFour.map(item => {
            return <Text style={styles.listText}>{item}</Text>;
          })}
        </View>
        <View>
          <Text style={styles.lowerText}>Week 5</Text>
          {weekFive.map(item => {
            return <Text style={styles.listText}>{item}</Text>;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: '#00BFB3',
  },
  topText: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#023436',
  },
  listText: {
    fontSize: 12,
  },
  lowerText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default GroceryPage;
