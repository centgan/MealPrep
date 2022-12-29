# MealPrep
App created in React Native in order to accomplish all the needs I wanted in a meal plan app. Generates a new meal plan at the beginning of each month
using https://mealprepmanual.com recipes. None of the recipes used for this app are mine. The original recipes can be found on https://mealprepmanual.com
or on https://www.youtube.com/@TheMealPrepManual. All credit goes towards Josh Cortis for creating these recipes.

## Set up
Same process as setting up a regular npm project (https://reactnative.dev/docs/environment-setup) and requires the dependencies, react-native-calendars, 
react-native-chart-kit, react-native-svg, @ovalmoney/react-native-fitness, @react-native-async-storage/async-storage, @react-navigation/native, @react-navigation/native-stack, 
react-native-screens and @react-navigation/bottom-tabs

## Usage
No need to add anything else everything should be set up, beginning of each month the program will run a planner function. This will randomize all recipies and calculate how long each meal should last and when it will be needed to generate a new list of foods. A recipe will also show up however if there is still confusions a link will redirect you towards the https://mealprepmanual.com recipe

