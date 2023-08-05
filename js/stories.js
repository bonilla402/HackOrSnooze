"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

async function submitStory(evt) {
  console.debug("Submitting new story", evt);
  evt.preventDefault();

  // grab new story values
  const title = $("#subbmit-title").val();
  const author = $("#subbmit-author").val();
  const url = $("#subbmit-url").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  let newStory = await storyList.addStory(currentUser, {title, author, url});
  currentUser.ownStories.push(newStory);
  $submitForm.trigger("reset");
  $submitForm.hide();

  getAndShowStoriesOnStart();

}


$submitForm.on("submit", submitStory);


/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, allowDelete) {
  // console.debug("generateStoryMarkup", story);

  let isFavorite = false;
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${ allowDelete ? '<span class="story-icon hidden"><i class="fas fa-trash-alt trash"></i></span>' : ''}
        <span class="story-icon hidden"><i class="fa-star ${ currentUser && currentUser.favorites.find(s => s.storyId === story.storyId) ? 'fas' : 'far'} favorite"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  putStoryListOnScreen(storyList.stories, $allStoriesList, false);
}

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  putStoryListOnScreen(currentUser.favorites, $favoriteStoriesList, false);
}

function putOwnStoriesOnPage() {
  console.debug("putOwnStoriesOnPage");
  putStoryListOnScreen(currentUser.ownStories, $favoriteStoriesList, true);
}

function putStoryListOnScreen(stories, $htmlList, allowDelete)
{
  $htmlList.empty();

  // loop through all stories and generate HTML for them
  for (let story of stories) {
    const $story = generateStoryMarkup(story, allowDelete);
    $htmlList.append($story);
  }

  if (currentUser) $('.story-icon').show();

  $htmlList.show();
}

async function handleStoryClick(evt)
{
  if ($(evt.target).hasClass("favorite"))
  {
    const $star = $(evt.target);
    const $storyLi =  $star.closest("li");
    const story = storyList.stories.find(s => s.storyId === $storyLi.attr('id'));

    if ($star.hasClass('far'))
    {
      currentUser.addFavorite(story);
    }
    else
    {
      currentUser.removeFavorite(story);
    }

    $star.toggleClass('far fas');
  }

  if ($(evt.target).hasClass("trash"))
  {
    const $storyLi =  $(evt.target).closest("li");
    const story = storyList.stories.find(s => s.storyId === $storyLi.attr('id'));
    await currentUser.deleteStory(story);
    storyList.removeStory(story);
    $storyLi.remove();
  }
}
