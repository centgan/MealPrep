import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
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

const Add = ({route}) => {
  const [Multi, setMulti] = useState(null);
  const [Meal, setMeal] = useState(null);
  const [Calories, setCalories] = useState(null);
  const [Carbs, setCarbs] = useState(null);
  const [Fats, setFats] = useState(null);
  const [Protein, setProtein] = useState(null);

  const d = new Date();

  const updateMulti = (text, update) => {
    switch (update) {
      case 'multi':
        setMulti(text);
        break;
      case 'meal':
        setMeal(text);
        break;
      case 'calories':
        setCalories(text);
        break;
      case 'carbs':
        setCarbs(text);
        break;
      case 'fats':
        setFats(text);
        break;
      case 'protein':
        setProtein(text);
        break;
    }
  };

  const remover = (array, value) => {
    let NewArray = [];
    for (let i = 0; i < array.length; i++) {
      if (i !== value) {
        NewArray.push(array[i]);
      }
    }
    for (let i = 0; i < NewArray.length; i++) {
      NewArray[i].id = i;
    }
    return NewArray;
  };

  const edit = async (number, update, add = false) => {
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

    let same = w[year][month][route.params.index];

    let checkList = [Multi, Meal, Calories, Carbs, Fats, Protein];
    let check = false;
    for (let i = 0; i < checkList.length; i++) {
      if (checkList[i] === null || checkList[i] === '') {
        check = true;
      }
    }

    if (add) {
      if (!check) {
        let adding = {
          multi: Multi,
          id: route.params.num,
          meal: Meal,
          cals: Calories,
          carbs: Carbs,
          fat: Fats,
          protein: Protein,
        };
        w[year][month][route.params.index][route.params.update].push(adding);
      } else {
        Alert.alert(
          'Fill it up',
          'Make sure each field is filled before clicking adding shit',
          [
            {
              text: 'OK',
            },
          ],
        );
      }
    } else {
      w[year][month][route.params.index][update] = remover(
        w[year][month][route.params.index][update],
        number,
      );
      console.log(w[year][month][route.params.index][update]);
      console.log(number, 'num');
    }

    same.totalCals = sum(same, 0);
    same.totalCarbs = sum(same, 1);
    same.totalFat = sum(same, 2);
    same.totalProtein = sum(same, 3);

    // console.log(w[year][month][route.params.index]);
    await store(JSON.stringify(w));
  };

  const doing = () => {
    let dumb = [];
    for (let i = 0; i < route.params.num; i++) {
      dumb.push(i);
    }
    return dumb.map(item => {
      return (
        <TouchableOpacity
          style={styles.removables}
          key={item}
          onPress={() => edit(item, route.params.update)}>
          <Text style={styles.inside}>{item}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.parent}>
      <Text style={styles.titles}>Remove</Text>
      <View style={styles.row}>{doing()}</View>
      <Text style={styles.titles}>Add</Text>
      <View>
        <View style={styles.row}>
          <View style={styles.leftView}>
            <Text style={styles.leftText}>Multi</Text>
          </View>
          <View style={styles.same}>
            <TextInput
              style={styles.rightText}
              value={Multi}
              keyboardType={'numeric'}
              onChangeText={text => updateMulti(text, 'multi')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.leftView}>
            <Text style={styles.leftText}>Meal</Text>
          </View>
          <View style={styles.same}>
            <TextInput
              style={styles.rightText}
              value={Meal}
              onChangeText={text => updateMulti(text, 'meal')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.leftView}>
            <Text style={styles.leftText}>Calories</Text>
          </View>
          <View style={styles.same}>
            <TextInput
              style={styles.rightText}
              value={Calories}
              keyboardType={'numeric'}
              onChangeText={text => updateMulti(text, 'calories')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.leftView}>
            <Text style={styles.leftText}>Carbs</Text>
          </View>
          <View style={styles.same}>
            <TextInput
              style={styles.rightText}
              value={Carbs}
              keyboardType={'numeric'}
              onChangeText={text => updateMulti(text, 'carbs')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.leftView}>
            <Text style={styles.leftText}>Fats</Text>
          </View>
          <View style={styles.same}>
            <TextInput
              style={styles.rightText}
              value={Fats}
              keyboardType={'numeric'}
              onChangeText={text => updateMulti(text, 'fats')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.leftView}>
            <Text style={styles.leftText}>Protein</Text>
          </View>
          <View style={styles.same}>
            <TextInput
              style={styles.rightText}
              value={Protein}
              keyboardType={'numeric'}
              onChangeText={text => updateMulti(text, 'protein')}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => edit(0, 'none', true)}>
        <Text style={styles.addText}>Adding shit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  same: {
    marginTop: 5,
    backgroundColor: 'white',
    height: 30,
    width: 200,
    justifyContent: 'center',
    borderRadius: 8,
  },
  titles: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  removables: {
    marginTop: 5,
    height: 40,
    width: 40,
    borderRadius: 8,
    backgroundColor: 'gold',
    justifyContent: 'center',
  },
  inside: {
    textAlign: 'center',
    fontSize: 16,
  },
  leftView: {
    marginTop: 5,
    height: 30,
    width: 150,
    justifyContent: 'center',
    backgroundColor: 'gold',
  },
  leftText: {
    textAlign: 'center',
  },
  rightText: {
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 12,
  },
  addButton: {
    width: 350,
    height: 30,
    justifyContent: 'center',
    marginTop: 5,
    backgroundColor: 'gold',
  },
  addText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default Add;
