import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {LineChart, ProgressChart} from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fitness from '@ovalmoney/react-native-fitness';

const progressData = {
  labels: ['Swim'], // optional
  data: [0.4],
};
const chartConfig = {
  // backgroundColor: 'white',
  backgroundGradientFrom: 'white',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: 'white',
  backgroundGradientToOpacity: 0.75,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const permissions = [
  {
    kind: Fitness.PermissionKinds.Steps,
  },
];

// let stepChart = [];
// let dataSets = {};

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

// let dataSets = {
//   labels: dynamicWeek(),
//   datasets: dataSets],
// };

const storeAge = async value => {
  try {
    await AsyncStorage.setItem('Age', value);
  } catch (e) {
    console.log(e);
  }
};
const storeHeight = async value => {
  try {
    await AsyncStorage.setItem('Height', value);
  } catch (e) {
    console.log(e);
  }
};
const storeWeight = async value => {
  try {
    await AsyncStorage.setItem('Weight', value);
  } catch (e) {
    console.log(e);
  }
};
const storeActivity = async value => {
  try {
    await AsyncStorage.setItem('Activity', value);
  } catch (e) {
    console.log(e);
  }
};
const storeMaintain = async value => {
  try {
    await AsyncStorage.setItem('Maintain', value);
  } catch (e) {
    console.log(e);
  }
};

// const getAge = async () => {
//   try {
//     const value = await AsyncStorage.getItem('Age');
//     if (value !== null) {
//       return value;
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
// const getHeight = async () => {
//   try {
//     const value = await AsyncStorage.getItem('Height');
//     if (value !== null) {
//       return value;
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
// const getWeight = async () => {
//   try {
//     const value = await AsyncStorage.getItem('Weight');
//     if (value !== null) {
//       return value;
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
// const getActivity = async () => {
//   try {
//     const value = await AsyncStorage.getItem('Activity');
//     if (value !== null) {
//       return value;
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };

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
        await storeAge(text);
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
        await storeHeight(text);
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
        await storeWeight(text);
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
        await storeActivity(text);
      }
      setActivity(text);
    } else {
      setActivity(text);
    }
  };
  const checkMaintain = async num => {
    switch (num) {
      case -1:
        // console.log('less 0');
        setMain('-1');
        await storeMaintain('-1');
        break;
      case 0:
        // console.log('0');
        setMain('0');
        await storeMaintain('0');
        break;
      case +1:
        // console.log('greater 0');
        setMain('+1');
        await storeMaintain('+1');
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
        // console.log('-1 in');
        num =
          'https://pluspng.com/img-png/stickman-png-hd-free-1074x2400-stick-man-wallpapers-1074.png';
        break;
      case '0':
        // console.log('0 in');
        num = 'https://webstockreview.net/images/clipart-bathroom-symbol-7.png';
        break;
      case '+1':
        // console.log('+1 in');
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
      // console.log(setURl());
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
      setSteps(sum);
      // console.log(Steps);
      // console.log(sum);
      // stepChart = sum;
      // dataSets.labels = dynamicWeek();
      // dataSets.datasets = [{}];
      // for (let i = 0; i < sum.length; i++) {
      //   // stepChart[i] = sum[i].quantity;
      //   // sum[i].quantity = parseInt(sum[i].quantity);
      //   stepChart.push(parseInt(sum[i].quantity, 10));
      // }
      // dataSets.datasets[0].data = stepChart;
      // stepChart.map(item => {
      //   console.log(item.quantity);
      // });
      // let dataSets;
      // dataSets.data = stepChart;
      // console.log(stepChart);
      // console.log(dataSets.datasets);
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
            getSteps();
            setAuth(true);
            getSteps();
            console.log('got');
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
    // dynamicWeek();
  }, []);

  let a = [0, 0, 0, 0, 0, 0, 0];
  const dynamicData = () => {
    // console.log(Steps, 'dyn');
    // console.log(Auth);
    // console.log(stepChart);
    if (Auth && Steps != null) {
      a = [];
      for (let i = 0; i < Steps.length; i++) {
        a.push(Steps[i].quantity);
      }
    }
    return a;
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
                data: dynamicData(),
              },
            ],
          }}
          width={310} // from react-native
          height={190}
          // yAxisLabel="$"
          // yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            // style: {
            //   borderRadius: 16,
            // },
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
          <ProgressChart
            data={progressData}
            width={150}
            height={130}
            strokeWidth={16}
            radius={50}
            chartConfig={chartConfig}
            hideLegend={true}
          />
        </View>
        <View style={styles.halfView}>
          <Text style={styles.titleText}>Reflection</Text>
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
    marginTop: 20,
    marginHorizontal: 25,
  },
  Welcome: {
    marginBottom: 5,
    textAlign: 'left',
    fontSize: 26,
    fontWeight: 'bold',
  },
  chartView: {
    width: 330,
    height: 225,
    backgroundColor: 'aqua',
    // alignItems: 'center',
    borderRadius: 16,
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
    marginLeft: 10,
    marginTop: 10,
  },
  halfView: {
    backgroundColor: 'white',
    height: 153,
    width: 153,
    borderRadius: 16,
  },
  physical: {
    // marginLeft: 10,
    marginBottom: 11,
    width: 153,
    height: 44,
    backgroundColor: 'gold',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  physicalText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 15,
    marginTop: 10,
    // textAlign: 'center',
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
    backgroundColor: 'gold',
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
    backgroundColor: 'gold',
    height: 30,
    width: 30,
    borderRadius: 16,
    marginHorizontal: 10,
  },
  buttonText: {
    textAlign: 'center',
    marginVertical: 6,
  },
});

export default HomePage;
