import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  console.log('zsx log out in line 5');
  
	const [num, setNum] = useState(100);
	window.setNum = setNum;
	return <div>{num}</div>;
}
function Child() {
	return <span>mini-react</span>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App></App>);
