// 브라우저에서 직접 실행할 때는 상단 import 문들을 제거하거나 아래처럼 수정해야 합니다.
const React = window.React;
const ReactDOM = window.ReactDOM;
// App 컴포넌트와 CSS는 이미 HTML에서 경로를 잡았으므로 관리를 위해 아래처럼 구성합니다.

import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("root 엘리먼트를 찾을 수 없습니다.");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    React.createElement(React.StrictMode, null, 
      React.createElement(App)
    )
  );
}
