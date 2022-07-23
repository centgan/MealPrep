import React from 'react';
import {Text, View, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {LineChart, ProgressChart} from 'react-native-chart-kit';

const data = {
  labels: ['Swim'], // optional
  data: [0.4],
};
const chartConfig = {
  // backgroundColor: 'white',
  backgroundGradientFrom: 'black',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: 'black',
  backgroundGradientToOpacity: 0.75,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const HomePage = () => {
  return (
    <View style={styles.parent}>
      <Text style={styles.Welcome}>Welcome Back, </Text>
      <View style={styles.chartView}>
        <Text>Steps: </Text>
        <LineChart
          style={styles.chart}
          data={{
            labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
              },
            ],
          }}
          width={310} // from react-native
          height={190}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
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
        <View style={styles.CaloriesView}>
          <Text>Calories</Text>
          <ProgressChart
            data={data}
            width={100}
            height={100}
            strokeWidth={16}
            radius={36}
            chartConfig={chartConfig}
            hideLegend={true}
          />
        </View>
        <View>
          <Text>Reflection</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    marginTop: 30,
    marginHorizontal: 25,
  },
  Welcome: {
    textAlign: 'left',
    fontSize: 26,
    fontWeight: 'bold',
  },
  chartView: {
    width: 330,
    height: 230,
    backgroundColor: 'light-blue',
    // alignItems: 'center',
    borderRadius: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
  },
  CaloriesView: {
    backgroundColor: 'black',
    height: 150,
    width: 150,
  },
});

export default HomePage;
