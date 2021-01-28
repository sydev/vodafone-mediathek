import { Provider } from 'mobx-react';
import App from 'next/app';

import { fetchInitialStoreState, FilesStore } from '../stores/Files';

import '../styles/globals.css';

class MyApp extends App {
  state = {
    filesStore: new FilesStore()
  };

  // Fetching serialized(JSON) store state
  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);
    const initialStoreState = await fetchInitialStoreState();

    return {
      ...appProps,
      initialStoreState
    };
  }

  // Hydrate serialized state to store
  static getDerivedStateFromProps(props, state) {
    state.filesStore.hydrate(props.initialStoreState);
    return state;
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider filesStore={this.state.filesStore}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}
export default MyApp;
