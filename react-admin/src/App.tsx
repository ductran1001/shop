import { useRoutes } from 'react-router-dom';
import { Main } from 'components/Layouts/Main';
import { routes } from 'routes';

const App = () => <Main>{useRoutes(routes)}</Main>;

export default App;
