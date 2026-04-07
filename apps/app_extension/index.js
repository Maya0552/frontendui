import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './src'

console.log("hello world")

// Funkce pro generování UUID (použije crypto.randomUUID, pokud je dostupné)
const generateUUID = () => {
    return crypto.randomUUID ? crypto.randomUUID() : 'id-' + Math.random().toString(36).substr(2, 9);
  };

// Vytvoříme nový div a nastavíme mu náhodné id
const container = document.createElement('div');
container.id = generateUUID();
document.body.prepend(container);

// Vyrenderujeme aplikaci do vytvořeného divu
const root = ReactDOM.createRoot(container);
root.render(React.createElement(App, null));  