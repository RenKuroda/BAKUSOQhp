import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Contact from './pages/Contact';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
const render = () => {
  const path = window.location.pathname;
  const Page = path === '/contact' ? Contact : App;
  root.render(
    <React.StrictMode>
      <Page />
    </React.StrictMode>
  );
};

render();
window.addEventListener('popstate', render);