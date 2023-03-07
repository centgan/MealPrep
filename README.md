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

### Home page
Tells user steps taken, calories needed to consume and the activity level

https://user-images.githubusercontent.com/83138403/210019369-b11de3f2-51c7-49c2-aa00-0d05d0e9c3bb.mov


### Calendar

Gives the user a day by day food needed to eat as well as allows them to edit 

https://user-images.githubusercontent.com/83138403/210019555-9a46aa8d-85ed-4ef3-9014-e35d8fda1581.mov


### Food

A database of all food from https://mealprepmanual.com allows for searching and recipies

https://user-images.githubusercontent.com/83138403/210019485-e9c26341-cdf0-4e60-b2c7-3451f69c08a8.mov


### Grocery

Gives a list of groceries that the user has to buy for each week. This is still a work in progress

https://user-images.githubusercontent.com/83138403/210019451-fbced0ee-d9e4-47dd-bfcc-a5afb7dd2897.mov
