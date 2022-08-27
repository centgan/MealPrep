import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const db_full = require('../Data/db_full.json');

let CheckColor = 'gold';
let pressed = false;
const EachFood = ({route}) => {
  const title = route.params.title;
  const [Ing, setIng] = useState([]);
  const [Ins, setIns] = useState([]);
  const [Macros, setMacros] = useState({
    calories: '',
    carbs: '',
    fat: '',
    protein: '',
  });
  const [Servings, setServings] = useState('');
  const [Link, setLink] = useState('');
  const [Img, setImg] = useState('../Img/MP.png');

  useEffect(() => {
    const Data = db_full.filter(item => {
      const itemData = item.meal ? item.meal.toUpperCase() : ''.toUpperCase();
      const textData = title.toUpperCase();
      // console.log(itemData.indexOf(textData) > -1);
      return itemData.indexOf(textData) > -1;
    });
    const getData = () => {
      let returnedData = Data;
      // console.log(returnedData[0], 'this returned');
      let placeHolder = [];
      for (let i = 0; i < returnedData[0].ingredients.length; i++) {
        placeHolder.push([i, returnedData[0].ingredients[i]]);
      }
      setIng(placeHolder);

      placeHolder = [];
      for (let i = 0; i < returnedData[0].instructions.length; i++) {
        placeHolder.push([i, returnedData[0].instructions[i]]);
      }
      setIns(placeHolder);
      setMacros(returnedData[0].macros);
      setServings(returnedData[0].servings);
      setLink(returnedData[0].link);
      setImg(returnedData[0].img);
      // console.log(db_full);
    };
    getData();
  }, [title]);

  // const displayIngredients = () => {
  //   return();
  // };

  // const displayInstructions = () => {
  //   return();
  // }
  // console.log( .route.p);
  return (
    <ScrollView style={styles.parent} showsVerticalScrollIndicator={false}>
      <View style={styles.row}>
        <Image style={styles.backImg} source={{uri: Img}} />
        <View>
          <Text>Servings: {Servings}</Text>
          <Text>Calories: {Macros.calories}</Text>
          <Text>Carbs: {Macros.carbs}</Text>
          <Text>Fats: {Macros.fat}</Text>
          <Text>Protein: {Macros.protein}</Text>
        </View>
      </View>
      <Text style={styles.linkText} onPress={() => Linking.openURL(Link)}>
        {Link}
      </Text>
      <View style={styles.ingView}>
        <Text style={styles.titleText}>Ingredients: </Text>
        {Ing.map(item => {
          if (pressed) {
            CheckColor = '#007AFF';
          }
          return (
            <View style={styles.row} key={item[0]}>
              <TouchableOpacity
                onPress={() => {
                  pressed = true;
                }}
                style={[
                  styles.check,
                  {backgroundColor: pressed ? '#007AFF' : 'gold'},
                ]}
              />
              <Text style={styles.ingText}>- {item[1]}</Text>
            </View>
          );
        })}
        <View style={styles.ingView}>
          <Text style={styles.titleText}>Instructions: </Text>
          {Ins.map(item => {
            return (
              <View>
                <Text style={styles.insText}>Step {item[0] + 1}:</Text>
                <Text style={styles.ingText}>{item[1]}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  parent: {
    marginTop: 15,
    marginHorizontal: 25,
  },
  row: {
    flexDirection: 'row',
  },
  backImg: {
    marginRight: 10,
    height: 175,
    width: 175,
    borderRadius: 10,
  },
  linkText: {
    marginTop: 5,
    fontSize: 8,
    color: '#007AFF',
    textAlign: 'center',
  },
  ingView: {
    marginTop: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  ingText: {
    fontSize: 12,
    marginTop: 10,
  },
  check: {
    borderColor: 'black',
    borderWidth: 2,
    height: 25,
    width: 25,
    // backgroundColor: CheckColor,
    marginTop: 5,
  },
  insText: {
    marginTop: 5,
  },
});

export default EachFood;
