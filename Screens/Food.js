import React, {useState, useEffect} from 'react';
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

const db = require('../Data/db.json');
const db_full = require('../Data/db_full.json');
const FoodPage = ({navigation}) => {
  const [searchInput, setSearch] = useState(null);
  const [Filtered, setFiltered] = useState([]);
  // setFiltered(db_full);
  // const [All, setAll] = useState([]);

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

  useEffect(() => {
    setFiltered(db_full);
  }, []);

  const searchFiltered = text => {
    if (text) {
      const newData = db_full.filter(item => {
        const itemData = item.meal ? item.meal.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        console.log(itemData.indexOf(textData) > -1);
        return itemData.indexOf(textData) > -1;
      });
      setFiltered(newData);
      setSearch(text);
    } else {
      setFiltered(db_full);
      setSearch(null);
    }
  };

  return (
    <View style={styles.parent}>
      <Animated.View style={[styles.header, {height: animateHeaderHeight}]}>
        <Animated.Image
          style={[styles.header_img, {opacity: animateOpacity}]}
          source={require('../Img/MP.png')}
        />
        {/*change this TouchableOpacity when wanting to include settings slide*/}
        {/*ex onPress={()=>{alert("you clicked me")}}*/}
        {/*require('./Img/Setting.png')*/}
        {/*{
              uri: 'https://mealprepmanual.com/wp-content/uploads/2021/12/Ham-and-Bean-Soup-WP.jpg',
            }*/}
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Animated.Image
            style={[styles.header_img, {opacity: animateOpacity}]}
            source={require('../Img/Setting.png')}
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[styles.searchHeader, {height: animateSearchHeight}]}>
        <TextInput
          style={styles.search}
          value={searchInput}
          placeholder="Search for a meal"
          onChangeText={text => searchFiltered(text)}
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
          contentContainerStyle={{paddingBottom: 10}}
          data={Filtered}
          renderItem={({item}) => (
            <View style={styles.each}>
              <TouchableOpacity
                onPress={() => {
                  // navigation.setOptions({title: item.meal});
                  let passing = {};
                  passing.meal = item.meal;
                  passing.ingredients = item.ingredients;
                  passing.instructions = item.instructions;
                  passing.macros = item.macros;
                  passing.servings = item.servings;
                  passing.link = item.link;
                  passing.img = item.img;
                  navigation.navigate('IndividualScreen', {
                    title: item.meal,
                    ingredients: item.ingredients,
                    instructions: item.instructions,
                    macros: item.macros,
                    servings: item.servings,
                    link: item.link,
                    img: item.img,
                  });
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
      {/*<View style={styles.bot}>*/}
      {/*  <Text>hello</Text>*/}
      {/*</View>*/}
    </View>
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
    height: 45,
    width: 45,
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

export default FoodPage;
