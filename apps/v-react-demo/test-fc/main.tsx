import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	return (
		<div>
			<Child></Child>
		</div>
	);
}
function Child() {
	return <span>mini-react</span>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App></App>);