import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [num, setNum] = useState(100);
	return (
		<div key={123} onClick={() => setNum(num + 1)}>
			{num}
		</div>
	);
}
function Child() {
	return <span>mini-react</span>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App></App>);
