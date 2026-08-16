import {render,screen} from '@testing-library/react';
import {beforeEach,describe,expect,it} from 'vitest';
import {ReleasePage} from './ReleasePage';
import {useAppStore} from '../../store/useAppStore';

describe('ReleasePage',()=>{beforeEach(()=>useAppStore.setState({documents:[],revisions:[],releases:[]}));it('bloquea si faltan documentos y revisiones',()=>{render(<ReleasePage/>);expect(screen.getByText('Proyecto bloqueado')).toBeInTheDocument();});});
