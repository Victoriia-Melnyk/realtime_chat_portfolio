import './App.css';
import { Outlet } from 'react-router-dom';

export function App() {
	return (
		<main className="App">
			<Outlet />
		</main>
	);
}
