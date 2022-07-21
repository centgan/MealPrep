/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import type {Node} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
// import foodPage from './Screens/Food';
const db = require('./Data/db.json');
const db_full = require('./Data/db_full.json');
const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  const [searchInput, setSearch] = useState(null);

  let AnimatedHeaderValue = new Animated.Value(0);
  let HeaderMaxHeight = 60;
  let HeaderMinHeight = 0;
  let SearchMaxHeight = 80;
  let SearchMinHeight = 65;

  const animateHeaderHeight = AnimatedHeaderValue.interpolate({
    inputRange: [0, HeaderMaxHeight - HeaderMinHeight],
    outputRange: [HeaderMaxHeight, HeaderMinHeight],
    extrapolate: 'clamp',
  });

  const animateSearchHeight = AnimatedHeaderValue.interpolate({
    inputRange: [0, SearchMaxHeight - SearchMinHeight],
    outputRange: [SearchMaxHeight, SearchMinHeight],
    extrapolate: 'clamp',
  });

  const animateOpacity = AnimatedHeaderValue.interpolate({
    inputRange: [0, HeaderMaxHeight - HeaderMinHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  console.log(searchInput);

  return (
    <View style={styles.parent}>
      <Animated.View style={[styles.header, {height: animateHeaderHeight}]}>
        <Animated.Image
          style={[styles.header_img, {opacity: animateOpacity}]}
          source={require('./Img/MP.png')}
        />
        {/*change this TouchableOpacity when wanting to include settings slide*/}
        {/*ex onPress={()=>{alert("you clicked me")}}*/}
        {/*require('./Img/Setting.png')*/}
        {/*{
              uri: 'https://mealprepmanual.com/wp-content/uploads/2021/12/Ham-and-Bean-Soup-WP.jpg',
            }*/}
        <TouchableOpacity>
          <Animated.Image
            style={[styles.header_img, {opacity: animateOpacity}]}
            source={require('./Img/Setting.png')}
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[styles.searchHeader, {height: animateSearchHeight}]}>
        <TextInput
          style={styles.search}
          placeholder="Search for a meal"
          onChangeText={setSearch}
        />
      </Animated.View>
      <View style={styles.dbView}>
        <FlatList
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}],
            {useNativeDriver: false},
          )}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingBottom: 75}}
          data={db_full}
          renderItem={({item}) => (
            <View style={styles.each}>
              <TouchableOpacity
                onPress={() => {
                  alert('you clicked me');
                }}>
                <Image
                  style={styles.backImg}
                  resizeMode="center"
                  source={{
                    uri: item.img,
                  }}
                />
                <Text style={styles.textStyle}>{item.meal}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <View style={styles.bot}>
        <Text>hello</Text>
      </View>
    </View>
    // <foodPage />
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'gold',
  },
  header: {
    backgroundColor: 'white',
    // height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header_img: {
    margin: 20,
    height: 30,
    width: 30,
    opacity: 1,
  },
  searchHeader: {
    // height: 50,
    // backgroundColor: 'black',
  },
  search: {
    marginTop: 30,
    marginHorizontal: 75,
    borderWidth: 1,
    borderRadius: 10,
    height: 25,
    paddingHorizontal: 5,
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 11,
    opacity: 1,
    // padding: 5,
  },
  dbView: {
    marginBottom: 60,
    alignItems: 'center',
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
  backImg: {
    marginVertical: 5,
    marginHorizontal: 25,
    height: '50%',
    width: '50%',
    borderRadius: 10,
  },
  bot: {
    backgroundColor: 'black',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
  },
});

export default App;
