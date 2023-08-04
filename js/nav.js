"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

/** Show submit new form on click on "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $submitForm.show();
}


/** Show favorite stories on click on "favorites" */

function navFavsClick(evt) {
  console.debug("navFavsClick", evt);
  hidePageComponents();
  $favoriteStoriesList.show();
}

/** Show my stories div on click on "My Stories" */

function navMineClick(evt) {
  console.debug("navMineClick", evt);
  hidePageComponents();
  $myStoriesList.show();
}


$navSubmit.on("click", navSubmitClick);

$navFavs.on("click", navFavsClick);

$navMine.on("click", navMineClick);

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
