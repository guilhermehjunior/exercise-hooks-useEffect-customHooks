import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';

import { getPostsBySubreddit } from '../services/redditAPI';

const Context = createContext();
const { Provider, Consumer } = Context;

function RedditProvider({ children }) {
  const [postsBySubreddit, setPosts] = useState({
    frontend: {},
    reactjs: {},
  });
  const [selectedSubreddit, setSelectedSubreddit] = useState('reactjs');
  const [shouldRefreshSubreddit, setRefresh] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (selectedSubreddit || shouldRefreshSubreddit) {
      fetchPosts();
    }
  }, [selectedSubreddit, shouldRefreshSubreddit]);

  const fetchPosts = () => {
    if (!shouldFetchPosts()) return;

    setIsFetching(true);
    setRefresh(false);
    getPostsBySubreddit(selectedSubreddit)
      .then(handleFetchSuccess, handleFetchError);
  };

  const shouldFetchPosts = () => {
    const posts = postsBySubreddit[selectedSubreddit];

    if (!posts.items) return true;
    if (isFetching) return false;
    return shouldRefreshSubreddit;
  };

  const handleFetchSuccess = (json) => {
    const lastUpdated = Date.now();
    const items = json.data.children.map((child) => child.data);

    setRefresh(false);
    setIsFetching(false);
    setPosts({ ...postsBySubreddit, [selectedSubreddit] : { items, lastUpdated} });
  }

  const handleFetchError = (error) => {
    setRefresh(false);
    setIsFetching(false);
    setPosts({ ...postsBySubreddit, [selectedSubreddit] : { items: [], error: error.message } });
  }

  const handleSubredditChange = (selectedSubreddit) => {
    setSelectedSubreddit(selectedSubreddit);
  }

  const handleRefreshSubreddit = () => {
    setRefresh(true);
  }

  const context = {
    postsBySubreddit,
    selectedSubreddit,
    shouldRefreshSubreddit,
    isFetching,
    selectSubreddit: handleSubredditChange,
    fetchPosts: fetchPosts,
    refreshSubreddit: handleRefreshSubreddit,
    availableSubreddits: Object.keys(postsBySubreddit),
    posts: postsBySubreddit[selectedSubreddit].items,
  };

  return (
    <Provider value={context}>
      {children}
    </Provider>
  );
}

RedditProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { RedditProvider as Provider, Consumer, Context };