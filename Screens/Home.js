import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fitness from '@ovalmoney/react-native-fitness';

const permissions = [
  {
    kind: Fitness.PermissionKinds.Steps,
  },
];

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

// only run once a day
const dynamicWeek = () => {
  let d = new Date();
  const week = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  let weekList;
  if (d.getDay() === 6) {
    weekList = week;
  } else {
    let sliced = week.splice(d.getDay() + 1, 6);
    for (let i = sliced.length - 1; i >= 0; i--) {
      week.unshift(sliced[i]);
    }
    weekList = week;
  }
  // dataSets.labels = weekList;
  // console.log(weekList);
  return weekList;
};

const store = async (value, which) => {
  try {
    await AsyncStorage.setItem(which, value);
  } catch (e) {
    console.log(e);
  }
};

const getPhysical = async text => {
  try {
    const value = await AsyncStorage.getItem(text);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log(e);
  }
};

const HomePage = () => {
  const [Age, setAge] = useState('');
  const [Height, setHeight] = useState('');
  const [Weight, setWeight] = useState('');
  const [Activity, setActivity] = useState('');
  const [Auth, setAuth] = useState(false);
  const [Steps, setSteps] = useState(null);
  const [Main, setMain] = useState('');
  let activityPath;

  const checkAge = async text => {
    let w;
    await getPhysical('Age')
      .then(value => value)
      .then(data => {
        w = data;
      })
      .catch(err => console.log(err));
    if (text) {
      if (w !== text) {
        await store(text, 'Age');
      }
      setAge(text);
    } else {
      setAge(text);
    }
  };
  const checkHeight = async text => {
    let w;
    await getPhysical('Weight')
      .then(value => value)
      .then(data => {
        w = data;
      })
      .catch(err => console.log(err));
    if (text) {
      if (w !== text) {
        await store(text, 'Height');
      }
      setHeight(text);
    } else {
      setHeight(text);
    }
  };
  const checkWeight = async text => {
    let w;
    await getPhysical('Weight')
      .then(value => value)
      .then(data => {
        w = data;
      })
      .catch(err => console.log(err));
    if (text) {
      if (w !== text) {
        await store(text, 'Weight');
      }
      setWeight(text);
    } else {
      setWeight(text);
    }
  };
  const checkActivity = async text => {
    let w;
    await getPhysical('Activity')
      .then(value => value)
      .then(data => {
        w = data;
      })
      .catch(err => console.log(err));
    if (text) {
      if (w !== text) {
        await store(text, 'Activity');
      }
      setActivity(text);
    } else {
      setActivity(text);
    }
  };
  const checkMaintain = async num => {
    switch (num) {
      case -1:
        console.log('less 0');
        setMain('-1');
        await store('-1', 'Maintain');
        break;
      case 0:
        // console.log('0');
        setMain('0');
        await store('0', 'Maintain');
        break;
      case +1:
        // console.log('greater 0');
        setMain('+1');
        await store('+1', 'Maintain');
        break;
    }
  };

  const setActivityURL = () => {
    // console.log(Activity);
    if (Activity.toUpperCase().indexOf('SEDENTARY') >= 0) {
      activityPath =
        'https://cdn0.iconfinder.com/data/icons/healthcare-medical-4/512/bed-512.png';
    } else if (Activity.toUpperCase().indexOf('LIGHT') >= 0) {
      activityPath =
        'https://www.shareicon.net/data/2016/04/06/745500_sports_512x512.png';
    } else if (Activity.toUpperCase().indexOf('MODERATE') >= 0) {
      activityPath =
        'https://openclipart.org/image/2400px/svg_to_png/201733/1410105361.png';
    } else if (Activity.toUpperCase().indexOf('INTENSE') >= 0) {
      activityPath =
        'https://cdn.pixabay.com/photo/2014/04/02/11/00/runner-305189_1280.png';
    } else if (Activity.toUpperCase().indexOf('EXTREME') >= 0) {
      activityPath =
        'https://cdn.emojidex.com/emoji/seal/weight_lifter.png?1417132311';
    }
    return activityPath;
  };
  const setMaintainURL = () => {
    // console.log(Main, 'dis');
    let num;
    switch (Main) {
      case '-1':
        num =
          'https://pluspng.com/img-png/stickman-png-hd-free-1074x2400-stick-man-wallpapers-1074.png';
        break;
      case '0':
        num = 'https://webstockreview.net/images/clipart-bathroom-symbol-7.png';
        break;
      case '+1':
        num = 'https://webstockreview.net/images/fat-clipart-overweight-1.png';
        break;
    }
    return num;
  };

  useEffect(() => {
    const pull = async () => {
      const age = await AsyncStorage.getItem('Age');
      const height = await AsyncStorage.getItem('Height');
      const weight = await AsyncStorage.getItem('Weight');
      const activityAsync = await AsyncStorage.getItem('Activity');
      const maintain = await AsyncStorage.getItem('Maintain');

      setAge(age);
      setHeight(height);
      setWeight(weight);
      setActivity(activityAsync);
      setMain(maintain);
    };

    const getSteps = async () => {
      let curDate = new Date();
      curDate.setTime(
        curDate.getTime() +
          curDate.getTimezoneOffset() * 60 * 1000 +
          4 * 60 * 60 * 1000,
      );
      let weekDate = new Date();
      weekDate.setTime(
        weekDate.getTime() +
          weekDate.getTimezoneOffset() * 60 * 1000 +
          4 * 60 * 60 * 1000,
      );
      let we = curDate.getDate() - 7;
      weekDate.setDate(we);
      let theDates = {startDate: weekDate, endDate: curDate};
      let sum = await Fitness.getSteps(theDates);

      let b = [0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < sum.length; j++) {
          let partA = sum[j].startDate.split('-')[2].split('T')[0];
          if (parseInt(weekDate.getDate() + i, 10) === parseInt(partA, 10)) {
            b[i] = sum[j].quantity;
          }
        }
      }
      setSteps(b);
    };
    const req = async () => {
      await Fitness.requestPermissions(permissions)
        .then(authorized => {
          console.log({authorized});
        })
        .catch(err => {
          console.log('err');
          console.log({err});
        });
    };
    const auth = async () => {
      await Fitness.isAuthorized(permissions)
        .then(authorized => {
          if (authorized === true) {
            setAuth(true);
            getSteps();
          } else {
            req();
          }
        })
        .catch(error => {
          console.log('err auth');
          console.log(error);
        });
    };
    pull();
    auth();
  }, []);

  let a = [0, 0, 0, 0, 0, 0, 0];
  const dynamicData = which => {
    if (Auth && Steps != null) {
      a = [];
      for (let i = 0; i < Steps.length; i++) {
        a.push(Steps[i]);
      }
    }
    // setMove(a[a.length - 1]);
    if (which === 0) {
      return a;
    } else {
      if (a[a.length - 1] <= 5000) {
        return 'Get up and move';
      } else {
        return 'Boss man moves';
      }
    }
  };

  return (
    <View style={styles.parent}>
      <Text style={styles.Welcome}>Welcome Back, </Text>
      <View style={styles.chartView}>
        <Text style={styles.titleText}>Steps: </Text>
        <LineChart
          style={styles.chart}
          data={{
            labels: dynamicWeek(),
            datasets: [
              {
                data: dynamicData(0),
              },
            ],
          }}
          width={310} // from react-native
          height={190}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: '#049A8F',
            backgroundGradientFrom: '#03B5AA',
            backgroundGradientTo: '#d69e51',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
        />
      </View>
      <View style={styles.rowView}>
        <View style={styles.halfView}>
          <Text style={styles.titleText}>Calories</Text>
          <Text style={styles.caloriesText}>
            {calories(Age, Height, Weight, Activity, Main)}
          </Text>
        </View>
        <View style={styles.halfView}>
          <Text style={styles.titleText}>Reflection</Text>
          <Text style={styles.reflectionText}>{dynamicData(1)}</Text>
        </View>
      </View>
      <View style={styles.rowView}>
        <View>
          <View style={styles.physical}>
            <Text style={styles.physicalText}>Age</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => checkAge(text)}
              value={Age}
              keyboardType={'numeric'}
            />
          </View>
          <View style={styles.physical}>
            <Text style={styles.physicalText}>Height</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => checkHeight(text)}
              value={Height}
              keyboardType={'numeric'}
            />
          </View>
          <View style={styles.physical}>
            <Text style={styles.physicalText}>Weight</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => checkWeight(text)}
              value={Weight}
              keyboardType={'numeric'}
            />
          </View>
        </View>
        <View style={styles.halfView}>
          <Text style={styles.titleText}>Activity</Text>
          <View style={styles.rowBott}>
            <Image
              style={styles.imgActivity}
              resizeMode="contain"
              source={{
                uri: setActivityURL(),
              }}
            />
            <Image
              style={styles.imgActivity}
              resizeMode="contain"
              // resizeMethod="stretch"
              source={{
                uri: setMaintainURL(),
              }}
            />
          </View>
          <TextInput
            style={styles.activityInput}
            onChangeText={text => checkActivity(text)}
            value={Activity}
          />
          <View style={styles.rowBott}>
            <TouchableOpacity onPress={() => checkMaintain(-1)}>
              <View style={styles.buttonClick}>
                <Text style={styles.buttonText}>-1</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => checkMaintain(0)}>
              <View style={styles.buttonClick}>
                <Text style={styles.buttonText}>0</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => checkMaintain(+1)}>
              <View style={styles.buttonClick}>
                <Text style={styles.buttonText}>+1</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
// activity view
const styles = StyleSheet.create({
  parent: {
    paddingTop: 20,
    paddingHorizontal: 25,
    backgroundColor: '#00BFB3',
  },
  Welcome: {
    marginBottom: 5,
    textAlign: 'left',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#023436',
  },
  chartView: {
    width: 330,
    height: 225,
    backgroundColor: '#037971',
    // alignItems: 'center',
    borderRadius: 16,
    // shadowOffset: {
    //   width: -5,
    //   height: 5,
    // },
    // shadowOpacity: 1,
  },
  chart: {
    // marginVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  titleText: {
    paddingTop: 10,
    paddingLeft: 15,
    fontWeight: 'bold',
    fontSize: 15,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginLeft: 10,
    marginTop: 10,
  },
  halfView: {
    height: 153,
    width: 153,
    borderRadius: 16,
    backgroundColor: '#037971',
  },
  physical: {
    // marginLeft: 10,
    marginBottom: 11,
    width: 153,
    height: 44,
    backgroundColor: '#03B5AA',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowOffset: {
      width: -5,
      height: 5,
    },
    shadowOpacity: 1,
  },
  physicalText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 15,
    marginTop: 10,
  },
  input: {
    height: 34,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 5,
    marginRight: 10,
    textAlign: 'center',
  },
  activityInput: {
    height: 34,
    width: 133,
    backgroundColor: '#03B5AA',
    shadowOffset: {
      width: -5,
      height: 5,
    },
    shadowOpacity: 1,
    marginHorizontal: 10,
    borderRadius: 16,
    padding: 5,
    marginTop: 5,
  },
  imgActivity: {
    height: 40,
    width: 40,
    marginLeft: 20,
    // marginHorizontal: 15,
    // marginTop: 5,
  },
  rowBott: {
    flexDirection: 'row',
    marginTop: 5,
    // justifyContent: 'space-between',
  },
  buttonClick: {
    backgroundColor: '#03B5AA',
    shadowOffset: {
      width: -5,
      height: 5,
    },
    shadowOpacity: 1,
    height: 30,
    width: 30,
    borderRadius: 16,
    marginHorizontal: 10,
  },
  buttonText: {
    textAlign: 'center',
    marginVertical: 6,
  },
  caloriesText: {
    fontSize: 46,
    fontWeight: 'bold',
    color: '#47d3b3',
    marginTop: 25,
    textAlign: 'center',
    fontFamily: 'American Typewriter',
    textDecorationLine: 'underline',
  },
  reflectionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#47d3b3',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'American Typewriter',
    marginHorizontal: 5,
  },
});

export default HomePage;
