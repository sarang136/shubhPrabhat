import { HashRouter } from 'react-router-dom'
import AppRoutes from './Routes/AppRoutes'

const App = () => {


  return <>
    <HashRouter>
      <AppRoutes />
    </HashRouter>

  </>
}

export default App