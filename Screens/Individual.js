import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

const EachFood = ({route}) => {
  const {title} = route.params;
  const {ingredients} = route.params;
  const {instructions} = route.params;
  const {macros} = route.params;
  const {servings} = route.params;
  const {link} = route.params;
  const {img} = route.params;

  // console.log({title});
  // console.log({ingredients});
  // console.log({instructions});
  // console.log({macros});
  // console.log({servings});
  // console.log({link});
  // console.log({img});

  return (
    <View style={styles.parent}>
      <Text>hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
});

export default EachFood;
