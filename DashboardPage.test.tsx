import {render,screen} from '@testing-library/react';import {DashboardPage} from './DashboardPage';
it('renders the approved commercial dashboard structure',()=>{render(<DashboardPage/>);expect(screen.getByText('Proyectos activos')).toBeInTheDocument();expect(screen.getByText('Máquina activa')).toBeInTheDocument();expect(screen.getByText('Proyectos recientes')).toBeInTheDocument()});
