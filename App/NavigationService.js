// NavigationService.js

import { NavigationActions } from 'react-navigation';
import { StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function push(routeName, params) {
  _navigator.dispatch(
    NavigationActions.push({
      routeName,
      params,
    }),
  );
}

function replace(routeName, params, action) {
  _navigator.dispatch(
    StackActions.replace({
      routeName,
      params,
      action,
    }),
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  push,
  replace,
  setTopLevelNavigator,
};
