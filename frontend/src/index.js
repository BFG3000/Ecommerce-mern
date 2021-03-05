import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import 'font-awesome/css/font-awesome.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme'
// import { amber, brown } from '@material-ui/core/colors';
import { MuiThemeProvider } from '@material-ui/core/';

// i should try to redesign the whole thing with material ui but for now lets work with bootstrap
// const theme = createMuiTheme({
//   palette: {
//     primary: brown,
//     secondary: amber,
//   },
// });
//console.log(theme);

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <App />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);
